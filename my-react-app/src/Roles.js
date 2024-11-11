import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

const RoleManagement = () => {
  const [personnel, setPersonnel] = useState([]);
  
  useEffect(() => {
    const fetchPersonnel = async () => {
      try {
        const response = await axios.get('http://localhost:5000/personnel');
        setPersonnel(response.data);
      } catch (error) {
        console.error('Error fetching personnel:', error);
      }
    };

    fetchPersonnel();
  }, []);

  const handleRoleChange = async (id, newRole) => {
    try {
      await axios.put(`http://localhost:5000/personnel/${id}`, { Role: newRole });
      setPersonnel(personnel.map(person =>
        person.PersonnelID === id ? { ...person, Role: newRole } : person
      ));
    } catch (error) {
      console.error('Error updating role:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/personnel/${id}`);
      setPersonnel(personnel.filter(person => person.PersonnelID !== id));
    } catch (error) {
      console.error('Error deleting personnel:', error);
    }
  };

  return (
    <div className="container mt-4">
      <h2>Role Management</h2>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Status</th>
            <th>Contact Number</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {personnel.map((person) => (
            <tr key={person.PersonnelID} style={{ backgroundColor: person.Status === 'Online' ? 'lightgreen' : 'white' }}>
              <td>{person.PersonnelID}</td>
              <td>{person.Name}</td>
              <td>{person.Status}</td>
              <td>{person.ContactInformation}</td>
              <td>
                <select 
                  value={person.Role} 
                  onChange={(e) => handleRoleChange(person.PersonnelID, e.target.value)}
                >
                  <option value="Admin">Admin</option>
                  <option value="Manager">Manager</option>
                  <option value="Affected People">Affected People</option>
                  <option value="Relief Organizations">Relief Organizations</option>
                </select>
              </td>
              <td>
                <button
                  className="btn btn-danger me-2"
                  onClick={() => handleDelete(person.PersonnelID)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RoleManagement;
