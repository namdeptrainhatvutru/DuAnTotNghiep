import { createSlice } from "@reduxjs/toolkit"
import { addRapChieu, deleteRapChieu, updateRapChieu } from "../actions/RapChieuAction"


const initialState = {
  listrapchieu: [],
}

const RapChieuSlice = createSlice({
  name: "rapchieu",
  initialState,
  reducers: {
    setRapChieu: (state, action) => {
      state.listrapchieu = action.payload
    },
    
  },
  extraReducers: builder => {
    builder.addCase(addRapChieu.fulfilled, (state, action) => {
  if (state.listrapchieu && Array.isArray(state.listrapchieu)) {
    state.listrapchieu.push(action.payload);
  } else {
    state.listrapchieu = [action.payload];
  }
});
    builder.addCase(deleteRapChieu.fulfilled,(state,action)=>{
        const id = action.payload
        state.listrapchieu = state.listrapchieu.filter(item => item.cinema_id !== id)
    })
    builder.addCase(updateRapChieu.fulfilled,(state,action)=>{
        const updatedRapChieu = action.payload
        const index = state.listrapchieu.findIndex(item => item.cinema_id === updatedRapChieu.cinema_id)
        if(index !== -1){
            state.listrapchieu[index] = updatedRapChieu
        }
    })
  }
})

export const { setRapChieu, removeRapChieu } = RapChieuSlice.actions
export default RapChieuSlice.reducer