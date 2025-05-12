import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Spinner } from 'react-bootstrap';

function ScanPage() {
  const [image, setImage] = useState(null);
  const [productName, setProductName] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleTakePhoto = () => {
    alert('Camera functionality is not implemented in this demo.');
  };

  const handleScan = async () => {
    if (!image) return alert('Please upload an image.');
    if (!productName.trim()) return alert('Please enter a product name.');
    setIsUploading(true);
    try {
      // 1. POST scan to backend
      const scanRes = await fetch('/api/scans', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          // You may need to add user_id and product_id if required by backend
          user_id: 1, // TODO: Replace with actual user id from auth/session
          product_id: 1, // TODO: Replace with actual product id if available
          ocr_text: '', // Optional: fill if you have OCR text
          image_url: image // For demo, send base64 image
        })
      });
      const scanData = await scanRes.json();
      if (!scanRes.ok) throw new Error(scanData.message || 'Scan failed');

      // 2. POST to recommendations for analysis
      const recRes = await fetch('/api/recommendations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          image,
          productInfo: productName
        })
      });
      const recData = await recRes.json();
      if (!recRes.ok) throw new Error(recData.message || 'Recommendation failed');

      setIsUploading(false);
      navigate('/results', { state: recData });
    } catch (error) {
      console.error('Error scanning:', error);
      setIsUploading(false);
      alert(error.message || 'Scan failed');
    }
  };

  return (
    <div className="scan pt-16 container mx-auto px-4 text-center">
      <h2 className="text-2xl font-bold text-secondary mb-4">Scan Your Food</h2>
      <div className="card shadow-sm mx-auto" style={{ maxWidth: '500px' }}>
        <div className="card-body">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="form-control mb-3"
          />
          <button
            onClick={handleTakePhoto}
            className="btn btn-outline-secondary mb-3"
          >
            Take a Photo
          </button>
          {image && (
            <img
              src={image}
              alt="Preview"
              className="img-fluid mb-3"
              style={{ maxHeight: '300px' }}
            />
          )}
          <input
            type="text"
            placeholder="Enter product name"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            className="form-control mb-3"
          />
          <button
            onClick={handleScan}
            className="btn btn-primary"
            disabled={isUploading}
          >
            {isUploading ? <Spinner animation="border" size="sm" /> : 'Submit Scan'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ScanPage;