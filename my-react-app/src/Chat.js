import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { Navbar, Nav, Dropdown, Button, Container, Form, InputGroup } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaHome, FaExclamationCircle, FaHospital, FaCity, FaUserShield, FaTasks, FaPhoneAlt, FaClipboardList, FaNewspaper, FaCogs, FaComments, FaUser, FaBell } from 'react-icons/fa';

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const username = localStorage.getItem('username') || 'Guest';

  useEffect(() => {
    setMessages([{ user: 'Bot', text: 'Welcome to the chat!' }]);
  }, []);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const newMessages = [...messages, { user: username, text: input }];
    setMessages(newMessages);

    try {
      const response = await axios.post('http://localhost:5000/chat/ask', { query: input }, { withCredentials: true });
      setMessages([...newMessages, { user: 'Bot', text: response.data.message || JSON.stringify(response.data) }]);
    } catch (error) {
      console.error('Error in chat:', error);
      setMessages([...newMessages, { user: 'Bot', text: 'Error: Could not fetch response.' }]);
    }

    setInput('');
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
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
      <Navbar bg="secondary" variant="dark" fixed="top">
        <Container fluid>
          <Navbar.Brand>Hi, {username}</Navbar.Brand>
          <Nav className="ms-auto">
            <Dropdown alignRight>
              <Dropdown.Toggle as={Nav.Link} className="text-white">
                <FaUser /> Account
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item as={Link} to="/profile">Profile</Dropdown.Item>
                <Dropdown.Item onClick={handleLogout}>Logout</Dropdown.Item>
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
              </Dropdown.Menu>
            </Dropdown>
          </Nav>
        </Container>
      </Navbar>

      <div className="d-flex flex-grow-1" style={{ marginTop: '56px' }}>
        <div className="bg-dark text-white sidebar" style={{ width: '250px', minHeight: '100vh' }}>
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

        <div className="main-content-chat d-flex flex-column p-3" style={{ width: '95%' }}>
          <Container className="flex-grow-1 d-flex flex-column-reverse chat-window bg-light p-3" style={{ overflowY: 'auto', maxHeight: '70vh' }}>
            {messages.map((msg, index) => (
              <div key={index} className={`my-2 ${msg.user === username ? 'text-end' : 'text-start'}`}>
                <strong>{msg.user}: </strong>{msg.text}
              </div>
            ))}
          </Container>
          
          <InputGroup className="mt-3" style={{ marginLeft: '280px', marginRight: '200px', width: '80%' }}>
            <Form.Control
              placeholder="Type a message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <Button variant="primary" onClick={handleSend}>Send</Button>
          </InputGroup>
        </div>
      </div>
    </div>
  );
};

export default Chat;
