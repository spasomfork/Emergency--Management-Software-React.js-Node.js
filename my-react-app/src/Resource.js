import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import axios from 'axios';
import DataTable from 'react-data-table-component';
import 'bootstrap/dist/css/bootstrap.min.css';

const Resources = () => {
  const [resources, setResources] = useState([]);
  const [filterText, setFilterText] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchResources = async () => {
      try {
        const response = await axios.get('http://localhost:5000/resources', { withCredentials: true });
        setResources(response.data);
      } catch (error) {
        console.error('Error fetching resources:', error);
      }
    };

    fetchResources();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this resource?')) {
      try {
        await axios.delete(`http://localhost:5000/resources/${id}`, { withCredentials: true });
        setResources(resources.filter(resource => resource.ResourceID !== id));
      } catch (error) {
        console.error('Error deleting resource:', error);
        alert('Failed to delete resource');
      }
    }
  };

  const handleEdit = (id) => {
    navigate(`/edit-resource/${id}`);
  };

  const handleCreate = () => {
    navigate('/create-resource');
  };

  const columns = [
    {
      name: 'ID',
      selector: row => row.ResourceID,
      sortable: true,
      width: '80px'
    },
    {
      name: 'Name',
      selector: row => row.Name,
      sortable: true,
      style: {
        fontSize: '18px',
        width: '150px'
      }
    },
    {
      name: 'Description',
      selector: row => row.Description,
      sortable: true,
      style: {
        fontSize: '18px',
        width: '250px'
      }
    },
    {
      name: 'Quantity',
      selector: row => String(row.Quantity || '').trim(),
      sortable: true,
      style: {
        fontSize: '18px',
        width: '150px'
      }
    },
    {
      name: 'Status',
      selector: row => row.Status,
      sortable: true,
      style: {
        fontSize: '18px',
        width: '200px'
      }
    },
    {
      name: 'Actions',
      cell: row => (
        <div style={{ display: 'flex', gap: '10px' }}>
          <button className="btn btn-danger" onClick={() => handleDelete(row.ResourceID)}>
            Delete
          </button>
          <button className="btn btn-primary" onClick={() => handleEdit(row.ResourceID)}>
            Edit
          </button>
        </div>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
      width: '200px'
    }
  ];

  const filteredData = resources.filter(
    item => item.Name && item.Name.toLowerCase().includes(filterText.toLowerCase())
  );

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Resources</h2>
        <div>
          <Button variant="success" onClick={handleCreate}>
            Add New Resource Request
          </Button>
        </div>
      </div>

      {/* Search Input */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <input
          type="text"
          placeholder="Search by Name"
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
          className="form-control"
          style={{ width: '250px', fontSize: '16px' }}
        />
      </div>

      <DataTable
        columns={columns}
        data={filteredData}
        pagination
        highlightOnHover
        responsive
        defaultSortFieldId="ResourceID"
        customStyles={{
          header: {
            style: {
              fontSize: '25px',
            },
          },
          rows: {
            style: {
              fontSize: '18px',
            },
          },
        }}
      />
    </div>
  );
};

export default Resources;
