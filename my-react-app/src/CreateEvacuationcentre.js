import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

const CreateEvacuationCenter = () => {
  const navigate = useNavigate();
  const [evacuationCenter, setEvacuationCenter] = useState({
    Name: '',
    Location: '',
    Capacity: '',
    AvailabilityStatus: ''
  });
  const username = localStorage.getItem('username') || 'Guest';

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/evacuation-centers', evacuationCenter);
      alert('Evacuation Center created successfully');
      navigate('/evacuation', { state: { username } });
    } catch (error) {
      console.error('Error creating evacuation center:', error);
      alert('Failed to create evacuation center. Please try again.');
    }
  };

  return (
    <div className="d-flex flex-column h-100">
      {/* Main content */}
      <div className="main-content-evacuation-center"style={{ maxWidth: '95%'}}>
        <div className="container mt-4">
          <h2 className="mb-4">Create Evacuation Center</h2>
          <form onSubmit={handleCreate} className="row justify-content-center">
            <div className="mb-3 col-md-6">
              <label htmlFor="evacuationCenterName" className="form-label">Name</label>
              <input
                type="text"
                className="form-control"
                id="evacuationCenterName"
                value={evacuationCenter.Name}
                onChange={(e) => setEvacuationCenter({ ...evacuationCenter, Name: e.target.value })}
                pattern="^[A-Z][a-z]{1,14}( [A-Z][a-z]{1,14})*$"
                title="Name should start with a capital letter, with only lowercase letters following, and be 2-15 characters long."
                required
              />
            </div>
            <div className="mb-3 col-md-6">
              <label htmlFor="evacuationCenterLocation" className="form-label">Location</label>
              <input
                type="text"
                className="form-control"
                id="evacuationCenterLocation"
                value={evacuationCenter.Location}
                onChange={(e) => setEvacuationCenter({ ...evacuationCenter, Location: e.target.value })}
                pattern="^[A-Z][a-z]{1,19}$"
                title="Location should start with a capital letter, followed by lowercase letters, and be 2-20 characters long."
                required
              />
            </div>
            <div className="mb-3 col-md-6">
              <label htmlFor="evacuationCenterCapacity" className="form-label">Capacity</label>
              <input
                type="number"
                className="form-control"
                id="evacuationCenterCapacity"
                value={evacuationCenter.Capacity}
                onChange={(e) => setEvacuationCenter({ ...evacuationCenter, Capacity: e.target.value })}
                min="1"
                max="10000"
                title="Capacity must be a number between 1 and 10000."
                required
              />
            </div>
            <div className="mb-3 col-md-6">
              <label htmlFor="evacuationCenterAvailabilityStatus" className="form-label">Availability Status</label>
              <input
                type="text"
                className="form-control"
                id="evacuationCenterAvailabilityStatus"
                value={evacuationCenter.AvailabilityStatus}
                onChange={(e) => setEvacuationCenter({ ...evacuationCenter, AvailabilityStatus: e.target.value })}
                pattern="^(Active|Deactive)$"
                title="Availability Status must be either 'Active' or 'Deactive', with the first letter capitalized."
                required
              />
            </div>
            <div className="col-md-6">
              <Button type="submit" variant="primary" className="w-100">Create</Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateEvacuationCenter;
