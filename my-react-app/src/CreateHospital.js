import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Navbar, Nav, Dropdown, Button, Container } from 'react-bootstrap';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaHome, FaUser, FaBell, FaExclamationCircle, FaHospital, FaCity, FaUserShield, FaTasks, FaPhoneAlt, FaClipboardList, FaNewspaper, FaCogs, FaComments } from 'react-icons/fa';

const CreateHospital = () => {
  const navigate = useNavigate();
  const location = useLocation();
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

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: <FaHome /> },
    { path: '/incidents', label: 'Incidents', icon: <FaExclamationCircle /> },
    { path: '/hospitals', label: 'Hospitals', icon: <FaHospital /> },
    { path: '/evacuation', label: 'Evacuation Centers', icon: <FaCity /> },
    { path: '/role-management', label: 'Role Management', icon: <FaUserShield /> },
    { path: '/task-management', label: 'Task Management', icon: <FaTasks /> },
    { path: '/lifeline-numbers-management', label: 'Lifeline Numbers', icon: <FaPhoneAlt /> },
    { path: '/damage-reporting', label: 'Damage Reporting', icon: <FaClipboardList /> },
    { path: '/news-alerts-management', label: 'News Alerts Management', icon: <FaNewspaper /> },
    { path: '/resource-allocation', label: 'Resource Allocation', icon: <FaCogs /> },
    { path: '/chat', label: 'Chat', icon: <FaComments /> }
  ];

  return (
    <div className="d-flex flex-column h-100">
      {/* Top bar */}
      <Navbar bg="secondary" variant="dark" fixed="top">
        <Container fluid>
          <Navbar.Brand>Hi, {username}</Navbar.Brand>
          <Nav className="ml-auto">
            <Dropdown alignRight>
              <Dropdown.Toggle as={Nav.Link} className="text-white">
                <FaUser /> Account
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item as={Link} to="/profile">Profile</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
            <Dropdown alignRight className="mx-3">
              <Dropdown.Toggle as={Nav.Link} className="text-white position-relative">
                <FaBell />
                <span className="badge badge-danger position-absolute top-0 start-100 translate-middle p-1 rounded-circle">
                  5
                </span>
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item href="#pablo" onClick={(e) => e.preventDefault()}>Notification 1</Dropdown.Item>
                <Dropdown.Item href="#pablo" onClick={(e) => e.preventDefault()}>Notification 2</Dropdown.Item>
                <Dropdown.Item href="#pablo" onClick={(e) => e.preventDefault()}>Notification 3</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
            <Button variant="info" onClick={handleLogout}>Logout</Button>
          </Nav>
        </Container>
      </Navbar>

      <div className="d-flex flex-grow-1">
        {/* Sidebar */}
        <div className="bg-dark text-white sidebar">
          <ul className="nav flex-column px-3">
            {navItems.map((item) => (
              <li key={item.path} className={`nav-item my-2 ${location.pathname === item.path ? 'active' : ''}`}>
                <Link to={item.path} className={`nav-link ${location.pathname === item.path ? 'text-primary' : 'text-white'}`}>
                  {item.icon} {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Main content */}
        <div className="main-content-incident">
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
      </div>
    </div>
  );
};

export default CreateHospital;
