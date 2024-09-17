import React, { useState } from 'react';
import 'bulma/css/bulma.min.css';
import Dashboard from '../dashboard';

// Import your custom images
import samsungLogo from '../../assets/images/samsung.png';
import unandLogo from '../../assets/images/unand.png';
import rubbishLogo from '../../assets/images/rubbish.png';
import samsungSolveForTomorrow from '../../assets/images/samsung-solve-for-tomorrow.png';

// Custom styles
const layoutContainerStyle = {
    display: 'flex',
    flexDirection: 'row',
    height: '100vh',
    margin: 0,
    padding: 0,
};

const contentStyle = {
    marginLeft: '220px', 
    flexGrow: 1,
    padding: '2rem',
};


const logosContainerStyle = {
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
};

const iconWrapperStyle = {
    marginRight: '10px',
};

const circleStyle = {
    width: '80px',
    height: '80px',
    borderRadius: '50%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
};

const imageStyle = {
    width: '50px',
};

// Custom styles for table
const tableHeaderStyle = {
    backgroundColor: '#072570',
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
};

const tdCenterStyle = {
    textAlign: 'center',
};

const thStyle = {
    ...tableHeaderStyle,
    color: 'white',
};

const tableContainerStyle = {
    marginTop: '1rem',
};

const sampleData = [
    { Tahun: 2024, P: 1, Provinsi: 'Sumatera Barat', KabupatenKota: 'Kab. Tanah Datar', NamaFasilitas: 'Bank Sampah Induk ANISA', Jenis: 'BSI', Status: 'A', SampahMasuk: 949.00, SampahTerkelola: 912.50 },
    { Tahun: 2024, P: 1, Provinsi: 'Sumatera Barat', KabupatenKota: 'Kab. Tanah Datar', NamaFasilitas: 'Bank Sampah Induk Tiga Saudara', Jenis: 'BSI', Status: 'A', SampahMasuk: 482.53, SampahTerkelola: 481.80 },
    { Tahun: 2024, P: 1, Provinsi: 'Sumatera Barat', KabupatenKota: 'Kab. Lima Puluh Kota', NamaFasilitas: 'Permata Plastik', Jenis: 'BSI', Status: 'A', SampahMasuk: 273.75, SampahTerkelola: 273.75 },
    { Tahun: 2024, P: 1, Provinsi: 'Sumatera Barat', KabupatenKota: 'Kota Solok', NamaFasilitas: 'Bank Sampah Hanasty', Jenis: 'BSI', Status: 'A', SampahMasuk: 76.65, SampahTerkelola: 0.00 },
    { Tahun: 2024, P: 1, Provinsi: 'Sumatera Barat', KabupatenKota: 'Kota Sawahlunto', NamaFasilitas: 'BSI CEMARA', Jenis: 'BSI', Status: 'A', SampahMasuk: 365.00, SampahTerkelola: 365.00 },
    { Tahun: 2024, P: 1, Provinsi: 'Sumatera Barat', KabupatenKota: 'Kota Sawahlunto', NamaFasilitas: 'BANK SAMPAH INDUK EMAS BERSIH', Jenis: 'BSI', Status: 'A', SampahMasuk: 219.00, SampahTerkelola: 219.00 }
];

const OrdersDashboard = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 10;

    // Calculate total pages
    const totalPages = Math.ceil(sampleData.length / rowsPerPage);

    // Get current page rows
    const currentRows = sampleData.slice(
        (currentPage - 1) * rowsPerPage,
        currentPage * rowsPerPage
    );

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    return (
        <div style={layoutContainerStyle}>
            <Dashboard activeItem="OrdersDashboard" />

            <div style={contentStyle}>
                <section className="hero is-light is-small">
                    <div className="hero-body">
                        <div className="columns is-vcentered">
                            <div className="column">
                                <h1 className="title">BANK SAMPAH INDUK</h1>
                                <h2 className="subtitle">Pengelolaan Sampah di Sumatra Barat</h2>
                            </div>
                            <div className="column has-text-right">
                                <div style={logosContainerStyle}>
                                    <div className="is-inline-block has-text-centered" style={iconWrapperStyle}>
                                        <div style={circleStyle}>
                                            <img src={samsungSolveForTomorrow} alt="Samsung Solve For Tomorrow Logo" style={imageStyle} />
                                        </div>
                                    </div>
                                    <div className="is-inline-block has-text-centered" style={iconWrapperStyle}>
                                        <div style={circleStyle}>
                                            <img src={samsungLogo} alt="Samsung Logo" style={imageStyle} />
                                        </div>
                                    </div>
                                    <div className="is-inline-block has-text-centered" style={iconWrapperStyle}>
                                        <div style={circleStyle}>
                                            <img src={rubbishLogo} alt="Rubbish Logo" style={imageStyle} />
                                        </div>
                                    </div>
                                    <div className="is-inline-block has-text-centered" style={iconWrapperStyle}>
                                        <div style={circleStyle}>
                                            <img src={unandLogo} alt="Unand Logo" style={imageStyle} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <div className="table-container" style={tableContainerStyle}>
                    <table className="table is-fullwidth is-striped is-hoverable">
                        <thead>
                            <tr style={tableHeaderStyle}>
                                <th style={thStyle}>Tahun</th>
                                <th style={thStyle}>P</th>
                                <th style={thStyle}>Provinsi</th>
                                <th style={thStyle}>Kabupaten/Kota</th>
                                <th style={thStyle}>Nama Fasilitas</th>
                                <th style={thStyle}>Jenis</th>
                                <th style={thStyle}>Status</th>
                                <th style={thStyle}>Sampah masuk (ton/thn)</th>
                                <th style={thStyle}>Sampah terkelola (ton/thn)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentRows.map((row, index) => (
                                <tr key={index}>
                                    <td style={tdCenterStyle}>{row.Tahun}</td>
                                    <td style={tdCenterStyle}>{row.P}</td>
                                    <td>{row.Provinsi}</td>
                                    <td>{row.KabupatenKota}</td>
                                    <td>{row.NamaFasilitas}</td>
                                    <td style={tdCenterStyle}>{row.Jenis}</td>
                                    <td style={tdCenterStyle}>{row.Status}</td>
                                    <td style={tdCenterStyle}>{row.SampahMasuk}</td>
                                    <td style={tdCenterStyle}>{row.SampahTerkelola}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <nav className="pagination is-centered" role="navigation" aria-label="pagination">
                    <button
                        className="pagination-previous"
                        disabled={currentPage === 1}
                        onClick={() => handlePageChange(currentPage - 1)}>
                        Previous
                    </button>
                    <button
                        className="pagination-next"
                        disabled={currentPage === totalPages}
                        onClick={() => handlePageChange(currentPage + 1)}>
                        Next
                    </button>
                    <ul className="pagination-list">
                        {Array.from({ length: totalPages }, (_, index) => (
                            <li key={index}>
                                <button
                                    className={`pagination-link ${currentPage === index + 1 ? 'is-current' : ''}`}
                                    onClick={() => handlePageChange(index + 1)}>
                                    {index + 1}
                                </button>
                            </li>
                        ))}
                    </ul>
                </nav>
            </div>
        </div>
    );
};

export default OrdersDashboard;
