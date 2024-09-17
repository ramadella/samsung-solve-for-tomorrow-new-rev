import React, { useState, useEffect } from 'react';
import Dashboard from '../dashboard';

const CameraCapture = () => {
  const [detectionInfo, setDetectionInfo] = useState(null);
  const [error, setError] = useState(null);
  const [isStreaming, setIsStreaming] = useState(false); // Track if the video stream is active

  const containerStyle = {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    height: '100vh',
  };

  const dashboardStyle = {
    width: '220px',
    position: 'relative',
    zIndex: 1,
    backgroundColor: '#f8f9fa',
  };

  const contentStyle = {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    padding: '20px',
  };

  const headerStyle = {
    textAlign: 'center',
    fontSize: '24px',
    fontWeight: 'bold',
    marginBottom: '20px',
    color: '#072570',
  };

  const bodyContentStyle = {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  };

  const videoSectionStyle = {
    flex: 2,
    maxHeight: '75vh',
    position: 'relative',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.2)',
    borderRadius: '6px',
    overflow: 'hidden',
    backgroundColor: '#f8f9fa',
  };

  const videoStyle = {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  };

  const buttonContainerStyle = {
    position: 'absolute',
    top: '440px',
    bottom: '20px',
    left: '45%',
    transform: 'translateX(-50%)',
    zIndex: 10,
    width: '30%',
  };

  const buttonStyle = {
    display: 'block',
    width: '100%',
    padding: '10px',
    backgroundColor: '#072570',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '16px',
    textAlign: 'center',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
    transition: 'background-color 0.3s ease',
  };

  const buttonHoverStyle = {
    backgroundColor: '#0056b3',
  };

  const infoSectionStyle = {
    flex: 1,
    marginLeft: '20px',
    padding: '20px',
    backgroundColor: '#ffffff',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    borderLeft: '6px solid #072570',
  };

  const infoTitleStyle = {
    color: '#072570',
    fontSize: '22px',
    marginBottom: '10px',
  };

  const infoTextStyle = {
    color: '#333',
    fontSize: '16px',
    margin: '5px 0 0 5px',
  };

  const errorTextStyle = {
    color: '#e63946',
    fontSize: '16px',
  };

  useEffect(() => {
    const startCamera = async () => {
      try {
        await fetch('http://localhost:5001/video_feed');
        setIsStreaming(true);
      } catch (err) {
        setError("Failed to start the camera");
      }
    };

    startCamera();

    return () => {
      const stopCamera = async () => {
        try {
          await fetch('http://localhost:5001/stop_feed');
          setIsStreaming(false);
        } catch (err) {
          setError("Failed to stop the camera");
        }
      };
      stopCamera();
    };
  }, []);

  const handleCaptureClick = async () => {
    try {
      const response = await fetch('http://localhost:5001/latest_detection');
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      setDetectionInfo(data);
      setError(null);
    } catch (err) {
      setError(err.message);
      setDetectionInfo(null);
    }
  };

  return (
    <div style={containerStyle}>
      <div style={dashboardStyle}>
        <Dashboard activeItem="CameraCapture" />
      </div>
      <div style={contentStyle}>
        <div style={headerStyle}>Waste Classification and Detection</div>
        <div style={bodyContentStyle}>
          <div style={videoSectionStyle}>
            {isStreaming ? (
              <img src="http://localhost:5001/video_feed" alt="Video Feed" style={videoStyle} />
            ) : (
              <p style={infoTextStyle}>Camera is not streaming</p>
            )}
          </div>
          <div style={buttonContainerStyle}>
            <button
              style={buttonStyle}
              onMouseOver={(e) => (e.currentTarget.style.backgroundColor = buttonHoverStyle.backgroundColor)}
              onMouseOut={(e) => (e.currentTarget.style.backgroundColor = buttonStyle.backgroundColor)}
              onClick={handleCaptureClick}>
              Capture Image
            </button>
          </div>
          <div style={infoSectionStyle}>
            <h2 style={infoTitleStyle}>Detection Info</h2>
            {error && <p style={errorTextStyle}>Error: {error}</p>}
            {detectionInfo ? (
              <div>
                <p style={infoTextStyle}><strong>Name:</strong> {detectionInfo.name}</p>
                <p style={infoTextStyle}><strong>Description:</strong> {detectionInfo.description}</p>
                <p style={infoTextStyle}><strong>Category:</strong> {detectionInfo.category}</p>
                <p style={infoTextStyle}><strong>Timestamp:</strong> {detectionInfo.timestamp}</p>
              </div>
            ) : (
              <p style={infoTextStyle}>No detection info available. Click "Capture Image" to detect.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CameraCapture;