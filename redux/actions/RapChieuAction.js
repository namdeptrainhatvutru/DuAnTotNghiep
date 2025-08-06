import { createAsyncThunk } from '@reduxjs/toolkit';
import { setRapChieu} from '../reducers/RapChieuReducer';
import BASE from '../../config/BaseUrl';

const api_rapchieu = `http://${BASE}:3000/rapchieu`

export const fetchRapChieu = () => {
  return async dispatch => {
    try {
      const response = await fetch(api_rapchieu);
      const data = await response.json();
      dispatch(setRapChieu(data));
    } catch (error) {
      console.error('Error fetching rap chieu:', error);
    }
  };
};

export const addRapChieu = createAsyncThunk(
    'rapchieu/addRapChieu',
    async rapchieu => {
        const response = await fetch(api_rapchieu, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(rapchieu),
        });
        const data = await response.json();
        if (response.ok) {
        return data;
        }
    },
)
export const deleteRapChieu = createAsyncThunk(
    'rapchieu/deleteRapChieu',
    async (id) => {
        const response = await fetch(`${api_rapchieu}/${id}`, {
            method: 'DELETE',
        });
        if (response.ok) {
            return id;
        }
    },
)

export const updateRapChieu = createAsyncThunk(
    'rapchieu/updateRapChieu',
    async (rapchieu) => {
        const response = await fetch(`${api_rapchieu}/${rapchieu.cinema_id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(rapchieu),
        });
        const data = await response.json();
        if (response.ok) {
            return data;
        }
    },
)
