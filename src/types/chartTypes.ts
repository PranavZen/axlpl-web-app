// Chart-related type definitions
export interface ShipmentStatusData {
  status: string;
  count: number;
  percentage: number;
}

export interface ChartDataset {
  label: string;
  data: number[];
  backgroundColor: string[];
  borderColor: string[];
  borderWidth: number;
}

export interface ChartData {
  labels: string[];
  datasets: ChartDataset[];
}

export interface ChartOptions {
  responsive: boolean;
  maintainAspectRatio: boolean;
  plugins: {
    legend?: {
      position?: 'top' | 'bottom' | 'left' | 'right';
      labels?: {
        padding?: number;
        usePointStyle?: boolean;
        font?: {
          size?: number;
        };
      };
    };
    title?: {
      display?: boolean;
      text?: string;
      font?: {
        size?: number;
        weight?: string;
      };
    };
    tooltip?: {
      callbacks?: {
        label?: (context: any) => string;
      };
    };
  };
  scales?: {
    y?: {
      beginAtZero?: boolean;
      max?: number;
      ticks?: {
        callback?: (value: any) => string;
      };
      title?: {
        display?: boolean;
        text?: string;
      };
    };
    x?: {
      title?: {
        display?: boolean;
        text?: string;
      };
    };
  };
}

export interface ShipmentChartProps {
  shipments: any[];
  loading?: boolean;
  error?: string | null;
}

export interface UseShipmentChartData {
  shipments: any[];
  loading: boolean;
  error: string | null;
  statusData: ShipmentStatusData[];
  totalShipments: number;
  hasData: boolean;
}
