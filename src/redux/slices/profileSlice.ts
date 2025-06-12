import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { getUserData } from "../../utils/authUtils";
import { API_BASE_URL } from "../../config";

// Profile Data Interface
export interface ProfileData {
  id: string;
  company_name: string;
  full_name: string;
  category: string;
  nature_business: string;
  country_id: string;
  country_name: string;
  state_id: string;
  state_name: string;
  city_id: string;
  city_name: string;
  area_id: string;
  area_name: string;
  branch_id: string;
  branch_name: string;
  pincode: string;
  reg_address1: string;
  reg_address2: string;
  mobile_no: string;
  tel_no: string;
  fax_no: string;
  email: string;
  pan_no: string;
  gst_no: string;
  pan_card: string;
  gst_certi: string;
  reg_certi: string;
  axlpl_insurance_value: string;
  third_party_insurance_value: string;
  third_party_policy_no: string;
  third_party_exp_date: string;
  is_shipment_approve: string;
  is_send_mail: string;
  is_send_sms: string;
  cust_profile_img: string;
  path: string;
  [key: string]: any;
}

// Location Option Interface
export interface LocationOption {
  id: string;
  name: string;
}

// Profile State Interface
interface ProfileState {
  profileData: ProfileData | null;
  countries: LocationOption[];
  states: LocationOption[];
  cities: LocationOption[];
  areas: LocationOption[];
  branches: LocationOption[];
  loading: boolean;
  saving: boolean;
  error: string | null;
}

const initialState: ProfileState = {
  profileData: null,
  countries: [],
  states: [],
  cities: [],
  areas: [],
  branches: [],
  loading: false,
  saving: false,
  error: null,
};

