import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import 'fontsource-roboto';

const PieRadialChart = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:5000/users/color')
      .then(response => {
        const transformedData = Object.keys(response.data).map(key => ({
          name: key.charAt(0).toUpperCase() + key.slice(1),
          value: response.data[key]
        }));
        setData(transformedData);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching data:', err);
        setError(err.message || 'Error fetching data');
        setLoading(false);
      });
  }, []);

  if (loading) return <div style={styles.loading}>Loading...</div>;
  if (error) return <div style={styles.error}>Error fetching data!</div>;

  const colors = ['#FF0000', '#adb009', '#FFA500']; // red, yellow, orange

  const totalValue = data.reduce((sum, entry) => sum + entry.value, 0);
  const highestValue = data.reduce((max, entry) => entry.value > max ? entry.value : max, 0);
  const highestEntry = data.find(entry => entry.value === highestValue);
  const highestPercentage = (highestValue / totalValue * 100).toFixed(2);

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Percentage of Waste Data</h2>
      <h3 style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 400, fontSize: '16px', color: '#555', marginBottom: '20px' }}>
      overview the Percentage of Waste
      </h3>
      <div style={styles.chartContainer}>
        <div style={styles.highValueContainer}>
          <span style={styles.highValueLabel}>Highest Value:</span>
          <span style={styles.highValue}>
            {highestEntry ? `${highestEntry.name}: ${highestPercentage}%` : 'N/A'}
          </span>
        </div>
        <ResponsiveContainer width="100%" height={400}>
          <PieChart>
            <Tooltip />
            <Legend align="right" verticalAlign="middle" layout="vertical" />
            <Pie
              data={data}
              dataKey="value"
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              fill="#82ca9d"
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              labelLine={false}
              isAnimationActive={true}
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={colors[index % colors.length]}
                />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

// Inline styles
const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: '24px',
    margin: '20px',
    marginBottom: '10px',
    color: '#072570',
    textAlign: 'center',
    fontWeight: 700,
    fontFamily: 'Roboto, sans-serif',
  },
  loading: {
    textAlign: 'center',
    fontSize: '18px',
    color: '#666',
  },
  error: {
    textAlign: 'center',
    fontSize: '18px',
    color: '#d9534f',
  },
  chartContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    position: 'relative',
    width: '100%',
    margin: '0 0 0 10px'
  },
  highValueContainer: {
    position: 'absolute',
    top: 0,
    right: 5,
    margin: '10px',
    backgroundColor: '#f9f9f9',
    border: '1px solid #ddd',
    padding: '10px',
    borderRadius: '5px',
    boxShadow: '0 0 10px rgba(0,0,0,0.1)',
    fontFamily: 'Roboto, sans-serif',
  },
  highValueLabel: {
    fontWeight: 'bold',
  },
  highValue: {
    display: 'block',
  },
};

export default PieRadialChart;
