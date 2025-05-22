import { createSlice } from "@reduxjs/toolkit"


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
      
  }
})

export const { setPhim } = PhimSlice.actions
export default PhimSlice.reducer