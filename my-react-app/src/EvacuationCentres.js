import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const EvacuationCenter = () => {
  const [centers, setCenters] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCenters = async () => {
      try {
        const response = await axios.get('http://localhost:5000/evacuation-centers');
        setCenters(response.data);
      } catch (error) {
        console.error('Error fetching evacuation centers:', error);
      }
    };

    fetchCenters();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this evacuation center?')) {
      try {
        await axios.delete(`http://localhost:5000/evacuation-centers/${id}`);
        setCenters(centers.filter(center => center.CenterID !== id));
      } catch (error) {
        console.error('Error deleting evacuation center:', error);
        alert('Failed to delete evacuation center');
      }
    }
  };

  const handleEdit = (id) => {
    navigate(`/edit-evacuationcentre/${id}`);
  };

  const handleCreate = () => {
    navigate('/create-evacuationcentre');
  };

  return (
    <div className="main-content-evacuation-center">
      <div className="container mt-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2>Evacuation Centers</h2>
          <Button variant="success" onClick={handleCreate}>Add New Evacuation Center</Button>
        </div>
        <table className="table table-striped">
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Location</th>
              <th>Capacity</th>
              <th>Availability Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {centers.map((center) => (
              <tr key={center.CenterID}>
                <td>{center.CenterID}</td>
                <td>{center.Name}</td>
                <td>{center.Location}</td>
                <td>{center.Capacity}</td>
                <td>{center.AvailabilityStatus}</td>
                <td>
                  <Button variant="primary" className="me-2" onClick={() => handleEdit(center.CenterID)}>Edit</Button>
                  <Button variant="danger" onClick={() => handleDelete(center.CenterID)}>Delete</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EvacuationCenter;
