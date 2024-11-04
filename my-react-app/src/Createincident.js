import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Navbar, Nav, Dropdown, Button, Container } from 'react-bootstrap';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaHome, FaUser, FaBell, FaExclamationCircle, FaHospital, FaCity, FaUserShield, FaTasks, FaPhoneAlt, FaClipboardList, FaNewspaper, FaCogs, FaComments } from 'react-icons/fa';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';

// Custom icon URL (replace with your desired icon)
const customIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png', // Replace with your custom icon URL
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  shadowSize: [41, 41]
});

const CreateIncident = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [incident, setIncident] = useState({
    Title: '',
    Description: '',
    Status: '',
    Date: '',
    Latitude: '',
    Longitude: ''
  });
  const username = localStorage.getItem('username') || 'Guest';

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/incidents', incident);
      alert('Incident created successfully');
      navigate('/incidents', { state: { username } });
    } catch (error) {
      console.error('Error creating incident:', error);
      alert('Failed to create incident. Please try again.');
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

  // Component to handle the map click and marker placement
  function LocationMarker() {
    const map = useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;
        setIncident({
          ...incident,
          Latitude: lat,
          Longitude: lng
        });
      }
    });

    return incident.Latitude && incident.Longitude ? (
      <Marker position={[incident.Latitude, incident.Longitude]} icon={customIcon} />
    ) : null;
  }

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
            <h2 className="mb-4">Create Incident</h2>
            <form onSubmit={handleCreate} className="row justify-content-center">
              <div className="mb-3 col-md-4">
                <label htmlFor="incidentTitle" className="form-label">Title</label>
                <input
                  type="text"
                  className="form-control"
                  id="incidentTitle"
                  value={incident.Title}
                  onChange={(e) => setIncident({ ...incident, Title: e.target.value })}
                  pattern="([A-Z][a-z]{1,14})(\s[A-Z][a-z]{1,14})*"
                />
              </div>
              <div className="mb-3 col-md-4">
                <label htmlFor="incidentDescription" className="form-label">Description</label>
                <textarea
                  className="form-control"
                  id="incidentDescription"
                  value={incident.Description}
                  onChange={(e) => setIncident({ ...incident, Description: e.target.value })}
                  pattern="([A-Z][a-z]{1,14})(\s([A-Za-z][a-z]{1,14}))*"
                />
              </div>
              <div className="mb-3 col-md-4">
                <label htmlFor="incidentStatus" className="form-label">Status</label>
                <input
                  type="text"
                  className="form-control"
                  id="incidentStatus"
                  value={incident.Status}
                  onChange={(e) => setIncident({ ...incident, Status: e.target.value })}
                  pattern="^(High|Mild|Low)$"
                />
              </div>
              <div className="mb-3 col-md-4">
                <label htmlFor="incidentDate" className="form-label">Date</label>
                <input
                  type="date"
                  className="form-control"
                  id="incidentDate"
                  value={incident.Date}
                  onChange={(e) => setIncident({ ...incident, Date: e.target.value })}
                />
              </div>
              {/* Map for selecting location */}
              <div className="mb-3 col-md-8">
                <label className="form-label">Select Location on Map</label>
                <MapContainer center={[51.505, -0.09]} zoom={13} style={{ height: '50vh', width: '80%' }}>
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  />
                  <LocationMarker />
                </MapContainer>
              </div>
              <div className="col-md-6 mt-4">
                <Button type="submit" variant="primary" className="w-100">Create</Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateIncident;
