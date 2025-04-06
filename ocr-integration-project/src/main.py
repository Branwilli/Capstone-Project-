import os
from image_capture.image_capture import capture_image, select_image

def main():
    choice = input("Enter 'c' to capture an image or 's' to select an image from files: ").strip().lower()
    if choice == 'c':
        image = capture_image()
    elif choice == 's':
        image = select_image()
    else:
        print("Invalid choice.")
        return

    if image is None:
        print("No image to process.")
        return

    print("Image loaded successfully.")

    # Image Preprocessing
    from preprocessing import preprocess_image
    output_dir = os.path.join(os.path.expanduser("~"), "Downloads")
    preprocessed_image = preprocess_image(image, 
                                        target_size=(800, 800), 
                                        threshold_value=128, 
                                        output_path=output_dir, 
                                        file_name="processed_image.png")

    if preprocessed_image is None or preprocessed_image.size == 0:
        print("Error: Preprocessing failed.")
        return

    print("Image preprocessed successfully.")

    # OCR Integration
    from ocr_integration import extract_text, correct_ocr_errors, extract_lines
    
    print("Starting OCR extraction...")
    recognized_text, text_coordinates, ocr_data = extract_text(preprocessed_image)
    print("OCR extraction completed.")
    print(f"Recognized Text: {recognized_text}")
    print(f"Text Coordinates: {text_coordinates}")

    # Correct OCR Errors
    corrected_text = correct_ocr_errors(recognized_text)
    print(f"Corrected Text: {corrected_text}")

    # Save corrected OCR text to a file
    documents_dir = os.path.join(os.path.expanduser("~"), "Documents")
    text_output_path = os.path.join(documents_dir, "corrected_text.txt")
    os.makedirs(os.path.dirname(text_output_path), exist_ok=True)
    with open(text_output_path, "w", encoding='utf-8') as text_file:
        text_file.write(corrected_text)
    print(f"Corrected OCR text saved to {text_output_path}")

    # Extract Lines
    line_data = extract_lines(ocr_data)
    print(f"Extracted {len(line_data)} lines of text")

    # Layout Analysis
    from layout_analysis import layout_analysis
    
    print("Starting layout analysis...")
    clustered_sections = layout_analysis(line_data, n_clusters=3)
    print(f"Detected layout sections: {clustered_sections}")

    # PostProcessing - Categorize Text
    from post_processing import categorize_text
    categorized_text = categorize_text(clustered_sections)
    
    # Summary of clustered sections
    print("Summarizing clustered sections...")
    def summarize_text(clustered_sections):
        if not isinstance(clustered_sections, dict):
            return "Error: clustered_sections is not a dictionary."
        
        summary = []
        for cluster_id, texts in clustered_sections.items():
            num_elements = len(texts)
            if num_elements <= 5:
                text_snippet = ' '.join(texts)
            else:
                text_snippet = ' '.join(texts[:3]) + ' ... ' + ' '.join(texts[-3:])
            
            if len(text_snippet) > 100:
                text_snippet = text_snippet[:97] + '...'
            
            summary_line = f"Section {cluster_id}: {num_elements} elements - {text_snippet}"
            summary.append(summary_line)
        
        return '\n'.join(summary)
    
    summarized_text = summarize_text(clustered_sections)

    # Output the results
    print("\nCategorized Text:")
    for item in categorized_text:
        if isinstance(item, tuple) and len(item) == 2:
            category, content = item
            print(f"{category}: {content}")
        else:
            print(f"Unexpected format in categorized_text: {item}")
    
    print("\nSummarized Text:")
    print(summarized_text)

    # Save layout sections and categorized text to a file
    layout_output_path = os.path.join(documents_dir, "layout_sections.txt")
    os.makedirs(os.path.dirname(layout_output_path), exist_ok=True)
    with open(layout_output_path, "w", encoding='utf-8') as layout_file:
        layout_file.write("Clustered Sections:\n")
        for cluster_id, texts in clustered_sections.items():
            layout_file.write(f"Section {cluster_id}: {texts}\n")
        layout_file.write("\nCategorized Text:\n")
        # Handle list of tuples instead of dictionary
        for item in categorized_text:
            if isinstance(item, tuple) and len(item) == 2:
                category, content = item
                layout_file.write(f"{category}: {content}\n")
            else:
                layout_file.write(f"Unexpected format: {item}\n")
    print(f"Layout sections saved to {layout_output_path}")
    
if __name__ == "__main__":
    main()