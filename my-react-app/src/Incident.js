import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';

const Incident = () => {
  const [incidents, setIncidents] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch incidents when the component mounts
    const fetchIncidents = async () => {
      try {
        const response = await axios.get('http://localhost:5000/incidents', { withCredentials: true });
        setIncidents(response.data);
      } catch (error) {
        console.error('Error fetching incidents:', error);
      }
    };

    fetchIncidents();
  }, []);

  const handleEdit = (id) => {
    navigate(`/edit-incident/${id}`);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this incident?')) {
      try {
        await axios.delete(`http://localhost:5000/incidents/${id}`, { withCredentials: true });
        setIncidents(incidents.filter(incident => incident.IncidentID !== id));
      } catch (error) {
        console.error('Error deleting incident:', error);
        alert('Failed to delete incident');
      }
    }
  };

  const handleCreate = () => {
    navigate('/create-incident');
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Incidents</h2>
        <Button variant="success" onClick={handleCreate}>Add New Incident</Button>
      </div>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>#</th>
            <th>Title</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {incidents.map((incident) => (
            <tr key={incident.IncidentID}>
              <td>{incident.IncidentID}</td>
              <td>{incident.Title}</td>
              <td>{incident.Status}</td>
              <td>
                <button
                  className="btn btn-primary mr-2"
                  onClick={() => handleEdit(incident.IncidentID)}
                >
                  Edit
                </button>
                <button
                  className="btn btn-danger"
                  onClick={() => handleDelete(incident.IncidentID)}
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
          {incidents.map((incident) => (
            <Marker
              key={incident.IncidentID}
              position={[incident.Latitude, incident.Longitude]}
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
                <strong>{incident.Title}</strong><br />
                {incident.Status}
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
};

export default Incident;
