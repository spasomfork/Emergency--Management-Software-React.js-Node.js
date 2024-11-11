import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation, useParams } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

const ViewNewsAlert = () => {
    const [alert, setAlert] = useState({
        AlertTitle: '',
        AlertDescription: '',
        AlertSource: '',
        AlertDate: '',
    });

    const [errorMessage, setErrorMessage] = useState(''); // Error state

    const navigate = useNavigate();
    const { id } = useParams();

    useEffect(() => {
        const fetchAlert = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/disaster-alerts/${id}`);
                if (response.data) {
                    setAlert(response.data);
                } else {
                    setErrorMessage('Alert not found');
                    navigate('/news-alerts-management');
                }
            } catch (error) {
                console.error('Error fetching Alert:', error);
                setErrorMessage('Error fetching Alert');
            }
        };

        fetchAlert();
    }, [id, navigate]);

    return (
        <div className="d-flex flex-column h-100">
            <div className="main-content-alerts d-flex justify-content-center align-items-start">
                <div className="container">
                    <h2 className="mb-4">View Alert</h2>

                    {errorMessage && (
                        <div className="alert alert-danger" role="alert">
                            {errorMessage}
                        </div>
                    )}
                    
                    <div className="form-group mb-3">
                        <label htmlFor="title">Title:</label>
                        <input
                            type="text"
                            id="title"
                            className="form-control"
                            value={alert.AlertTitle}
                            onChange={(e) => setAlert({ ...alert, AlertTitle: e.target.value })}
                            required
                        />
                    </div>

                    <div className="form-group mb-3">
                        <label htmlFor="description">Description:</label>
                        <textarea
                            id="description"
                            className="form-control"
                            value={alert.AlertDescription}
                            onChange={(e) => setAlert({ ...alert, AlertDescription: e.target.value })}
                            required
                            rows={5}  // Specify number of rows for better visibility
                        />
                    </div>

                    <div className="form-group mb-3">
                        <label htmlFor="source">Source:</label>
                        <input
                            type="text"
                            id="source"
                            className="form-control"
                            value={alert.AlertSource}
                            onChange={(e) => setAlert({ ...alert, AlertSource: e.target.value })}
                            required
                        />
                    </div>

                    <div className="form-group mb-3">
                        <label htmlFor="date">Date:</label>
                        <p id="date" className="form-control">
                            {new Date(alert.AlertDate).toLocaleString(undefined, {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                            })}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ViewNewsAlert;
