import React from 'react';
import ShipmentPieChart from './ShipmentPieChart';
import ShipmentBarChart from './ShipmentBarChart';
import { ShipmentChartProps } from '../../../types/chartTypes';

const ShipmentCharts: React.FC<ShipmentChartProps> = ({ 
  shipments, 
  loading = false, 
  error = null 
}) => {
  // Get total shipments count
//   const totalShipments = shipments?.length || 0;

  return (
    <div className="shipment-charts">
      <div className="chart-header">
        <div className="chart-title">
          Shipment Status Analytics
        </div>
      </div>

      <div className="charts-grid">
        <div className="chart-item">
          <h6 className="chart-type-title">Distribution Overview</h6>
          <ShipmentPieChart 
            shipments={shipments} 
            loading={loading} 
            error={error}
          />
        </div>
        <hr />
        <div className="chart-item">
          <h6 className="chart-type-title">Status Comparison</h6>
          <ShipmentBarChart 
            shipments={shipments} 
            loading={loading} 
            error={error}
          />
        </div>
      </div>
    </div>
  );
};

export default ShipmentCharts;
