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
      // TODO: Replace the mock data below with a real API call to the backend
      // const response = await fetch('/api/scan', { ... });
      // const data = await response.json();
      const data = {
        scan_id: '123',
        productName,
        sodium: 200,
        sugar: 10,
        fats: 5,
        protein: 15,
        vitamins: ['A', 'C'],
        nutriscores: 'B',
        chemicalRisk: 2,
        feedback: 'Moderate sodium; avoid if sensitive to Red Dye 40.'
      };
      setTimeout(() => {
        setIsUploading(false);
        navigate('/results', { state: data });
      }, 2000);
    } catch (error) {
      console.error('Error scanning:', error);
      setIsUploading(false);
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