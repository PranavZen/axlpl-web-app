import { configureStore } from '@reduxjs/toolkit';
import axios from 'axios';
import serviceTypeReducer, { fetchServiceTypes, clearServiceTypes } from '../serviceTypeSlice';
import { getUserData } from '../../../utils/authUtils';

// Mock dependencies
jest.mock('axios');
jest.mock('../../../utils/authUtils');

const mockedAxios = axios as jest.Mocked<typeof axios>;
const mockedGetUserData = getUserData as jest.MockedFunction<typeof getUserData>;

describe('serviceTypeSlice', () => {
  let store: ReturnType<typeof configureStore>;

  beforeEach(() => {
    store = configureStore({
      reducer: {
        serviceType: serviceTypeReducer,
      },
    });
    jest.clearAllMocks();
  });

  describe('fetchServiceTypes', () => {
    it('should fetch service types successfully', async () => {
      // Mock user data
      mockedGetUserData.mockReturnValue({
        Customerdetail: {
          token: 'test-token',
          id: 'test-id',
        },
      });

      // Mock API response
      const mockServiceTypes = [
        {
          id: '1',
          name: 'Normal Delivery',
          price: '0',
          hsn_sac_value: '996812',
        },
        {
          id: '2',
          name: 'Express Delivery',
          price: '0',
          hsn_sac_value: '996812',
        },
        {
          id: '4',
          name: 'Exhibition Shipment',
          price: '0',
          hsn_sac_value: '996812',
        },
      ];

      mockedAxios.post.mockResolvedValue({
        data: {
          status: 'success',
          message: 'Services data found',
          Services: mockServiceTypes,
        },
      });

      // Dispatch the action
      await store.dispatch(fetchServiceTypes());

      // Check the state
      const state = store.getState().serviceType;
      expect(state.loading).toBe(false);
      expect(state.error).toBe(null);
      expect(state.serviceTypes).toEqual(mockServiceTypes);
    });

    it('should handle missing token', async () => {
      // Mock user data without token
      mockedGetUserData.mockReturnValue({
        Customerdetail: {
          id: 'test-id',
        },
      });

      // Dispatch the action
      await store.dispatch(fetchServiceTypes());

      // Check the state
      const state = store.getState().serviceType;
      expect(state.loading).toBe(false);
      expect(state.error).toBe('Authentication required');
      expect(state.serviceTypes).toEqual([]);
    });

    it('should handle alternative response format', async () => {
      // Mock user data
      mockedGetUserData.mockReturnValue({
        Customerdetail: {
          token: 'test-token',
          id: 'test-id',
        },
      });

      // Mock API response with direct array
      const mockServiceTypes = [
        {
          id: '1',
          name: 'Normal Delivery',
          price: '0',
          hsn_sac_value: '996812',
        },
      ];

      mockedAxios.post.mockResolvedValue({
        data: mockServiceTypes,
      });

      // Dispatch the action
      await store.dispatch(fetchServiceTypes());

      // Check the state
      const state = store.getState().serviceType;
      expect(state.loading).toBe(false);
      expect(state.error).toBe(null);
      expect(state.serviceTypes).toEqual(mockServiceTypes);
    });

    it('should handle API error', async () => {
      // Mock user data
      mockedGetUserData.mockReturnValue({
        Customerdetail: {
          token: 'test-token',
          id: 'test-id',
        },
      });

      // Mock API error
      mockedAxios.post.mockRejectedValue(new Error('Network error'));

      // Dispatch the action
      await store.dispatch(fetchServiceTypes());

      // Check the state
      const state = store.getState().serviceType;
      expect(state.loading).toBe(false);
      expect(state.error).toBe('Network error');
      expect(state.serviceTypes).toEqual([]);
    });

    it('should handle invalid response format', async () => {
      // Mock user data
      mockedGetUserData.mockReturnValue({
        Customerdetail: {
          token: 'test-token',
          id: 'test-id',
        },
      });

      // Mock API response with invalid format
      mockedAxios.post.mockResolvedValue({
        data: {
          status: 'success',
          // Missing Services array
        },
      });

      // Dispatch the action
      await store.dispatch(fetchServiceTypes());

      // Check the state
      const state = store.getState().serviceType;
      expect(state.loading).toBe(false);
      expect(state.error).toBe('Invalid response format');
      expect(state.serviceTypes).toEqual([]);
    });
  });

  describe('clearServiceTypes', () => {
    it('should clear service types and error', () => {
      // Set initial state with some data
      store.dispatch(fetchServiceTypes.fulfilled([
        {
          id: '1',
          name: 'Normal Delivery',
          price: '0',
          hsn_sac_value: '996812',
        }
      ], '', undefined));

      // Clear service types
      store.dispatch(clearServiceTypes());

      // Check the state
      const state = store.getState().serviceType;
      expect(state.serviceTypes).toEqual([]);
      expect(state.error).toBe(null);
      expect(state.loading).toBe(false);
    });
  });
});
