import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import DataTable from 'react-data-table-component';
import 'bootstrap/dist/css/bootstrap.min.css';

const DisasterAlerts = () => {
  const [alerts, setAlerts] = useState([]);
  const [filterText, setFilterText] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const response = await axios.get('http://localhost:5000/disaster-alerts');
        setAlerts(response.data);
      } catch (error) {
        console.error('Error fetching alerts:', error);
      }
    };

    fetchAlerts();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this alert?')) {
      try {
        await axios.delete(`http://localhost:5000/disaster-alerts/${id}`);
        setAlerts(alerts.filter(alert => alert.AlertID !== id));
      } catch (error) {
        console.error('Error deleting alert:', error);
      }
    }
  };

  const handleView = (id) => {
    navigate(`/view-news-alert/${id}`);
  };

  const columns = [
    {
      name: 'Title',
      selector: row => row.AlertTitle,
      sortable: true,
      style: {
        fontSize: '18px',
        width: '400px'
      }
    },
    {
      name: 'Description',
      selector: row => row.AlertDescription,
      style: {
        fontSize: '18px',
        width: '300px'
      }
    },
    {
      name: 'Source',
      selector: row => row.AlertSource,
      sortable: true,
      style: {
        fontSize: '18px',
        width: '100px'
      }
    },
    {
      name: 'Date',
      selector: row => new Date(row.AlertDate).toLocaleString(),
      sortable: true,
      style: {
        fontSize: '18px',
        width: '100px'
      }
    },
    {
      name: 'Actions',
      cell: row => (
        <div style={{ display: 'flex', gap: '10px' }}>
          <button className="btn btn-primary" onClick={() => handleView(row.AlertID)}>
            View
          </button>
          <button className="btn btn-danger" onClick={() => handleDelete(row.AlertID)}>
            Delete
          </button>
        </div>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
      width: '150px',
    }
  ];

  const filteredAlerts = alerts.filter(alert =>
    alert.AlertTitle.toLowerCase().includes(filterText.toLowerCase())
  );

  return (
    <div className="container mt-4">
      <h2>Disaster Alerts</h2>

      <div className="d-flex justify-content-between align-items-center mb-4">
        <input
          type="text"
          placeholder="Search by title"
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
          className="form-control"
          style={{ width: '250px', fontSize: '16px' }}
        />
      </div>

      <DataTable
        columns={columns}
        data={filteredAlerts}
        pagination
        highlightOnHover
        responsive
        customStyles={{
          header: {
            style: {
              fontSize: '25px', // Larger font for headers
            },
          },
          rows: {
            style: {
              fontSize: '18px', // Larger font for rows
            },
          },
        }}
      />
    </div>
  );
};

export default DisasterAlerts;
