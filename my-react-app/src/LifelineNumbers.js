import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Navbar, Nav, Dropdown, Button, Container } from 'react-bootstrap';
import axios from 'axios';
import {
  FaHome, FaUser, FaBell, FaExclamationCircle, FaCity, FaUserShield, FaTasks,
  FaPhoneAlt, FaClipboardList, FaNewspaper, FaCogs, FaComments
} from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';

const LifelineNumbers = () => {
  const [lifelineNumbers, setLifelineNumbers] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  const username = localStorage.getItem('username') || 'Guest';

  useEffect(() => {
    const fetchLifelineNumbers = async () => {
      try {
        const response = await axios.get('http://localhost:5000/lifeline-numbers', { withCredentials: true });
        setLifelineNumbers(response.data);
      } catch (error) {
        console.error('Error fetching lifeline numbers:', error);
      }
    };

    fetchLifelineNumbers();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this lifeline number?')) {
      try {
        await axios.delete(`http://localhost:5000/lifeline-numbers/${id}`, { withCredentials: true });
        setLifelineNumbers(lifelineNumbers.filter(number => number.NumberID !== id));
      } catch (error) {
        console.error('Error deleting lifeline number:', error);
        alert('Failed to delete lifeline number');
      }
    }
  };

  const handleEdit = (id) => {
    navigate(`/edit-lifeline-number/${id}`);
  };

  const handleLogout = () => {
    navigate('/'); // Redirect to login page
  };

  const handleCreateCSV = () => {
    navigate('/create-lifeline-csv');
  };

  const handleCreatePDF = async () => {
    try {
      const response = await axios.get('http://localhost:5000/lifeline-numbers/pdf', { responseType: 'blob' });
      // Code to handle the response, such as opening the PDF in a new tab
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'lifeline-numbers.pdf'); // Or any other filename
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link); // Clean up
    } catch (error) {
      console.error('Error creating PDF:', error);
      // Log detailed error info
      if (error.response) {
        console.error('Response error:', error.response.data);
        console.error('Response status:', error.response.status);
      } else if (error.request) {
        console.error('Request error:', error.request);
      } else {
        console.error('General error:', error.message);
      }
      alert('Failed to create PDF');
    }
  };
  
  

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: <FaHome /> },
    { path: '/incidents', label: 'Incidents', icon: <FaExclamationCircle /> },
    { path: '/hospitals', label: 'Hospitals', icon: <FaPhoneAlt /> },
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
        <div className="main-content-lifeline">
          <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h2>Lifeline Numbers</h2>
              <div>
                <Button 
                    variant="success" 
                    onClick={handleCreatePDF} 
                    style={{ marginRight: '25px' }}
                  >
                    Print PDF
                  </Button>
                <Button 
                  variant="success" 
                  onClick={handleCreateCSV}
                >
                  Add New Lifeline Number by CSV Upload
                </Button>
              </div>
            </div>
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Service Name</th>
                  <th>Contact Number</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {lifelineNumbers.map((number) => (
                  <tr key={number.NumberID}>
                    <td>{number.NumberID}</td>
                    <td>{number.ServiceName}</td>
                    <td>{number.ContactNumber}</td>
                    <td>
                      <button
                        className="btn btn-danger me-2"
                        onClick={() => handleDelete(number.NumberID)}
                      >
                        Delete
                      </button>
                      <button
                        className="btn btn-primary"
                        onClick={() => handleEdit(number.NumberID)}
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LifelineNumbers;
