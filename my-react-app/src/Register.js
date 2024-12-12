import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import lifebuoy from './Image/lifebuoy.jpg'; // Adjusted import for the image

const Register = () => {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [contact, setContact] = useState('');
  const [role, setRole] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !password || !contact || !role) {
      alert('All fields are required');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/register', {
        name,
        password,
        contact,
        role
      }, {
        withCredentials: true
      });

      if (response.status === 201) {
        alert('Registration successful');
        navigate('/');
      }
    } catch (error) {
      if (error.response && error.response.data) {
        alert(error.response.data.message || 'Registration failed');
      } else {
        alert('Registration failed');
      }
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-7">
          <div className="text-center mb-3">
            <img 
              src={lifebuoy} 
              alt="Registration" 
              className="img-fluid" 
              style={{ maxHeight: '200px', maxWidth: '100%' }}
            />
          </div>
          <div 
            className="p-4" 
            style={{ backgroundColor: '#D3D3D3', borderRadius: '15px' }}
          >
            <h2 className="text-center mb-4">Register with EmergiPlan</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group mb-3">
                <label>Name:</label>
                <input
                  type="text"
                  className="form-control"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="form-group mb-3">
                <label>Password:</label>
                <input
                  type="password"
                  className="form-control"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  pattern="^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[\W_]).{11,}$"
                  title="Password must be more than 10 characters, and include at least one symbol, one uppercase letter, one lowercase letter, and one number."
                  required
                />
              </div>
              <div className="form-group mb-3">
                <label>Contact Information:</label>
                <input
                  type="number"
                  className="form-control"
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                />
              </div>
              <div className="form-group mb-3">
                <label>Role:</label>
                <select
                  className="form-control"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  required
                >
                  <option value="" disabled>Select your role</option>
                  <option value="Admin">Admin</option>
                  <option value="Relief Organizations">Relief Organizations</option>
                  <option value="Affected People">Affected People</option>
                </select>
              </div>
              <button type="submit" className="btn btn-primary w-100">Register</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
