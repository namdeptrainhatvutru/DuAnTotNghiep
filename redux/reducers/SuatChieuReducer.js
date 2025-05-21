import { createSlice } from "@reduxjs/toolkit"




const initialState = {
  listsuatchieu: [],
}

const SuatChieuSlice = createSlice({
  name: "suatchieu",
  initialState,
  reducers: {
    setSuatChieu: (state, action) => {
      state.listsuatchieu = action.payload
    },
    
  },
  extraReducers: builder => {
      
   
  }
})

export const { setSuatChieu } = SuatChieuSlice.actions
export default SuatChieuSlice.reducer