import { createSlice } from "@reduxjs/toolkit"
import { addSuatChieu, deleteSuatChieu, updateSuatChieu } from "../actions/SuatChieuAction"




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
      builder.addCase(addSuatChieu.fulfilled,(state,action)=>{
        state.listsuatchieu.push(action.payload)
      })
      builder.addCase(deleteSuatChieu.fulfilled,(state,action)=>{
        state.listsuatchieu = state.listsuatchieu.filter(item => item.suat_chieu_id !== action.payload)
      })
      builder.addCase(updateSuatChieu.fulfilled,(state,action)=>{
        const index = state.listsuatchieu.findIndex(item => item.suat_chieu_id === action.payload.suat_chieu_id)
        if (index !== -1) {
          state.listsuatchieu[index] = action.payload
        }
      })
  }
})

export const { setSuatChieu } = SuatChieuSlice.actions
export default SuatChieuSlice.reducer