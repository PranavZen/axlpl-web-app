import { ChartOptions } from 'chart.js';

// Status color mapping
export const STATUS_COLORS = {
  'Pending': '#ffc107',
  'Picked up': '#17a2b8',
  'Waiting for pickup': '#fd7e14',
  'Out for delivery': '#28a745',
  'Delivered': '#20c997',
  'Hold': '#6f42c1',
  'Cancelled': '#dc3545',
  'In Transit': '#007bff',
  'Processing': '#6c757d',
  'Returned': '#e83e8c'
};

// Process shipment data for charts
export const processShipmentData = (shipments: any[]) => {
  if (!shipments || shipments.length === 0) {
    return [];
  }

  const statusCounts: { [key: string]: number } = {};
  const totalShipments = shipments.length;

  // Count shipments by status
  shipments.forEach(shipment => {
    const status = shipment.shipment_status || 'Unknown';
    statusCounts[status] = (statusCounts[status] || 0) + 1;
  });

  // Convert to array format with percentages
  return Object.entries(statusCounts).map(([status, count]) => ({
    status,
    count,
    percentage: parseFloat(((count / totalShipments) * 100).toFixed(1))
  }));
};

// Create pie chart data
export const createPieChartData = (statusData: any[]) => {
  const labels = statusData.map(item => item.status);
  const data = statusData.map(item => item.count);
  const backgroundColor = labels.map(label => STATUS_COLORS[label as keyof typeof STATUS_COLORS] || '#6c757d');

  return {
    labels,
    datasets: [{
      data,
      backgroundColor,
      borderWidth: 2,
      borderColor: '#ffffff',
      hoverBorderWidth: 3,
      hoverBorderColor: '#ffffff'
    }]
  };
};

// Create bar chart data
export const createBarChartData = (statusData: any[]) => {
  const labels = statusData.map(item => item.status);
  const data = statusData.map(item => item.count);
  const backgroundColor = labels.map(label => STATUS_COLORS[label as keyof typeof STATUS_COLORS] || '#6c757d');

  return {
    labels,
    datasets: [{
      label: 'Shipments',
      data,
      backgroundColor,
      borderRadius: 8,
      borderSkipped: false,
    }]
  };
};

// Pie chart options
export const pieChartOptions: ChartOptions<'pie'> = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false
    },
    title: {
      display: false
    },
    tooltip: {
      backgroundColor: '#123458',
      titleColor: '#ffffff',
      bodyColor: '#ffffff',
      borderColor: '#47464a',
      borderWidth: 1,
      cornerRadius: 8,
      padding: 12,
      callbacks: {
        label: function(context: any) {
          const value = context.parsed;
          const total = context.dataset.data.reduce((sum: number, val: number) => sum + val, 0);
          const percentage = ((value / total) * 100).toFixed(1);
          return `${context.label}: ${value} (${percentage}%)`;
        }
      }
    }
  }
};

// Bar chart options
export const barChartOptions: ChartOptions<'bar'> = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false
    },
    title: {
      display: false
    },
    tooltip: {
      backgroundColor: '#123458',
      titleColor: '#ffffff',
      bodyColor: '#ffffff',
      borderColor: '#47464a',
      borderWidth: 1,
      cornerRadius: 8,
      padding: 12,
      callbacks: {
        label: function(context: any) {
          const value = context.parsed.y;
          const total = context.dataset.data.reduce((sum: number, val: number) => sum + val, 0);
          const percentage = ((value / total) * 100).toFixed(1);
          return `${context.label}: ${value} (${percentage}%)`;
        }
      }
    }
  },
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        stepSize: 1,
        color: '#47464a'
      },
      grid: {
        color: '#e9ecef'
      }
    },
    x: {
      ticks: {
        color: '#47464a'
      },
      grid: {
        display: false
      }
    }
  }
};
