import { createSlice } from "@reduxjs/toolkit"
import { addSuatChieu, deleteAllSuatChieuByRoomId, deleteSuatChieu, updateSuatChieu } from "../actions/SuatChieuAction"




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
      builder.addCase(deleteAllSuatChieuByRoomId.fulfilled, (state, action) => {
    // action.payload là mảng suat_chieu_id đã xóa
    state.listsuatchieu = state.listsuatchieu.filter(
      suat => !action.payload.includes(suat.suat_chieu_id)
    );
  });
  }
})

export const { setSuatChieu } = SuatChieuSlice.actions
export default SuatChieuSlice.reducer