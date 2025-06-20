import {createSlice} from '@reduxjs/toolkit';
import {
  addVoucher,
  deleteVoucher,
  updateVoucher,
  updateVoucherByMa,
} from '../actions/VoucherAction';

const initialState = {
  listvoucher: [],
};

const VoucherSlice = createSlice({
  name: 'voucher',
  initialState,
  reducers: {
    setVoucher: (state, action) => {
      state.listvoucher = action.payload;
    },
  },
  extraReducers: builder => {
    builder.addCase(addVoucher.fulfilled, (state, action) => {
      if (state.listvoucher && Array.isArray(state.listvoucher)) {
        state.listvoucher.push(action.payload);
      } else {
        state.listvoucher = [action.payload];
      }
    });
    builder.addCase(deleteVoucher.fulfilled, (state, action) => {
      const id = action.payload;
      state.listvoucher = state.listvoucher.filter(
        item => item.voucher_id !== id && item.id !== id,
      );
    });
    builder.addCase(updateVoucher.fulfilled, (state, action) => {
      const updatedVoucher = action.payload;
      const index = state.listvoucher.findIndex(
        item =>
          item.voucher_id === updatedVoucher.voucher_id ||
          item.id === updatedVoucher.voucher_id,
      );
      if (index !== -1) {
        state.listvoucher[index] = updatedVoucher;
      }
    });
    builder.addCase(updateVoucherByMa.fulfilled, (state, action) => {
    const updatedVoucher = action.payload;
    const index = state.listvoucher.findIndex(
      v =>
        v.voucher_id === updatedVoucher.voucher_id ||
        v.id === updatedVoucher.voucher_id
    );
    if (index !== -1) {
      state.listvoucher[index] = updatedVoucher;
    }
  });
  },
});

export const {setVoucher} = VoucherSlice.actions;
export default VoucherSlice.reducer;
