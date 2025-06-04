import { createAsyncThunk } from "@reduxjs/toolkit";
import { setThanhToan } from "../reducers/ThanhToanReducer";

const link_thanhtoan = 'https://67ac56315853dfff53da3fd1.mockapi.io/Thanh_Toan';

// Lấy tất cả thanh toán
export const fetchThanhToan = () => {
    return async dispatch => {
        try {
            const response = await fetch(link_thanhtoan);
            const data = await response.json();
            dispatch(setThanhToan(data));
        } catch (error) {
            console.error('Error fetching thanh toan:', error);
        }
    }
}

// Thêm thanh toán
export const addThanhToan = createAsyncThunk(
    'thanhtoan/addThanhToan',
    async (thanhtoan) => {
        const response = await fetch(link_thanhtoan, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(thanhtoan)
        });
        const data = await response.json();
        if (response.ok) return data;
    }
);

// Xóa thanh toán
export const deleteThanhToan = createAsyncThunk(
    'thanhtoan/deleteThanhToan',
    async (id) => {
        const response = await fetch(`${link_thanhtoan}/${id}`, {
            method: 'DELETE',
        });
        if (response.ok) return id;
    }
);

// Cập nhật thanh toán
export const updateThanhToan = createAsyncThunk(
    'thanhtoan/updateThanhToan',
    async (thanhtoan) => {
        const response = await fetch(`${link_thanhtoan}/${thanhtoan.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(thanhtoan)
        });
        const data = await response.json();
        if (response.ok) return data;
    }
);
