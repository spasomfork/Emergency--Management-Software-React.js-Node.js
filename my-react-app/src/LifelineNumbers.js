import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import axios from 'axios';
import jsPDF from 'jspdf';
import DataTable from 'react-data-table-component';
import 'bootstrap/dist/css/bootstrap.min.css';

const LifelineNumbers = () => {
  const [lifelineNumbers, setLifelineNumbers] = useState([]);
  const [filterText, setFilterText] = useState('');
  const navigate = useNavigate();
  const username = localStorage.getItem('username') || 'Guest';

  useEffect(() => {
    const fetchLifelineNumbers = async () => {
      try {
        const response = await axios.get('http://localhost:5000/lifeline-numbers', { withCredentials: true });
        setLifelineNumbers(response.data);
      } catch (error) {
        console.error('Error fetching lifeline numbers:', error);
      }
    };

    fetchLifelineNumbers();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this lifeline number?')) {
      try {
        await axios.delete(`http://localhost:5000/lifeline-numbers/${id}`, { withCredentials: true });
        setLifelineNumbers(lifelineNumbers.filter(number => number.NumberID !== id));
      } catch (error) {
        console.error('Error deleting lifeline number:', error);
        alert('Failed to delete lifeline number');
      }
    }
  };

  const handleEdit = (id) => {
    navigate(`/edit-lifeline-number/${id}`);
  };

 
  const handleCreateCSV = () => {
    navigate('/create-lifeline-csv');
  };

  const handleCreatePDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text('Lifeline Numbers', 80, 20);
    doc.setFontSize(12);
    doc.text('ID', 20, 40);
    doc.text('Service Name', 40, 40);
    doc.text('Contact Number', 130, 40);

    let yPosition = 50;
    lifelineNumbers.forEach((number) => {
      doc.text(`${number.NumberID}`, 20, yPosition);
      doc.text(`${number.ServiceName}`, 40, yPosition);
      doc.text(`${String(number.ContactNumber || '').trim()}`, 130, yPosition); // Ensure contact number is a string
      yPosition += 10;
    });

    window.open(doc.output('bloburl'), '_blank');
  };

  const columns = [
    {
      name: 'ID',
      selector: row => row.NumberID,
      sortable: true,
      width: '80px'
    },
    {
      name: 'Service Name',
      selector: row => row.ServiceName,
      sortable: true,
      style: {
        fontSize: '18px', // Increase font size
      }
    },
    {
      name: 'Contact Number',
      selector: row => String(row.ContactNumber || '').trim(), // Ensure contact number is a string
      sortable: true,
      style: {
        fontSize: '18px', // Increase font size
      }
    },
    {
      name: 'Actions',
      cell: row => (
        <div style={{ display: 'flex', gap: '10px' }}> {/* Adjust button spacing */}
          <button className="btn btn-danger" onClick={() => handleDelete(row.NumberID)}>
            Delete
          </button>
          <button className="btn btn-primary" onClick={() => handleEdit(row.NumberID)}>
            Edit
          </button>
        </div>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
      width: '200px', // Adjust button column width
    }
  ];

  const filteredData = lifelineNumbers.filter(
    item => item.ServiceName && item.ServiceName.toLowerCase().includes(filterText.toLowerCase())
  );

  return (
    <div className="main-content-lifeline">
      <div className="container mt-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2>Lifeline Numbers</h2>
          <div>
            <Button variant="success" onClick={handleCreatePDF} style={{ marginRight: '25px' }}>
              Print PDF
            </Button>
            <Button variant="success" onClick={handleCreateCSV}>
              Add New Lifeline Number by CSV Upload
            </Button>
          </div>
        </div>
        
        {/* Search Input */}
        <div className="d-flex justify-content-between align-items-center mb-3">
          <input
            type="text"
            placeholder="Search by Service Name"
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
            className="form-control"
            style={{ width: '250px', fontSize: '16px' }} // Adjust font size of the input
          />
        </div>

        <DataTable
          columns={columns}
          data={filteredData}
          pagination
          highlightOnHover
          responsive
          defaultSortFieldId="NumberID"
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
    </div>
  );
};

export default LifelineNumbers;
