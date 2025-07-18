// Chart utility functions for shipment data processing
import { ShipmentStatusData, ChartData } from '../types/chartTypes';

// Color palette for different shipment statuses
export const STATUS_COLORS = {
  'approved': '#28a745',
  'pending': '#ffc107',
  'hold': '#dc3545',
  'archived': '#6c757d',
  'delivered': '#17a2b8',
  'in_transit': '#007bff',
  'cancelled': '#fd7e14',
  'returned': '#e83e8c',
  'picked_up': '#20c997',          // Teal color for picked up
  'waiting_for_pickup': '#ff6b6b',  // Red-orange for waiting for pickup
  'out_for_delivery': '#4dabf7',    // Light blue for out for delivery
  // Alternative status names that might come from API
  'active': '#28a745',
  'inactive': '#6c757d',
  'shipped': '#007bff',
  'processing': '#ffc107',
  'completed': '#17a2b8',
  'default': '#6f42c1'
};

// Status name mapping in case API returns different names
const STATUS_MAPPING: { [key: string]: string } = {
  'active': 'approved',
  'inactive': 'hold',
  'shipped': 'in_transit',
  'processing': 'pending',
  'completed': 'delivered',
  'pickup': 'picked_up',
  'waiting pickup': 'waiting_for_pickup',
  'out for delivery': 'out_for_delivery',
  'in transit': 'in_transit'
};

// Process shipment data to get status-wise count and percentage
export const processShipmentData = (shipments: any[]): ShipmentStatusData[] => {
  console.log('📊 Processing shipment data:', shipments?.length || 0, 'shipments');
  
  if (!shipments || shipments.length === 0) {
    console.log('📊 No shipments data to process');
    return [];
  }

  // Count shipments by status
  const statusCounts: { [key: string]: number } = {};
  
  shipments.forEach((shipment, index) => {
    let status = shipment.shipment_status?.toLowerCase() || 'unknown';
    
    // Apply status mapping if needed
    if (STATUS_MAPPING[status]) {
      status = STATUS_MAPPING[status];
    }
    
    // Normalize status (replace spaces with underscores)
    status = status.replace(/\s+/g, '_');
    
    statusCounts[status] = (statusCounts[status] || 0) + 1;
    
    // Log first few shipments for debugging
    if (index < 5) {
      console.log(`📊 Shipment ${index + 1}: original = "${shipment.shipment_status}", normalized = "${status}"`);
    }
  });

  console.log('📊 Status counts:', statusCounts);

  const totalShipments = shipments.length;
  
  // Convert to array with percentages
  const statusData: ShipmentStatusData[] = Object.entries(statusCounts).map(([status, count]) => ({
    status: status.charAt(0).toUpperCase() + status.slice(1),
    count,
    percentage: Math.round((count / totalShipments) * 100)
  }));

  // Sort by count (descending)
  const sortedData = statusData.sort((a, b) => b.count - a.count);
  console.log('📊 Processed status data:', sortedData);
  
  return sortedData;
};

// Get color for a given status
export const getStatusColor = (status: string): string => {
  let normalizedStatus = status.toLowerCase().replace(/\s+/g, '_');
  
  // Apply status mapping if needed
  if (STATUS_MAPPING[normalizedStatus]) {
    normalizedStatus = STATUS_MAPPING[normalizedStatus];
  }
  
  return STATUS_COLORS[normalizedStatus as keyof typeof STATUS_COLORS] || STATUS_COLORS.default;
};

// Create data for Pie Chart
export const createPieChartData = (statusData: ShipmentStatusData[]): ChartData => {
  const labels = statusData.map(item => item.status);
  const data = statusData.map(item => item.percentage);
  const backgroundColor = statusData.map(item => getStatusColor(item.status));
  const borderColor = backgroundColor.map(color => color);

  return {
    labels,
    datasets: [
      {
        label: 'Shipment Status Distribution (%)',
        data,
        backgroundColor,
        borderColor,
        borderWidth: 1
      }
    ]
  };
};

// Create data for Bar Chart
export const createBarChartData = (statusData: ShipmentStatusData[]): ChartData => {
  const labels = statusData.map(item => item.status);
  const data = statusData.map(item => item.percentage);
  const backgroundColor = statusData.map(item => getStatusColor(item.status));
  const borderColor = backgroundColor.map(color => color);

  return {
    labels,
    datasets: [
      {
        label: 'Shipment Status Distribution (%)',
        data,
        backgroundColor,
        borderColor,
        borderWidth: 1
      }
    ]
  };
};

// Chart options for Pie Chart
export const pieChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom' as const,
      labels: {
        padding: 24,
        usePointStyle: true,
        pointStyle: 'circle',
        font: {
          size: 13,
          family: 'Work Sans',
          weight: '500'
        },
        color: '#123458',
        boxWidth: 12,
        boxHeight: 12
      }
    },
    title: {
      display: false // We'll handle title in React component
    },
    tooltip: {
      backgroundColor: '#123458',
      titleColor: '#ffffff',
      titleFont: {
        size: 14,
        family: 'Work Sans',
        weight: '600'
      },
      bodyColor: '#ffffff',
      bodyFont: {
        size: 13,
        family: 'Work Sans',
        weight: '500'
      },
      borderColor: '#47464a',
      borderWidth: 1,
      cornerRadius: 8,
      padding: 12,
      callbacks: {
        label: function(context: any) {
          return `${context.label}: ${context.parsed}%`;
        }
      }
    }
  },
  elements: {
    arc: {
      borderWidth: 2,
      borderColor: '#ffffff',
      hoverBorderWidth: 3,
      hoverBorderColor: '#ffffff'
    }
  }
};

// Chart options for Bar Chart
export const barChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false
    },
    title: {
      display: false // We'll handle title in React component
    },
    tooltip: {
      backgroundColor: '#123458',
      titleColor: '#ffffff',
      titleFont: {
        size: 14,
        family: 'Work Sans',
        weight: '600'
      },
      bodyColor: '#ffffff',
      bodyFont: {
        size: 13,
        family: 'Work Sans',
        weight: '500'
      },
      borderColor: '#47464a',
      borderWidth: 1,
      cornerRadius: 8,
      padding: 12,
      callbacks: {
        label: function(context: any) {
          return `${context.label}: ${context.parsed}%`;
        }
      }
    }
  },
  scales: {
    y: {
      beginAtZero: true,
      max: 100,
      grid: {
        color: '#f1f3f4',
        lineWidth: 1
      },
      ticks: {
        color: '#47464a',
        font: {
          size: 12,
          family: 'Work Sans',
          weight: '500'
        },
        callback: function(value: any) {
          return value + '%';
        }
      },
      title: {
        display: true,
        text: 'Percentage (%)',
        color: '#123458',
        font: {
          size: 14,
          family: 'Work Sans',
          weight: '600'
        }
      }
    },
    x: {
      grid: {
        display: false
      },
      ticks: {
        color: '#47464a',
        font: {
          size: 12,
          family: 'Work Sans',
          weight: '500'
        },
        maxRotation: 45,
        minRotation: 0
      },
      title: {
        display: true,
        text: 'Shipment Status',
        color: '#123458',
        font: {
          size: 14,
          family: 'Work Sans',
          weight: '600'
        }
      }
    }
  },
  elements: {
    bar: {
      borderRadius: 4,
      borderSkipped: false,
      borderWidth: 0,
      hoverBackgroundColor: function(context: any) {
        // Slightly darker version of the bar color on hover
        const color = context.element.options.backgroundColor;
        return color + 'DD'; // Add alpha for darker effect
      }
    }
  }
};
