import { configureStore } from "@reduxjs/toolkit";
import adminSliceReducer from './slices/adminSlice';
import employeeSliceReducer from './slices/employeeSlice'

export const store = configureStore({
  reducer: {
    adminSlice: adminSliceReducer,
    employeeSlice: employeeSliceReducer
  },
});

export default store;
