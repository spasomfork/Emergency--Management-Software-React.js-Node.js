import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Navbar, Nav, Dropdown, Button, Container } from 'react-bootstrap';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaHome, FaUser, FaBell, FaExclamationCircle, FaHospital, FaCity, FaUserShield, FaTasks, FaPhoneAlt, FaClipboardList, FaNewspaper, FaCogs, FaComments } from 'react-icons/fa';

const CreateEvacuationCenter = () => {
  const navigate = useNavigate();
  const location = useLocation();
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
        <div className="main-content-evacuation-center">
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
                  pattern="^[A-Z][a-z]{1,14}$"
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
    </div>
  );
};

export default CreateEvacuationCenter;
