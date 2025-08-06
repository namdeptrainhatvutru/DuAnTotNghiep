import { createAsyncThunk } from "@reduxjs/toolkit"
import { setSuatChieu } from "../reducers/SuatChieuReducer"
import BASE from "../../config/BaseUrl"

const api_suat_chieu = `http://${BASE}:3000/suatchieu`




export const fetchSuatChieu = (room_id) => {
    return async dispatch => {
        try {
            const response = await fetch(`${api_suat_chieu}?room_id=${room_id}`)
            const data = await response.json()
            dispatch(setSuatChieu(data))
        } catch (error) {
            console.error('Error fetching suat chieu:', error)
        }
    }
}
export const fetchAllSuatChieu = () => {
    return async dispatch => {
        try {
            const response = await fetch(`${api_suat_chieu}`)
            const data = await response.json()
            dispatch(setSuatChieu(data))
        } catch (error) {
            console.error('Error fetching suat chieu:', error)
        }
    }
}

export const addSuatChieu = createAsyncThunk(
    'suatchieu/addSuatChieu',
    async (suatchieu)=>{
        const res = await fetch(api_suat_chieu,{
            method:'POST',
            headers:{'Content-Type':'Application/json'},
            body:JSON.stringify(suatchieu)
        })
        const data = await res.json(); // Lấy dữ liệu mới tạo từ API
        return data; // Trả về cho reducer
    }
)
export const deleteSuatChieu = createAsyncThunk(
    'suatchieu/deleteSuatChieu',
    async (suat_chieu_id) => {
        try {
            const response = await fetch(`${api_suat_chieu}/${suat_chieu_id}`, {
                method: 'DELETE',
            })
            if (response.ok) {
                return suat_chieu_id
            }
        } catch (error) {
            console.error('Error deleting suat chieu:', error)
        }
    },
)
export const updateSuatChieu = createAsyncThunk(
    'suatchieu/updateSuatChieu',
    async (suatchieu) => {
        try {
            const response = await fetch(`${api_suat_chieu}/${suatchieu.suat_chieu_id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'Application/json',
                },
                body: JSON.stringify(suatchieu),
            })
            const data = await response.json()
            if (response.ok) {
                return data
            }
        } catch (error) {
            console.error('Error updating suat chieu:', error)
        }
    }
)

// lấy suất chiếu theo id phim
export const fetchSuatChieuByPhimId = (phim_id) => {
    return async dispatch => {
        try {
            const response = await fetch(`${api_suat_chieu}?phim_id=${phim_id}`)
            const data = await response.json()
            dispatch(setSuatChieu(data))
        } catch (error) {
            console.error('Error fetching suat chieu by phim id:', error)
        }
    }
}


export const deleteAllSuatChieuByRoomId = createAsyncThunk(
  'suatchieu/deleteAllByRoomId',
  async (room_id, { getState, dispatch }) => {
    // Lấy danh sách suất chiếu từ state
    const { suatchieu } = getState();
    const suatChieuList = suatchieu.listsuatchieu || [];
    // Lọc các suất chiếu có room_id cần xóa
    const toDelete = suatChieuList.filter(suat => suat.room_id === room_id);
    // Xóa từng suất chiếu
    await Promise.all(
      toDelete.map(suat =>
        fetch(`${api_suat_chieu}/${suat.suat_chieu_id}`, { method: 'DELETE' })
      )
    );
    // Trả về mảng id đã xóa (nếu cần)
    return toDelete.map(suat => suat.suat_chieu_id);
  }
);