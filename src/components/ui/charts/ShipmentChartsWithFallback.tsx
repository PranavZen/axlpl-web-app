import React from 'react';
import { ShipmentChartProps } from '../../../types/chartTypes';
import ShipmentCharts from './ShipmentCharts';

// Mock data for testing when no real data is available
const mockShipmentData = [
  { shipment_id: 'MOCK001', shipment_status: 'Approved' },
  { shipment_id: 'MOCK002', shipment_status: 'Approved' },
  { shipment_id: 'MOCK003', shipment_status: 'Pending' },
  { shipment_id: 'MOCK004', shipment_status: 'Hold' },
  { shipment_id: 'MOCK005', shipment_status: 'Delivered' },
  { shipment_id: 'MOCK006', shipment_status: 'Cancelled' },
  { shipment_id: 'MOCK007', shipment_status: 'Picked Up' },
  { shipment_id: 'MOCK008', shipment_status: 'Waiting for Pickup' },
  { shipment_id: 'MOCK009', shipment_status: 'Out for Delivery' },
  { shipment_id: 'MOCK010', shipment_status: 'In Transit' },
];

const ShipmentChartsWithFallback: React.FC<ShipmentChartProps> = ({ 
  shipments, 
  loading, 
  error 
}) => {
  // If no real data and not loading, show mock data for demonstration
  const hasRealData = shipments && shipments.length > 0;
  const showMockData = !hasRealData && !loading && !error;

  if (showMockData) {
    return (
      <div>
        <div className="demo-notice">
          <div className="alert">
            <div className="alert-content">
              <div className="alert-icon">ℹ️</div>
              <div className="alert-text">
                 No shipment data available. Showing sample data for demonstration.
              </div>
            </div>
          </div>
        </div>
        <ShipmentCharts 
          shipments={mockShipmentData}
          loading={false}
          error={null}
        />
      </div>
    );
  }

  return (
    <ShipmentCharts 
      shipments={shipments}
      loading={loading}
      error={error}
    />
  );
};

export default ShipmentChartsWithFallback;
