import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button, Container } from 'react-bootstrap';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';

// Custom icon for map marker
const customIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  shadowSize: [41, 41]
});

const CreateDamageReport = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [report, setReport] = useState({
    Property: '',
    Severity: '',
    DamageDescription: '',
    Latitude: '',
    Longitude: '',
    Name: '', 
    Photo: null 
  });
  const username = localStorage.getItem('username') || 'Guest';

  const handleCreate = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('Property', report.Property);
    formData.append('Severity', report.Severity);
    formData.append('DamageDescription', report.DamageDescription);
    formData.append('Latitude', report.Latitude);
    formData.append('Longitude', report.Longitude);
    formData.append('Name', report.Name);
    formData.append('Photo', report.Photo);

    try {
      await axios.post('http://localhost:5000/damagereports', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      alert('Damage report created successfully');
      navigate('/damage-reporting', { state: { username } });
    } catch (error) {
      console.error('Error creating damage report:', error);
      alert('Failed to create report. Please try again.');
    }
  };

  

  // Component to handle the map click and marker placement
  function LocationMarker() {
    const map = useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;
        setReport({
          ...report,
          Latitude: lat,
          Longitude: lng
        });
      }
    });

    return report.Latitude && report.Longitude ? (
      <Marker position={[report.Latitude, report.Longitude]} icon={customIcon} />
    ) : null;
  }

  return (
    <div className="d-flex flex-column h-100">
      {/* Main content */}
      <div className="main-content-damage-report" style={{ marginTop: '20px' }}>
        <div className="container mt-4">
          <h2 className="mb-4">Create Damage Report</h2>
          <form onSubmit={handleCreate} className="row justify-content-center">
            <div className="mb-3 col-md-6">
              <label htmlFor="damageProperty" className="form-label">Property Relationship</label>
              <input
                type="text"
                className="form-control"
                id="damageProperty"
                value={report.Property}
                onChange={(e) => setReport({ ...report, Property: e.target.value })}
                pattern="^[A-Z][a-z]{1,19}$"
                title="Property should start with a capital letter, followed by lowercase letters, 2-20 characters."
                required
              />
            </div>
            <div className="mb-3 col-md-6">
              <label htmlFor="damageSeverity" className="form-label">Severity</label>
              <input
                type="text"
                className="form-control"
                id="damageSeverity"
                value={report.Severity}
                onChange={(e) => setReport({ ...report, Severity: e.target.value })}
                pattern="^(High|Low|Mild)$"
                title="Severity must be one of the following: High, Low, or Mild."
                required
              />
            </div>
            <div className="mb-3 col-md-12">
              <label htmlFor="damageDescription" className="form-label">Damage Description</label>
              <textarea
                className="form-control"
                id="damageDescription"
                value={report.DamageDescription}
                onChange={(e) => setReport({ ...report, DamageDescription: e.target.value })}
                pattern="^[A-Z][a-z\s]{0,199}$"
                title="Description should start with a capital letter, followed by lowercase letters and spaces, up to 200 characters."
                required
              />
            </div>

            {/* New Name Input */}
            <div className="mb-3 col-md-6">
              <label htmlFor="damageName" className="form-label">Name</label>
              <input
                type="text"
                className="form-control"
                id="damageName"
                value={report.Name}
                onChange={(e) => setReport({ ...report, Name: e.target.value })}
                pattern="^[A-Z][a-z]{1,14}$"
                title="Name should start with a capital letter, be 2-15 characters long, with no numbers."
                required
              />
            </div>

            {/* New Photo Upload */}
            <div className="mb-3 col-md-6">
              <label htmlFor="damagePhoto" className="form-label">Upload Photo</label>
              <input
                type="file"
                className="form-control"
                id="damagePhoto"
                onChange={(e) => setReport({ ...report, Photo: e.target.files[0] })}
                accept="image/png, image/jpeg"
              />
            </div>

            {/* Map for selecting location */}
            <div className="mb-3 col-md-10">
              <label className="form-label">Select Location on Map</label>
              <MapContainer
                center={[51.505, -0.09]}
                zoom={13}
                scrollWheelZoom={false}
                style={{ height: '300px' }}>
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <LocationMarker />
              </MapContainer>
            </div>

            <div className="mb-3 col-md-6">
              <label htmlFor="latitude" className="form-label">Latitude</label>
              <input
                type="text"
                className="form-control"
                id="latitude"
                value={report.Latitude}
                readOnly />
            </div>

            <div className="mb-3 col-md-6">
              <label htmlFor="longitude" className="form-label">Longitude</label>
              <input
                type="text"
                className="form-control"
                id="longitude"
                value={report.Longitude}
                readOnly />
            </div>

            <div className="mb-3 col-md-6">
              <button type="submit" className="btn btn-primary">Submit Report</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateDamageReport;
