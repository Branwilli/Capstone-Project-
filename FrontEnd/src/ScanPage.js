import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Spinner } from 'react-bootstrap';

function ScanPage() {
  const [image, setImage] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [productName, setProductName] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const navigate = useNavigate();
  const cameraInputRef = React.useRef();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleTakePhoto = () => {
    if (cameraInputRef.current) {
      cameraInputRef.current.click();
    }
  };

  const handleScan = async () => {
    if (!imageFile) return alert('Please upload an image.');
    if (!productName.trim()) return alert('Please enter a product name.');
    setIsUploading(true);
    try {
      // POST to recommendations for analysis and image upload
      const formData = new FormData();
      const userId = localStorage.getItem('user_id');
      formData.append('image', imageFile);
      formData.append('productInfo', productName);
      formData.append('user_id', userId);
      const recRes = await fetch('/api/recommendations', {
        method: 'POST',
        body: formData
      });
      const recData = await recRes.json();
      if (!recRes.ok) throw new Error(recData.message || recData.error || 'Recommendation failed');
      
      const imageUrl = recData.image_url || '';
      // If product_id is returned from recData, use it; else fallback to 1
      const productId = recData.product_id || 1;
      const scanRes = await fetch('/api/scans', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: userId,
          product_id: productId,
          ocr_text: recData.ocr_text || '',
          image_url: imageUrl
        })
      });
      const scanData = await scanRes.json();
      if (!scanRes.ok) throw new Error(scanData.message || 'Scan failed');

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
          {/* Hidden camera input for taking a photo */}
          <input
            type="file"
            accept="image/*"
            capture="environment"
            style={{ display: 'none' }}
            ref={cameraInputRef}
            onChange={handleFileChange}
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