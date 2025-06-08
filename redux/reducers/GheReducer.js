import {createSlice} from '@reduxjs/toolkit';
import {
  addGhe,
  deleteGhe,
  deleteGheByRoomId,
  updateGhe,
  updateNhieuGhe,
} from '../actions/GheAction';

const initialState = {
  listghe: [],
};

const GheSlice = createSlice({
  name: 'ghe',
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
      state.listghe = state.listghe.filter(
        item => item.seat_id !== action.payload,
      );
    });
    builder.addCase(updateGhe.fulfilled, (state, action) => {
      const index = state.listghe.findIndex(
        item => item.seat_id === action.payload.seat_id,
      );
      if (index !== -1) {
        state.listghe[index] = action.payload;
      }
    });
    builder.addCase(deleteGheByRoomId.fulfilled, (state, action) => {
      state.listghe = state.listghe.filter(
        item => item.room_id !== action.payload,
      );
    });
    builder.addCase(updateNhieuGhe.fulfilled, (state, action) => {
      // action.payload là mảng các vi_tri ghế đã chọn
      state.listghe = state.listghe.map(ghe =>
        action.payload.includes(ghe.vi_tri)
          ? {...ghe, trang_thai: 'đã chọn'}
          : ghe,
      );
    });
  },
});

export const {setGhe} = GheSlice.actions;
export default GheSlice.reducer;
