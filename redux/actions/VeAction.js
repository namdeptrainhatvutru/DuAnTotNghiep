const link_ve = 'https://68431f28e1347494c31f29ef.mockapi.io/Ve';

import { createAsyncThunk } from "@reduxjs/toolkit";
import { setVe } from "../reducers/VeReducer";

// Lấy tất cả vé
export const fetchVe = () => {
    return async dispatch => {
        try {
            const response = await fetch(link_ve);
            const data = await response.json();
            dispatch(setVe(data));
        } catch (error) {
            console.error('Error fetching ve:', error);
        }
    }
}
// lấy vé theo khach_hang_id
export const fetchVeByKhachHangId = (khach_hang_id) => {
    return async dispatch => {
        try {
            const response = await fetch(`${link_ve}?khach_hang_id=${khach_hang_id}`);
            const data = await response.json();
            dispatch(setVe(data));
        } catch (error) {
            console.error('Error fetching ve by khach_hang_id:', error);
        }
    }
}

// Thêm vé
export const addVe = createAsyncThunk(
    've/addVe',
    async (ve) => {
        const response = await fetch(link_ve, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(ve)
        });
        const data = await response.json();
        if (response.ok) return data;
    }
);

// Xóa vé
export const deleteVe = createAsyncThunk(
    've/deleteVe',
    async (id) => {
        const response = await fetch(`${link_ve}/${id}`, {
            method: 'DELETE',
        });
        if (response.ok) return id;
    }
);

// Cập nhật vé
export const updateVe = createAsyncThunk(
    've/updateVe',
    async (ve) => {
        const response = await fetch(`${link_ve}/${ve.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(ve)
        });
        const data = await response.json();
        if (response.ok) return data;
    }
);

export const updateTrangThaiVe = createAsyncThunk(
  've/updateTrangThaiVe',
  async ({ ve_id, trang_thai }) => {
    const response = await fetch(`${link_ve}/${ve_id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ trang_thai }),
    });
    const data = await response.json();
    if (response.ok) return data;
  }
);

export const fetchVeById = createAsyncThunk(
  've/fetchVeById',
  async (ve_id) => {
    const response = await fetch(`${link_ve}/${ve_id}`);
    const data = await response.json();
    if (response.ok) return data;
  }
);