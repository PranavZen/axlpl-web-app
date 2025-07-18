import { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../redux/store';
import { fetchAllShipmentsForCharts } from '../redux/slices/activeShipmentSlice';
import { processShipmentData } from '../utils/chartUtils';
import { UseShipmentChartData } from '../types/chartTypes';

export const useShipmentChartData = (): UseShipmentChartData => {
  const dispatch = useDispatch<AppDispatch>();
  const { shipments, loading, error } = useSelector((state: RootState) => state.activeShipment);

  useEffect(() => {
    // Fetch all shipments using the new action designed for charts
    dispatch(fetchAllShipmentsForCharts());
  }, [dispatch]);

  const chartData = useMemo(() => {
    if (!shipments || shipments.length === 0) {
      return {
        statusData: [],
        totalShipments: 0,
        hasData: false
      };
    }

    const statusData = processShipmentData(shipments);
    return {
      statusData,
      totalShipments: shipments.length,
      hasData: true
    };
  }, [shipments]);

  return {
    shipments,
    loading,
    error,
    ...chartData
  };
};

export default useShipmentChartData;
