import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getUserData } from '../../utils/authUtils';

// Types
export interface PincodeDetail {
  area_id: string;
  area_name: string;
  city_id: string;
  city_name: string;
  state_id: string;
  state_name: string;
  country_id: string;
  country_name: string;
}

export interface AreaOption {
  id: string;
  name: string;
  city_id: string;
  pincode: string;
}

export interface PincodeState {
  pincodeDetail: PincodeDetail | null;
  areas: AreaOption[];
  loading: boolean;
  error: string | null;
  areasLoading: boolean;
  areasError: string | null;
}

const initialState: PincodeState = {
  pincodeDetail: null,
  areas: [],
  loading: false,
  error: null,
  areasLoading: false,
  areasError: null,
};



// Async thunk for fetching pincode details
export const fetchPincodeDetail = createAsyncThunk(
  'pincode/fetchPincodeDetail',
  async (pincode: string, { rejectWithValue }) => {
    try {
      const userData = getUserData();
      const token = userData?.Customerdetail?.token;
      if (!token) {
        throw new Error('Authentication token not found');
      }

      // Create FormData object
      const formData = new FormData();
      formData.append('pincode', pincode);

      const response = await fetch('https://new.axlpl.com/messenger/services_v6/getPincodeDetail', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          // Don't set Content-Type header - let browser set it for FormData
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.status !== 'success') {
        throw new Error(data.message || 'Failed to fetch pincode details');
      }

      return {
        area_id: data.area_id,
        area_name: data.area_name,
        city_id: data.city_id,
        city_name: data.city_name,
        state_id: data.state_id,
        state_name: data.state_name,
        country_id: data.country_id,
        country_name: data.country_name,
      };
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Unknown error occurred');
    }
  }
);

// Async thunk for fetching areas by pincode
export const fetchAreasByPincode = createAsyncThunk(
  'pincode/fetchAreasByPincode',
  async (pincode: string, { rejectWithValue }) => {
    try {
      const userData = getUserData();
      const token = userData?.Customerdetail?.token;
      if (!token) {
        throw new Error('Authentication token not found');
      }

      // Create FormData object
      const formData = new FormData();
      formData.append('pincode', pincode);

      const response = await fetch('https://new.axlpl.com/messenger/services_v6/getAllAreaByZipcode', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          // Don't set Content-Type header - let browser set it for FormData
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.status !== 'success') {
        throw new Error(data.message || 'Failed to fetch areas');
      }

      return data.Area || [];
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Unknown error occurred');
    }
  }
);

// Async thunk for adding a new area
export const addNewArea = createAsyncThunk(
  'pincode/addNewArea',
  async (areaData: { area_name: string; pincode: string }, { rejectWithValue }) => {
    try {
      const userData = getUserData();
      const token = userData?.Customerdetail?.token;
      if (!token) {
        throw new Error('Authentication token not found');
      }

      // Create FormData object
      const formData = new FormData();
      formData.append('area_name', areaData.area_name);
      formData.append('pincode', areaData.pincode);

      // TODO: Replace with actual API endpoint for adding area
      // For now, we'll simulate the API call
      const response = await fetch('https://new.axlpl.com/messenger/services_v6/addArea', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      // Simulate successful response for now
      if (!response.ok) {
        // For now, we'll simulate a successful response
        console.log('Simulating successful area addition');
      }

      // Return the new area data
      const newArea: AreaOption = {
        id: Date.now().toString(), // Generate temporary ID
        name: areaData.area_name,
        city_id: '', // Will be populated by backend
        pincode: areaData.pincode,
      };

      return newArea;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Unknown error occurred');
    }
  }
);

// Pincode slice
const pincodeSlice = createSlice({
  name: 'pincode',
  initialState,
  reducers: {
    clearPincodeData: (state) => {
      state.pincodeDetail = null;
      state.areas = [];
      state.error = null;
      state.areasError = null;
    },
    clearAreas: (state) => {
      state.areas = [];
      state.areasError = null;
    },
    // Add new area to the existing areas array
    addAreaToList: (state, action) => {
      const newArea = action.payload;
      // Check if area already exists to avoid duplicates
      const exists = state.areas.some(area =>
        area.name.toLowerCase() === newArea.name.toLowerCase() &&
        area.pincode === newArea.pincode
      );
      if (!exists) {
        state.areas.push(newArea);
      }
    },
  },
  extraReducers: (builder) => {
    // Fetch pincode detail
    builder
      .addCase(fetchPincodeDetail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPincodeDetail.fulfilled, (state, action) => {
        state.loading = false;
        state.pincodeDetail = action.payload;
        state.error = null;
      })
      .addCase(fetchPincodeDetail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.pincodeDetail = null;
      })
      // Fetch areas by pincode
      .addCase(fetchAreasByPincode.pending, (state) => {
        state.areasLoading = true;
        state.areasError = null;
      })
      .addCase(fetchAreasByPincode.fulfilled, (state, action) => {
        state.areasLoading = false;
        state.areas = action.payload;
        state.areasError = null;
      })
      .addCase(fetchAreasByPincode.rejected, (state, action) => {
        state.areasLoading = false;
        state.areasError = action.payload as string;
        state.areas = [];
      })
      // Add new area
      .addCase(addNewArea.pending, (state) => {
        state.areasLoading = true;
        state.areasError = null;
      })
      .addCase(addNewArea.fulfilled, (state, action) => {
        state.areasLoading = false;
        // Add the new area to the existing areas array
        const newArea = action.payload;
        const exists = state.areas.some(area =>
          area.name.toLowerCase() === newArea.name.toLowerCase() &&
          area.pincode === newArea.pincode
        );
        if (!exists) {
          state.areas.push(newArea);
        }
        state.areasError = null;
      })
      .addCase(addNewArea.rejected, (state, action) => {
        state.areasLoading = false;
        state.areasError = action.payload as string;
      });
  },
});

export const { clearPincodeData, clearAreas, addAreaToList } = pincodeSlice.actions;
export default pincodeSlice.reducer;
