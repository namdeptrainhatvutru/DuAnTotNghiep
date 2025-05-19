import { configureStore } from "@reduxjs/toolkit";
import UserReducer from "../reducers/UserReducer"
import RapChieuReducer from "../reducers/RapChieuReducer"
export default configureStore(
    {
        reducer:{
            user : UserReducer,
            rapchieu : RapChieuReducer,
        }
    }
)