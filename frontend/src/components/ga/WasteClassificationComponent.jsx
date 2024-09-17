import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Dashboard from '../dashboard';

const WasteClassificationComponent = () => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setError(null);

    if (selectedFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(selectedFile);
    } else {
      setPreview(null);
    }
  };

  const handleSubmit = async () => {
    if (!file) return;

    setLoading(true);
    setError(null);
    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await fetch('http://localhost:5001/classify_and_predict', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }

      setResults(data);
      console.log('Server response:', data);
    } catch (error) {
      console.error('Error:', error);
      setError(`An error occurred while processing the image: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const chartData = results && results.optimized_composition
    ? Object.entries(results.optimized_composition).map(([name, value]) => ({ name, value }))
    : [];

  const dashboardStyle = {
    width: '220px',
    position: 'relative',
    zIndex: 1,
    backgroundColor: '#f8f9fa',
  };

  const headerStyle = {
    padding: '20px 0 0 300px',
    textAlign: 'center',
    fontSize: '24px',
    fontWeight: 'bold',
    marginBottom: '20px',
    color: '#072570',
  };

  const containerStyle = {
    display: 'flex',
    flexDirection: 'row',
    marginTop: '20px',
    marginLeft: '250px',
  };

  const boxStyle = {
    padding: '20px 8px',
    border: '1px solid #e0e0e0',
    borderRadius: '8px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    backgroundColor: 'white',
    width: '450px',
  };

  const resultsBoxStyle = {
    padding: '20px 8px',
    border: '1px solid #e0e0e0',
    borderRadius: '8px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    backgroundColor: 'white',
    marginLeft: '20px',
    width: '500px',
  };

  const fileInputStyle = {
    fontSize: '16px',
    padding: '10px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    width: '100%',
    marginBottom: '15px',
  };

  const compositionBoxStyle = {
    marginTop: '20px',
    marginLeft: '250px',
    padding: '20px 8px',
    border: '1px solid #e0e0e0',
    borderRadius: '8px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    backgroundColor: 'white',
    width: '76.8%',
  };

  return (
    <div className="p-8">
      <div style={dashboardStyle}>
        <Dashboard activeItem="WasteClassificationComponent" />
      </div>
      <h1 style={headerStyle}>Plastic Waste Classification and Fuel Prediction</h1>

      <div style={containerStyle}>
        {/* Upload and Classify Box */}
        <div style={boxStyle}>
          <input
            type="file"
            onChange={handleFileChange}
            accept="image/*"
            style={fileInputStyle}
          />

          {preview && (
            <img
              src={preview}
              alt="Preview"
              style={{
                maxWidth: '300px',
                maxHeight: '300px',
                marginTop: '10px',
                marginBottom: '10px',
              }}
            />
          )}

          <button
            onClick={handleSubmit}
            disabled={!file || loading}
            style={{
              backgroundColor: '#072570',
              color: 'white',
              padding: '12px 24px',
              borderRadius: '5px',
              border: 'none',
              cursor: 'pointer',
              fontSize: '18px',
              fontWeight: 'bold',
              width: '100%',
              marginTop: '10px',
            }}
          >
            {loading ? 'Processing...' : 'Classify and Predict'}
          </button>

          {error && <div className="mt-4 text-red-500">{error}</div>}
        </div>

        {/* Results Box */}
        <div style={resultsBoxStyle}>
          <h2 className="text-xl font-semibold mb-4">Results</h2>
          {results ? (
            <>
              {results.processed_image && (
                <img
                  src={results.processed_image}
                  alt="Processed"
                  style={{ maxWidth: '400px', maxHeight: '400px', marginBottom: '10px' }}
                />
              )}

              <h3 className="text-lg font-semibold mb-2">
                Detected Plastic Items: {results.plastic_count || 0}
              </h3>

              <h3 className="text-lg font-semibold mt-4">
                Predicted Fuel: {results.predicted_fuel ? results.predicted_fuel.toFixed(2) : 'N/A'}
              </h3>

              <h3 className="text-lg font-semibold mt-4 mb-2">Detections</h3>
              <ul>
                {results.detections.map((detection, index) => (
                  <li key={index}>
                    {detection.class}: {(detection.confidence * 100).toFixed(2)}% confidence
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <p>No results available.</p>
          )}
        </div>
      </div>

      {/* Optimized Composition Box */}
      <div style={compositionBoxStyle}>
        <h3 className="text-lg font-semibold mb-2">Optimized Composition</h3>
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <p>No composition data available.</p>
        )}
      </div>
    </div>
  );
};

export default WasteClassificationComponent;