import { configureStore } from '@reduxjs/toolkit';
import axios from 'axios';
import paymentModeReducer, { fetchPaymentModes, clearPaymentModes } from '../paymentModeSlice';
import { getUserData } from '../../../utils/authUtils';

// Mock dependencies
jest.mock('axios');
jest.mock('../../../utils/authUtils');

const mockedAxios = axios as jest.Mocked<typeof axios>;
const mockedGetUserData = getUserData as jest.MockedFunction<typeof getUserData>;

describe('paymentModeSlice', () => {
  let store: ReturnType<typeof configureStore>;

  beforeEach(() => {
    store = configureStore({
      reducer: {
        paymentMode: paymentModeReducer,
      },
    });
    jest.clearAllMocks();
  });

  describe('fetchPaymentModes', () => {
    it('should fetch payment modes successfully', async () => {
      // Mock user data
      mockedGetUserData.mockReturnValue({
        Customerdetail: {
          token: 'test-token',
          id: 'test-id',
        },
      });

      // Mock API response
      const mockPaymentModes = [
        { id: 'prepaid', name: 'Prepaid' },
        { id: 'topay', name: 'To Pay' },
        { id: 'contract', name: 'Contract' },
      ];

      mockedAxios.get.mockResolvedValue({
        data: {
          status: 'success',
          message: 'Payment Mode List',
          data: {
            payment_modes: mockPaymentModes,
            sub_payment_modes: [
              { id: 'account', name: 'Account' },
              { id: 'cash', name: 'Cash' },
            ],
          },
        },
      });

      // Dispatch the action
      await store.dispatch(fetchPaymentModes());

      // Check the state
      const state = store.getState().paymentMode;
      expect(state.loading).toBe(false);
      expect(state.error).toBe(null);
      expect(state.paymentModes).toEqual(mockPaymentModes);
    });

    it('should handle missing token', async () => {
      // Mock user data without token
      mockedGetUserData.mockReturnValue({
        Customerdetail: {
          id: 'test-id',
        },
      });

      // Dispatch the action
      await store.dispatch(fetchPaymentModes());

      // Check the state
      const state = store.getState().paymentMode;
      expect(state.loading).toBe(false);
      expect(state.error).toBe('Authentication required');
      expect(state.paymentModes).toEqual([]);
    });

    it('should handle alternative response format', async () => {
      // Mock user data
      mockedGetUserData.mockReturnValue({
        Customerdetail: {
          token: 'test-token',
          id: 'test-id',
        },
      });

      // Mock API response with direct payment_modes array
      const mockPaymentModes = [
        { id: 'prepaid', name: 'Prepaid' },
        { id: 'topay', name: 'To Pay' },
      ];

      mockedAxios.get.mockResolvedValue({
        data: {
          payment_modes: mockPaymentModes,
        },
      });

      // Dispatch the action
      await store.dispatch(fetchPaymentModes());

      // Check the state
      const state = store.getState().paymentMode;
      expect(state.loading).toBe(false);
      expect(state.error).toBe(null);
      expect(state.paymentModes).toEqual(mockPaymentModes);
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
      mockedAxios.get.mockRejectedValue(new Error('Network error'));

      // Dispatch the action
      await store.dispatch(fetchPaymentModes());

      // Check the state
      const state = store.getState().paymentMode;
      expect(state.loading).toBe(false);
      expect(state.error).toBe('Network error');
      expect(state.paymentModes).toEqual([]);
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
      mockedAxios.get.mockResolvedValue({
        data: {
          status: 'success',
          // Missing payment_modes
        },
      });

      // Dispatch the action
      await store.dispatch(fetchPaymentModes());

      // Check the state
      const state = store.getState().paymentMode;
      expect(state.loading).toBe(false);
      expect(state.error).toBe('Invalid response format');
      expect(state.paymentModes).toEqual([]);
    });
  });

  describe('clearPaymentModes', () => {
    it('should clear payment modes and error', () => {
      // Set initial state with some data
      store.dispatch(fetchPaymentModes.fulfilled([
        { id: 'prepaid', name: 'Prepaid' }
      ], '', undefined));

      // Clear payment modes
      store.dispatch(clearPaymentModes());

      // Check the state
      const state = store.getState().paymentMode;
      expect(state.paymentModes).toEqual([]);
      expect(state.error).toBe(null);
      expect(state.loading).toBe(false);
    });
  });
});
