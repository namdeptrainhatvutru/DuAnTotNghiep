import { createSlice } from "@reduxjs/toolkit";
import { addVe, deleteVe, updateVe, updateTrangThaiVe } from "../actions/VeAction";

const initialState = {
  listve: [],
};

const VeSlice = createSlice({
  name: "ve",
  initialState,
  reducers: {
    setVe: (state, action) => {
      state.listve = action.payload;
    },
  },
  extraReducers: builder => {
    builder.addCase(addVe.fulfilled, (state, action) => {
      state.listve.push(action.payload);
    });
    builder.addCase(deleteVe.fulfilled, (state, action) => {
      state.listve = state.listve.filter(item => item.ve_id !== action.payload);
    });
    builder.addCase(updateVe.fulfilled, (state, action) => {
      const index = state.listve.findIndex(item => item.ve_id === action.payload.id);
      if (index !== -1) {
        state.listve[index] = action.payload;
      }
    });
    builder.addCase(updateTrangThaiVe.fulfilled, (state, action) => {
      const index = state.listve.findIndex(item => item.ve_id === action.payload.ve_id);
      if (index !== -1) {
        state.listve[index] = { ...state.listve[index], ...action.payload };
      }
    });
  }
});

export const { setVe } = VeSlice.actions;
export default VeSlice.reducer;