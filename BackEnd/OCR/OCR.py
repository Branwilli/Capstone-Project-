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

def capture_image():
    cap = cv2.VideoCapture(0)
    if not cap.isOpened():
        print("Error: Could not open webcam.")
        return None
    ret, frame = cap.read()
    cap.release()
    cv2.destroyAllWindows()
    if not ret:
        print("Error: Could not read frame.")
        return None
    return frame

def select_image():
    app = QApplication([])
    filename, _ = QFileDialog.getOpenFileName(
        None, "Select an image", "", "Image files (*.jpg *.jpeg *.png)"
    )
    app.exit()
    if not filename:
        print("No file selected.")
        return None
    image = cv2.imread(filename)
    if image is None:
        print("Error: Could not read the image.")
    return image

def resize_image(image, fx=1.5, fy=1.5):
    return cv2.resize(image, None, fx=fx, fy=fy, interpolation=cv2.INTER_CUBIC)

def convert_to_grayscale(image):
    return cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

def apply_threshold(image, block_size=15, c=4):
    kernel = np.ones((2, 2), np.uint8)
    image = cv2.dilate(image, kernel, iterations=1)
    image = cv2.erode(image, kernel, iterations=1)
    thresholded_image = cv2.adaptiveThreshold(
        image, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY, block_size, c
    )
    return thresholded_image

def preprocess_image(image, target_size=(800, 800), output_path=None, file_name="processed_image.png"):
    original_height, original_width = image.shape[:2]
    target_width, target_height = target_size
    fx = target_width / float(original_width)
    fy = target_height / float(original_height)

    resized = resize_image(image, fx=fx, fy=fy)
    gray = convert_to_grayscale(resized)
    thresh = apply_threshold(gray)

    if output_path:
        save_path = os.path.join(output_path, file_name)
        cv2.imwrite(save_path, thresh)
        print(f"Preprocessed image saved to {save_path}")

    return thresh

def extract_text(image, conf_threshold=20):
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
        print(f"Error processing image: {e}")
        return "", [], {}

def correct_ocr_errors(extracted_text):
    spell = SpellChecker()
    # Tokenize the text into words
    words = extracted_text.split()
    corrected_words = []
    for word in words:
        # Only correct alphabetic words, leave numbers and symbols
        if word.isalpha():
            corrected = spell.correction(word)
            corrected_words.append(corrected if corrected else word)
        else:
            corrected_words.append(word)
    text = ' '.join(corrected_words)
    # Apply regex-based corrections as before
    text = re.sub(r'(?<!\d)0(?!\d)', 'O', text)
    text = re.sub(r'(?<!\d)1(?!\d)', 'I', text)
    text = re.sub(r'[^a-zA-Z0-9\s%.,]', '', text)
    text = re.sub(r'\s+', ' ', text).strip()
    return text

def extract_lines(ocr_data, conf_threshold=50):
    lines = defaultdict(list)
    for i in range(len(ocr_data['text'])):
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

def layout_analysis(line_data):
    sections = defaultdict(list)
    for line in line_data:
        sections[line['block_num']].append(line)
    return dict(sections)


def correct_nutrient_name(nutrient_name):
    """
    Use difflib to find the closest match to a known nutrient name.
    This can fix common OCR errors 
    """
    cleaned = nutrient_name.replace("==", "").strip()
    match = difflib.get_close_matches(cleaned, KNOWN_NUTRIENTS, n=1, cutoff=0.5)
    return match[0] if match else cleaned

def is_numeric_token(text):
    """
    Check if the given text represents a number (with optional unit),
    and fix a known OCR error (e.g. 'I%' to '1%').
    """
    if text.startswith("I%"):
        text = "1%" + text[2:]
    pattern = r'^(\d+\.?\d*|<\d+)\s*(g|mg|mcg|%|kcal)?$'
    return re.match(pattern, text, re.IGNORECASE) is not None

def extract_line_nutrients(words):
    """
    Using token-by-token processing, extract (nutrient_candidate, value, unit) tuples.
    If multiple pairs appear in one line (e.g. 'Calories 250 Calories from fat 10'),
    they are separated out. The value and unit are separated if possible.
    """
    nutrients = []
    buffer = []
    for w in words:
        token = w['text'].strip()
        if token in ['-', '--']:
            continue
        if is_numeric_token(token):
            if buffer:
                nutrient_candidate = " ".join(buffer).strip()
                # Extract value and unit from token
                match = re.match(r'^(<?\d+\.?\d*)\s*(g|mg|mcg|%|kcal)?$', token, re.IGNORECASE)
                if match:
                    value = match.group(1)
                    unit = match.group(2) if match.group(2) else ''
                else:
                    value = token
                    unit = ''
                nutrients.append((nutrient_candidate, value, unit))
            buffer = []
        else:
            buffer.append(token)
    return nutrients

