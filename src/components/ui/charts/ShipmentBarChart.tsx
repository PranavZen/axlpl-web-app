import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { createBarChartData, barChartOptions, processShipmentData } from '../../../utils/chartUtils';
import { ShipmentChartProps } from '../../../types/chartTypes';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const ShipmentBarChart: React.FC<ShipmentChartProps> = ({ 
  shipments, 
  loading = false, 
  error = null 
}) => {
  // Process shipment data
  const statusData = processShipmentData(shipments);
  const chartData = createBarChartData(statusData);

  if (loading) {
    return (
      <div className="chart-container d-flex justify-content-center align-items-center">
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p className="loading-text">Loading shipment data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="chart-container d-flex justify-content-center align-items-center">
        <div className="error-state">
          <div className="error-icon">⚠️</div>
          <h4 className="error-title">Failed to load data</h4>
          <p className="error-message">{error}</p>
        </div>
      </div>
    );
  }

  if (!shipments || shipments.length === 0) {
    return (
      <div className="chart-container d-flex justify-content-center align-items-center">
        <div className="empty-state">
          <div className="empty-icon">📊</div>
          <h4 className="empty-title">No Data Available</h4>
          <p className="empty-message">No shipment data found for the selected period.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="chart-container">
      <div className="chart-content" style={{ width: '100%', height: '160px' }}>
        <Bar 
          data={chartData} 
          options={barChartOptions} 
          width={400} 
          height={160}
        />
      </div>
      
      {/* Enhanced Status Summary */}
      <div className="chart-summary bar-chart-summary">
        <div className="summary-header">
          <h6 className="summary-title bar-chart-title">📈 Status Comparison</h6>
          <div className="summary-stats">
            {/* <span className="total-count">{statusData.reduce((sum, item) => sum + item.count, 0)} Total</span> */}
            {/* <span className="highest-status">Highest: {statusData.reduce((max, item) => item.count > max.count ? item : max, statusData[0])?.status}</span> */}
          </div>
        </div>
        <div className="summary-grid">
          {statusData.map((item, index) => (
            <div key={index} className="summary-item" style={{ borderLeftColor: chartData.datasets[0].backgroundColor[index] }}>
              <div className="status-header">
                <div 
                  className="status-indicator" 
                  style={{ 
                    backgroundColor: chartData.datasets[0].backgroundColor[index],
                  }}
                ></div>
                <div className="status-info">
                  <div className="status-name" style={{ color: chartData.datasets[0].backgroundColor[index] }}>
                    {item.status} ({item.percentage}%)
                  </div>
                  
                </div>
              </div>
              <div className="status-details">
                <div className="status-count">
                  <span className="count-number" style={{ color: chartData.datasets[0].backgroundColor[index] }}>
                    {item.count} {""}
                  </span>
                  <span className="count-label">shipments</span>
                </div>
                <div className="status-progress">
                  <div 
                    className="progress-bar"
                    style={{ 
                      width: `${item.percentage}%`,
                      backgroundColor: chartData.datasets[0].backgroundColor[index],
                    }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ShipmentBarChart;
