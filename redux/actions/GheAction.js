const link_ghe = `http://${BASE}:3000/ghe`;

import { createAsyncThunk } from "@reduxjs/toolkit";
import { setGhe } from "../reducers/GheReducer";
import BASE from "../../config/BaseUrl";

// Lấy tất cả ghế
export const fetchGhe = () => {
    return async dispatch => {
        try {
            const response = await fetch(link_ghe);
            const data = await response.json();
            dispatch(setGhe(data));
        } catch (error) {
            console.error('Error fetching ghe:', error);
        }
    }
}
//lấy ghế theo room_id
export const fetchGheByRoomId = (room_id) => {
    return async dispatch => {
        try {
            const response = await fetch(`${link_ghe}?room_id=${room_id}`);
            const data = await response.json();
            dispatch(setGhe(data));
        } catch (error) {
            console.error('Error fetching ghe by room_id:', error);
        }
    }
}

// Thêm ghế
export const addGhe = createAsyncThunk(
    'ghe/addGhe',
    async (ghe) => {
        const response = await fetch(link_ghe, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(ghe)
        });
        const data = await response.json();
        if (response.ok) return data;
    }
);

// Xóa ghế
export const deleteGhe = createAsyncThunk(
    'ghe/deleteGhe',
    async (id) => {
        const response = await fetch(`${link_ghe}/${id}`, {
            method: 'DELETE',
        });
        if (response.ok) return id;
    }
);

// Cập nhật ghế
export const updateGhe = createAsyncThunk(
    'ghe/updateGhe',
    async (ghe) => {
        // Sử dụng id thay vì id nếu dữ liệu ghế có trường id
        const id = ghe.id || ghe.id;
        const response = await fetch(`${link_ghe}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(ghe)
        });
        const data = await response.json();
        if (response.ok) return data;
    }
);

// xóa ghế theo suat_chieu_id
export const deleteGheBySuatChieuId = createAsyncThunk(
  'ghe/deleteGheBySuatChieuId',
  async (suat_chieu_id, { dispatch }) => {
    const response = await fetch(`${link_ghe}?suat_chieu_id=${suat_chieu_id}`);
    const data = await response.json();
    for (const ghe of data) {
      await dispatch(deleteGhe(ghe.id));
    }
    return suat_chieu_id;
  })

export const updateNhieuGhe = createAsyncThunk(
  'ghe/updateNhieuGhe',
  async ({ listghe, gheSelected }, { dispatch }) => {
    // listghe: danh sách tất cả ghế của phòng
    // gheSelected: mảng các vị trí ghế đã chọn
    const promises = gheSelected.map(vi_tri => {
      const ghe = listghe.find(g => g.vi_tri === vi_tri);
      if (ghe) {
        return dispatch(updateGhe({ ...ghe, trang_thai: 'đã chọn' }));
      }
      return null;
    });
    await Promise.all(promises);
    return gheSelected;
  }
);