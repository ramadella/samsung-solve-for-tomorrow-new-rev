import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaTrashAlt, FaRecycle, FaHandsHelping, FaRegCheckCircle, FaTimesCircle } from 'react-icons/fa';

const StatsComponent = () => {
  const [stats, setStats] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/waste-statistics')
      .then((response) => {
        setStats(response.data);
      })
      .catch((error) => console.error('Error fetching data:', error));
  }, []);

  const styles = {
    statsContainer: {
      display: 'flex',
      flexWrap: 'wrap', // Ensure all cards are in one row
      justifyContent: 'space-between',  // Align the cards in one row with spacing between
      alignItems: 'center',
      gap: '14px',
      margin: '20px -2px',
      width: '100%',
      boxSizing: 'border-box',
      overflowX: 'auto',
    },
    statCard: {
      padding: '5px 20px', 
      borderRadius: '8px', 
      color: '#fff',
      width: '180px',
      height: '120px', // Adjusted height to accommodate icons
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      alignItems: 'center',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
      flexShrink: 0,
    },
    statHeader: {
      fontSize: '12px',  // Smaller font for the header
      fontWeight: '600',
      textAlign: 'center',
    },
    statValue: {
      fontSize: '18px',  // Reduced font size for the value
      fontWeight: 'bold',
      margin: '4px 0',
    },
    statDescription: {
      fontSize: '12px',  // Smaller description text
      color: '#eeeea1',
      textAlign: 'center',
      fontWeight: '500'
    },
    icon: {
      fontSize: '24px', // Adjust icon size
      marginBottom: '8px',
    },
    gradient1: {
      background: 'linear-gradient(45deg, #3a71d1, #13305e)',
    },
    gradient2: {
      background: 'linear-gradient(45deg, #f5a623, #b0925b)',
    },
    gradient3: {
      background: 'linear-gradient(45deg, #27ae60, #52874c)',
    },
    gradient4: {
      background: 'linear-gradient(45deg, #e74c3c, #733b28)',
    },
    gradient5: {
      background: 'linear-gradient(45deg, #8e44ad, #3c2645)', // Additional gradient
    },
  };

  const iconMap = [
    <FaTrashAlt style={styles.icon} key="icon1" />,
    <FaRecycle style={styles.icon} key="icon2" />,
    <FaHandsHelping style={styles.icon} key="icon3" />,  // Waste Management
    <FaRegCheckCircle style={styles.icon} key="icon4" />,  // Managed Waste
    <FaTimesCircle style={styles.icon} key="icon5" />,  // Unmanaged Waste
  ];

  return (
    <div style={styles.statsContainer}>
      {stats.map((stat, index) => {
        // Assign a different gradient for each card based on index
        let gradientStyle;
        switch (index) {
          case 0:
            gradientStyle = styles.gradient1;
            break;
          case 1:
            gradientStyle = styles.gradient2;
            break;
          case 2:
            gradientStyle = styles.gradient3;
            break;
          case 3:
            gradientStyle = styles.gradient4;
            break;
          case 4:
            gradientStyle = styles.gradient5;
            break;
          default:
            gradientStyle = styles.gradient1;
            break;
        }

        return (
          <div key={stat.metric_name} style={{ ...styles.statCard, ...gradientStyle }}>
            {iconMap[index]}
            <h3 style={styles.statHeader}>{stat.metric_name}</h3>
            <p style={styles.statValue}>{stat.value}</p>
            <p style={styles.statDescription}>{stat.percentage ? `${stat.percentage}%` : 'N/A'} Increase</p>
          </div>
        );
      })}
    </div>
  );
};

export default StatsComponent;
