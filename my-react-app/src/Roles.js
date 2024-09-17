import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Navbar, Nav, Button, Container, Dropdown } from 'react-bootstrap'; // Added Dropdown import
import axios from 'axios';
import { FaHome, FaExclamationCircle, FaHospital, FaCity, FaUserShield, FaTasks, FaPhoneAlt, FaClipboardList, FaNewspaper, FaCogs, FaComments, FaUser, FaBell } from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';

const RoleManagement = () => {
  const [personnel, setPersonnel] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  const username = localStorage.getItem('username') || 'Guest';

  useEffect(() => {
    const fetchPersonnel = async () => {
      try {
        const response = await axios.get('http://localhost:5000/personnel');
        setPersonnel(response.data);
      } catch (error) {
        console.error('Error fetching personnel:', error);
      }
    };

    fetchPersonnel();
  }, []);

  const handleRoleChange = async (id, newRole) => {
    try {
      await axios.put(`http://localhost:5000/personnel/${id}`, { Role: newRole });
      setPersonnel(personnel.map(person =>
        person.PersonnelID === id ? { ...person, Role: newRole } : person
      ));
    } catch (error) {
      console.error('Error updating role:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/personnel/${id}`);
      setPersonnel(personnel.filter(person => person.PersonnelID !== id));
    } catch (error) {
      console.error('Error deleting personnel:', error);
    }
  };

  const handleEdit = (id) => {
    navigate(`/edit-roles/${id}`);
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
        <div className="main-content-role-management">
          <div className="container mt-4">
            <h2>Role Management</h2>
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Status</th>
                  <th>Contact Number</th>
                  <th>Role</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {personnel.map((person) => (
                  <tr key={person.PersonnelID} style={{ backgroundColor: person.Status === 'Online' ? 'lightgreen' : 'white' }}>
                    <td>{person.PersonnelID}</td>
                    <td>{person.Name}</td>
                    <td>{person.Status}</td>
                    <td>{person.ContactInformation}</td>
                    <td>
                      <select 
                        value={person.Role} 
                        onChange={(e) => handleRoleChange(person.PersonnelID, e.target.value)}
                      >
                        <option value="Admin">Admin</option>
                        <option value="Manager">Manager</option>
                        <option value="Affected People">Affected People</option>
                        <option value="Relief Organizations">Relief Organizations</option>
                      </select>
                    </td>
                    <td>
                    <button
                        className="btn btn-danger me-2"
                        onClick={() => handleDelete(person.PersonnelID)}
                      >
                        Delete
                      </button>
                      <button
                        className="btn btn-primary"
                        onClick={() => handleEdit(person.PersonnelID)}
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

export default RoleManagement;
