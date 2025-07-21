import React, { useEffect } from 'react';
import ShipmentChartsWithFallback from '../../ui/charts/ShipmentChartsWithFallback';
import useShipmentChartData from '../../../hooks/useShipmentChartData';

const ChartsBox: React.FC = () => {
  const { shipments, loading, error } = useShipmentChartData();

  // Debug: Log the shipment data to see what we're receiving
  useEffect(() => {
    if (shipments && shipments.length > 0) {
      
      
      
      // Count statuses for debugging
      const statusCounts: { [key: string]: number } = {};
      shipments.forEach(shipment => {
        const status = shipment.shipment_status?.toLowerCase() || 'unknown';
        statusCounts[status] = (statusCounts[status] || 0) + 1;
      });
      
    }
  }, [shipments, loading, error]);

  return (
    <div className="chartsBox">
      <ShipmentChartsWithFallback 
        shipments={shipments}
        loading={loading}
        error={error}
      />
    </div>
  );
};

export default ChartsBox;
