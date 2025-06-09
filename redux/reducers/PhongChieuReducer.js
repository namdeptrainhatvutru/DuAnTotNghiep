import { createSlice } from "@reduxjs/toolkit"
import { addPhongChieu, deletePhongChieu, updatePhongChieu } from "../actions/PhongChieuAction"



const initialState = {
  listphongchieu: [],
}

const PhongChieuSlice = createSlice({
  name: "phongchieu",
  initialState,
  reducers: {
    setPhongChieu: (state, action) => {
      state.listphongchieu = action.payload
    },
    
  },
  extraReducers: builder => {
      builder.addCase(addPhongChieu.fulfilled, (state, action) => {
  if (state.listphongchieu && Array.isArray(state.listphongchieu)) {
    state.listphongchieu.push(action.payload);
  } else {
    state.listphongchieu = [action.payload];
  }
});
      builder.addCase(deletePhongChieu.fulfilled,(state,action)=>{
        state.listphongchieu = state.listphongchieu.filter(item => item.room_id !== action.payload)
      })
      builder.addCase(updatePhongChieu.fulfilled,(state,action)=>{
        const index = state.listphongchieu.findIndex(item => item.room_id === action.payload.room_id)
        if(index !== -1){
          state.listphongchieu[index] = action.payload
        }
      })
  }
})

export const { setPhongChieu } = PhongChieuSlice.actions
export default PhongChieuSlice.reducer