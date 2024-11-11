import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import Button from 'react-bootstrap/Button';


// Custom icon URL
const customIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  shadowSize: [41, 41]
});

const CreateIncident = () => {
  const navigate = useNavigate();
  const [incident, setIncident] = useState({
    Title: '',
    Description: '',
    Status: '',
    Date: '',
    Latitude: '',
    Longitude: ''
  });

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/incidents', incident);
      alert('Incident created successfully');
      navigate('/incidents');
    } catch (error) {
      console.error('Error creating incident:', error);
      alert('Failed to create incident. Please try again.');
    }
  };

  // Component to handle the map click and marker placement
  function LocationMarker() {
    useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;
        setIncident({
          ...incident,
          Latitude: lat,
          Longitude: lng
        });
      }
    });

    return incident.Latitude && incident.Longitude ? (
      <Marker position={[incident.Latitude, incident.Longitude]} icon={customIcon} />
    ) : null;
  }

  return (
    <div className="d-flex justify-content-center align-items-start" style={{ minHeight: '100vh' }}>
      <div className="container mt-4">
        <h2 className="mb-4">Create Incident</h2>
        <form onSubmit={handleCreate} className="row justify-content-center">
          <div className="mb-3 col-md-4">
            <label htmlFor="incidentTitle" className="form-label">Title</label>
            <input
              type="text"
              className="form-control"
              id="incidentTitle"
              value={incident.Title}
              onChange={(e) => setIncident({ ...incident, Title: e.target.value })}
              pattern="([A-Z][a-z]{1,14})(\s[A-Z][a-z]{1,14})*"
            />
          </div>
          <div className="mb-3 col-md-4">
            <label htmlFor="incidentDescription" className="form-label">Description</label>
            <textarea
              className="form-control"
              id="incidentDescription"
              value={incident.Description}
              onChange={(e) => setIncident({ ...incident, Description: e.target.value })}
              pattern="([A-Z][a-z]{1,14})(\s([A-Za-z][a-z]{1,14}))*"
            />
          </div>
          <div className="mb-3 col-md-4">
            <label htmlFor="incidentStatus" className="form-label">Status</label>
            <input
              type="text"
              className="form-control"
              id="incidentStatus"
              value={incident.Status}
              onChange={(e) => setIncident({ ...incident, Status: e.target.value })}
              pattern="^(High|Mild|Low)$"
            />
          </div>
          <div className="mb-3 col-md-4">
            <label htmlFor="incidentDate" className="form-label">Date</label>
            <input
              type="date"
              className="form-control"
              id="incidentDate"
              value={incident.Date}
              onChange={(e) => setIncident({ ...incident, Date: e.target.value })}
            />
          </div>

          {/* Map for selecting location */}
          <div className="mb-3 col-md-8">
            <label className="form-label">Select Location on Map</label>
            <MapContainer center={[51.505, -0.09]} zoom={13} style={{ height: '50vh', width: '80%' }}>
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              <LocationMarker />
            </MapContainer>
          </div>

          <div className="col-md-6 mt-4">
            <Button type="submit" variant="primary" className="w-100">Create</Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateIncident;
