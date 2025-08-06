import { createAsyncThunk } from "@reduxjs/toolkit"
import { setUser } from "../reducers/UserReducer"
import BASE from "../../config/BaseUrl"


const api_khach_hang = 'https://67ac56315853dfff53da3fd1.mockapi.io/Khach_Hang'

export const fectchUser = () => {
    return async (dispatch) => {
        try {
            const response = await fetch(api_khach_hang)
            const data = await response.json()
            dispatch(setUser(data))
        } catch (error) {
            console.error(error)
        }
    }
}


export const addUser = createAsyncThunk(
    'user/addUser',
    async (user)=>{
        const response = await fetch(api_khach_hang, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(user)
        })
        const data = await response.json()
        if(response.ok){
            return data
        }
    }
)


export const updateUser = createAsyncThunk(
    'user/updateUser',
    async (user) => {
        const id = user.khach_hang_id || user.id;
        const response = await fetch(`${api_khach_hang}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(user)
        });
        const data = await response.json();
        if (response.ok) return data;
    }
);

export const deleteUser = createAsyncThunk(
    'user/deleteUser',
    async (id) => {
        const response = await fetch(`${api_khach_hang}/${id}`, {
            method: 'DELETE',
        });
        if (response.ok) return id;
    }
);

export const tangDiemUser = createAsyncThunk(
  'user/tangDiemUser',
  async ({user,soluong}) => {
    const id = user.khach_hang_id || user.id;
    const newUser = { ...user, diem: (user.diem || 0) + soluong*10 };
    const response = await fetch(`${api_khach_hang}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newUser)
    });
    const data = await response.json();
    if (response.ok) return data;
  }
);
