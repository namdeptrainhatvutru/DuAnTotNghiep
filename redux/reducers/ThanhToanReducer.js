import { createSlice } from "@reduxjs/toolkit";
import { addThanhToan, deleteThanhToan, updateThanhToan } from "../actions/ThanhToanAction";

const initialState = {
  listthanhtoan: [],
};

const ThanhToanSlice = createSlice({
  name: "thanhtoan",
  initialState,
  reducers: {
    setThanhToan: (state, action) => {
      state.listthanhtoan = action.payload;
    },
  },
  extraReducers: builder => {
    builder.addCase(addThanhToan.fulfilled, (state, action) => {
      state.listthanhtoan.push(action.payload);
    });
    builder.addCase(deleteThanhToan.fulfilled, (state, action) => {
      state.listthanhtoan = state.listthanhtoan.filter(item => item.thanh_toan_id !== action.payload);
    });
    builder.addCase(updateThanhToan.fulfilled, (state, action) => {
      const index = state.listthanhtoan.findIndex(item => item.thanh_toan_id === action.payload.thanh_toan_id);
      if (index !== -1) {
        state.listthanhtoan[index] = action.payload;
      }
    });
  }
});

export const { setThanhToan } = ThanhToanSlice.actions;
export default ThanhToanSlice.reducer;