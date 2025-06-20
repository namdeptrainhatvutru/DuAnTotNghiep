import { createAsyncThunk } from '@reduxjs/toolkit';
import { setVoucher } from '../reducers/VoucherReducer';

const api_voucher = 'https://68431f28e1347494c31f29ef.mockapi.io/voucher';
// ...giữ nguyên import...

const convertVoucher = (v) => ({
  ...v,
  voucher_id: v.voucher_id || v.id, // Ưu tiên voucher_id, fallback sang id
});

export const fetchVoucher = () => {
  return async dispatch => {
    try {
      const response = await fetch(api_voucher);
      let data = await response.json();
      data = data.map(convertVoucher);
      dispatch(setVoucher(data));
    } catch (error) {
      console.error('Error fetching voucher:', error);
    }
  };
};
export const fetchVoucher2 = () => {
  return async dispatch => {
    try {
      const response = await fetch(`${api_voucher}?khach_hang_id=""`);
      let data = await response.json();
      data = data.map(convertVoucher);
      dispatch(setVoucher(data));
    } catch (error) {
      console.error('Error fetching voucher:', error);
    }
  };
};

export const fetchVoucherById = (id) => {
  return async dispatch => {
    try {
      const response = await fetch(`${api_voucher}?khach_hang_id=${id}`);
      let data = await response.json();
    
      dispatch(setVoucher(data));
    } catch (error) {
      console.error('Error fetching voucher:', error);
    }
  };
};

export const addVoucher = createAsyncThunk(
  'voucher/addVoucher',
  async voucher => {
    const response = await fetch(api_voucher, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(voucher),
    });
    let data = await response.json();
    data = { ...data, voucher_id: data.voucher_id || data.id };
    if (response.ok) {
      return data;
    }
  }
);

export const deleteVoucher = createAsyncThunk(
  'voucher/deleteVoucher',
  async id => {
    const response = await fetch(`${api_voucher}/${id}`, {
      method: 'DELETE',
    });
    if (response.ok) {
      return id;
    }
  }
);

export const updateVoucher = createAsyncThunk(
  'voucher/updateVoucher',
  async voucher => {
    const response = await fetch(`${api_voucher}/${voucher.voucher_id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(voucher),
    });
    let data = await response.json();
    data = { ...data, voucher_id: data.voucher_id || data.id };
    if (response.ok) {
      return data;
    }
  }
);

export const updateVoucherByMa = createAsyncThunk(
  'voucher/updatebyMaGiamGia',
  async ({ ma_voucher, khach_hang_id }) => {
    // 1. Lấy voucher theo mã
    const resGet = await fetch(`${api_voucher}?ma_voucher=${ma_voucher}`);
    const data = await resGet.json();
    if (!Array.isArray(data) || data.length === 0) {
      throw new Error('Không tìm thấy voucher');
    }
    const voucher = data[0];

    // 2. Cập nhật khach_hang_id cho voucher đó
    const resPut = await fetch(`${api_voucher}/${voucher.voucher_id || voucher.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...voucher, khach_hang_id }),
    });
    const updated = await resPut.json();
    if (resPut.ok) {
      return updated;
    }
    throw new Error('Cập nhật voucher thất bại');
  }
);