import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, Container } from 'react-bootstrap';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

const EditResource = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [resource, setResource] = useState({
        Name: '',
        Description: '',
        Quantity: '',
        Status: ''
    });

    useEffect(() => {
        // Fetch resource data by ID
        const fetchResource = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/resources/${id}`);
                if (response.data) {
                    setResource(response.data);
                } else {
                    alert('Resource not found');
                    navigate('/resources');
                }
            } catch (error) {
                console.error('Error fetching resource:', error);
                alert('Error fetching resource');
            }
        };

        fetchResource();
    }, [id, navigate]);

    const handleUpdate = async (e) => {
        e.preventDefault();

        // Rule: Only allow update if resource status is 'open'
        if (resource.Status !== 'open') {
            alert('Resource can only be updated when its status is open.');
            return;
        }

        try {
            await axios.put(`http://localhost:5000/resources/${id}`, resource);
            alert('Resource updated successfully');
            navigate('/resource-allocation');
        } catch (error) {
            console.error('Error updating resource:', error.response?.data || error.message);
            alert('Failed to update resource. Please try again.');
        }
    };

    const handleStatusChange = async (e) => {
        e.preventDefault();
        const newStatus = prompt('Enter new status (open, ongoing, completed, rejected):');

        if (!['open', 'ongoing', 'completed', 'rejected'].includes(newStatus)) {
            alert('Invalid status. Please enter one of: open, ongoing, completed, rejected.');
            return;
        }

        // Rule: If status is 'completed' or 'rejected', it cannot be changed
        if (resource.Status === 'completed') {
            alert('Resource status cannot be changed once it is completed.');
            return;
        }
        if (resource.Status === 'rejected') {
            alert('Rejected resources cannot be edited.');
            return;
        }

        try {
            await axios.put(`http://localhost:5000/resources/${id}/status`, { newStatus });
            alert('Resource status updated successfully');
            navigate('/resource-allocation');
        } catch (error) {
            console.error('Error updating resource status:', error.response?.data || error.message);
            alert('Failed to update resource status. Please try again.');
        }
    };

    return (
        <Container className="mt-4" style={{ maxWidth: '80%',  marginTop: '10px' }}>
            <h2 className="mb-4">Edit Resource</h2>
            <form onSubmit={handleUpdate}>
                <div className="form-group mb-3">
                    <label htmlFor="name">Name:</label>
                    <input
                        type="text"
                        id="name"
                        className="form-control"
                        value={resource.Name}
                        onChange={(e) => setResource({ ...resource, Name: e.target.value })}
                        required
                        pattern="^[A-Z][a-zA-Z\s]{1,24}$" // Name must start with a capital letter and can be 2-25 characters long
                    />
                </div>

                <div className="form-group mb-3">
                    <label htmlFor="description">Description:</label>
                    <input
                        type="text"
                        id="description"
                        className="form-control"
                        value={resource.Description}
                        onChange={(e) => setResource({ ...resource, Description: e.target.value })}
                        required
                        pattern="^[A-Z][a-zA-Z\s]{1,24}$" // Description must start with a capital letter and can be 2-25 characters long
                    />
                </div>

                <div className="form-group mb-3">
                    <label htmlFor="quantity">Quantity:</label>
                    <input
                        type="number"
                        id="quantity"
                        className="form-control"
                        value={resource.Quantity}
                        onChange={(e) => setResource({ ...resource, Quantity: e.target.value })}
                        required
                        pattern="^(?:[2-9]|[1-9][0-9]|[1][0-0]{1,2})$" // Quantity must be a number from 2 to 1000
                    />
                </div>

                <Button variant="primary" type="submit">
                    Update Resource
                </Button>
            </form>

            <Button variant="warning" className="mt-3" onClick={handleStatusChange}>
                Change Resource Status
            </Button>
        </Container>
    );
};

export default EditResource;
