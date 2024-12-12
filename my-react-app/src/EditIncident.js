import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';

const customIcon = L.icon({
    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
    shadowSize: [41, 41]
});

const EditIncident = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [incident, setIncident] = useState({
        Title: '',
        Description: '',
        Status: '',
        Date: '',
        Latitude: '',
        Longitude: ''
    });

    useEffect(() => {
        const fetchIncident = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/incidents/${id}`);
                if (response.data) {
                    setIncident(response.data);
                } else {
                    alert('Incident not found');
                    navigate('/incidents');
                }
            } catch (error) {
                console.error('Error fetching incident:', error);
                alert('Error fetching incident');
            }
        };
        fetchIncident();
    }, [id, navigate]);

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`http://localhost:5000/incidents/${id}`, incident);
            alert('Updated successfully');
            navigate('/incidents');
        } catch (error) {
            console.error('Error updating incident:', error.response?.data || error.message);
            alert('Failed to update incident. Please try again.');
        }
    };

    function LocationMarker() {
        const map = useMapEvents({
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
        <div className="d-flex flex-column h-100 justify-content-center align-items-center">
            <div className="container" style={{ maxWidth: '80%', marginTop: '450px' }}>
                <h2 className="mb-4">Edit Incident</h2>
                <form onSubmit={handleUpdate}>
                    <div className="form-group mb-3">
                        <label htmlFor="title">Title:</label>
                        <input
                            type="text"
                            id="title"
                            className="form-control"
                            value={incident.Title}
                            onChange={(e) => setIncident({ ...incident, Title: e.target.value })}
                            pattern="([A-Z][a-z]{1,14})(\s([A-Za-z][a-z]{1,14}))*"
                            required
                        />
                    </div>

                    <div className="form-group mb-3">
                        <label htmlFor="description">Description:</label>
                        <textarea
                            id="description"
                            className="form-control"
                            value={incident.Description}
                            onChange={(e) => setIncident({ ...incident, Description: e.target.value })}
                            pattern="([A-Z][a-z]{1,14})(\s([A-Za-z][a-z]{1,14}))*"
                            required
                        />
                    </div>

                    <div className="form-group mb-3">
                        <label htmlFor="status">Status:</label>
                        <input
                            type="text"
                            id="status"
                            className="form-control"
                            value={incident.Status}
                            onChange={(e) => setIncident({ ...incident, Status: e.target.value })}
                            pattern="^(High|Mild|Low)$"
                            required
                        />
                    </div>

                    <div className="form-group mb-3">
                        <label htmlFor="date">Date:</label>
                        <input
                            type="date"
                            id="date"
                            className="form-control"
                            value={incident.Date}
                            onChange={(e) => setIncident({ ...incident, Date: e.target.value })}
                            required
                        />
                    </div>

                    {/* Map for selecting location */}
                    <div className="map-container mb-3">
                        <label className="form-label">Select Location on Map</label>
                        <MapContainer center={[incident.Latitude || 51.505, incident.Longitude || -0.09]} zoom={13} style={{ height: '50vh', width: '100%' }}>
                            <TileLayer
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            />
                            <LocationMarker />
                        </MapContainer>
                    </div>

                    <div className="form-group mb-3">
                        <label htmlFor="latitude">Latitude:</label>
                        <input
                            type="text"
                            id="latitude"
                            className="form-control"
                            value={incident.Latitude}
                            readOnly
                        />
                    </div>

                    <div className="form-group mb-3">
                        <label htmlFor="longitude">Longitude:</label>
                        <input
                            type="text"
                            id="longitude"
                            className="form-control"
                            value={incident.Longitude}
                            readOnly
                        />
                    </div>

                    <button type="submit" className="btn btn-primary">Update Incident</button>
                </form>
            </div>
        </div>
    );
};

export default EditIncident;
