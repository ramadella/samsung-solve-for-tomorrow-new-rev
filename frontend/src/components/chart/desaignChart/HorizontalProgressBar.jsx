// src/components/HorizontalProgressBar.jsx
import React from "react";

const HorizontalProgressBar = ({ label, percentage, color }) => {
  // Define the styles as JavaScript objects
  const containerStyle = {
    margin: "20px 0",
  };

  const labelStyle = {
    fontSize: "16px",
    marginBottom: "5px",
  };

  const percentageStyle = {
    fontSize: "14px",
    marginLeft: "8px",
  };

  const progressBarStyle = {
    width: "100%",
    height: "20px",
    backgroundColor: "#d3d3d3", // Light gray
    borderRadius: "10px",
    overflow: "hidden",
  };

  const progressFillStyle = {
    height: "100%",
    width: `${percentage}%`,
    backgroundColor: color,
    borderRadius: "10px",
    transition: "width 0.4s ease-in-out",
  };

  return (
    <div style={containerStyle}>
      <div style={labelStyle}>
        {label} <span style={percentageStyle}>{percentage}%</span>
      </div>
      <div style={progressBarStyle}>
        <div style={progressFillStyle}></div>
      </div>
    </div>
  );
};

export default HorizontalProgressBar;
