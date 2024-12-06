import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  employees: [],
  names: [], 
  loading: false,
  error: null,
};

export const fetchEmployees = createAsyncThunk(
  'employee/fetchEmployees',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/employees`);
      console.log(response.data)
      return response.data; 
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Something went wrong');
    }
  }
);

const employeeSlice = createSlice({
  name: 'employeeSlice',
  initialState,
  reducers: {
    addEmployee: (state, action) => {
      state.employees.push(action.payload);
      state.names.push(action.payload.name); 
      
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEmployees.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEmployees.fulfilled, (state, action) => {
        state.loading = false;
        state.employees = action.payload;
        state.names = action.payload.map((employee) => employee.name); 

      })
      .addCase(fetchEmployees.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload; 
      });
  },
});

export const { addEmployee } = employeeSlice.actions;

export default employeeSlice.reducer;
