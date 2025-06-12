import React from 'react';
import './LogisticsLoader.scss';

const LogisticsLoader: React.FC = () => {
  return (
    <div className="logistics-loader-container">
      <div className="logistics-loader">
        {/* Truck Animation */}
        <div className="truck">
          <div className="truck-body">
            <div className="truck-cab"></div>
            <div className="truck-trailer"></div>
          </div>
          <div className="truck-wheels">
            <div className="wheel wheel-front"></div>
            <div className="wheel wheel-rear1"></div>
            <div className="wheel wheel-rear2"></div>
          </div>
        </div>
        
        {/* Road Animation */}
        <div className="road">
          <div className="road-line"></div>
          <div className="road-line"></div>
          <div className="road-line"></div>
          <div className="road-line"></div>
        </div>
        
        {/* Loading Text */}
        <div className="loading-text">
          <span>Loading</span>
          <div className="dots">
            <span>.</span>
            <span>.</span>
            <span>.</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogisticsLoader;
