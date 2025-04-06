import cv2
import numpy as np
import os

def resize_image(image, fx=1.5, fy=1.5):
    """
    Resizes the input image by the specified scaling factors.

    Parameters:
    image (numpy.ndarray): The input image.
    fx (float): Scaling factor along the horizontal axis.
    fy (float): Scaling factor along the vertical axis.

    Returns:
    numpy.ndarray: The resized image.
    """
    print(f"Resizing image with factors fx={fx}, fy={fy}....")
    resized_image = cv2.resize(image, None, fx=fx, fy=fy, interpolation=cv2.INTER_CUBIC)
    print("Image resized successfully")
    return resized_image

def convert_to_grayscale(image):
    """
    Converts the input image to grayscale to simplify further processing.

    Parameters:
    image (numpy.ndarray): The input image.

    Returns:
    numpy.ndarray: The grayscale image.
    """
    print("Converting image to grayscale....")
    grayscale_image = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    print("Image converted to grayscale successfully")
    return grayscale_image

def apply_threshold(image, threshold_value):
    """
    Applies binary thresholding to the input image to enhance text visibility.

    Parameters:
    image (numpy.ndarray): The input grayscale image.
    threshold_value (int): The threshold value for binarization.

    Returns:
    numpy.ndarray: The thresholded binary image.
    """
    print(f"Applying threshold with value={threshold_value}...")
    kernel = np.ones((1, 1), np.uint8)
    image = cv2.dilate(image, kernel, iterations=1)
    image = cv2.erode(image, kernel, iterations=1)
    print("Dilation and erosion applied successfully")
    
    _, thresholded_image = cv2.threshold(image, threshold_value, 255, cv2.THRESH_BINARY)
    print("Thresholding applied successfully")
    return thresholded_image

def preprocess_image(image, target_size, threshold_value, output_path, file_name):
    """
    Preprocesses the input image by resizing, converting to grayscale, and applying thresholding.

    Parameters:
    image (numpy.ndarray): The input image.
    target_size (tuple): The target dimensions (width, height) for resizing.
    threshold_value (int): The threshold value for binarization.
    output_path (str): The directory to save the preprocessed image.
    file_name (str): The name of the output file.

    Returns:
    numpy.ndarray: The preprocessed image.
    """
    print("Starting preprocessing of image....")
    original_height, original_width = image.shape[:2]
    target_width, target_height = target_size
    fx = target_width / original_width
    fy = target_height / original_height
    
    resized_image = resize_image(image, fx, fy)
    grayscale_image = convert_to_grayscale(resized_image)
    thresholded_image = apply_threshold(grayscale_image, threshold_value)
    
    save_path = os.path.join(output_path, file_name)
    cv2.imwrite(save_path, thresholded_image)
    print("Image saved successfully")
    
    return thresholded_image