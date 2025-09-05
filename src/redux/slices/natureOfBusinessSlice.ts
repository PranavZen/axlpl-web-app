
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { API_BASE_URL } from "../../config";
export interface NatureItem {
  name: string;
  value: string;
}

interface NatureState {
  items: NatureItem[];
  loading: boolean;
  error: string | null;
}

const initialState: NatureState = {
  items: [],
  loading: false,
  error: null,
};

export const fetchNatureOfBusiness = createAsyncThunk<
  NatureItem[],
  void,
  { rejectValue: string }
>("natureOfBusiness/fetchAll", async (_, { rejectWithValue }) => {
  try {
    const url =
      `${API_BASE_URL}/get_nature_of_business`;
    const res = await axios.get(url);
    // API shape:
    // { status, message, nature_of_business: [{name, value}, ...] }
    if (Array.isArray(res.data?.nature_of_business)) {
      return res.data.nature_of_business as NatureItem[];
    }
    return rejectWithValue("Invalid response format");
  } catch (e: any) {
    return rejectWithValue(e?.response?.data?.message || e.message);
  }
});

const natureOfBusinessSlice = createSlice({
  name: "natureOfBusiness",
  initialState,
  reducers: {},
  extraReducers: (b) => {
    b.addCase(fetchNatureOfBusiness.pending, (s) => {
      s.loading = true;
      s.error = null;
    });
    b.addCase(fetchNatureOfBusiness.fulfilled, (s, a) => {
      s.loading = false;
      s.items = a.payload;
    });
    b.addCase(fetchNatureOfBusiness.rejected, (s, a) => {
      s.loading = false;
      s.error = a.payload ?? "Failed to load nature of business";
    });
  },
});

export default natureOfBusinessSlice.reducer;
