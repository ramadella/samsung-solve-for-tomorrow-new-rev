import React, { useEffect, useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import axios from 'axios';
import 'fontsource-roboto';

const WasteAreaChart = () => {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [maxValue, setMaxValue] = useState(0);
  const [highestValue, setHighestValue] = useState(null); // Add highest value state

  useEffect(() => {
    axios
      .get('http://localhost:5000/waste-statistics')
      .then((response) => {
        const transformedData = response.data.map(item => ({
          name: item.metric_name,
          count: item.value
        }));

        // Add a zero data point at the beginning
        const dataWithZeroStart = [{ name: '', count: 0 }, ...transformedData];

        setData(dataWithZeroStart);

        const max = Math.max(...transformedData.map(item => item.count), 0);
        setMaxValue(max);

        // Find and set the highest value
        const highest = transformedData.reduce((prev, current) => (prev.count > current.count ? prev : current));
        setHighestValue(highest);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        setError('Failed to fetch data');
      });
  }, []);

  return (
    <div style={{ width: '100%', height: 400, padding: '20px', position: 'relative' }}>
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <h1 style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 700, fontSize: '24px', color: '#072570' }}>
          Recap Report Trash
        </h1>
        <h3 style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 400, fontSize: '16px', color: '#555' }}>
          Overview of Waste Statistics Over Time
        </h3>
      </div>
      {error && <div style={{ color: 'red', textAlign: 'center', marginBottom: '20px' }}>{error}</div>}
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 20, right: 30, left: 70, bottom: 20 }}
          style={{ backgroundColor: '#f9f9f9' }}
        >
          <defs>
            <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#00C896" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#00C896" stopOpacity={0.2} />
            </linearGradient>
          </defs>
          <CartesianGrid vertical={false} stroke="#eee" />
          <XAxis
            dataKey="name"
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#666', fontSize: 12 }}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#666', fontSize: 12 }}
            domain={[0, maxValue * 1.1]}
            tickFormatter={(value) => value.toLocaleString()}
            stroke="#ccc"
          />
          <Tooltip
            contentStyle={{ backgroundColor: '#fff', borderColor: '#ddd' }}
            itemStyle={{ color: '#333' }}
          />
          <ReferenceLine y={maxValue * 0.7} label={{ value: "Target", position: 'insideTop', style: { fontWeight: 'bold', fill: 'red' } }} stroke="red" strokeDasharray="3 3" />
          <Area
            type="monotone"
            dataKey="count"
            stroke="#00C896"
            fillOpacity={1}
            fill="url(#colorCount)"
            dot={{ stroke: '#00C896', strokeWidth: 2, r: 4 }}
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>

      {/* Highest Value Box */}
      {highestValue && (
        <div style={{
          position: 'absolute',
          top: '75px',
          right: '30px',
          backgroundColor: '#fff',
          border: '1px solid #ccc',
          borderRadius: '4px',
          padding: '10px',
          fontSize: '14px',
          boxShadow: '0 2px 6px rgba(0,0,0,0.2)'
        }}>
          <p style={{ fontWeight: 'bold', margin: 0 }}>Highest Value</p>
          <p style={{ margin: 0 }}>{`${highestValue.name}: ${highestValue.count}`}</p>
        </div>
      )}
    </div>
  );
};

export default WasteAreaChart;
