import { configureStore } from '@reduxjs/toolkit';
import axios from 'axios';
import commodityReducer, { fetchCommodities, clearCommodities } from '../commoditySlice';
import { getUserData } from '../../../utils/authUtils';

// Mock dependencies
jest.mock('axios');
jest.mock('../../../utils/authUtils');

const mockedAxios = axios as jest.Mocked<typeof axios>;
const mockedGetUserData = getUserData as jest.MockedFunction<typeof getUserData>;

describe('commoditySlice', () => {
  let store: ReturnType<typeof configureStore>;

  beforeEach(() => {
    store = configureStore({
      reducer: {
        commodity: commodityReducer,
      },
    });
    jest.clearAllMocks();
  });

  describe('fetchCommodities', () => {
    it('should fetch commodities successfully', async () => {
      // Mock user data
      mockedGetUserData.mockReturnValue({
        Customerdetail: {
          token: 'test-token',
          id: 'test-id',
        },
      });

      // Mock API response
      const mockCommodities = [
        { id: '1', name: 'STUDDED JEWELLERY', category_id: '1' },
        { id: '2', name: 'GOLD JEWELLERY', category_id: '1' },
      ];

      mockedAxios.post.mockResolvedValue({
        data: {
          status: 'success',
          message: 'Commodity data found',
          Commodity: mockCommodities,
        },
      });

      // Dispatch the action
      await store.dispatch(fetchCommodities('1'));

      // Check the state
      const state = store.getState().commodity;
      expect(state.loading).toBe(false);
      expect(state.error).toBe(null);
      expect(state.commodities).toEqual(mockCommodities);
    });

    it('should handle missing token', async () => {
      // Mock user data without token
      mockedGetUserData.mockReturnValue({
        Customerdetail: {
          id: 'test-id',
        },
      });

      // Dispatch the action
      await store.dispatch(fetchCommodities('1'));

      // Check the state
      const state = store.getState().commodity;
      expect(state.loading).toBe(false);
      expect(state.error).toBe('Authentication required');
      expect(state.commodities).toEqual([]);
    });

    it('should handle missing category ID', async () => {
      // Mock user data
      mockedGetUserData.mockReturnValue({
        Customerdetail: {
          token: 'test-token',
          id: 'test-id',
        },
      });

      // Dispatch the action with empty category ID
      await store.dispatch(fetchCommodities(''));

      // Check the state
      const state = store.getState().commodity;
      expect(state.loading).toBe(false);
      expect(state.error).toBe('Category ID is required');
      expect(state.commodities).toEqual([]);
    });

    it('should handle 204 No Content response', async () => {
      // Mock user data
      mockedGetUserData.mockReturnValue({
        Customerdetail: {
          token: 'test-token',
          id: 'test-id',
        },
      });

      // Mock 204 response
      mockedAxios.post.mockResolvedValue({
        status: 204,
        data: null,
      });

      // Dispatch the action
      await store.dispatch(fetchCommodities('1'));

      // Check the state
      const state = store.getState().commodity;
      expect(state.loading).toBe(false);
      expect(state.error).toBe(null);
      expect(state.commodities).toEqual([]);
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
      await store.dispatch(fetchCommodities('1'));

      // Check the state
      const state = store.getState().commodity;
      expect(state.loading).toBe(false);
      expect(state.error).toBe('Network error');
      expect(state.commodities).toEqual([]);
    });
  });

  describe('clearCommodities', () => {
    it('should clear commodities and error', () => {
      // Set initial state with some data
      store.dispatch(fetchCommodities.fulfilled([
        { id: '1', name: 'Test Commodity', category_id: '1' }
      ], '', '1'));

      // Clear commodities
      store.dispatch(clearCommodities());

      // Check the state
      const state = store.getState().commodity;
      expect(state.commodities).toEqual([]);
      expect(state.error).toBe(null);
      expect(state.loading).toBe(false);
    });
  });

  describe('commodity filtering by category', () => {
    it('should return commodities that match the category ID', async () => {
      // Mock user data
      mockedGetUserData.mockReturnValue({
        Customerdetail: {
          token: 'test-token',
          id: 'test-id',
        },
      });

      // Mock API response with commodities for category "1"
      const mockCommodities = [
        { id: '1', name: 'STUDDED JEWELLERY', category_id: '1' },
        { id: '2', name: 'GOLD JEWELLERY', category_id: '1' },
        { id: '3', name: 'Silver Jewellery', category_id: '1' },
      ];

      mockedAxios.post.mockResolvedValue({
        data: {
          status: 'success',
          message: 'Commodity data found',
          Commodity: mockCommodities,
        },
      });

      // Dispatch the action with category ID "1"
      await store.dispatch(fetchCommodities('1'));

      // Check that all returned commodities have category_id "1"
      const state = store.getState().commodity;
      expect(state.commodities).toEqual(mockCommodities);
      expect(state.commodities.every(commodity => commodity.category_id === '1')).toBe(true);
    });
  });
});
