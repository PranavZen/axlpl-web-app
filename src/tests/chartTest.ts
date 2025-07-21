// Test script to verify chart functionality
import { processShipmentData, createPieChartData, createBarChartData } from '../utils/chartUtils';

// Sample shipment data for testing - including the new statuses
const sampleShipments = [
  { shipment_id: '1', shipment_status: 'approved' },
  { shipment_id: '2', shipment_status: 'approved' },
  { shipment_id: '3', shipment_status: 'pending' },
  { shipment_id: '4', shipment_status: 'hold' },
  { shipment_id: '5', shipment_status: 'picked_up' },
  { shipment_id: '6', shipment_status: 'waiting_for_pickup' },
  { shipment_id: '7', shipment_status: 'out_for_delivery' },
  { shipment_id: '8', shipment_status: 'delivered' },
  { shipment_id: '9', shipment_status: 'in_transit' },
  { shipment_id: '10', shipment_status: 'picked_up' }
];

// console.log('Testing chart data processing with new status colors...');

// Test data processing
const statusData = processShipmentData(sampleShipments);
// console.log('Status Data:', statusData);

// Test pie chart data creation
const pieData = createPieChartData(statusData);
// console.log('Pie Chart Data:', pieData);

// Test bar chart data creation
const barData = createBarChartData(statusData);
// console.log('Bar Chart Data:', barData);

// Expected output should show new statuses with custom colors:
// - Picked Up: Teal (#20c997)
// - Waiting for Pickup: Red-orange (#ff6b6b)
// - Out for Delivery: Light blue (#4dabf7)

export { sampleShipments, statusData, pieData, barData };
