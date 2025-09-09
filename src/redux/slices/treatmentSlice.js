import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const API_BASE = (import.meta.env.VITE_API_URL || 'http://localhost:8000/api');
const API_URL = `${API_BASE}/treatments`;

const getAuthHeaders = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  return {
    headers: {
      Authorization: `Bearer ${user?.token}`,
      'Content-Type': 'application/json',
    },
  };
};

export const fetchTreatments = createAsyncThunk(
  'treatments/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(API_URL, getAuthHeaders());
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch treatments');
    }
  }
);

export const addTreatment = createAsyncThunk(
  'treatments/add',
  async (treatmentData, { rejectWithValue }) => {
    try {
      const response = await axios.post(API_URL, treatmentData, getAuthHeaders());
      toast.success('Treatment added successfully');
      return response.data;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add treatment');
      return rejectWithValue(error.response?.data?.message || 'Failed to add treatment');
    }
  }
);

export const deleteTreatment = createAsyncThunk(
  'treatments/delete',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`${API_URL}/${id}`, getAuthHeaders());
      if (response.data?.success) {
        return id; // Return the ID of the deleted treatment
      }
      throw new Error(response.data?.message || 'Failed to delete treatment');
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to delete treatment';
      return rejectWithValue(errorMessage);
    }
  }
);

const treatmentSlice = createSlice({
  name: 'treatments',
  initialState: {
    items: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTreatments.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchTreatments.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
        state.error = null;
      })
      .addCase(fetchTreatments.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
        toast.error(action.payload);
      })
      .addCase(addTreatment.fulfilled, (state, action) => {
        state.items.push(action.payload);
        state.error = null;
      })
      .addCase(deleteTreatment.pending, (state) => {
        state.status = 'deleting';
      })
      .addCase(deleteTreatment.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = state.items.filter(item => item._id !== action.payload);
        state.error = null;
        toast.success('Treatment deleted successfully');
      })
      .addCase(deleteTreatment.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
        toast.error(action.payload);
      });
  },
});

export const selectAllTreatments = (state) => state.treatments.items;
export const selectTreatmentStatus = (state) => state.treatments.status;
export const selectTreatmentError = (state) => state.treatments.error;

export default treatmentSlice.reducer;