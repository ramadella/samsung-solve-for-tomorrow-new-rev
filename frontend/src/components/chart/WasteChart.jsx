import React, { useState, useEffect } from "react";
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, ReferenceLine } from "recharts";
import 'fontsource-roboto';

// Daftar jenis sampah
const waste = [
    "alumunium",
    "battery",
    "cardboard",
    "food_waste",
    "glass",
    "paper",
    "plastic",
    "styrofoam",
    "tea-bags",
];

const WasteChart = () => {
    const [data, setData] = useState([]);

    useEffect(() => {
        const fetchWasteData = async () => {
            try {
                const response = await fetch('http://localhost:5001/waste_data');
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const wasteData = await response.json();

                // Membuat peta data dari nama sampah ke jumlah total
                const wasteMap = wasteData.reduce((acc, item) => {
                    acc[item.name] = item.total_count;
                    return acc;
                }, {});

                // Menyediakan semua jenis sampah, bahkan jika tidak ada data
                const fullData = waste.map(item => ({
                    name: item,
                    count: wasteMap[item] || 0
                }));

                setData(fullData);
            } catch (error) {
                console.error("Error fetching waste data:", error);
                // Data dummy untuk menampilkan grafik saat terjadi kesalahan
                setData(waste.map(item => ({ name: item, count: Math.floor(Math.random() * 1000) })));
            }
        };

        fetchWasteData();
    }, []);

    return (
        <div style={{ padding: '20px', backgroundColor: '#f9f9f9' }}>
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                <h1 style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 700, fontSize: '24px', color: '#072570', marginBottom: '10px' }}>
                    Recap of Trash Detected by YOLOv8
                </h1>
                <h3 style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 400, fontSize: '16px', color: '#555', marginBottom: '20px' }}>
                    Overview of Waste Types
                </h3>
            </div>
            <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={data} margin={{ top: 20, right: 50, left: 20, bottom: 30 }}>
                    <defs>
                        <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                    <XAxis
                        dataKey="name"
                        tick={{ fill: '#666', fontSize: 12 }}
                        interval={0} // Show all ticks
                        angle={-45} // Rotate the labels by 45 degrees
                        textAnchor="end" // Align text at the end for better readability
                    />
                    <YAxis
                        domain={[0, Math.max(...data.map(d => d.count)) * 1.1]}
                        tickFormatter={(value) => value.toLocaleString()}
                        tick={{ fill: '#666', fontSize: 12 }}
                        stroke="#ccc"
                    />
                    <Tooltip
                        contentStyle={{ backgroundColor: '#fff', borderColor: '#ddd', borderRadius: '4px' }}
                        itemStyle={{ color: '#333' }}
                    />
                    <ReferenceLine y={1000} label="Target" stroke="red" strokeDasharray="3 3" />
                    <Area
                        type="monotone"
                        dataKey="count"
                        stroke="#8884d8"
                        fillOpacity={1}
                        fill="url(#colorUv)"
                        dot={{ stroke: '#8884d8', strokeWidth: 2, r: 4 }}
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
};

export default WasteChart;
