import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import TableComponent from './TableComponent';
import Dashboard from '../dashboard';

// Main Data Component
const Data = () => {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [hoveredButton, setHoveredButton] = useState(null); // Manage hover state
  const [hasMoreData, setHasMoreData] = useState(true); // Track if there's more data
  const usersPerPage = 10;
  const navigate = useNavigate();

  useEffect(() => {
    getUsers(currentPage);
  }, [currentPage]);

  const getUsers = async (page) => {
    try {
      const response = await axios.get('http://localhost:5000/users', {
        params: { page, limit: usersPerPage }
      });

      const users = response.data.users || [];

      setData(users);
      // Disable next if the received data is less than the page limit
      setHasMoreData(users.length === usersPerPage);
    } catch (error) {
      console.error('Error fetching users:', error);
      alert('Failed to fetch users. Please try again later.');
    }
  };

  const paginate = (pageNumber) => {
    if (pageNumber > 0) {
      setCurrentPage(pageNumber);
    }
  };

  const handleEdit = (id) => {
    navigate(`/edit/${id}`);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/users/${id}`);
      getUsers(currentPage);
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('Failed to delete user. Please try again later.');
    }
  };

  const handleViewMap = (user) => {
    navigate(`/map?lat=${user.latitude}&lng=${user.longitude}&zoom=12`);
  };

  const handleAdd = () => {
    navigate('/add'); // Navigate to the 'add' page when the button is clicked
  };

  const paginationContainerStyle = {
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginBottom: '10px',
    marginRight: '76px',
  };

  const paginationStyle = {
    display: 'flex',
    alignItems: 'center',
  };

  const baseButtonStyle = {
    backgroundColor: '#072570',
    border: '1px solid #072570',
    fontSize: '15px',
    fontFamily: 'Roboto, Arial, sans-serif',
    color: '#ffffff',
    borderRadius: '4px',
    padding: '10px 15px',
    cursor: 'pointer',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    margin: '0 5px',
    transition: 'background-color 0.3s, box-shadow 0.3s',
    outline: 'none', // Remove default outline
  };

  const buttonHoverStyle = {
    backgroundColor: '#041c40',
    boxShadow: '0 6px 8px rgba(0, 0, 0, 0.2)',
  };

  const titleStyle = {
    color: '#072570',
    fontWeight: 700,
    fontSize: '24px', // Adjust the font size as needed
    marginBottom: '20px',
    textAlign: 'center',
  };

  const addButtonContainerStyle = {
    display: 'flex',
    justifyContent: 'flex-end',
    marginRight: '101px',
    marginBottom: '10px',
    paddingRight: '76px'
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <Dashboard activeItem="Data" style={{ zIndex: 1, position: 'relative' }} />
      <div style={{ marginTop: '30px', margin: '0 0 0 100px', width: '100%' }}>
        <h1 style={titleStyle}>Table Recap Trash Location</h1>

        <div style={addButtonContainerStyle}>
          <button
            style={{ ...baseButtonStyle, ...(hoveredButton === 'add' ? buttonHoverStyle : {}) }}
            onMouseEnter={() => setHoveredButton('add')}
            onMouseLeave={() => setHoveredButton(null)}
            onClick={handleAdd}
          >
            Add Data
          </button>
        </div>

        <TableComponent
          data={data}
          currentPage={currentPage}
          usersPerPage={usersPerPage}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onViewMap={handleViewMap}
        />
      </div>

      <div style={paginationContainerStyle}>
        <div style={paginationStyle}>
          <button
            style={{ ...baseButtonStyle, ...(hoveredButton === 'prev' ? buttonHoverStyle : {}) }}
            onMouseEnter={() => setHoveredButton('prev')}
            onMouseLeave={() => setHoveredButton(null)}
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <span style={{ margin: '0 10px' }}>Page {currentPage}</span>
          <button
            style={{ ...baseButtonStyle, ...(hoveredButton === 'next' ? buttonHoverStyle : {}) }}
            onMouseEnter={() => setHoveredButton('next')}
            onMouseLeave={() => setHoveredButton(null)}
            onClick={() => paginate(currentPage + 1)}
            disabled={!hasMoreData} // Disable if no more data
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default Data;
