import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        'http://localhost:5000/login',
        { username, password },
        { withCredentials: true }
      );

      if (response.data.user) {
        // Save the username to localStorage
        localStorage.setItem('username', response.data.user.Name);
        navigate('/dashboard');
      } else {
        alert(response.data.message || 'Login failed. Please try again.');
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        alert('Invalid username or password');
      } else {
        alert('An error occurred. Please try again.');
      }
    }
  };

  const handleRegister = () => {
    navigate('/register');
  };

  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-lg-5 d-flex flex-column justify-content-center align-items-center bg-primary text-white" style={{ height: '500px' }}>
          <h1>EmergiPlan</h1>
          <img 
            src="https://media.licdn.com/dms/image/D4E10AQGy6GmETadoGA/image-shrink_800/0/1689665441446?e=2147483647&v=beta&t=uZDbrnvmPv_Z4Xr_0ySvLs7hPp8qIT9CyF0kYOtXnWg" 
            alt="User provided" 
            className="mt-4" 
            style={{ height: '300px', width: '100%' }} 
          />
        </div>
        <div className="col-lg-5 d-flex flex-column justify-content-center align-items-center bg-warning" style={{ height: '500px' }}>
          <form className="w-100" onSubmit={handleLogin}>
            <fieldset>
              <legend className="text-center mb-4">
                <h1>User Login</h1>
              </legend>
              <div className="mb-3 w-75">
                <label className="form-label" htmlFor="username">
                  <h3>Username</h3>
                </label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  className="form-control"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              <div className="mb-4 w-75">
                <label className="form-label" htmlFor="password">
                  <h3>Password</h3>
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  className="form-control"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className="d-flex flex-column align-items-center">
                <button className="btn btn-success btn-lg w-75 mb-2" type="submit">
                  Login
                </button>
                <p className="text-center">
                  No account yet?{' '}
                  <button type="button" className="btn btn-link" onClick={handleRegister}>
                    Register
                  </button>
                </p>
              </div>
            </fieldset>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
