import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation, useParams } from 'react-router-dom';
import { Navbar, Nav, Dropdown, Button, Container } from 'react-bootstrap';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import {
    FaHome, FaUser, FaBell, FaExclamationCircle, FaHospital, FaCity, FaUserShield, FaTasks,
    FaPhoneAlt, FaClipboardList, FaNewspaper, FaCogs, FaComments
} from 'react-icons/fa';

const ViewNewsAlert = () => {
    const [alert, setAlert] = useState({
        AlertTitle: '',
        AlertDescription: '',
        AlertSource: '',
        AlertDate: '',
    });

    const [errorMessage, setErrorMessage] = useState(''); // Error state

    const navigate = useNavigate();
    const { id } = useParams();
    const location = useLocation();

    const username = localStorage.getItem('username') || 'Guest';

    useEffect(() => {
        const fetchAlert = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/disaster-alerts/${id}`);
                if (response.data) {
                    setAlert(response.data);
                } else {
                    setErrorMessage('Alert not found');
                    navigate('/news-alerts-management');
                }
            } catch (error) {
                console.error('Error fetching Alert:', error);
                setErrorMessage('Error fetching Alert');
            }
        };

        fetchAlert();
    }, [id, navigate]);

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
                <div className="main-content-alerts d-flex justify-content-center align-items-start">
                    <div className="container" style={{ maxWidth: '80%' }}>
                        <h2 className="mb-4">View Alert</h2>

                        {errorMessage && (
                            <div className="alert alert-danger" role="alert">
                                {errorMessage}
                            </div>
                        )}
                        
                        <div className="form-group mb-3">
                            <label htmlFor="title">Title:</label>
                            <input
                                type="text"
                                id="title"
                                className="form-control"
                                value={alert.AlertTitle}
                                onChange={(e) => setAlert({ ...alert, AlertTitle: e.target.value })}
                                required
                            />
                        </div>

                        <div className="form-group mb-3">
                            <label htmlFor="description">Description:</label>
                            <textarea
                                id="description"
                                className="form-control"
                                value={alert.AlertDescription}
                                onChange={(e) => setAlert({ ...alert, AlertDescription: e.target.value })}
                                required
                                rows={5}  // Specify number of rows for better visibility
                            />
                        </div>

                        <div className="form-group mb-3">
                            <label htmlFor="source">Source:</label>
                            <input
                                type="text"
                                id="source"
                                className="form-control"
                                value={alert.AlertSource}
                                onChange={(e) => setAlert({ ...alert, AlertSource: e.target.value })}
                                required
                            />
                        </div>

                        <div className="form-group mb-3">
                            <label htmlFor="date">Date:</label>
                            <p id="date" className="form-control">
                                {new Date(alert.AlertDate).toLocaleString(undefined, {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                })}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ViewNewsAlert;