def nlp_entity_match(nutrient_candidate):
    """
    Use spaCy's matcher to detect if the nutrient_candidate matches one of our nutrient patterns.
    If a match is found, return the standard nutrient name after correction.
    """
    doc = nlp(nutrient_candidate.lower())
    matches = matcher(doc)
    # If any matching span is found, take the first match.
    if matches:
        # Get the span text and then fuzzy-match it against our KNOWN_NUTRIENTS.
        match_id, start, end = matches[0]
        span = doc[start:end]
        return correct_nutrient_name(span.text.title())
    else:
        # Fall back to fuzzy matching using difflib if matcher returns nothing.
        return correct_nutrient_name(nutrient_candidate.title())

def categorize_text(clustered_sections):
    """
    Process each block (table) to extract nutrient-value pairs.
    For blocks with 2-column layouts (detected via K-means on x-coordinates of numbers),
    the numeric tokens are assigned as 'Per Serving' (if closer to the left) or 'Per Container'.
    Additionally, spaCy matcher is used to validate nutrient names.
    
    Returns:
      {
         'table_count': <int>,
         'Nutritional Values': {
            'Per Serving': { nutrient: value, ... },
            'Per Container': { nutrient: value, ... }
         }
      }
    """
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
            col1_center = None
            col2_center = None
        else:
            left_coords = np.array(numeric_tokens).reshape(-1, 1)
            kmeans = KMeans(n_clusters=2, random_state=42)
            labels = kmeans.fit_predict(left_coords)
            centers = kmeans.cluster_centers_.flatten()
            col1_center, col2_center = sorted(centers)
            n_clusters = 1 if abs(col1_center - col2_center) < 50 else 2

        block_has_nutrients = False

        for line in lines:
            pairs = extract_line_nutrients(line['words'])
            for nutrient_candidate, value, unit in pairs:
                # Use spaCy entity matcher to check nutrient_candidate.
                corrected_name = nlp_entity_match(nutrient_candidate)
                # Validate against our known nutrients list:
                if corrected_name.lower() in (k.lower() for k in KNOWN_NUTRIENTS):
                    if n_clusters == 1:
                        categorized['Nutritional Values']['Per Serving'][corrected_name] = value + unit
                    else:
                        numeric_obj = next((w for w in line['words'] if w['text'].strip() == value), None)
                        if numeric_obj:
                            left_x = numeric_obj['left']
                            if abs(left_x - col1_center) < abs(left_x - col2_center):
                                categorized['Nutritional Values']['Per Serving'][corrected_name] = value + unit
                            else:
                                categorized['Nutritional Values']['Per Container'][corrected_name] = value + unit
                    block_has_nutrients = True
                else:
                    print(f"Skipping invalid nutrient: {nutrient_candidate}")
        if block_has_nutrients:
            categorized['table_count'] += 1

    return categorized


def process_image_from_array():
    while True:
        mode = input("Enter 'c' to capture an image or 's' to select an image: ").strip().lower()
        if mode == 'c':
            image = capture_image()
            break
        elif mode == 's':
            image = select_image()
            break
        else:
            print("Invalid choice, please enter 'c' or 's'.")

    if image is None:
        print("No image to process.")
        return

    output_dir = os.path.join(os.path.expanduser("~"), "Downloads")
    preprocessed_image = preprocess_image(image, target_size=(800, 800), output_path=output_dir)
    if preprocessed_image is None:
        print("Error: Preprocessing failed.")
        return

    recognized_text, boxes, ocr_data = extract_text(preprocessed_image, conf_threshold=20)
    #print("Recognized Text:", recognized_text)

    corrected_text = correct_ocr_errors(recognized_text)
    #print("Corrected Text:", corrected_text)
    # Optionally save corrected text if needed
    documents_dir = os.path.join(os.path.expanduser("~"), "Documents")
    text_output_path = os.path.join(documents_dir, "corrected_text.txt")
    os.makedirs(os.path.dirname(text_output_path), exist_ok=True)
    with open(text_output_path, "w", encoding="utf-8") as f:
        f.write(corrected_text)
    #print(f"Corrected OCR text saved to {text_output_path}")

    line_data = extract_lines(ocr_data, conf_threshold=50)
    #print(f"Extracted {len(line_data)} lines of text")

    sections = layout_analysis(line_data)
    #print(f"Detected {len(sections)} sections")

    categorized = categorize_text(sections)
    #print("Text categorization complete.")
    #print(f"Total nutritional tables detected: {categorized['table_count']}")

    # Prioritize Per Serving data; fall back to Per Container if needed.
    final_nutrients = categorized['Nutritional Values']['Per Serving']
    if not final_nutrients and categorized['Nutritional Values']['Per Container']:
        final_nutrients = categorized['Nutritional Values']['Per Container']

    return final_nutrients
    #print("\nFinal Nutrients Dictionary:")
    #print(json.dumps(final_nutrients, indent=2))


#if __name__ == "__main__":
    #main()
