import { configureStore } from '@reduxjs/toolkit';
import axios from 'axios';
import customerReducer, { fetchCustomers, clearCustomers } from '../customerSlice';
import { getUserData } from '../../../utils/authUtils';

// Mock dependencies
jest.mock('axios');
jest.mock('../../../utils/authUtils');

const mockedAxios = axios as jest.Mocked<typeof axios>;
const mockedGetUserData = getUserData as jest.MockedFunction<typeof getUserData>;

describe('customerSlice', () => {
  let store: ReturnType<typeof configureStore>;

  beforeEach(() => {
    store = configureStore({
      reducer: {
        customer: customerReducer,
      },
    });
    jest.clearAllMocks();
  });

  describe('fetchCustomers', () => {
    it('should fetch customers successfully', async () => {
      // Mock user data
      mockedGetUserData.mockReturnValue({
        Customerdetail: {
          token: 'test-token',
          id: 'test-id',
        },
      });

      // Mock API response
      const mockCustomers = [
        {
          id: '1',
          full_name: 'John Doe',
          company_name: 'Test Company',
          pincode: '123456',
          state_name: 'Test State',
          city_name: 'Test City',
          area_name: 'Test Area',
          gst_no: 'TEST123',
          address1: 'Test Address 1',
          address2: 'Test Address 2',
          mobile_no: '1234567890',
          email: 'test@example.com',
        },
      ];

      mockedAxios.get.mockResolvedValue({
        data: {
          status: 'success',
          Customers: mockCustomers,
        },
      });

      // Dispatch the action
      const params = { branch_id: '1', m_id: '1', next_id: '0' };
      await store.dispatch(fetchCustomers(params));

      // Check the state
      const state = store.getState().customer;
      expect(state.loading).toBe(false);
      expect(state.error).toBe(null);
      expect(state.customers).toEqual(mockCustomers);
    });

    it('should handle authentication error', async () => {
      // Mock no user data
      mockedGetUserData.mockReturnValue(null);

      // Dispatch the action
      const params = { branch_id: '1', m_id: '1', next_id: '0' };
      await store.dispatch(fetchCustomers(params));

      // Check the state
      const state = store.getState().customer;
      expect(state.loading).toBe(false);
      expect(state.error).toBe('Authentication required');
      expect(state.customers).toEqual([]);
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
      mockedAxios.get.mockRejectedValue(new Error('API Error'));

      // Dispatch the action
      const params = { branch_id: '1', m_id: '1', next_id: '0' };
      await store.dispatch(fetchCustomers(params));

      // Check the state
      const state = store.getState().customer;
      expect(state.loading).toBe(false);
      expect(state.error).toBe('API Error');
      expect(state.customers).toEqual([]);
    });
  });

  describe('clearCustomers', () => {
    it('should clear customers and error', () => {
      // Set initial state with customers and error
      store.dispatch(fetchCustomers.fulfilled([{ id: '1', full_name: 'Test' } as any], '', { branch_id: '1', m_id: '1', next_id: '0' }));
      store.dispatch(fetchCustomers.rejected({ message: 'Test error' } as any, '', { branch_id: '1', m_id: '1', next_id: '0' }));

      // Clear customers
      store.dispatch(clearCustomers());

      // Check the state
      const state = store.getState().customer;
      expect(state.customers).toEqual([]);
      expect(state.error).toBe(null);
    });
  });
});
