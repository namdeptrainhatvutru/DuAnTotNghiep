import { createAsyncThunk } from "@reduxjs/toolkit"
import { setUser } from "../reducers/UserReducer"


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
