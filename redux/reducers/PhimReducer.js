import { createSlice } from "@reduxjs/toolkit"
import { addPhim, deletePhim, updatePhim } from "../actions/PhimAction"


  const initialState = {
  listphim: [],
}


const PhimSlice = createSlice({
  name: "phim",
  initialState,
  reducers: {
    setPhim: (state, action) => {
      state.listphim = action.payload
    },
    
  },
  extraReducers: builder => {
        builder.addCase(addPhim.fulfilled,(state,action)=>{
            state.listphim.push(action.payload)
        })
        builder.addCase(addPhim.rejected,(state,action)=>{
            console.log('Error adding phim:', action.error.message)
        })
        builder.addCase(deletePhim.fulfilled,(state,action)=>{
          state.listphim = state.listphim.filter(item => item.phim_id !== action.payload)
        })
        builder.addCase(updatePhim.fulfilled,(state,action)=>{
          const index = state.listphim.findIndex(item => item.phim_id === action.payload.phim_id)
          if (index !== -1) {
            state.listphim[index] = action.payload
          }
        })

  }
})

export const { setPhim } = PhimSlice.actions
export default PhimSlice.reducer