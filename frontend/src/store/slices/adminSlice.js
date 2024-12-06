import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { headers } from '../../utils';

const initialState = {
  laptops: [],
  categorized: {
    available: [],
    assigned: [],
    maintenance: [],
  },
  loading: false,
  error: null,
};

export const fetchLaptops = createAsyncThunk(
  'admin/fetchLaptops',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/laptops`, headers); 
      return response.data; 
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Something went wrong');
    }
  }
);

export const fetchAssignedLaptops = createAsyncThunk(
  'admin/fetchAssignedLaptops',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/laptops/assigned`, headers);
      return response.data; 
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Something went wrong');
    }
  }
);

export const fetchAvailableLaptops = createAsyncThunk(
  'admin/fetchAvailableLaptops',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/laptops/available`, headers);
      return response.data; 
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Something went wrong');
    }
  }
);

export const fetchMaintenanceLaptops = createAsyncThunk(
  'admin/fetchMaintenanceLaptops',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/laptops/maintenance`, headers);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Something went wrong');
    }
  }
);



const adminSlice = createSlice({
  name: 'adminSlice',
  initialState,
  reducers: {
    addLaptop: (state, action) => {
        state.laptops.push(action.payload); 
        if (action.payload.status === 'ASSIGNED') {
          state.categorized.assigned.push(action.payload);
        } else if (action.payload.status === 'AVAILABLE') {
          state.categorized.available.push(action.payload);
        } else if (action.payload.status === 'MAINTENANCE') {
          state.categorized.maintenance.push(action.payload);
        }
      },
      fetchLaptopsStart: (state) => {
        state.loading = true;
      },
      fetchLaptopsSuccess: (state, action) => {
        state.loading = false;
        state.laptops = action.payload;
      },
      fetchLaptopsFailure: (state, action) => {
        state.loading = false;
        state.error = action.payload;
      },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLaptops.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLaptops.fulfilled, (state, action) => {
        state.loading = false;
        state.laptops = action.payload;
        console.log(state.laptops)

        const available = [];
        const assigned = [];
        const maintenance = [];

        action.payload.forEach((laptop) => {
          if (laptop.status === 'AVAILABLE') available.push(laptop);
          else if (laptop.status === 'ASSIGNED') assigned.push(laptop);
          else if (laptop.status === 'MAINTENANCE') maintenance.push(laptop);
        });

        state.categorized = { available, assigned, maintenance };
      })
      .addCase(fetchLaptops.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(fetchAssignedLaptops.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAssignedLaptops.fulfilled, (state, action) => {
        state.loading = false;
        state.categorized.assigned = action.payload;
      })
      .addCase(fetchAssignedLaptops.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(fetchAvailableLaptops.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAvailableLaptops.fulfilled, (state, action) => {
        state.loading = false;
        state.categorized.available = action.payload;
      })
      .addCase(fetchAvailableLaptops.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(fetchMaintenanceLaptops.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMaintenanceLaptops.fulfilled, (state, action) => {
        state.loading = false;
        state.categorized.maintenance = action.payload;
      })
      .addCase(fetchMaintenanceLaptops.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { addLaptop, fetchLaptopsStart, fetchLaptopsSuccess, fetchLaptopsFailure } = adminSlice.actions;


export default adminSlice.reducer;
