import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button } from 'react-bootstrap';

const EditEvacuationCenter = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [evacuationCenter, setEvacuationCenter] = useState({
        Name: '',
        Location: '',
        Capacity: '',
        AvailabilityStatus: ''
    });

    useEffect(() => {
        // Fetch evacuation center data by ID
        const fetchEvacuationCenter = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/evacuation-centers/${id}`);
                if (response.data) {
                    setEvacuationCenter(response.data);
                } else {
                    alert('Evacuation Center not found');
                    navigate('/evacuation');
                }
            } catch (error) {
                console.error('Error fetching evacuation center:', error);
                alert('Error fetching evacuation center');
            }
        };

        fetchEvacuationCenter();
    }, [id, navigate]);

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`http://localhost:5000/evacuation-centers/${id}`, evacuationCenter);
            alert('Updated successfully');
            navigate('/evacuation');
        } catch (error) {
            console.error('Error updating evacuation center:', error.response?.data || error.message);
            alert('Failed to update evacuation center. Please try again.');
        }
    };

    return (
        <div className="container mt-4" style={{ maxWidth: '80%'}}>
            <h2 className="mb-4">Edit Evacuation Center</h2>
            <form onSubmit={handleUpdate}>
                <div className="form-group mb-3">
                    <label htmlFor="name">Name:</label>
                    <input
                        type="text"
                        id="name"
                        className="form-control"
                        value={evacuationCenter.Name}
                        onChange={(e) => setEvacuationCenter({ ...evacuationCenter, Name: e.target.value })}
                        pattern="([A-Z][a-z]{1,14})(\s[A-Z][a-z]{1,14})*"
                        title="Name"
                        required
                    />
                </div>

                <div className="form-group mb-3">
                    <label htmlFor="location">Location:</label>
                    <input
                        type="text"
                        id="location"
                        className="form-control"
                        value={evacuationCenter.Location}
                        onChange={(e) => setEvacuationCenter({ ...evacuationCenter, Location: e.target.value })}
                        pattern="^[A-Z][a-z]{1,19}$"
                        title="Location"
                        required
                    />
                </div>

                <div className="form-group mb-3">
                    <label htmlFor="capacity">Capacity:</label>
                    <input
                        type="number"
                        id="capacity"
                        className="form-control"
                        value={evacuationCenter.Capacity}
                        onChange={(e) => setEvacuationCenter({ ...evacuationCenter, Capacity: e.target.value })}
                        min="1"
                        max="10000"
                        title="Capacity"
                        required
                    />
                </div>

                <div className="form-group mb-3">
                    <label htmlFor="availabilityStatus">Availability Status:</label>
                    <input
                        type="text"
                        id="availabilityStatus"
                        className="form-control"
                        value={evacuationCenter.AvailabilityStatus}
                        onChange={(e) => setEvacuationCenter({ ...evacuationCenter, AvailabilityStatus: e.target.value })}
                        pattern="^(Active|Deactive)$"
                        title="Availability Status"
                        required
                    />
                </div>

                <Button variant="primary" type="submit">
                    Update
                </Button>
            </form>
        </div>
    );
};

export default EditEvacuationCenter;
