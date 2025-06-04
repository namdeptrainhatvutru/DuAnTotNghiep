import { createAsyncThunk } from "@reduxjs/toolkit"
import { setSuatChieu } from "../reducers/SuatChieuReducer"

const api_suat_chieu = 'https://6824075665ba058033989f25.mockapi.io/Suat_Chieu'




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