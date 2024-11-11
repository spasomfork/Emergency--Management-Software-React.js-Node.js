import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

const CreateResource = () => {
  const navigate = useNavigate();
  const [resource, setResource] = useState({
    Name: '',
    Status: 'open', // Default value
    Quantity: '',
    Description: ''
  });
  const username = localStorage.getItem('username') || 'Guest';

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/resources', resource);
      alert('Resource created successfully');
      navigate('/resource-allocation', { state: { username } });
    } catch (error) {
      console.error('Error creating resource:', error);
      alert('Failed to create resource. Please try again.');
    }
  };

  return (
    <div className="container mt-4" style={{ maxWidth: '80%',  marginTop: '10px' }}>
      <h2 className="mb-4">Create Resource</h2>
      <form onSubmit={handleCreate} className="row justify-content-center">
        <div className="mb-3 col-md-6">
          <label htmlFor="resourceName" className="form-label">Name</label>
          <input
            type="text"
            className="form-control"
            id="resourceName"
            value={resource.Name}
            onChange={(e) => setResource({ ...resource, Name: e.target.value })}
            pattern="^[A-Z][a-zA-Z\s]{1,24}$" // First letter capital and 2-25 characters
            required
          />
        </div>
        <div className="mb-3 col-md-6">
          <label htmlFor="resourceStatus" className="form-label">Status</label>
          <select
            className="form-select"
            id="resourceStatus"
            value={resource.Status}
            onChange={(e) => setResource({ ...resource, Status: e.target.value })}
          >
            <option value="open">Open</option>
            <option value="ongoing">Ongoing</option>
            <option value="completed">Completed</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
        <div className="mb-3 col-md-6">
          <label htmlFor="resourceQuantity" className="form-label">Quantity</label>
          <input
            type="number"
            className="form-control"
            id="resourceQuantity"
            value={resource.Quantity}
            onChange={(e) => setResource({ ...resource, Quantity: e.target.value })}
            pattern="^(?:[2-9]|[1-9][0-9]|[1][0-0]{1,2})$" // Number from 2-1000
            required
          />
        </div>
        <div className="mb-3 col-md-6">
          <label htmlFor="resourceDescription" className="form-label">Description</label>
          <textarea
            className="form-control"
            id="resourceDescription"
            value={resource.Description}
            onChange={(e) => setResource({ ...resource, Description: e.target.value })}
            pattern="^([A-Z][a-zA-Z\s]{1,24})(\s[A-Za-z][a-zA-Z\s]{1,24})*$" // Multiple words with first letter capital
            required
          />
        </div>
        <div className="col-md-6">
          <Button type="submit" variant="primary" className="w-100">Create</Button>
        </div>
      </form>
    </div>
  );
};

export default CreateResource;
