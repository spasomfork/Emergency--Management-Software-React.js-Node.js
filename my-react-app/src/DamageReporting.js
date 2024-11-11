import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';

const DamageReporting = () => {
  const [reports, setReports] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDamageReports = async () => {
      try {
        const response = await axios.get('http://localhost:5000/damagereports', { withCredentials: true });
        setReports(response.data);
      } catch (error) {
        console.error('Error fetching damage reports:', error);
      }
    };

    fetchDamageReports();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this damage report?')) {
      try {
        await axios.delete(`http://localhost:5000/damagereports/${id}`, { withCredentials: true });
        setReports(reports.filter(report => report.ReportID !== id));
      } catch (error) {
        console.error('Error deleting damage report:', error);
        alert('Failed to delete damage report');
      }
    }
  };

  const handleCreate = () => {
    navigate('/create-damage-report');
  };

  return (
    <div className="main-content-damage-report">
      <div className="container mt-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2>Damage Reports</h2>
          <button className="btn btn-success" onClick={handleCreate}>Add New Report</button>
        </div>
        <table className="table table-striped">
          <thead>
            <tr>
              <th>#</th>
              <th>Description</th>
              <th>Severity</th>
              <th>Property</th>
              <th>Name</th>
              <th>Photo</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {reports.map((report) => (
              <tr key={report.ReportID}>
                <td>{report.ReportID}</td>
                <td>{report.DamageDescription}</td>
                <td>{report.Severity}</td>
                <td>{report.Property}</td>
                <td>{report.Name}</td>
                <td>
                  {report.Photo ? (
                    <img
                      src={report.Photo}
                      alt="Damage"
                      style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                    />
                  ) : (
                    <img
                      src="https://via.placeholder.com/100"
                      alt="No Photo"
                      style={{ width: '100px', height: '100px' }}
                    />
                  )}
                </td>
                <td>
                  <button
                    className="btn btn-danger"
                    onClick={() => handleDelete(report.ReportID)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Leaflet Map */}
        <div className="map-container mt-4" style={{ height: '50vh', width: '80%' }}>
          <MapContainer center={[51.505, -0.09]} zoom={13} style={{ height: '100%', width: '100%' }}>
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            {reports.map((report) => (
              report.Latitude && report.Longitude && (
                <Marker
                  key={report.ReportID}
                  position={[report.Latitude, report.Longitude]}
                  icon={L.icon({
                    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
                    iconSize: [25, 41],
                    iconAnchor: [12, 41],
                    popupAnchor: [1, -34],
                    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
                    shadowSize: [41, 41]
                  })}
                >
                  <Popup>
                    <strong>{report.Property}</strong><br />
                    {report.DamageDescription}<br />
                    Severity: {report.Severity}
                  </Popup>
                </Marker>
              )
            ))}
          </MapContainer>
        </div>
      </div>
    </div>
  );
};

export default DamageReporting;
