// src/redux/slices/pincodeSlice.ts
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

/** Details returned by getPincodeDetailForRegistration */
export interface RegisterPincodeDetail {
  area_id: string;
  area_name: string;
  city_id: string;
  city_name: string;
  state_id: string;
  state_name: string;
  country_id: string;
  country_name: string;
}

/** Area rows returned by getAllAreaByZipcodeForRegistration */
export interface RegisterAreaItem {
  id: string;
  name: string; // may be empty sometimes
  city_id: string;
  pincode: string;
}

interface RegisterPincodeState {
  detail: RegisterPincodeDetail | null;
  detailLoading: boolean;
  detailError: string | null;

  areas: RegisterAreaItem[];
  areasLoading: boolean;
  areasError: string | null;
}

const initialState: RegisterPincodeState = {
  detail: null,
  detailLoading: false,
  detailError: null,

  areas: [],
  areasLoading: false,
  areasError: null,
};

export const fetchRegisterPincodeDetail = createAsyncThunk<
  RegisterPincodeDetail,
  string,
  { rejectValue: string }
>("pincode/fetchDetail", async (pincode, { rejectWithValue }) => {
  try {
    const fd = new FormData();
    fd.append("pincode", pincode);
    const res = await axios.post(
      "https://new.axlpl.com/messenger/services_v6/getPincodeDetailForRegistration",
      fd
    );
    const d = res.data;
    if (d?.status === "success" && d?.city_id) {
      // Normalize to our interface
      const detail: RegisterPincodeDetail = {
        area_id: d.area_id,
        area_name: d.area_name,
        city_id: d.city_id,
        city_name: d.city_name,
        state_id: d.state_id,
        state_name: d.state_name,
        country_id: d.country_id,
        country_name: d.country_name,
      };
      return detail;
    }
    return rejectWithValue("Invalid response for pincode detail");
  } catch (e: any) {
    return rejectWithValue(e?.response?.data?.message || e.message);
  }
});

export const fetchRegisterAreasByPincode = createAsyncThunk<
  RegisterAreaItem[],
  string,
  { rejectValue: string }
>("pincode/fetchAreas", async (pincode, { rejectWithValue }) => {
  try {
    const fd = new FormData();
    fd.append("pincode", pincode);
    const res = await axios.post(
      "https://new.axlpl.com/messenger/services_v6/getAllAreaByZipcodeForRegistration",
      fd
    );
    const d = res.data;
    if (Array.isArray(d?.Area)) {
      return d.Area as RegisterAreaItem[];
    }
    return rejectWithValue("Invalid response for areas");
  } catch (e: any) {
    return rejectWithValue(e?.response?.data?.message || e.message);
  }
});

const registerPincodeSlice = createSlice({
  name: "registerPincode",
  initialState,
  reducers: {
    clearPincodeData(state) {
      state.detail = null;
      state.areas = [];
      state.detailError = null;
      state.areasError = null;
    },
  },
  extraReducers: (b) => {
    // detail
    b.addCase(fetchRegisterPincodeDetail.pending, (s) => {
      s.detailLoading = true;
      s.detailError = null;
      s.detail = null;
    });
    b.addCase(fetchRegisterPincodeDetail.fulfilled, (s, a) => {
      s.detailLoading = false;
      s.detail = a.payload;
    });
    b.addCase(fetchRegisterPincodeDetail.rejected, (s, a) => {
      s.detailLoading = false;
      s.detailError = a.payload ?? "Failed to fetch pincode detail";
      s.detail = null;
    });

    // areas
    b.addCase(fetchRegisterAreasByPincode.pending, (s) => {
      s.areasLoading = true;
      s.areasError = null;
      s.areas = [];
    });
    b.addCase(fetchRegisterAreasByPincode.fulfilled, (s, a) => {
      s.areasLoading = false;
      s.areas = a.payload;
    });
    b.addCase(fetchRegisterAreasByPincode.rejected, (s, a) => {
      s.areasLoading = false;
      s.areasError = a.payload ?? "Failed to fetch areas";
      s.areas = [];
    });
  },
});

export const { clearPincodeData } = registerPincodeSlice.actions;
export default registerPincodeSlice.reducer;
