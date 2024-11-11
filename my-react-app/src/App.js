import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import CustomNavbar from './Navbar'; // Import the Navbar component
import Sidebar from './Sidebar'; // Import Sidebar component
import Login from './Login';
import Dashboard from './Dashboard';
import Register from './Register';
import Incident from './Incident';
import EditIncident from './EditIncident';
import CreateIncident from './Createincident';
import Hospital from './Hospitals';
import EditHospital from './EditHospital';
import CreateHospital from './CreateHospital';
import CreateHospitalCSV from './CreateHospitalCSV';
import EvacuationCenter from './EvacuationCentres';
import EditEvacuationCentres from './EditEvacuationcentre';
import CreateEvacuationCenter from './CreateEvacuationcentre';
import Task from './Task';
import CreateTask from './CreateTask';
import LifelineNumbers from './LifelineNumbers';
import CreateLifelineCSV from './CreateLifeNumbers';
import EditLifeline from './EditLifelineNumbers';
import Role from './Roles';
import EditRoles from './EditRoles';
import CreateRoles from './CreateRoles';
import Damage from './DamageReporting';
import CreateDamage from './CreateDamageReporting';
import NewsAlert from './NewsAlert';
import ViewNewsAlert from './ViewNewsAlert';
import Resource from './Resource';
import CreateResource from './CreateResource';
import EditResource from './EditResource';
import Chat from './Chat';

import 'bootstrap/dist/css/bootstrap.min.css';

const App = () => {
  // Use location to determine the current route
  const location = useLocation();

  // Check if the current path is either Login or Register
  const isAuthPage = location.pathname === '/' || location.pathname === '/register';

  return (
    <div className="d-flex flex-column h-100">
      {/* Conditionally render the Navbar and Sidebar */}
      {!isAuthPage && <CustomNavbar />}
      {!isAuthPage && <Sidebar />}

      <div className="d-flex flex-grow-1">
        {/* Main Content */}
        <div className="main-content-hospitals">
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/register" element={<Register />} />
            <Route path="/incidents" element={<Incident />} />
            <Route path="/edit-incident/:id" element={<EditIncident />} />
            <Route path="/create-incident" element={<CreateIncident />} />
            <Route path="/hospitals" element={<Hospital />} />
            <Route path="/edit-hospital/:id" element={<EditHospital />} />
            <Route path="/create-hospital" element={<CreateHospital />} />
            <Route path="/create-hospital-csv" element={<CreateHospitalCSV />} />
            <Route path="/evacuation" element={<EvacuationCenter />} />
            <Route path="/edit-evacuationcentre/:id" element={<EditEvacuationCentres />} />
            <Route path="/create-evacuationcentre" element={<CreateEvacuationCenter />} />
            <Route path="/task-management" element={<Task />} />
            <Route path="/create-task" element={<CreateTask />} />
            <Route path='/lifeline-numbers-management' element={<LifelineNumbers />} />
            <Route path="/create-lifeline-csv" element={<CreateLifelineCSV />} />
            <Route path="/edit-lifeline-number/:id" element={<EditLifeline />} />
            <Route path="/role-management" element={<Role />} />
            <Route path="/edit-roles/:id" element={<EditRoles />} />
            <Route path="/create-roles" element={<CreateRoles />} />
            <Route path="/damage-reporting" element={<Damage />} />
            <Route path="/create-damage-report" element={<CreateDamage />} />
            <Route path="/news-alerts-management" element={<NewsAlert />} />
            <Route path="/view-news-alert/:id" element={<ViewNewsAlert />} />
            <Route path="/resource-allocation" element={<Resource />} />
            <Route path="/create-resource" element={<CreateResource />} />
            <Route path="/edit-resource/:id" element={<EditResource />} />
            <Route path="/chat" element={<Chat />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

// Wrap the entire App component inside Router for routing to work
const AppWithRouter = () => (
  <Router>
    <App />
  </Router>
);

export default AppWithRouter;
