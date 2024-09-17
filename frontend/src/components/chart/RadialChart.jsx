import React, { useState, useEffect } from 'react';
import {
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip
} from 'recharts';
import 'fontsource-roboto';

const CustomTooltip = ({ payload }) => {
  if (!payload || payload.length === 0) return null;

  const { subject, value } = payload[0].payload;

  return (
    <div style={{
      backgroundColor: '#fff',
      border: '1px solid #ccc',
      borderRadius: '4px',
      padding: '10px',
      fontSize: '14px',
      boxShadow: '0 2px 6px rgba(0,0,0,0.2)'
    }}>
      <p style={{ fontWeight: 'bold' }}>{`${subject}: ${value}`}</p>
    </div>
  );
};

const RadialChart = () => {
  const [data, setData] = useState([]);
  const [highestValue, setHighestValue] = useState({ subject: '', value: 0 });

  useEffect(() => {
    fetch('http://localhost:5000/users/color')
      .then((response) => response.json())
      .then((data) => {
        const formattedData = [
          {
            subject: 'Red',
            value: data.red,
            fullMark: 150,
          },
          {
            subject: 'Yellow',
            value: data.yellow,
            fullMark: 150,
          },
          {
            subject: 'Orange',
            value: data.orange,
            fullMark: 150,
          },
        ];

        setData(formattedData);

        // Find the highest value
        const maxData = formattedData.reduce((prev, current) => (prev.value > current.value ? prev : current));
        setHighestValue(maxData);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, []);

  return (
    <div style={{ position: 'relative' }}>
      <div style={{ textAlign: 'center', marginBottom: '10px' }}>
        <h1 style={{
          marginTop: '20px',
          fontFamily: 'Roboto, sans-serif',
          fontWeight: 700,
          fontSize: '24px',
          color: '#072570'
        }}>
          Recap Amount of Waste Data
        </h1>
        <h3 style={{
          marginTop: '10px',
          fontFamily: 'Roboto, sans-serif',
          fontWeight: 400,
          fontSize: '16px',
          color: '#555'
        }}>
          Overview Amount of Waste
        </h3>
      </div>
      <ResponsiveContainer width="100%" height={350}>
        <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
          <defs>
            <linearGradient id="colorRed" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#ff0000" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#ff0000" stopOpacity={0.1} />
            </linearGradient>
            <linearGradient id="colorYellow" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#bfbf1d" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#bfbf1d" stopOpacity={0.1} />
            </linearGradient>
            <linearGradient id="colorOrange" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#d64106" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#d64106" stopOpacity={0.1} />
            </linearGradient>
          </defs>
          <PolarGrid stroke="#ddd" strokeDasharray="3 3" />
          <PolarAngleAxis
            dataKey="subject"
            stroke="#666"
            tick={{ fontSize: 12 }}
            tickLine={{ stroke: '#666' }}
            tickMargin={0}
            angle={0}
          />
          <PolarRadiusAxis
            angle={30}
            domain={[0, 15]}
            stroke="#666"
            tick={{ fontSize: 12 }}
          />
          {data.map((entry, index) => (
            <Radar
              key={index}
              name={entry.subject}
              dataKey="value"
              stroke={
                entry.subject === 'Red' ? '#ff0000' :
                  entry.subject === 'Yellow' ? '#bfbf1d' :
                    '#d64106'
              }
              fill={
                entry.subject === 'Red' ? 'url(#colorRed)' :
                  entry.subject === 'Yellow' ? 'url(#colorYellow)' :
                    '#3e73f7'
              }
              fillOpacity={0.4}
              animationDuration={1500}
            />
          ))}
          <Tooltip content={<CustomTooltip />} />
        </RadarChart>
      </ResponsiveContainer>

      <div style={{
        position: 'absolute',
        right: '20px',
        top: '75px',
        backgroundColor: '#fff',
        border: '1px solid #ccc',
        borderRadius: '4px',
        padding: '10px',
        fontSize: '14px',
        boxShadow: '0 2px 6px rgba(0,0,0,0.2)'
      }}>
        <p style={{ fontWeight: 'bold' }}>{`Highest Value`}</p>
        <p>{`${highestValue.subject}: ${highestValue.value}`}</p>
      </div>

      <div style={{
        marginTop: '-100px',
        textAlign: 'center',
        fontFamily: 'Roboto, sans-serif',
        fontSize: '16px',
        color: '#333',
      }}>
        <p><strong>Color Indicators: </strong></p>
        <ul style={{
          listStyle: 'none',
          padding: 0,
          display: 'flex',
          justifyContent: 'center',
          gap: '20px'
        }}>
          <li><span style={{ color: '#ff0000' }}>Red</span></li>
          <li><span style={{ color: '#bfbf1d' }}>Yellow</span></li>
          <li><span style={{ color: '#d64106' }}>Orange</span></li>
        </ul>
      </div>
    </div>
  );
};

export default RadialChart;
