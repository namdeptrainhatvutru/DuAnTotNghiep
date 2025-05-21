import { createAsyncThunk } from "@reduxjs/toolkit"
import { setPhongChieu } from "../reducers/PhongChieuReducer"


const api_phong_chieu = 'https://682410ae65ba05803398c2c7.mockapi.io/Phong_Chieu'

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
export const deletePhongChieu = createAsyncThunk(
    'phongchieu/deletePhongChieu',
    async (room_id) => {
        const response = await fetch(`${api_phong_chieu}/${room_id}`, {
            method: 'DELETE',
        })
        if (response.ok) {
            return room_id
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