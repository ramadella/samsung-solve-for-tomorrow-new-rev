import React, { useEffect, useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Legend
} from "recharts";

const ColorPercentages = () => {
  const [colorData, setColorData] = useState([]);

  useEffect(() => {
    const fetchColorData = async () => {
      try {
        const response = await fetch("http://localhost:5001/average_waste_data");
        const data = await response.json();
        const transformedData = data.map(({ average_count, name }) => ({
          color: name.charAt(0).toUpperCase() + name.slice(1),
          percentage: parseFloat(average_count),
        }));

        setColorData(transformedData);
      } catch (error) {
        console.error("Error fetching color data:", error);
      }
    };

    fetchColorData();
  }, []);

  return (
    <div style={{ width: '100%', height: '400px', padding: '20px' }}>
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <h1 style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 700, fontSize: '24px', color: '#072570', marginBottom: '10px' }}>
          Percentage of Trash Detected by YOLOv8
        </h1>
        <h3 style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 400, fontSize: '16px', color: '#555', marginBottom: '20px' }}>
          Overview of Trash Detected by YOLOv8
        </h3>
      </div>
      <ResponsiveContainer>
        <BarChart
          data={colorData}
          layout="vertical"
          margin={{ top: 20, right: 30, bottom: 0, left: 30 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" />
          <YAxis type="category" dataKey="color" />
          <Tooltip />
          <Legend />
          <Bar dataKey="percentage" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ColorPercentages;
