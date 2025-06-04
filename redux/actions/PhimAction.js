import { createAsyncThunk } from "@reduxjs/toolkit"
import { setPhim } from "../reducers/PhimReducer"



const api_phim = 'https://67b5f43207ba6e59083f3354.mockapi.io/Phim'

export const fetchPhim = () => {
    return async dispatch => {
        try {
            const response = await fetch(api_phim)
            const data = await response.json()
            dispatch(setPhim(data))
        } catch (error) {
            console.error('Error fetching phong chieu:', error)
        }
    }
}

export const addPhim = createAsyncThunk(
    'phim/addPhim',
    async (phim) => {
        try {
            const response = await fetch(api_phim, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(phim),
            })
            const data = await response.json()
            if (response.ok) {
                return data
            }
        } catch (error) {
            console.error('Error adding phim:', error)
        }
    }
)
export const deletePhim = createAsyncThunk(
    'phim/deletePhim',
    async (phim_id) => {
        try {
            const response = await fetch(`${api_phim}/${phim_id}`, {
                method: 'DELETE',
            })
            if (response.ok) {
                return phim_id
            }
        } catch (error) {
            console.error('Error deleting phim:', error)
        }
    },
)
export const updatePhim = createAsyncThunk(
    'phim/updatePhim',
    async (phim) => {
        try {
            const response = await fetch(`${api_phim}/${phim.phim_id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(phim),
            })
            const data = await response.json()
            if (response.ok) {
                return data
            }
        } catch (error) {
            console.error('Error updating phim:', error)
        }
    }
)