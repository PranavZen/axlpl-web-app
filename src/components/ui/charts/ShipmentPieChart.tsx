import React from 'react';
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  Title
} from 'chart.js';
import { createPieChartData, pieChartOptions, processShipmentData } from '../../../utils/chartUtils';
import { ShipmentChartProps } from '../../../types/chartTypes';
import { LogisticsLoader } from '../spinner';

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend, Title);

const ShipmentPieChart: React.FC<ShipmentChartProps> = ({ 
  shipments, 
  loading = false, 
  error = null 
}) => {
  // Process shipment data
  const statusData = processShipmentData(shipments);
  const chartData = createPieChartData(statusData);

  if (loading) {
    return (
      <LogisticsLoader />
    );
  }

  if (error) {
    return (
      <div className="chart-container">
        <div className="chart-empty">
          <div className="empty-icon">⚠️</div>
          <div className="empty-text">Failed to Load Data</div>
          <div className="empty-description">
            {error}
          </div>
        </div>
      </div>
    );
  }

  if (!shipments || shipments.length === 0) {
    return (
      <div className="chart-container">
        <div className="chart-empty">
          <div className="empty-icon">📊</div>
          <div className="empty-text">No Shipment Data</div>
          <div className="empty-description">
            There are no shipments to display in the chart
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="chart-container">
      <div className="chart-content" style={{ width: '100%', height: '180px' }}>
        <Pie 
          data={chartData} 
          options={pieChartOptions} 
          width={180} 
          height={180}
        />
      </div>
      
      {/* Enhanced Status Summary */}
      <div className="chart-summary pie-chart-summary">
        <div className="summary-header">
          <h6 className="summary-title pie-chart-title">📊 Status Distribution</h6>
          <div className="summary-stats">
            <span className="status-types">{statusData.length} Status Types</span>
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
                  <div className="status-percentage" style={{ color: chartData.datasets[0].backgroundColor[index] }}>
                    
                  </div>
                </div>
              </div>
              <div className="status-details">
                <div className="status-count">
                  <span className="count-number" style={{ color: chartData.datasets[0].backgroundColor[index] }}>
                    {item.count} {""}
                  </span>
                  <span className="count-label">Shipments</span>
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

export default ShipmentPieChart;
