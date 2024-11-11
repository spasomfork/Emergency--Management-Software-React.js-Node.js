import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const CreateHospital = () => {
  const navigate = useNavigate();
  const [hospital, setHospital] = useState({
    Name: '',
    Location: '',
    Status: '',
    Capacity: ''
  });
  const username = localStorage.getItem('username') || 'Guest';

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/hospitals', hospital);
      alert('Hospital created successfully');
      navigate('/hospitals', { state: { username } });
    } catch (error) {
      console.error('Error creating hospital:', error);
      alert('Failed to create hospital. Please try again.');
    }
  };

  const handleLogout = () => {
    navigate('/'); // Redirect to login page
  };

  return (
    <div className="main-content-create-hospital" style={{ maxWidth: '80%', marginTop: '30px' }}>
      <div className="container mt-4">
        <h2 className="mb-4">Create Hospital</h2>
        <form onSubmit={handleCreate} className="row justify-content-center">
          <div className="mb-3 col-md-6">
            <label htmlFor="hospitalName" className="form-label">Name</label>
            <input
              type="text"
              className="form-control"
              id="hospitalName"
              value={hospital.Name}
              onChange={(e) => setHospital({ ...hospital, Name: e.target.value })}
              pattern="^[A-Z][a-z]{1,14}( [A-Z][a-z]{1,14})*$"
              title="Name"
              required
            />
          </div>
          <div className="mb-3 col-md-6">
            <label htmlFor="hospitalLocation" className="form-label">Location</label>
            <input
              type="text"
              className="form-control"
              id="hospitalLocation"
              value={hospital.Location}
              onChange={(e) => setHospital({ ...hospital, Location: e.target.value })}
              pattern="^[A-Z][a-z]{1,14}$"
              title="Location"
              required
            />
          </div>
          <div className="mb-3 col-md-6">
            <label htmlFor="hospitalStatus" className="form-label">Status</label>
            <input
              type="text"
              className="form-control"
              id="hospitalStatus"
              value={hospital.Status}
              onChange={(e) => setHospital({ ...hospital, Status: e.target.value })}
              pattern="^(Active|Deactive|Operational)$"
              title="Status"
              required
            />
          </div>
          <div className="mb-3 col-md-6">
            <label htmlFor="hospitalCapacity" className="form-label">Capacity</label>
            <input
              type="number"
              className="form-control"
              id="hospitalCapacity"
              value={hospital.Capacity}
              onChange={(e) => setHospital({ ...hospital, Capacity: e.target.value })}
              pattern="^[1-9]\d{0,3}$|^10000$"
              title="Capacity"
              required
            />
          </div>
          <div className="col-md-6">
            <Button type="submit" variant="primary" className="w-100">Create</Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateHospital;
