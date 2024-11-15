// Hospital.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { role } from './Navbar';  // Import role

const Hospital = () => {
  const [hospitals, setHospitals] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHospitals = async () => {
      try {
        const response = await axios.get('http://localhost:5000/hospitals', { withCredentials: true });
        setHospitals(response.data);
      } catch (error) {
        console.error('Error fetching hospitals:', error);
      }
    };
    fetchHospitals();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this hospital?')) {
      try {
        await axios.delete(`http://localhost:5000/hospitals/${id}`, { withCredentials: true });
        setHospitals(hospitals.filter(hospital => hospital.HospitalID !== id));
      } catch (error) {
        console.error('Error deleting hospital:', error);
      }
    }
  };

  const handleCreateCSV = async () => {
    navigate('/create-hospital-csv');
  };

  const handleCreate = () => {
    navigate('/create-hospital');
  };

  const handleEdit = (id) => {
    navigate(`/edit-hospital/${id}`);
  };

  return (
    <div className="main-content-hospitals">
      <div className="container mt-1">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2>Hospitals</h2>
          {role === 'Admin' && (
            <div>
              <Button variant="success" onClick={handleCreateCSV} style={{ marginRight: '10px' }}>
                Add New Hospital by CSV Upload
              </Button>
              <Button variant="success" onClick={handleCreate}>
                Add New Hospital
              </Button>
            </div>
          )}
        </div>
        <table className="table table-striped">
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Location</th>
              <th>Status</th>
              <th>Capacity</th>
              {role === 'Admin' && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {hospitals.map((hospital) => (
              <tr key={hospital.HospitalID}>
                <td>{hospital.HospitalID}</td>
                <td>{hospital.Name}</td>
                <td>{hospital.Location}</td>
                <td>{hospital.Status}</td>
                <td>{hospital.Capacity}</td>
                {role === 'Admin' && (
                  <td>
                    <button className="btn btn-danger me-2" onClick={() => handleDelete(hospital.HospitalID)}>
                      Delete
                    </button>
                    <button className="btn btn-primary" onClick={() => handleEdit(hospital.HospitalID)}>
                      Edit
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Hospital;
