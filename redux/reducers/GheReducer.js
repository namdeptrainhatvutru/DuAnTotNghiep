import { createSlice } from "@reduxjs/toolkit";
import { addGhe, deleteGhe, deleteGheByRoomId, updateGhe } from "../actions/GheAction";

const initialState = {
  listghe: [],
};

const GheSlice = createSlice({
  name: "ghe",
  initialState,
  reducers: {
    setGhe: (state, action) => {
      state.listghe = action.payload;
    },
  },
  extraReducers: builder => {
    builder.addCase(addGhe.fulfilled, (state, action) => {
      state.listghe.push(action.payload);
    });
    builder.addCase(deleteGhe.fulfilled, (state, action) => {
      state.listghe = state.listghe.filter(item => item.seat_id !== action.payload);
    });
    builder.addCase(updateGhe.fulfilled, (state, action) => {
      const index = state.listghe.findIndex(item => item.seat_id === action.payload.seat_id);
      if (index !== -1) {
        state.listghe[index] = action.payload;
      }
    });
    builder.addCase(deleteGheByRoomId.fulfilled, (state, action) => {
      state.listghe = state.listghe.filter(item => item.room_id !== action.payload);
    });
  }
});

export const { setGhe } = GheSlice.actions;
export default GheSlice.reducer;