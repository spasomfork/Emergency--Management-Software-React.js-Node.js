import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

const Dashboard = () => {
  const navigate = useNavigate();

  const [dashboardData, setDashboardData] = useState({
    incidents: 0,
    hospitals: 0,
    activeHospitals: 0,
    evacuationCenters: { activeCenters: 0, deactiveCenters: 0 },
    tasks: { completeTasks: 0, inProgressTasks: 0 },
    personnelCount: 0,
    damageReports: { low: 0, mild: 0, high: 0 }
  });

  const [tasks, setTasks] = useState([]);
  const [weather, setWeather] = useState({});
  const [search, setSearch] = useState('');

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

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get('http://localhost:5000/tasks');
        setTasks(response.data);
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    };
    fetchTasks();
  }, []);

  const searchPressed = () => {
    const api = {
      key: "9e43ec55218c3baf128d2122f5314c75",
      base: "https://api.openweathermap.org/data/2.5/",
    };
    fetch(`${api.base}weather?q=${search}&units=metric&APPID=${api.key}`)
      .then((res) => res.json())
      .then((result) => setWeather(result));
  };

  return (
    <div className="main-content">
      <div className="container mt-1">
        <div className="row mb-4">
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
                <h5 className="card-title">Total: {dashboardData.hospitals.totalHospitals}</h5>
                <h5 className="card-title">Active: {dashboardData.activeHospitals.activeHospitals}</h5>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card text-white bg-info mb-3">
              <div className="card-header">Evacuation Centers</div>
              <div className="card-body d-flex justify-content-between">
                <h5 className="card-title">Open: {dashboardData.evacuationCenters.activeCenters}</h5>
                <h5 className="card-title">Closed: {dashboardData.evacuationCenters.deactiveCenters}</h5>
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
                <h5 className="card-title">Complete: {dashboardData.tasks.completeTasks}</h5>
                <h5 className="card-title">In Progress: {dashboardData.tasks.inProgressTasks}</h5>
              </div>
            </div>
          </div>

          <div className="col-md-5">
            <div className="card text-white mb-3" style={{ backgroundColor: '#6a4a3a' }}>
              <div className="card-header">Damage Report</div>
              <div className="card-body d-flex justify-content-between">
                <h5 className="card-title">Low: {dashboardData.damageReports.low}</h5>
                <h5 className="card-title">Mild: {dashboardData.damageReports.mild}</h5>
                <h5 className="card-title">High: {dashboardData.damageReports.high}</h5>
              </div>
            </div>
          </div>
        </div>

        <div className="row mt-4">
          {/* Tasks Table Tile */}
          <div className="col-md-6">
            <div className="card">
              <div className="card-header">Task List</div>
              <div className="card-body">
                <table className="table table-striped">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Title</th>
                      <th>Description</th>
                      <th>Status</th>
                      <th>Assigned To</th>
                      <th>Due Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tasks.map((task) => (
                      <tr key={task.TaskID}>
                        <td>{task.TaskID}</td>
                        <td>{task.Title}</td>
                        <td>{task.Description}</td>
                        <td>{task.Status}</td>
                        <td>{task.AssignedTo}</td>
                        <td>{task.DueDate}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Weather Search Tile */}
          <div className="col-md-5">
            <div className="card">
              <div className="card-header">Weather Search</div>
              <div className="card-body">
                <input
                  type="text"
                  placeholder="Enter city/town..."
                  onChange={(e) => setSearch(e.target.value)}
                />
                <button className="btn btn-primary mt-2" onClick={searchPressed}>
                  Search
                </button>
                {weather.main && (
                  <div className="mt-3">
                    <p><strong>{weather.name}</strong></p>
                    <p>{weather.main.temp}°C</p>
                    <p>{weather.weather[0].main}</p>
                    <p>({weather.weather[0].description})</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
