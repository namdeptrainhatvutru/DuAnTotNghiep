import { createSlice } from "@reduxjs/toolkit"
import { addUser } from "../actions/UserAction"


const initialState ={
    user: null,
}

const UserSlice = createSlice(
    {
        name: "user",
        initialState,
        reducers: {
            setUser: (state, action) => {
                state.user = action.payload
            },
            removeUser: (state) => {
                state.user = null
            }
        },
        extraReducers: builder =>{
            builder.addCase(addUser.fulfilled, (state, action) => {
                state.user = action.payload
            })
        }
    }
)

export const {setUser, removeUser} = UserSlice.actions
export default UserSlice.reducer