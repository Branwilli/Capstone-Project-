from collections import defaultdict
import pytesseract
pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'
from PIL import Image
import cv2
import numpy as np
from nltk.corpus import words
from nltk.data import find
from nltk import download
import re

try:
    find('corpora/words.zip')
except LookupError:
    download('words')

def extract_text(image):
    """
    Extracts text and layout information from the given preprocessed image using Tesseract OCR.
    """
    try:
        pil_image = Image.fromarray(cv2.cvtColor(image, cv2.COLOR_BGR2RGB))
        data = pytesseract.image_to_data(pil_image, output_type=pytesseract.Output.DICT)
        
        text = " ".join([word for word, conf in zip(data['text'], data['conf']) if int(conf) > 0])
        boxes = [(data['left'][i], data['top'][i], data['width'][i], data['height'][i]) 
                for i in range(len(data['text'])) if int(data['conf'][i]) > 0]
        
        return text, boxes, data  # Return the full data dictionary for later use
    except Exception as e:
        print(f"Error processing image: {e}")
        return "", [], {}  # Ensure three values are returned even in case of an error

def extract_text_from_images(image_paths):
    """
    Processes a list of preprocessed images to extract text and layout information.
    """
    results = []
    for path in image_paths:
        try:
            image = cv2.imread(path)
            if image is not None:
                text, boxes, data = extract_text(image)
                results.append((text, boxes, data))
            else:
                print(f"Error loading image: {path}")
                results.append(("", [], {}))
        except Exception as e:
            print(f"Error processing image {path}: {e}")
            results.append(("", [], {}))
    return results

def correct_ocr_errors(extracted_text):
    """
    Corrects common OCR errors and standardizes the extracted text.
    """
    print("Starting OCR error correction...")
    english_words = set(words.words())

    corrected_text = re.sub(r'\b0\b', 'O', extracted_text)
    corrected_text = re.sub(r'\b1\b', 'I', extracted_text)
    corrected_text = re.sub(r'[^a-zA-Z0-9\s]', '', corrected_text)
    corrected_text = re.sub(r'\s+', ' ', corrected_text).strip()

    corrected_words = []
    for word in corrected_text.split():
        if word.lower() in english_words:
            corrected_words.append(word)
        else:
            corrected_words.append(word)

    corrected_text = ' '.join(corrected_words)
    print("OCR error correction completed.")
    return corrected_text

def extract_lines(ocr_data, conf_threshold=60):
    """
    Extracts lines of text from OCR results based on confidence threshold.
    """
    lines = defaultdict(list)
    for i in range(len(ocr_data['text'])):
        if ocr_data['level'][i] == 5 and int(ocr_data['conf'][i]) > conf_threshold:
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
                'box': line_box
            })
    
    return line_data