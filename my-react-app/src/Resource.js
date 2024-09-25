import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Navbar, Nav, Dropdown, Button, Container } from 'react-bootstrap';
import axios from 'axios';
import DataTable from 'react-data-table-component';
import { FaHome, FaUser, FaBell, FaExclamationCircle, FaCity, FaUserShield, FaTasks, FaPhoneAlt, FaClipboardList, FaNewspaper, FaCogs, FaComments } from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';

const Resources = () => {
  const [resources, setResources] = useState([]);
  const [filterText, setFilterText] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const username = localStorage.getItem('username') || 'Guest';

  useEffect(() => {
    const fetchResources = async () => {
      try {
        const response = await axios.get('http://localhost:5000/resources', { withCredentials: true });
        setResources(response.data);
      } catch (error) {
        console.error('Error fetching resources:', error);
      }
    };

    fetchResources();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this resource?')) {
      try {
        await axios.delete(`http://localhost:5000/resources/${id}`, { withCredentials: true });
        setResources(resources.filter(resource => resource.ResourceID !== id));
      } catch (error) {
        console.error('Error deleting resource:', error);
        alert('Failed to delete resource');
      }
    }
  };

  const handleEdit = (id) => {
    navigate(`/edit-resource/${id}`);
  };

  const handleLogout = () => {
    navigate('/');
  };

  const handleCreate = () => {
    navigate('/create-resource');
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
      name: 'ID',
      selector: row => row.ResourceID,
      sortable: true,
      width: '80px'
    },
    {
      name: 'Name',
      selector: row => row.Name,
      sortable: true,
      style: {
        fontSize: '18px', // Increase font size
        width: '150px'
      }
    },
    {
      name: 'Description',
      selector: row => row.Description,
      sortable: true,
      style: {
        fontSize: '18px', // Increase font size
        width: '250px'
      }
    },
    {
      name: 'Quantity',
      selector: row => String(row.Quantity || '').trim(), // Ensure quantity is a string
      sortable: true,
      style: {
        fontSize: '18px', // Increase font size
        width: '150px'
      }
    },
    {
      name: 'Status',
      selector: row => row.Status,
      sortable: true,
      style: {
        fontSize: '18px', // Increase font size
        width: '200px'
      }
    },
    {
      name: 'Actions',
      cell: row => (
        <div style={{ display: 'flex', gap: '10px' }}> {/* Adjust button spacing */}
          <button className="btn btn-danger" onClick={() => handleDelete(row.ResourceID)}>
            Delete
          </button>
          <button className="btn btn-primary" onClick={() => handleEdit(row.ResourceID)}>
            Edit
          </button>
        </div>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
      width: '200px', // Adjust button column width
    }
  ];

  const filteredData = resources.filter(
    item => item.Name && item.Name.toLowerCase().includes(filterText.toLowerCase())
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

        <div className="main-content-resources">
          <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h2>Resources</h2>
              <div>
                <Button variant="success" onClick={handleCreate}>
                  Add New Resource Request
                </Button>
              </div>
            </div>

            {/* Search Input */}
            <div className="d-flex justify-content-between align-items-center mb-3">
              <input
                type="text"
                placeholder="Search by Name"
                value={filterText}
                onChange={(e) => setFilterText(e.target.value)}
                className="form-control"
                style={{ width: '250px', fontSize: '16px' }} // Adjust font size of the input
              />
            </div>

            <DataTable
              columns={columns}
              data={filteredData}
              pagination
              highlightOnHover
              responsive
              defaultSortFieldId="ResourceID"
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

export default Resources;
