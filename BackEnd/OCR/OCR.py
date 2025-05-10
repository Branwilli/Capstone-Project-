import os
import re
import difflib
import json
import cv2
import numpy as np
import spacy
import pytesseract
from PIL import Image
from collections import defaultdict
from PyQt5.QtWidgets import QApplication, QFileDialog
from sklearn.cluster import KMeans
from spacy.matcher import Matcher
from spellchecker import SpellChecker
from symspellpy import SymSpell, Verbosity
import logging
from functools import lru_cache
from typing import Any, Dict, List, Optional, Tuple, Union

# Set Tesseract path
pytesseract.pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe"

# Load spaCy English model and setup matcher for nutrient entities
nlp = spacy.load("en_core_web_sm")
matcher = Matcher(nlp.vocab)

# Known nutrient list for fuzzy matching and entity matching.
KNOWN_NUTRIENTS = [
    "Calories", "Calories From Fat", "Total Fat", "Saturated Fat", "Trans Fat",
    "Cholesterol", "Sodium", "Total Carbohydrate", "Dietary Fiber", "Sugars",
    "Protein", "Vitamin A", "Vitamin C", "Calcium", "Iron", "Potassium", "Vitamin D",
    "Vitamin E", "Vitamin K", "Thiamin", "Riboflavin", "Niacin", "Vitamin B6",
    "Folate", "Vitamin B12", "Biotin", "Pantothenic Acid", "Phosphorus", "Iodine",
    "Magnesium", "Zinc", "Selenium", "Copper", "Manganese", "Chromium", "Molybdenum",
    "Chloride", "Omega-3 Fatty Acids", "Omega-6 Fatty Acids", "Monounsaturated Fat",
    "Polyunsaturated Fat", "Added Sugars", "Alcohol", "Caffeine", "Water"
]

# Define matching patterns. We use lower-case patterns to capture common OCR variations.
patterns = []
for nutrient in KNOWN_NUTRIENTS:
    # Each pattern here is a list of lowercase tokens (the nutrient split by spaces)
    pattern = [{"LOWER": token.lower()} for token in nutrient.split()]
    patterns.append(pattern)

# Add patterns to matcher under the label "NUTRIENT"
matcher.add("NUTRIENT", patterns)

# Set up logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s %(levelname)s:%(message)s')

def capture_image(camera_index: int = 0) -> Optional[np.ndarray]:
    cap = cv2.VideoCapture(camera_index)
    if not cap.isOpened():
        logging.error("Could not open webcam.")
        return None
    ret, frame = cap.read()
    cap.release()
    cv2.destroyAllWindows()
    if not ret:
        logging.error("Could not read frame from webcam.")
        return None
    return frame

def select_image() -> Optional[np.ndarray]:
    app = QApplication([])
    filename, _ = QFileDialog.getOpenFileName(
        None, "Select an image", "", "Image files (*.jpg *.jpeg *.png)"
    )
    app.exit()
    if not filename:
        logging.warning("No file selected.")
        return None
    image = cv2.imread(filename)
    if image is None:
        logging.error(f"Could not read the image: {filename}")
    return image

def resize_image(image: np.ndarray, fx: float = 1.5, fy: float = 1.5) -> np.ndarray:
    try:
        if cv2.cuda.getCudaEnabledDeviceCount() > 0:
            gpu_image = cv2.cuda_GpuMat()
            gpu_image.upload(image)
            gpu_resized = cv2.cuda.resize(gpu_image, (int(image.shape[1] * fx), int(image.shape[0] * fy)), interpolation=cv2.INTER_CUBIC)
            return gpu_resized.download()
        else:
            return cv2.resize(image, None, fx=fx, fy=fy, interpolation=cv2.INTER_CUBIC)
    except Exception as e:
        logging.error(f"Error resizing image: {e}")
        return image

def convert_to_grayscale(image: np.ndarray) -> np.ndarray:
    return cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

