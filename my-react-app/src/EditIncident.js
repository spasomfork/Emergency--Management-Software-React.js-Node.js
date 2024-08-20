import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation, useParams } from 'react-router-dom';
import { Navbar, Nav, Dropdown, Button, Container } from 'react-bootstrap';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import {
    FaHome, FaUser, FaBell, FaExclamationCircle, FaHospital, FaCity, FaUserShield, FaTasks,
    FaPhoneAlt, FaClipboardList, FaNewspaper, FaCogs, FaComments
} from 'react-icons/fa';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';

// Custom icon URL (replace with your desired icon)
const customIcon = L.icon({
    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
    shadowSize: [41, 41]
});

const EditIncident = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { id } = useParams();
    const [incident, setIncident] = useState({
        Title: '',
        Description: '',
        Status: '',
        Date: '',
        Latitude: '',
        Longitude: ''
    });
    const username = localStorage.getItem('username') || 'Guest';

    useEffect(() => {
        // Fetch incident data by ID
        const fetchIncident = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/incidents/${id}`);
                if (response.data) {
                    setIncident(response.data);
                } else {
                    alert('Incident not found');
                    navigate('/incidents');
                }
            } catch (error) {
                console.error('Error fetching incident:', error);
                alert('Error fetching incident');
            }
        };

        fetchIncident();
    }, [id, navigate]);

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`http://localhost:5000/incidents/${id}`, incident);
            alert('Updated successfully');
            navigate('/incidents', { state: { username } });
        } catch (error) {
            console.error('Error updating incident:', error.response?.data || error.message);
            alert('Failed to update incident. Please try again.');
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
        { path: '/lifeline-numbers-management', label: 'Lifeline Numbers Management', icon: <FaPhoneAlt /> },
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
                        <h2 className="mb-4">Edit Incident</h2>
                        <form onSubmit={handleUpdate}>
                            <div className="form-group mb-3">
                                <label htmlFor="title">Title:</label>
                                <input
                                    type="text"
                                    id="title"
                                    className="form-control"
                                    value={incident.Title}
                                    onChange={(e) => setIncident({ ...incident, Title: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="form-group mb-3">
                                <label htmlFor="description">Description:</label>
                                <textarea
                                    id="description"
                                    className="form-control"
                                    value={incident.Description}
                                    onChange={(e) => setIncident({ ...incident, Description: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="form-group mb-3">
                                <label htmlFor="status">Status:</label>
                                <input
                                    type="text"
                                    id="status"
                                    className="form-control"
                                    value={incident.Status}
                                    onChange={(e) => setIncident({ ...incident, Status: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="form-group mb-3">
                                <label htmlFor="date">Date:</label>
                                <input
                                    type="date"
                                    id="date"
                                    className="form-control"
                                    value={incident.Date}
                                    onChange={(e) => setIncident({ ...incident, Date: e.target.value })}
                                    required
                                />
                            </div>

                            {/* Map for selecting location */}
                            <div className="map-container mb-3">
                                <label className="form-label">Select Location on Map</label>
                                <MapContainer center={[incident.Latitude || 51.505, incident.Longitude || -0.09]} zoom={13} style={{ height: '50vh', width: '80%' }}>
                                    <TileLayer
                                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                    />
                                    <LocationMarker />
                                </MapContainer>
                            </div>

                            <div className="form-group mb-3">
                                <label htmlFor="latitude">Latitude:</label>
                                <input
                                    type="text"
                                    id="latitude"
                                    className="form-control"
                                    value={incident.Latitude}
                                    readOnly
                                />
                            </div>

                            <div className="form-group mb-3">
                                <label htmlFor="longitude">Longitude:</label>
                                <input
                                    type="text"
                                    id="longitude"
                                    className="form-control"
                                    value={incident.Longitude}
                                    readOnly
                                />
                            </div>

                            <button type="submit" className="btn btn-primary">Update Incident</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditIncident;
