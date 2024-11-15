// CustomNavbar.js
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Navbar as BootstrapNavbar, Nav, Dropdown, Button, Container } from 'react-bootstrap';
import { FaUser, FaBell, FaTrash } from 'react-icons/fa';
import axios from 'axios';

let role = '';  // Declare a global variable to store the role

const CustomNavbar = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState(localStorage.getItem('username') || 'Guest');
  const [notifications, setNotifications] = useState([]);
  const [notificationCount, setNotificationCount] = useState(0);

  useEffect(() => {


    // Fetch role of the logged-in user
    const fetchRole = async () => {
      try {
        const personnelId = localStorage.getItem('userID');
        console.log("Personnel ID:", personnelId);
        const response = await axios.get(`http://localhost:5000/personnel/role/${personnelId}`);
        role = response.data.role;  // Assign role to the global variable
      } catch (error) {
        console.error('Error fetching role:', error);
      }
    };

    fetchRole();

    // Fetch notifications when the component mounts
    const fetchNotifications = async () => {
      try {
        const response = await axios.get('http://localhost:5000/notifications/get');
        setNotifications(response.data);
        setNotificationCount(response.data.length);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };

    // Fetch notifications initially
    fetchNotifications();

    // Set up interval to check for new notifications every 10 seconds
    const interval = setInterval(() => {
      console.log('Checking for new notifications...');
      fetchNotifications();
    }, 5000); // 10000ms = 10 seconds

    // Cleanup the interval on unmount
    return () => clearInterval(interval);

  }, []);  // Empty dependency array means this effect runs once when the component mounts

  // Delete a notification
  const deleteNotification = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/notifications/${id}`);
      setNotifications((prevNotifications) => prevNotifications.filter((notif) => notif.notification_id !== id));
      setNotificationCount((prevCount) => prevCount - 1);
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('username');
    localStorage.removeItem('userID');
    navigate('/'); // Redirect to login page
  };

  return (
    <BootstrapNavbar bg="secondary" variant="dark" fixed="top">
      <Container fluid>
        <BootstrapNavbar.Brand>Hi, {username}</BootstrapNavbar.Brand>
        <Nav className="ml-auto">
          <Dropdown align="end">
            <Dropdown.Toggle as={Nav.Link} className="text-white">
              <FaUser /> Account
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item as={Link} to="/profile">Profile</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
          <Dropdown align="end" className="mx-3">
            <Dropdown.Toggle as={Nav.Link} className="text-white position-relative">
              <FaBell />
              {notificationCount > 0 && (
                <span className="badge bg-danger position-absolute top-0 start-100 translate-middle p-1 rounded-circle">
                  {notificationCount}
                </span>
              )}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              {notifications.length > 0 ? (
                notifications.map((notif) => (
                  <Dropdown.Item key={notif.notification_id} href="#pablo" onClick={(e) => e.preventDefault()}>
                    <div className="d-flex justify-content-between align-items-center">
                      <span>{notif.message}</span>
                      <FaTrash
                        className="text-danger ml-2"
                        style={{ cursor: 'pointer' }}
                        onClick={() => deleteNotification(notif.notification_id)}
                      />
                    </div>
                  </Dropdown.Item>
                ))
              ) : (
                <Dropdown.Item>No new notifications</Dropdown.Item>
              )}
            </Dropdown.Menu>
          </Dropdown>
          <Button variant="info" onClick={handleLogout}>Logout</Button>
        </Nav>
      </Container>
    </BootstrapNavbar>
  );
};

export { role };  // Export the role variable
export default CustomNavbar;
