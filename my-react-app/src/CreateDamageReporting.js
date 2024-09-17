import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Navbar, Nav, Dropdown, Button, Container } from 'react-bootstrap';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaHome, FaUser, FaBell, FaExclamationCircle, FaHospital, FaCity, FaUserShield, FaTasks, FaPhoneAlt, FaClipboardList, FaNewspaper, FaCogs, FaComments } from 'react-icons/fa';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';

// Custom icon for map marker
const customIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  shadowSize: [41, 41]
});

const CreateDamageReport = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [report, setReport] = useState({
    Property: '',
    Severity: '',
    DamageDescription: '', // Renamed to DamageDescription
    Latitude: '',
    Longitude: '',
    Name: '', 
    Photo: null 
  });
  const username = localStorage.getItem('username') || 'Guest';

  const handleCreate = async (e) => {
    e.preventDefault();

    // Use FormData to handle file uploads
    const formData = new FormData();
    formData.append('Property', report.Property);
    formData.append('Severity', report.Severity);
    formData.append('DamageDescription', report.DamageDescription); // Use DamageDescription
    formData.append('Latitude', report.Latitude);
    formData.append('Longitude', report.Longitude);
    formData.append('Name', report.Name); // Add name to form data
    formData.append('Photo', report.Photo); // Add photo to form data

    try {
      await axios.post('http://localhost:5000/damagereports', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      alert('Damage report created successfully');
      navigate('/damage-reporting', { state: { username } });
    } catch (error) {
      console.error('Error creating damage report:', error);
      alert('Failed to create report. Please try again.');
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
        setReport({
          ...report,
          Latitude: lat,
          Longitude: lng
        });
      }
    });

    return report.Latitude && report.Longitude ? (
      <Marker position={[report.Latitude, report.Longitude]} icon={customIcon} />
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
            <h2 className="mb-4">Create Damage Report</h2>
            <form onSubmit={handleCreate} className="row justify-content-center">
              <div className="mb-3 col-md-6">
                <label htmlFor="damageProperty" className="form-label">Property Relationship</label>
                <input
                  type="text"
                  className="form-control"
                  id="damageProperty"
                  value={report.Property}
                  onChange={(e) => setReport({ ...report, Property: e.target.value })}
                />
              </div>
              <div className="mb-3 col-md-6">
                <label htmlFor="damageSeverity" className="form-label">Severity</label>
                <input
                  type="text"
                  className="form-control"
                  id="damageSeverity"
                  value={report.Severity}
                  onChange={(e) => setReport({ ...report, Severity: e.target.value })} />
              </div>
              <div className="mb-3 col-md-12">
                <label htmlFor="damageDescription" className="form-label">Damage Description</label> {/* Updated label */}
                <textarea
                  className="form-control"
                  id="damageDescription"
                  value={report.DamageDescription}  // Updated value to DamageDescription
                  onChange={(e) => setReport({ ...report, DamageDescription: e.target.value })}  // Updated state setter
                />
              </div>

              {/* New Name Input */}
              <div className="mb-3 col-md-6">
                <label htmlFor="damageName" className="form-label">Name</label>
                <input
                  type="text"
                  className="form-control"
                  id="damageName"
                  value={report.Name}
                  onChange={(e) => setReport({ ...report, Name: e.target.value })} />
              </div>

              {/* New Photo Upload */}
              <div className="mb-3 col-md-6">
                <label htmlFor="damagePhoto" className="form-label">Upload Photo</label>
                <input
                  type="file"
                  className="form-control"
                  id="damagePhoto"
                  onChange={(e) => setReport({ ...report, Photo: e.target.files[0] })} />
              </div>

              {/* Map for selecting location */}
              <div className="mb-3 col-md-12">
                <label className="form-label">Select Location on Map</label>
                <MapContainer
                  center={[51.505, -0.09]}
                  zoom={13}
                  scrollWheelZoom={false}
                  style={{ height: '300px' }}>
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <LocationMarker />
                </MapContainer>
              </div>

              <div className="mb-3 col-md-6">
                <label htmlFor="latitude" className="form-label">Latitude</label>
                <input
                  type="text"
                  className="form-control"
                  id="latitude"
                  value={report.Latitude}
                  readOnly />
              </div>

              <div className="mb-3 col-md-6">
                <label htmlFor="longitude" className="form-label">Longitude</label>
                <input
                  type="text"
                  className="form-control"
                  id="longitude"
                  value={report.Longitude}
                  readOnly />
              </div>

              <div className="mb-3 col-md-6">
                <button type="submit" className="btn btn-primary">Submit Report</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateDamageReport;
