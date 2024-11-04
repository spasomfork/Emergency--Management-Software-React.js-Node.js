import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation, useParams } from 'react-router-dom';
import { Navbar, Nav, Dropdown, Button, Container } from 'react-bootstrap';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import {
    FaHome, FaUser, FaBell, FaExclamationCircle, FaHospital, FaCity, FaUserShield, FaTasks,
    FaPhoneAlt, FaClipboardList, FaNewspaper, FaCogs, FaComments
} from 'react-icons/fa';

const EditResource = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { id } = useParams();
    const [resource, setResource] = useState({
        Name: '',
        Description: '',
        Quantity: '',
        Status: ''
    });
    const username = localStorage.getItem('username') || 'Guest';

    useEffect(() => {
        // Fetch resource data by ID
        const fetchResource = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/resources/${id}`);
                if (response.data) {
                    setResource(response.data);
                } else {
                    alert('Resource not found');
                    navigate('/resources');
                }
            } catch (error) {
                console.error('Error fetching resource:', error);
                alert('Error fetching resource');
            }
        };

        fetchResource();
    }, [id, navigate]);

    const handleUpdate = async (e) => {
        e.preventDefault();

        // Rule: Only allow update if resource status is 'open'
        if (resource.Status !== 'open') {
            alert('Resource can only be updated when its status is open.');
            return;
        }

        try {
            await axios.put(`http://localhost:5000/resources/${id}`, resource);
            alert('Resource updated successfully');
            navigate('/resource-allocation', { state: { username } });
        } catch (error) {
            console.error('Error updating resource:', error.response?.data || error.message);
            alert('Failed to update resource. Please try again.');
        }
    };

    const handleStatusChange = async (e) => {
        e.preventDefault();
        const newStatus = prompt('Enter new status (open, ongoing, completed, rejected):');

        if (!['open', 'ongoing', 'completed', 'rejected'].includes(newStatus)) {
            alert('Invalid status. Please enter one of: open, ongoing, completed, rejected.');
            return;
        }

        // Rule: If status is 'completed' or 'rejected', it cannot be changed
        if (resource.Status === 'completed') {
            alert('Resource status cannot be changed once it is completed.');
            return;
        }
        if (resource.Status === 'rejected') {
            alert('Rejected resources cannot be edited.');
            return;
        }

        try {
            await axios.put(`http://localhost:5000/resources/${id}/status`, { newStatus });
            alert('Resource status updated successfully');
            navigate('/resource-allocation', { state: { username } });
        } catch (error) {
            console.error('Error updating resource status:', error.response?.data || error.message);
            alert('Failed to update resource status. Please try again.');
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
                <div className="main-content-resource-edit">
                    <div className="container mt-4">
                        <h2 className="mb-4">Edit Resource</h2>
                        <form onSubmit={handleUpdate}>
                            <div className="form-group mb-3">
                                <label htmlFor="name">Name:</label>
                                <input
                                    type="text"
                                    id="name"
                                    className="form-control"
                                    value={resource.Name}
                                    onChange={(e) => setResource({ ...resource, Name: e.target.value })}
                                    required
                                    pattern="^[A-Z][a-zA-Z\s]{1,24}$" // Name must start with a capital letter and can be 2-25 characters long
                                />
                            </div>

                            <div className="form-group mb-3">
                                <label htmlFor="description">Description:</label>
                                <input
                                    type="text"
                                    id="description"
                                    className="form-control"
                                    value={resource.Description}
                                    onChange={(e) => setResource({ ...resource, Description: e.target.value })}
                                    required
                                    pattern="^[A-Z][a-zA-Z\s]{1,24}$" // Description must start with a capital letter and can be 2-25 characters long
                                />
                            </div>

                            <div className="form-group mb-3">
                                <label htmlFor="quantity">Quantity:</label>
                                <input
                                    type="number"
                                    id="quantity"
                                    className="form-control"
                                    value={resource.Quantity}
                                    onChange={(e) => setResource({ ...resource, Quantity: e.target.value })}
                                    required
                                    pattern="^(?:[2-9]|[1-9][0-9]|[1][0-0]{1,2})$" // Quantity must be a number from 2 to 1000
                                />
                            </div>

                            <Button variant="primary" type="submit">
                                Update Resource
                            </Button>
                        </form>

                        <Button variant="warning" className="mt-3" onClick={handleStatusChange}>
                            Change Resource Status
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditResource;
