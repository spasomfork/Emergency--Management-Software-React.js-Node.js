import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button, Container } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const CreateHospitalCSV = () => {
  const [file, setFile] = useState(null);
  const navigate = useNavigate();
  const username = localStorage.getItem('username') || 'Guest';

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
      await axios.post('http://localhost:5000/hospitals/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      alert('CSV uploaded successfully');
      navigate('/hospitals');
    } catch (error) {
      console.error('Error uploading CSV:', error);
      alert('Failed to upload CSV. Please try again.');
    }
  };

  const handleLogout = () => {
    navigate('/'); // Redirect to login page
  };

  return (
    <div className="main-content-create-hospital-csv" style={{ maxWidth: '80%', marginTop: '30px' }}>
      <Container className="mt-4">
        <h2 className="mb-4">Upload Hospital CSV</h2>
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
  );
};

export default CreateHospitalCSV;
