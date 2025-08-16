import { createAsyncThunk } from "@reduxjs/toolkit"
import { setPhongChieu } from "../reducers/PhongChieuReducer"
import BASE from "../../config/BaseUrl"
import { fetchAllSuatChieu } from "./SuatChieuAction"

const api_phong_chieu = `http://${BASE}:3000/phongchieu`

export const fetchPhongChieu = (cinema_id) => {
    return async dispatch => {
        try {
            const response = await fetch(`${api_phong_chieu}?cinema_id=${cinema_id}`)
            const data = await response.json()
            dispatch(setPhongChieu(data))
        } catch (error) {
            console.error('Error fetching phong chieu:', error)
        }
    }
}
//fetch tất cả phòng chiếu
export const fetchAllPhongChieu = () => {
    return async dispatch => {
        try {
            const response = await fetch(api_phong_chieu)
            const data = await response.json()
            dispatch(setPhongChieu(data))
        } catch (error) {
            console.error('Error fetching all phong chieu:', error)
        }
    }
}

export const addPhongChieu = createAsyncThunk(
    'phongchieu/addPhongChieu',
    async phongchieu => {
        const response = await fetch(api_phong_chieu, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(phongchieu),
        })
        const data = await response.json()
        if (response.ok) {
            return data
        }
    },
)
// Cập nhật hàm deletePhongChieu để xóa cascade
export const deletePhongChieu = createAsyncThunk(
    'phongchieu/deletePhongChieu',
    async (room_id, { dispatch, getState }) => {
        try {
            // 1. Đảm bảo có dữ liệu suất chiếu mới nhất
            await dispatch(fetchAllSuatChieu());
            
            // 2. Lấy tất cả suất chiếu của phòng này
            const allSuatChieu = getState().suatchieu.listsuatchieu || [];
            const suatChieuOfRoom = allSuatChieu.filter(
                (suat) => suat.room_id === room_id
            );
            
            // 3. Xóa từng suất chiếu
            for (const suat of suatChieuOfRoom) {
                await fetch(`http://${BASE}:3000/suatchieu/${suat.suat_chieu_id}`, {
                    method: 'DELETE',
                });
            }
            
            // 4. Xóa phòng chiếu
            const response = await fetch(`${api_phong_chieu}/${room_id}`, {
                method: 'DELETE',
            });
            
            if (response.ok) {
                return room_id;
            }
            throw new Error("Không thể xóa phòng chiếu");
        } catch (error) {
            console.error("Error deleting phong chieu:", error);
            throw error;
        }
    },
)
export const updatePhongChieu = createAsyncThunk(
    'phongchieu/updatePhongChieu',
    async (phongchieu) => {
        const response = await fetch(`${api_phong_chieu}/${phongchieu.room_id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(phongchieu),
        })
        const data = await response.json()
        if (response.ok) {
            return data
        }
    },
)