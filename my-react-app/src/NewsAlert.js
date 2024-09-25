import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Navbar, Nav, Dropdown, Button, Container } from 'react-bootstrap';
import axios from 'axios';
import DataTable from 'react-data-table-component';
import { FaHome, FaUser, FaBell, FaExclamationCircle, FaCity, FaUserShield, FaTasks, FaPhoneAlt, FaClipboardList, FaNewspaper, FaCogs, FaComments } from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';

const DisasterAlerts = () => {
  const [alerts, setAlerts] = useState([]);
  const [filterText, setFilterText] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const username = localStorage.getItem('username') || 'Guest';

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const response = await axios.get('http://localhost:5000/disaster-alerts');
        setAlerts(response.data);
      } catch (error) {
        console.error('Error fetching alerts:', error);
      }
    };

    fetchAlerts();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this alert?')) {
      try {
        await axios.delete(`http://localhost:5000/disaster-alerts/${id}`);
        setAlerts(alerts.filter(alert => alert.AlertID !== id));
      } catch (error) {
        console.error('Error deleting alert:', error);
      }
    }
  };

  
  const handleView = (id) => {
    navigate(`/view-news-alert/${id}`);
  };


  const handleLogout = () => {
    navigate('/');
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

  const columns = [
    {
      name: 'Title',
      selector: row => row.AlertTitle,
      sortable: true,
      style: {
        fontSize: '18px',
         width: '400px'
      }
    },
    {
      name: 'Description',
      selector: row => row.AlertDescription,
      style: {
        fontSize: '18px',
         width: '300px'
      }
    },
    {
      name: 'Source',
      selector: row => row.AlertSource,
      sortable: true,
      style: {
        fontSize: '18px',
         width: '100px'
      }
    },
    {
      name: 'Date',
      selector: row => new Date(row.AlertDate).toLocaleString(),
      sortable: true,
      style: {
        fontSize: '18px',
         width: '100px'
      }
    },
    {
      name: 'Actions',
      cell: row => (
        <div style={{ display: 'flex', gap: '10px' }}>
            <button className="btn btn-primary" onClick={() => handleView(row.AlertID)}>
            View
          </button>
          <button className="btn btn-danger" onClick={() => handleDelete(row.AlertID)}>
            Delete
          </button>
        </div>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
      width: '150px',
    }
  ];

  const filteredAlerts = alerts.filter(alert =>
    alert.AlertTitle.toLowerCase().includes(filterText.toLowerCase())
  );

  return (
    <div className="d-flex flex-column h-100">
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
                <Dropdown.Item>Notification 1</Dropdown.Item>
                <Dropdown.Item>Notification 2</Dropdown.Item>
                <Dropdown.Item>Notification 3</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
            <Button variant="info" onClick={handleLogout}>Logout</Button>
          </Nav>
        </Container>
      </Navbar>

      <div className="d-flex flex-grow-1">
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

        <div className="main-content-alerts">
          <div className="container mt-4">
            <h2>Disaster Alerts</h2>

            <div className="d-flex justify-content-between align-items-center mb-4">
              <input
                type="text"
                placeholder="Search by title"
                value={filterText}
                onChange={(e) => setFilterText(e.target.value)}
                className="form-control"
                style={{ width: '250px', fontSize: '16px' }}
              />
            </div>

            <DataTable
              columns={columns}
              data={filteredAlerts}
              pagination
              highlightOnHover
              responsive
              customStyles={{
                header: {
                  style: {
                    fontSize: '25px', // Larger font for headers
                  },
                },
                rows: {
                  style: {
                    fontSize: '18px', // Larger font for rows
                  },
                },
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DisasterAlerts;
