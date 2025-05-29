import { configureStore } from '@reduxjs/toolkit';
import axios from 'axios';
import categoryReducer, { fetchCategories } from '../categorySlice';
import { getUserData } from '../../../utils/authUtils';

// Mock dependencies
jest.mock('axios');
jest.mock('../../../utils/authUtils');

const mockedAxios = axios as jest.Mocked<typeof axios>;
const mockedGetUserData = getUserData as jest.MockedFunction<typeof getUserData>;

describe('categorySlice', () => {
  let store: ReturnType<typeof configureStore>;

  beforeEach(() => {
    store = configureStore({
      reducer: {
        category: categoryReducer,
      },
    });
    jest.clearAllMocks();
  });

  describe('fetchCategories', () => {
    it('should fetch categories successfully', async () => {
      // Mock user data
      mockedGetUserData.mockReturnValue({
        Customerdetail: {
          token: 'test-token',
          id: 'test-id',
        },
      });

      // Mock API response
      const mockCategories = [
        { id: '1', name: 'Document', product_unit: 'piece' },
        { id: '2', name: 'Parcel', product_unit: 'kg' },
      ];

      mockedAxios.get.mockResolvedValue({
        data: {
          Category: mockCategories,
        },
      });

      // Dispatch the action
      await store.dispatch(fetchCategories());

      // Check the state
      const state = store.getState().category;
      expect(state.loading).toBe(false);
      expect(state.error).toBe(null);
      expect(state.categories).toEqual(mockCategories);
    });

    it('should handle authentication error', async () => {
      // Mock no user data
      mockedGetUserData.mockReturnValue(null);

      // Dispatch the action
      await store.dispatch(fetchCategories());

      // Check the state
      const state = store.getState().category;
      expect(state.loading).toBe(false);
      expect(state.error).toBe('Authentication required');
      expect(state.categories).toEqual([]);
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
      await store.dispatch(fetchCategories());

      // Check the state
      const state = store.getState().category;
      expect(state.loading).toBe(false);
      expect(state.error).toBe('Network error');
      expect(state.categories).toEqual([]);
    });
  });
});
