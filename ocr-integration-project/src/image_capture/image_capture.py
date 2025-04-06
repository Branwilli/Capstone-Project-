import cv2
from PyQt5.QtWidgets import QApplication, QFileDialog

def capture_image():
    """Capture an image from the webcam."""
    cap = cv2.VideoCapture(0)
    if not cap.isOpened():
        print("Error: Could not open webcam.")
        return None

    ret, frame = cap.read()
    if not ret:
        print("Error: Could not read frame.")
        frame = None

    # Release the camera and close any OpenCV windows
    cap.release()
    cv2.destroyAllWindows()
    return frame

def select_image():
    """Select an image from files using a file dialog."""
    app = QApplication([])
    filename, _ = QFileDialog.getOpenFileName(None, "Select an image", "", "Image files (*.jpg *.jpeg *.png)")
    app.exit()
    if not filename:
        print("No file selected.")
        return None
    image = cv2.imread(filename)
    if image is None:
        print("Error: Could not read the image.")
    return image