# OCR Integration Part: Image to Text

This project implements an Optical Character Recognition (OCR) system that processes images to extract text and analyze its structure.

## Overview

This project implements an Optical Character Recognition (OCR) system that processes images to extract text. The architecture consists of several components that work together to achieve accurate text recognition and analysis.

## System Architecture

The OCR system is structured into the following main components:

1. **Image Preprocessing**: Enhances the quality of input images by resizing, converting to grayscale, and applying thresholding techniques to make text more distinguishable.

2. **OCR Integration**: Uses Tesseract OCR to extract text and layout information from preprocessed images, providing recognized text and text block coordinates.

3. **Layout Analysis**: Groups extracted text into logical sections (e.g., Nutritional Values, Ingredients) using unsupervised learning techniques like K-means clustering

4. **Post-Processing**: Categorizes the extracted text into predefined categories (Nutritional Values, Ingredients, Chemicals, Others) using NLP techniques such as pattern matching and entity recognition.

## Installation Instructions

Install the required libraries:
```
pip install -r requirements.txt
```


