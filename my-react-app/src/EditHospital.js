import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

const EditHospital = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [hospital, setHospital] = useState({
        Name: '',
        Location: '',
        Status: '',
        Capacity: ''
    });
    const username = localStorage.getItem('username') || 'Guest';

    useEffect(() => {
        const fetchHospital = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/hospitals/${id}`);
                if (response.data) {
                    setHospital(response.data);
                } else {
                    alert('Hospital not found');
                    navigate('/hospitals');
                }
            } catch (error) {
                console.error('Error fetching hospital:', error);
                alert('Error fetching hospital');
            }
        };

        fetchHospital();
    }, [id, navigate]);

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`http://localhost:5000/hospitals/${id}`, hospital);
            alert('Updated successfully');
            navigate('/hospitals', { state: { username } });
        } catch (error) {
            console.error('Error updating hospital:', error.response?.data || error.message);
            alert('Failed to update hospital. Please try again.');
        }
    };

    const handleLogout = () => {
        navigate('/'); // Redirect to login page
    };

    return (
        <div className="container" style={{ maxWidth: '80%', marginTop: '30px' }}>
            <h2 className="mb-4">Edit Hospital</h2>
            <form onSubmit={handleUpdate}>
                <div className="form-group mb-3">
                    <label htmlFor="name">Name:</label>
                    <input
                        type="text"
                        id="name"
                        className="form-control"
                        value={hospital.Name}
                        onChange={(e) => setHospital({ ...hospital, Name: e.target.value })}
                        pattern="^[A-Z][a-z]{1,14}( [A-Z][a-z]{1,14})*$"
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
                        value={hospital.Location}
                        onChange={(e) => setHospital({ ...hospital, Location: e.target.value })}
                        pattern="^[A-Z][a-z]{1,14}$"
                        title="Location"
                        required
                    />
                </div>

                <div className="form-group mb-3">
                    <label htmlFor="status">Status:</label>
                    <input
                        type="text"
                        id="status"
                        className="form-control"
                        value={hospital.Status}
                        onChange={(e) => setHospital({ ...hospital, Status: e.target.value })}
                        pattern="^(Active|Deactive|Operational)$"
                        title="Status"
                        required
                    />
                </div>

                <div className="form-group mb-3">
                    <label htmlFor="capacity">Capacity:</label>
                    <input
                        type="text"
                        id="capacity"
                        className="form-control"
                        value={hospital.Capacity}
                        onChange={(e) => setHospital({ ...hospital, Capacity: e.target.value })}
                        pattern="^[1-9]\d{0,3}$|^10000$"
                        title="Capacity"
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

export default EditHospital;
