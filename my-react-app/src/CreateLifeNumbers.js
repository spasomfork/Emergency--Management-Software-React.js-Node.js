import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button, Container } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const CreateLifelineCSV = () => {
  const [file, setFile] = useState(null);
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      alert('Please select a CSV file first.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      await axios.post('http://localhost:5000/lifeline-numbers/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      alert('CSV uploaded successfully');
      navigate('/lifeline-numbers-management');
    } catch (error) {
      console.error('Error uploading CSV:', error);
      alert('Failed to upload CSV. Please try again.');
    }
  };

  return (
    <div className="d-flex flex-column h-100">
      <div className="main-content-lifeline"  style={{ height:'100vh',  marginTop: '10px', width:'90%' }}>
        <Container className="mt-4">
          <h2 className="mb-4">Upload Lifeline Numbers CSV</h2>
          <form onSubmit={handleUpload}>
            <div className="mb-3">
              <input
                type="file"
                className="form-control"
                accept=".csv"
                onChange={handleFileChange}
              />
            </div>
            <Button type="submit" variant="primary">Upload CSV</Button>
          </form>
        </Container>
      </div>
    </div>
  );
};

export default CreateLifelineCSV;
