import React from 'react';
import { FaUserAlt, FaRecycle, FaGraduationCap, FaMapMarkedAlt } from 'react-icons/fa'; // Import FaMapMarkedAlt for Map icon
import { TbTableShortcut } from 'react-icons/tb';
import { MdOutlineDashboardCustomize } from 'react-icons/md';
import { IoMdFlame } from 'react-icons/io'; // Import IoMdFlame for Fuel Prediction icon
import { useNavigate } from 'react-router-dom';
import 'fontsource-roboto';

const Dashboard = ({ activeItem }) => {
  const navigate = useNavigate();

  const menuStyle = {
    backgroundColor: '#072570',
    height: '100vh',
    paddingTop: '20px',
    width: '210px',
    color: '#ffffff',
    position: 'fixed',
  };

  const menuLabelStyle = {
    fontSize: '24px',
    fontWeight: '700',
    fontFamily: 'Roboto, sans-serif',
    color: '#ffffff',
    textAlign: 'center',
    borderRadius: '0',
  };

  const hrStyle = {
    border: 'none',
    borderBottom: '1px solid #ffffff',
    margin: '10px 0',
  };

  const menuListStyle = {
    padding: '0',
    listStyleType: 'none',
  };

  const buttonStyle = {
    color: '#ffffff',
    borderRadius: '0',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    textAlign: 'left',
    width: '100%',
    padding: '10px',
    display: 'flex',
    alignItems: 'center',
    transition: 'background-color 0.3s',
  };

  const iconStyle = {
    color: '#61dafb',
    marginRight: '10px',
  };

  const getButtonStyle = (itemName) => ({
    ...buttonStyle,
    backgroundColor: activeItem === itemName ? '#3B82F6' : 'transparent',
  });

  const handleNavigation = (itemName, path) => {
    navigate(path);
  };

  return (
    <aside className="menu" style={menuStyle}>
      <p className="menu-label" style={menuLabelStyle}>
        VASTUM
      </p>
      <hr style={hrStyle} />
      <ul className="menu-list" style={menuListStyle}>
        <li>
          <button
            style={getButtonStyle('DashboardDesign')}
            onClick={() => handleNavigation('DashboardDesign', '/')}>
            <span className="icon" style={iconStyle}>
              <MdOutlineDashboardCustomize />
            </span>
            Dashboard
          </button>
        </li>
        <li>
          <button
            style={getButtonStyle('PlasticWasteEducation')}
            onClick={() => handleNavigation('PlasticWasteEducation', '/education')}>
            <span className="icon" style={iconStyle}>
              <FaGraduationCap />
            </span>
            Education
          </button>
        </li>
        <li>
          <button
            style={getButtonStyle('OrdersDashboard')}
            onClick={() => handleNavigation('OrdersDashboard', '/customers')}>
            <span className="icon" style={iconStyle}>
              <FaUserAlt />
            </span>
            Customers
          </button>
        </li>
        <li>
          <button
            style={getButtonStyle('CameraCapture')}
            onClick={() => handleNavigation('Camera', '/camera-feed')}>
            <span className="icon" style={iconStyle}>
              <FaRecycle />
            </span>
            Waste Detection
          </button>
        </li>
        <li>
          <button
            style={getButtonStyle('WasteClassificationComponent')}
            onClick={() => handleNavigation('WasteClassificationComponent', '/fuel-prediction')}>
            <span className="icon" style={iconStyle}>
              <IoMdFlame />
            </span>
            Fuel Prediction
          </button>
        </li>
        <li>
          <button
            style={getButtonStyle('Data')}
            onClick={() => handleNavigation('Data', '/data')}>
            <span className="icon" style={iconStyle}>
              <TbTableShortcut />
            </span>
            Data
          </button>
        </li>
        <li>
          <button
            style={getButtonStyle('CustomMap')}
            onClick={() => handleNavigation('CustomMap', '/map')}>
            <span className="icon" style={iconStyle}>
              <FaMapMarkedAlt />
            </span>
            Map
          </button>
        </li>
      </ul>
    </aside>
  );
};

export default Dashboard;
