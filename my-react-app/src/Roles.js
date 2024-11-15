import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { role } from './Navbar';  // Import role

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
            {role === 'Admin' && <th>Actions</th>} {/* Only show actions if role is Admin */}
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
                {role === 'Admin' ? (  // Only allow Admin to change roles
                  <select 
                    value={person.Role} 
                    onChange={(e) => handleRoleChange(person.PersonnelID, e.target.value)}
                  >
                    <option value="Admin">Admin</option>
                    <option value="Affected People">Affected People</option>
                    <option value="Relief Organizations">Relief Organizations</option>
                  </select>
                ) : (
                  <span>{person.Role}</span>  // Display role as text for non-admin users
                )}
              </td>
              {role === 'Admin' && (  // Only show delete button for Admin
                <td>
                  <button
                    className="btn btn-danger me-2"
                    onClick={() => handleDelete(person.PersonnelID)}
                  >
                    Delete
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RoleManagement;
