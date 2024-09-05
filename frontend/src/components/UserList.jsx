import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import backgroundImage from '../assets/images/background.png';
import overlayImage from '../assets/images/overlay.png';
import ButtonWithHoverEffect from './ButtonWithHoverEffect';
import unandLogo from '../assets/images/unand.png';
import samsungLogo from '../assets/images/samsung.png';
import rubbishLogo from '../assets/images/rubbish.png';
import samsungSolveForTomorrowLogo from '../assets/images/samsung-solve-for-tomorrow.png';

const UserList = () => {
    const [users, setUsers] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [hoveredRow, setHoveredRow] = useState(null);
    const usersPerPage = 5;
    const navigate = useNavigate();

    useEffect(() => {
        getUsers(currentPage);
    }, [currentPage]);

    const getUsers = async (page) => {
        try {
            const response = await axios.get('http://localhost:5000/users', {
                params: { page, limit: usersPerPage }
            });
            setUsers(response.data.users || []);
            setTotalPages(response.data.totalPages || 1);
        } catch (error) {
            console.error('Error fetching users:', error);
            alert('Failed to fetch users. Please try again later.');
        }
    };

    const deleteUser = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/users/${id}`);
            getUsers(currentPage);
        } catch (error) {
            console.error('Error deleting user:', error);
            alert('Failed to delete user. Please try again later.');
        }
    };

    const paginate = (pageNumber) => {
        if (pageNumber > 0 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber);
        }
    };

    const goToMap = (user) => {
        navigate(`/map?lat=${user.latitude}&lng=${user.longitude}&zoom=12`);
    };

    const generatePageNumbers = () => {
        const pageNumbers = [];
        const maxPagesToShow = 5;
        const halfMaxPages = Math.floor(maxPagesToShow / 2);

        let startPage = Math.max(1, currentPage - halfMaxPages);
        let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

        if (endPage - startPage < maxPagesToShow - 1) {
            startPage = Math.max(1, endPage - maxPagesToShow + 1);
        }

        for (let i = startPage; i <= endPage; i++) {
            pageNumbers.push(i);
        }

        return pageNumbers;
    };

    // Styles
    const containerStyle = {
        maxHeight: '100%',
        overflow: 'hidden',
        boxSizing: 'border-box',
        padding: '1rem',
        borderRadius: '8px',
        backgroundColor: '#2C0E30',
        marginBottom: '1rem',
    };

    const tableStyle = {
        width: '100%',
        tableLayout: 'auto',
        borderCollapse: 'collapse',
        backgroundColor: '#300336',
        borderRadius: '5px',
        boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)',
        overflow: 'hidden',
    };

    const headerStyle = {
        backgroundColor: '#871abd',
        color: '#ffffff',
        fontWeight: 'bold',
        padding: '10px',
        textAlign: 'center',
        position: 'sticky',
        top: 0,
        zIndex: 1,
    };

    const rowStyle = {
        backgroundColor: '#4A1F54',
        color: '#ffffff',
        fontWeight: 'bold',
        fontSize: '0.85rem',
        textAlign: 'center',
        padding: '6px',
        transition: 'background-color 0.3s ease',
    };

    const rowHoverStyle = {
        backgroundColor: '#723C8D',
    };

    const actionsCellStyle = {
        display: 'flex',
        justifyContent: 'center',
        gap: '8px',
    };

    const buttonContainerStyle = {
        display: 'flex',
        alignItems: 'center', // Menyelaraskan tombol secara vertikal
        gap: '1rem', // Jarak antara tombol
    };

    const mapButtonContainerStyle = {
        marginTop: '-49px',
        display: 'flex',
        alignItems: 'center', // Menyelaraskan tombol secara vertikal
        justifyContent: 'flex-end', // Tombol di sebelah kanan
    };

    const mainContainerStyle = {
        position: 'relative',
        backgroundColor: '#2C0E30',
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        minHeight: '90vh',
        padding: '1rem',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
    };

    const overlayStyle = {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundImage: `url(${overlayImage})`,
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        pointerEvents: 'none',
        opacity: 0.2,
    };

    const justifiedTextStyle = {
        textAlign: 'justify',
        textJustify: 'inter-word',
    };

    const logoStyle = {
        width: '80px',
        height: 'auto',
        margin: '10px',
    };

    const logoStyleSolve = {
        width: '125px',
        height: '85px',
        margin: '10px',
    };

    const logosContainerStyle = {
        display: 'flex',
        justifyContent: 'center',
        gap: '1rem',
        marginTop: '1rem',
        marginBottom: '0.5rem',
    };

    const paginationContainerStyle = {
        display: 'flex',
        justifyContent: 'right',
        gap: '1rem',
        marginTop: '1rem',
        marginBottom: '0.5rem',
    };

    const pageLinkStyle = {
        padding: '3px 10px',
        border: '2px solid #f6e8fa',
        borderRadius: '4px',
        backgroundColor: '#23082b',
        cursor: 'pointer',
        color: '#ffffff',
        transition: 'background-color 0.6s ease-in-out, transform 0.3s ease-in-out',  // Transition updated
    };

    const activePageLinkStyle = {
        background: 'linear-gradient(42deg, #7436bb 0.01%, #b520a3 100%)',
        borderColor: '#ff7527',
        color: '#ffffff',
        transform: 'scale(1.1)', // Slight scaling for active page
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)', // Add a subtle shadow
        borderRadius: '4px', // Rounded corners
        transition: 'all 0.3s ease', // Smooth transition for scaling and shadow
    };

    const headingStyle = {
        fontSize: '1.25rem',  // Ukuran font
        fontWeight: 'bold',  // Ketebalan font
        color: '#ffffff',  // Warna teks
        textAlign: 'center',  // Penataan teks di tengah
        marginBottom: '1rem',  // Jarak bawah
        textTransform: 'uppercase',  // Mengubah teks menjadi huruf kapital semua
    };

    return (
        <div style={mainContainerStyle}>
            <div style={overlayStyle}></div>
            <div className="columns mt-5 is-centered">
                <div className="column is-three-quarters">
                    <h1 className="title has-text-centered" style={{ color: '#fe5704', fontSize: '2rem', fontWeight: '200px', marginBottom: '0.5rem' }}>VASTUM</h1>
                    <h2 className="subtitle has-text-centered" style={{ color: '#ffffff', fontSize: '1.25rem', marginBottom: '1rem', fontWeight: 'bold' }}>
                        Pirolisis Sampah Menjadi Bahan Bakar Minyak
                    </h2>
                    <div style={containerStyle}>
                        <div style={buttonContainerStyle}>
                            <Link to={'add'} style={{ display: 'block', textDecoration: 'none' }}>
                                <ButtonWithHoverEffect
                                    baseColor="linear-gradient(180deg, #0004b3 0%, #0004b3 100%)"
                                    hoverColor="linear-gradient(180deg, #ff7527 0%, #fabf28 100%)"
                                >
                                    <span style={{ color: '#ffffff' }}>Add Data</span>
                                </ButtonWithHoverEffect>
                            </Link>
                            <Link to={'waste-upload'} style={{ display: 'block', textDecoration: 'none' }}>
                                <ButtonWithHoverEffect
                                    baseColor="linear-gradient(180deg, #bd0627 0%, #bd0627 100%)"
                                    hoverColor="linear-gradient(180deg, #ff7527 0%, #fabf28 100%)"
                                >
                                    <span style={{ color: '#ffffff' }}>Classification</span>
                                </ButtonWithHoverEffect>
                            </Link>
                            <Link to={'waste-upload'} style={{ display: 'block', textDecoration: 'none' }}>
                                <ButtonWithHoverEffect
                                    baseColor="linear-gradient(180deg, #4e54c8 0%, #8f94fb 100%)" 
                                    hoverColor="linear-gradient(180deg, #ff7527 0%, #fabf28 100%)"
                                >
                                    <span style={{ color: '#ffffff' }}>Estimation</span>
                                </ButtonWithHoverEffect>
                            </Link>
                        </div>
                        <div style={mapButtonContainerStyle}>
                            <Link to={'/map'} style={{ display: 'block', textDecoration: 'none' }}>
                                <ButtonWithHoverEffect
                                    baseColor="linear-gradient(180deg, #005f03 0%, #005f03 100%)"
                                    hoverColor="linear-gradient(180deg, #ff7527 0%, #fabf28 100%)"
                                >
                                    <span style={{ color: '#ffffff' }}>Go to Custom Map</span>
                                </ButtonWithHoverEffect>
                            </Link>
                        </div>
                        <div style={paginationContainerStyle}>
                            <button
                                style={pageLinkStyle}
                                onClick={() => paginate(currentPage - 1)}
                                disabled={currentPage === 1}
                            >
                                Previous
                            </button>
                            {generatePageNumbers().map((page) => (
                                <span
                                    key={page}
                                    style={page === currentPage ? { ...pageLinkStyle, ...activePageLinkStyle } : pageLinkStyle}
                                    onClick={() => paginate(page)}
                                >
                                    {page}
                                </span>
                            ))}
                            <button
                                style={pageLinkStyle}
                                onClick={() => paginate(currentPage + 1)}
                                disabled={currentPage === totalPages}
                            >
                                Next
                            </button>
                        </div>
                        <table className='table is-striped is-fullwidth' style={tableStyle}>
                            <thead>
                                <tr style={headerStyle}>
                                    <th style={headerStyle} >No</th>
                                    <th style={headerStyle}>Lokasi</th>
                                    <th style={headerStyle}>Latitude</th>
                                    <th style={headerStyle}>Longitude</th>
                                    <th style={headerStyle}>Image</th>
                                    <th style={headerStyle}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((user, index) => (
                                    <tr
                                        key={user.id}
                                        style={hoveredRow === user.id ? { ...rowStyle, ...rowHoverStyle } : rowStyle}
                                        onMouseEnter={() => setHoveredRow(user.id)}
                                        onMouseLeave={() => setHoveredRow(null)}
                                    >
                                        <td style={{ rowStyle, textAlign: 'center', color: '#ffffff' }}>{(currentPage - 1) * usersPerPage + index + 1}</td>
                                        <td style={{ ...rowStyle, ...justifiedTextStyle }}>{user.name}</td>
                                        <td style={rowStyle}>{user.latitude}</td>
                                        <td style={rowStyle} >{user.longitude}</td>
                                        <td style={rowStyle}>
                                            {user.image && (
                                                <img
                                                    src={`http://localhost:5000/public/images/${user.image}`}
                                                    alt={user.name}
                                                    width="120"
                                                    style={{ borderRadius: '4px' }}
                                                />
                                            )}
                                        </td>
                                        <td style={actionsCellStyle}>
                                            <Link to={`edit/${user.id}`} className='button is-small is-info is-outlined'>Edit</Link>
                                            <button onClick={() => deleteUser(user.id)} className='button is-small is-danger is-outlined'>Delete</button>
                                            <button
                                                onClick={() => goToMap(user)}
                                                className='button is-small is-primary is-outlined'>
                                                View on Map
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div>
                        <h2 style={headingStyle}>Penelitian ini didukung oleh</h2>
                        <div style={logosContainerStyle}>
                            <img src={unandLogo} alt="Unand Logo" style={logoStyle} />
                            <img src={samsungLogo} alt="Samsung Logo" style={logoStyle} />
                            <img src={rubbishLogo} alt="Rubbish Logo" style={logoStyle} />
                            <img src={samsungSolveForTomorrowLogo} alt="Samsung Solve for Tomorrow Logo" style={logoStyleSolve} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserList;