// Async thunk for fetching profile data
export const fetchProfileData = createAsyncThunk(
  "profile/fetchProfileData",
  async (_, { rejectWithValue }) => {
    try {
      const userData = getUserData();
      if (!userData?.Customerdetail?.id) {
        return rejectWithValue("User data not found. Please login again.");
      }

      console.log('🔄 Redux: Fetching profile data for user:', {
        id: userData.Customerdetail.id,
        role: userData.role || 'customer'
      });

      const formData = new FormData();
      formData.append('id', userData.Customerdetail.id);
      formData.append('user_role', userData.role || 'customer');

      const response = await axios.post(
        `${API_BASE_URL}/editProfile`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log('✅ Redux: Profile data fetched successfully:', response.data);

      if (response.data?.Customerdetail) {
        return response.data.Customerdetail;
      } else {
        return rejectWithValue('Invalid response format');
      }
    } catch (error: any) {
      console.error('❌ Redux: Profile fetch error:', error);
      return rejectWithValue(
        error.response?.data?.message || error.message || "Failed to fetch profile data"
      );
    }
  }
);

// Async thunk for updating profile data
export const updateProfileData = createAsyncThunk(
  "profile/updateProfileData",
  async (
    {
      profileData,
      files,
    }: {
      profileData: ProfileData;
      files: {
        profileImage?: File | null;
        panCard?: File | null;
        gstCertificate?: File | null;
        regCertificate?: File | null;
      };
    },
    { rejectWithValue }
  ) => {
    try {
      const userData = getUserData();
      if (!userData?.Customerdetail?.id) {
        return rejectWithValue("User data not found. Please login again.");
      }

      console.log('💾 Redux: Starting profile update process...');
      console.log('💾 Redux: User data:', { id: userData.Customerdetail.id, role: userData.role });
      console.log('💾 Redux: Profile data to update:', profileData);

      const formData = new FormData();

      // Add user identification
      formData.append('id', userData.Customerdetail.id);
      formData.append('user_role', userData.role || 'customer');

      // Add profile data - all fields from ProfileData interface
      Object.entries(profileData).forEach(([key, value]) => {
        if (key !== 'id' && value !== null && value !== undefined && value !== '') {
          const stringValue = String(value);
          formData.append(key, stringValue);
          console.log(`💾 Redux: Adding field ${key}:`, stringValue);
        }
      });

      // Add files if provided
      if (files.profileImage) {
        formData.append('cust_profile_img', files.profileImage);
        console.log('💾 Redux: Adding profile image:', files.profileImage.name);
      }
      if (files.panCard) {
        formData.append('pan_card', files.panCard);
        console.log('💾 Redux: Adding PAN card:', files.panCard.name);
      }
      if (files.gstCertificate) {
        formData.append('gst_certi', files.gstCertificate);
        console.log('💾 Redux: Adding GST certificate:', files.gstCertificate.name);
      }
      if (files.regCertificate) {
        formData.append('reg_certi', files.regCertificate);
        console.log('💾 Redux: Adding registration certificate:', files.regCertificate.name);
      }

      console.log('💾 Redux: Making API call to:', `${API_BASE_URL}/updateProfile`);

      const response = await axios.post(
        `${API_BASE_URL}/updateProfile`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log('💾 Redux: Profile update response:', response.data);
      console.log('💾 Redux: Response status:', response.status);

      // More flexible success check
      const isSuccess = response.status === 200 ||
                       response.data?.status === 'success' ||
                       response.data?.status === 1 ||
                       response.data?.success === true ||
                       (response.data?.message && !response.data?.error);

      if (isSuccess) {
        const successMessage = response.data?.message || response.data?.msg || '✅ Profile updated successfully!';
        console.log('💾 Redux: Update successful:', successMessage);
        return {
          message: successMessage,
          data: response.data
        };
      } else {
        const errorMessage = response.data?.message || response.data?.msg || response.data?.error || 'Failed to update profile';
        console.error('💾 Redux: Update failed:', errorMessage);
        return rejectWithValue(errorMessage);
      }
    } catch (error: any) {
      console.error('❌ Redux: Profile update error:', error);
      console.error('❌ Redux: Error details:', {
        message: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        url: error.config?.url
      });

      // Handle different types of errors
      if (error.response) {
        // Server responded with error status
        const errorMessage = error.response.data?.message ||
                           error.response.data?.msg ||
                           error.response.data?.error ||
                           `Server error: ${error.response.status} ${error.response.statusText}`;
        return rejectWithValue(errorMessage);
      } else if (error.request) {
        // Network error - request was made but no response received
        return rejectWithValue("Network error: Unable to connect to server. Please check your internet connection.");
      } else {
        // Something else happened
        return rejectWithValue(error.message || "Failed to update profile");
      }
    }
  }
);

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    // Clear profile error
    clearProfileError: (state) => {
      state.error = null;
    },
    // Update profile data locally (for form changes)
    updateProfileDataLocal: (state, action) => {
      if (state.profileData) {
        state.profileData = {
          ...state.profileData,
          ...action.payload
        };
      }
    },
    // Set location data
    setLocationData: (state, action) => {
      const { countries, states, cities, areas, branches } = action.payload;
      if (countries) state.countries = countries;
      if (states) state.states = states;
      if (cities) state.cities = cities;
      if (areas) state.areas = areas;
      if (branches) state.branches = branches;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch profile data cases
      .addCase(fetchProfileData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProfileData.fulfilled, (state, action) => {
        state.loading = false;
        state.profileData = action.payload;
        state.error = null;
        
        // Set location data based on profile data
        if (action.payload) {
          state.countries = action.payload.country_name ? [{ id: action.payload.country_id, name: action.payload.country_name }] : [];
          state.states = action.payload.state_name ? [{ id: action.payload.state_id, name: action.payload.state_name }] : [];
          state.cities = action.payload.city_name ? [{ id: action.payload.city_id, name: action.payload.city_name }] : [];
          state.areas = action.payload.area_name ? [{ id: action.payload.area_id, name: action.payload.area_name }] : [];
          state.branches = action.payload.branch_name ? [{ id: action.payload.branch_id, name: action.payload.branch_name }] : [];
        }
      })
      .addCase(fetchProfileData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Update profile data cases
      .addCase(updateProfileData.pending, (state) => {
        state.saving = true;
        state.error = null;
      })
      .addCase(updateProfileData.fulfilled, (state, action) => {
        state.saving = false;
        state.error = null;
        // The component will handle success message and refresh
      })
      .addCase(updateProfileData.rejected, (state, action) => {
        state.saving = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearProfileError, updateProfileDataLocal, setLocationData } = profileSlice.actions;

// Selectors
export const selectProfileData = (state: any) => state.profile.profileData;
export const selectProfileLoading = (state: any) => state.profile.loading;
export const selectProfileSaving = (state: any) => state.profile.saving;
export const selectProfileError = (state: any) => state.profile.error;
export const selectCountries = (state: any) => state.profile.countries;
export const selectStates = (state: any) => state.profile.states;
export const selectCities = (state: any) => state.profile.cities;
export const selectAreas = (state: any) => state.profile.areas;
export const selectBranches = (state: any) => state.profile.branches;

export default profileSlice.reducer;
