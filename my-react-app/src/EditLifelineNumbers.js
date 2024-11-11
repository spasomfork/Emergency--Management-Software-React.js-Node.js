import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button } from 'react-bootstrap';

const EditLifeline = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [lifeline, setLifeline] = useState({
        ServiceName: '',
        ContactNumber: ''
    });

    useEffect(() => {
        // Fetch lifeline data by ID
        const fetchLifeline = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/lifeline-numbers/${id}`);
                if (response.data) {
                    setLifeline(response.data);
                } else {
                    alert('Lifeline number not found');
                    navigate('/lifeline-numbers-management');
                }
            } catch (error) {
                console.error('Error fetching lifeline number:', error);
                alert('Error fetching lifeline number');
            }
        };

        fetchLifeline();
    }, [id, navigate]);

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`http://localhost:5000/lifeline-numbers/${id}`, lifeline);
            alert('Updated successfully');
            navigate('/lifeline-numbers-management');
        } catch (error) {
            console.error('Error updating lifeline number:', error.response?.data || error.message);
            alert('Failed to update lifeline number. Please try again.');
        }
    };

    return (
        <div className="d-flex justify-content-center align-items-start">
            <div className="container" style={{ maxWidth: '80%',  marginTop: '20px' }}>
                <h2 className="mb-4">Edit Lifeline Number</h2>
                <form onSubmit={handleUpdate}>
                    <div className="form-group mb-3">
                        <label htmlFor="ServiceName">Service Name:</label>
                        <input
                            type="text"
                            id="ServiceName"
                            className="form-control"
                            value={lifeline.ServiceName}
                            onChange={(e) => setLifeline({ ...lifeline, ServiceName: e.target.value })}
                            required
                        />
                    </div>

                    <div className="form-group mb-3">
                        <label htmlFor="ContactNumber">Contact Number:</label>
                        <input
                            type="text"
                            id="ContactNumber"
                            className="form-control"
                            value={lifeline.ContactNumber}
                            onChange={(e) => setLifeline({ ...lifeline, ContactNumber: e.target.value })}
                            required
                        />
                    </div>

                    <Button variant="primary" type="submit">
                        Update
                    </Button>
                </form>
            </div>
        </div>
    );
};

export default EditLifeline;
