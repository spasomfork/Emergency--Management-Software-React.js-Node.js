import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation, useParams } from 'react-router-dom';
import { Navbar, Nav, Dropdown, Button, Container } from 'react-bootstrap';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import {
    FaHome, FaUser, FaBell, FaExclamationCircle, FaHospital, FaCity, FaUserShield, FaTasks,
    FaPhoneAlt, FaClipboardList, FaNewspaper, FaCogs, FaComments
} from 'react-icons/fa';

const EditHospital = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { id } = useParams();
    const [hospital, setHospital] = useState({
        Name: '',
        Location: '',
        Status: '',
        Capacity: ''
    });
    const username = localStorage.getItem('username') || 'Guest';

    useEffect(() => {
        // Fetch hospital data by ID
        const fetchHospital = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/hospitals/${id}`);
                if (response.data) {
                    setHospital(response.data);
                } else {
                    alert('Hospital not found');
                    navigate('/hospitals');
                }
            } catch (error) {
                console.error('Error fetching hospital:', error);
                alert('Error fetching hospital');
            }
        };

        fetchHospital();
    }, [id, navigate]);

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`http://localhost:5000/hospitals/${id}`, hospital);
            alert('Updated successfully');
            navigate('/hospitals', { state: { username } });
        } catch (error) {
            console.error('Error updating hospital:', error.response?.data || error.message);
            alert('Failed to update hospital. Please try again.');
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
                <div className="main-content-evacuation-center-edit d-flex justify-content-center align-items-start">
                    <div className="container" style={{ maxWidth: '80%' }}>
                        <h2 className="mb-4">Edit Hospital</h2>
                        <form onSubmit={handleUpdate}>
                            <div className="form-group mb-3">
                                <label htmlFor="name">Name:</label>
                                <input
                                    type="text"
                                    id="name"
                                    className="form-control"
                                    value={hospital.Name}
                                    onChange={(e) => setHospital({ ...hospital, Name: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="form-group mb-3">
                                <label htmlFor="location">Location:</label>
                                <input
                                    type="text"
                                    id="location"
                                    className="form-control"
                                    value={hospital.Location}
                                    onChange={(e) => setHospital({ ...hospital, Location: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="form-group mb-3">
                                <label htmlFor="status">Status:</label>
                                <input
                                    type="text"
                                    id="status"
                                    className="form-control"
                                    value={hospital.Status}
                                    onChange={(e) => setHospital({ ...hospital, Status: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="form-group mb-3">
                                <label htmlFor="capacity">Capacity:</label>
                                <input
                                    type="text"
                                    id="capacity"
                                    className="form-control"
                                    value={hospital.Capacity}
                                    onChange={(e) => setHospital({ ...hospital, Capacity: e.target.value })}
                                    required
                                />
                            </div>

                            <Button variant="primary" type="submit">
                                Update
                            </Button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditHospital;