def detect_roi(image: np.ndarray, min_area: int = 100) -> Tuple[int, int, int, int]:
    try:
        contours, _ = cv2.findContours(image, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
        if not contours:
            return (0, 0, image.shape[1], image.shape[0])
        min_x, min_y = image.shape[1], image.shape[0]
        max_x, max_y = 0, 0
        for cnt in contours:
            area = cv2.contourArea(cnt)
            if area > min_area:
                x, y, w, h = cv2.boundingRect(cnt)
                min_x = min(min_x, x)
                min_y = min(min_y, y)
                max_x = max(max_x, x + w)
                max_y = max(max_y, y + h)
        return (min_x, min_y, max_x - min_x, max_y - min_y) if min_x < max_x and min_y < max_y else (0, 0, image.shape[1], image.shape[0])
    except Exception as e:
        logging.error(f"Error detecting ROI: {e}")
        return (0, 0, image.shape[1], image.shape[0])

def apply_threshold(image: np.ndarray, block_size: int = 15, c: int = 4) -> np.ndarray:
    kernel = np.ones((2, 2), np.uint8)
    image = cv2.dilate(image, kernel, iterations=1)
    image = cv2.erode(image, kernel, iterations=1)
    thresholded_image = cv2.adaptiveThreshold(
        image, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY, block_size, c
    )
    return thresholded_image

def preprocess_image(
    image: np.ndarray,
    target_size: Tuple[int, int] = (800, 800),
    output_path: Optional[str] = None,
    file_name: str = "processed_image.png"
) -> Optional[np.ndarray]:
    try:
        original_height, original_width = image.shape[:2]
        target_width, target_height = target_size
        fx = target_width / float(original_width)
        fy = target_height / float(original_height)
        resized = resize_image(image, fx=fx, fy=fy)
        gray = convert_to_grayscale(resized)
        _, thresh = cv2.threshold(gray, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)
        kernel = np.ones((2, 2), np.uint8)
        thresh = cv2.erode(thresh, kernel, iterations=1)
        thresh = cv2.dilate(thresh, kernel, iterations=1)
        if output_path:
            save_path = os.path.join(output_path, file_name)
            cv2.imwrite(save_path, thresh)
            logging.info(f"Preprocessed image saved to {save_path}")
        return thresh
    except Exception as e:
        logging.error(f"Error preprocessing image: {e}")
        return None

def extract_text(image: np.ndarray, conf_threshold: int = 20) -> Tuple[str, List[Tuple[int, int, int, int]], Dict[str, Any]]:
    try:
        pil_image = Image.fromarray(cv2.cvtColor(image, cv2.COLOR_BGR2RGB))
        data = pytesseract.image_to_data(pil_image, output_type=pytesseract.Output.DICT)
        text = " ".join([
            word for word, conf in zip(data['text'], data['conf'])
            if float(conf) > conf_threshold
        ])
        boxes = [
            (data['left'][i], data['top'][i], data['width'][i], data['height'][i])
            for i in range(len(data['text']))
            if float(data['conf'][i]) > conf_threshold
        ]
        return text, boxes, data
    except Exception as e:
        logging.error(f"Error processing image: {e}")
        return "", [], {}

def correct_ocr_errors(extracted_text: str) -> str:
    spell = SpellChecker()
    words = extracted_text.split()
    corrected_words = []
    for word in words:
        if word.isalpha():
            try:
                corrected = spell.correction(word)
                corrected_words.append(corrected if corrected else word)
            except Exception as e:
                logging.warning(f"Spell correction failed for '{word}': {e}")
                corrected_words.append(word)
        else:
            corrected_words.append(word)
    text = ' '.join(corrected_words)
    text = re.sub(r'(?<!\d)0(?!\d)', 'O', text)
    text = re.sub(r'(?<!\d)1(?!\d)', 'I', text)
    text = re.sub(r'[^a-zA-Z0-9\s%.,]', '', text)
    text = re.sub(r'\s+', ' ', text).strip()
    return text

def extract_lines(ocr_data: Dict[str, Any], conf_threshold: int = 50) -> List[Dict[str, Any]]:
    lines = defaultdict(list)
    for i in range(len(ocr_data.get('text', []))):
        try:
            if ocr_data['level'][i] == 5 and int(float(ocr_data['conf'][i])) > conf_threshold:
                block_num = ocr_data['block_num'][i]
                par_num = ocr_data['par_num'][i]
                line_num = ocr_data['line_num'][i]
                key = (block_num, par_num, line_num)
                lines[key].append({
                    'text': ocr_data['text'][i],
                    'left': ocr_data['left'][i],
                    'top': ocr_data['top'][i],
                    'width': ocr_data['width'][i],
                    'height': ocr_data['height'][i]
                })
        except Exception as e:
            logging.warning(f"Error extracting line at index {i}: {e}")
    line_data = []
    for key, words in lines.items():
        if words:
            words.sort(key=lambda w: w['left'])
            line_text = ' '.join(w['text'] for w in words)
            left = min(w['left'] for w in words)
            top = min(w['top'] for w in words)
            right = max(w['left'] + w['width'] for w in words)
            bottom = max(w['top'] + w['height'] for w in words)
            line_box = (left, top, right - left, bottom - top)
            line_data.append({
                'text': line_text,
                'box': line_box,
                'words': words,
                'block_num': key[0]
            })
    return line_data

def layout_analysis(line_data: List[Dict[str, Any]]) -> Dict[int, List[Dict[str, Any]]]:
    sections = defaultdict(list)
    for line in line_data:
        sections[line['block_num']].append(line)
    return dict(sections)

@lru_cache(maxsize=128)
def _cached_fuzzy_match(nutrient_candidate: str) -> str:
    cleaned = nutrient_candidate.replace("==", "").strip()
    match = difflib.get_close_matches(cleaned, KNOWN_NUTRIENTS, n=1, cutoff=0.5)
    return match[0] if match else cleaned

def correct_nutrient_name(nutrient_name: str) -> str:
    return _cached_fuzzy_match(nutrient_name)

def is_numeric_token(text: str) -> bool:
    if text.startswith("I%"):
        text = "1%" + text[2:]
    pattern = r'^(\d+\.?\d*|<\d+)\s*(g|mg|mcg|%|kcal)?$'
    return re.match(pattern, text, re.IGNORECASE) is not None

def extract_line_nutrients(words: List[Dict[str, Any]]) -> List[Tuple[str, str, str, Dict[str, Any]]]:
    nutrients = []
    buffer = []
    for w in words:
        token = w['text'].strip()
        if token in ['-', '--']:
            continue
        if is_numeric_token(token):
            if buffer:
                nutrient_candidate = " ".join(buffer).strip()
                match = re.match(r'^(<?\d+\.?\d*)\s*(g|mg|mcg|%|kcal)?$', token, re.IGNORECASE)
                if match:
                    value = match.group(1)
                    unit = match.group(2) if match.group(2) else ''
                else:
                    value = token
                    unit = ''
                nutrients.append((nutrient_candidate, value, unit, w))
            buffer = []
        else:
            buffer.append(token)
    return nutrients

@lru_cache(maxsize=128)
def _cached_spacy_match(nutrient_candidate: str) -> str:
    doc = nlp(nutrient_candidate.lower())
    matches = matcher(doc)
    if matches:
        match_id, start, end = matches[0]
        span = doc[start:end]
        return correct_nutrient_name(span.text.title())
    else:
        return correct_nutrient_name(nutrient_candidate.title())

def nlp_entity_match(nutrient_candidate: str) -> str:
    return _cached_spacy_match(nutrient_candidate)

def determine_optimal_k(coords: np.ndarray, max_k: int = 3) -> int:
    if len(coords) < 2:
        return 1
    coords = np.array(coords).reshape(-1, 1)
    wcss = []
    for k in range(1, min(max_k, len(coords)) + 1):
        kmeans = KMeans(n_clusters=k, random_state=42).fit(coords)
        wcss.append(kmeans.inertia_)
    if len(wcss) < 2:
        return 1
    diffs = [wcss[i-1] - wcss[i] for i in range(1, len(wcss))]
    optimal_k = diffs.index(max(diffs)) + 2
    return optimal_k

def categorize_text(clustered_sections: Dict[int, List[Dict[str, Any]]]) -> Dict[str, Any]:
    categorized = {
        'table_count': 0,
        'Nutritional Values': {
            'Per Serving': {},
            'Per Container': {}
        }
    }
    for block_id, lines in clustered_sections.items():
        numeric_tokens = []
        for line in lines:
            for w in line['words']:
                if is_numeric_token(w['text']):
                    numeric_tokens.append(w['left'])
        if len(numeric_tokens) < 2:
            n_clusters = 1
        else:
            left_coords = np.array(numeric_tokens).reshape(-1, 1)
            optimal_k = determine_optimal_k(left_coords, max_k=3)
            if optimal_k == 1:
                n_clusters = 1
            else:
                kmeans = KMeans(n_clusters=optimal_k, random_state=42).fit(left_coords)
                col_centers = sorted(kmeans.cluster_centers_.flatten())
                if min([col_centers[i+1] - col_centers[i] for i in range(optimal_k-1)]) < 50:
                    n_clusters = 1
                else:
                    n_clusters = optimal_k
                    if n_clusters > 2:
                        n_clusters = 2
                        kmeans = KMeans(n_clusters=2, random_state=42).fit(left_coords)
                        col_centers = sorted(kmeans.cluster_centers_.flatten())
        block_has_nutrients = False
        if n_clusters == 1:
            category_map = lambda x: 'Per Serving'
        else:
            cluster_indices = np.argsort(kmeans.cluster_centers_.flatten())
            cluster_to_category = {cluster_indices[0]: 'Per Serving', cluster_indices[1]: 'Per Container'}
        for line in lines:
            pairs = extract_line_nutrients(line['words'])
            for nutrient_candidate, value, unit, numeric_word in pairs:
                corrected_name = nlp_entity_match(nutrient_candidate)
                if corrected_name.lower() in (k.lower() for k in KNOWN_NUTRIENTS):
                    if n_clusters == 1:
                        category = 'Per Serving'
                    else:
                        left_x = numeric_word['left']
                        cluster_label = kmeans.predict([[left_x]])[0]
                        category = cluster_to_category[cluster_label]
                    categorized['Nutritional Values'][category][corrected_name] = value + unit
                    block_has_nutrients = True
        if block_has_nutrients:
            categorized['table_count'] += 1
    return categorized

def process_image_from_array(
    input_mode: Optional[str] = None,
    output_dir: Optional[str] = None,
    text_output_path: Optional[str] = None,
    preprocess_target_size: Tuple[int, int] = (800, 800),
    ocr_conf_threshold: int = 20,
    line_conf_threshold: int = 50
) -> Optional[Dict[str, str]]:
    image = None
    while True:
        mode = input_mode or input("Enter 'c' to capture an image or 's' to select an image: ").strip().lower()
        if mode == 'c':
            image = capture_image()
            break
        elif mode == 's':
            image = select_image()
            break
        else:
            logging.warning("Invalid choice, please enter 'c' or 's'.")
            if input_mode:
                return None
    if image is None:
        logging.error("No image to process.")
        return None
    output_dir = output_dir or os.path.join(os.path.expanduser("~"), "Downloads")
    preprocessed_image = preprocess_image(image, target_size=preprocess_target_size, output_path=output_dir)
    if preprocessed_image is None:
        logging.error("Preprocessing failed.")
        return None
    roi_box = detect_roi(preprocessed_image)
    x, y, w, h = roi_box
    cropped_image = preprocessed_image[y:y+h, x:x+w]
    recognized_text, boxes, ocr_data = extract_text(cropped_image, conf_threshold=ocr_conf_threshold)
    corrected_text = correct_ocr_errors(recognized_text)
    documents_dir = os.path.join(os.path.expanduser("~"), "Documents")
    text_output_path = text_output_path or os.path.join(documents_dir, "corrected_text.txt")
    os.makedirs(os.path.dirname(text_output_path), exist_ok=True)
    try:
        with open(text_output_path, "w", encoding="utf-8") as f:
            f.write(corrected_text)
        logging.info(f"Corrected OCR text saved to {text_output_path}")
    except Exception as e:
        logging.error(f"Failed to save corrected text: {e}")
    line_data = extract_lines(ocr_data, conf_threshold=line_conf_threshold)
    sections = layout_analysis(line_data)
    categorized = categorize_text(sections)
    final_nutrients = categorized['Nutritional Values']['Per Serving']
    if not final_nutrients and categorized['Nutritional Values']['Per Container']:
        final_nutrients = categorized['Nutritional Values']['Per Container']
    print("Final Nutrients:", final_nutrients)
    return final_nutrients

#if __name__ == "__main__":
    #process_image_from_array()
