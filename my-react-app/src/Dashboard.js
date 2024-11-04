import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Navbar, Nav, Dropdown, Button, Container } from 'react-bootstrap';
import axios from 'axios';
import { 
    FaHome, FaUser, FaBell, FaExclamationCircle, FaHospital, 
    FaCity, FaUserShield, FaTasks, FaPhoneAlt, FaClipboardList, 
    FaNewspaper, FaCogs, FaComments 
} from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const username = localStorage.getItem('username') || 'Guest';

  const [dashboardData, setDashboardData] = useState({
    incidents: 0,
    hospitals: 0,
    activeHospitals: 0,
    evacuationCenters: { activeCenters: 0, deactiveCenters: 0 },
    tasks: { completeTasks: 0, inProgressTasks: 0 },
    personnelCount: 0,
    damageReports: { low: 0, mild: 0, high: 0 }
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/dashboard-data', { withCredentials: true });
        setDashboardData(response.data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };

    fetchDashboardData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('username');
    navigate('/');
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

  const handleNavigation = (path) => {
    navigate(path);
  };

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
                <Link 
                  to={item.path} 
                  className={`nav-link ${location.pathname === item.path ? 'text-primary' : 'text-white'}`}
                  onClick={() => handleNavigation(item.path)}
                >
                  {item.icon} {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        
        {/* Main content */}
        <div className="main-content">
          <div className="row mb-4">
            {/* Dashboard cards */}
            <div className="col-md-3">
              <div className="card text-white bg-primary mb-3">
                <div className="card-header">Incidents</div>
                <div className="card-body">
                  <h5 className="card-title">{dashboardData.incidents.totalIncidents}</h5>
                </div>
              </div>
            </div>
            <div className="col-md-5">
              <div className="card text-white bg-success mb-3">
                <div className="card-header">Hospitals</div>
                <div className="card-body d-flex justify-content-between">
                  <div>
                    <h5 className="card-title">Total Hospitals: {dashboardData.hospitals.totalHospitals}</h5>
                  </div>
                  <div>
                    <h5 className="card-title">Total Active Capacity: {dashboardData.activeHospitals.activeHospitals}</h5>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card text-white bg-info mb-3">
                <div className="card-header">Evacuation Centers</div>
                <div className="card-body d-flex justify-content-between">
                  <div>
                    <h5 className="card-title">Open: {dashboardData.evacuationCenters.activeCenters}</h5>
                  </div>
                  <div>
                    <h5 className="card-title">Close: {dashboardData.evacuationCenters.deactiveCenters}</h5>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card text-white bg-dark mb-3">
                <div className="card-header">People</div>
                <div className="card-body">
                  <h5 className="card-title">{dashboardData.personnelCount.personnelCount}</h5>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card text-white bg-warning mb-3">
                <div className="card-header">Tasks</div>
                <div className="card-body d-flex justify-content-between">
                  <div>
                    <h5 className="card-title">Complete: {dashboardData.tasks.completeTasks}</h5>
                  </div>
                  <div>
                    <h5 className="card-title">In Progress: {dashboardData.tasks.inProgressTasks}</h5>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="row justify-content-center">
            <div className="col-md-6">
              <div className="card text-white mb-3" style={{ backgroundColor: '#6a4a3a' }}>
                <div className="card-header">Damage Report</div>
                <div className="card-body d-flex justify-content-between">
                  <div>
                    <h5 className="card-title">Low: {dashboardData.damageReports.low}</h5>
                  </div>
                  <div>
                    <h5 className="card-title">Mild: {dashboardData.damageReports.mild}</h5>
                  </div>
                  <div>
                    <h5 className="card-title">High: {dashboardData.damageReports.high}</h5>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
