import { configureStore } from "@reduxjs/toolkit";
import UserReducer from "../reducers/UserReducer"
import RapChieuReducer from "../reducers/RapChieuReducer"
import PhongChieuReducer from "../reducers/PhongChieuReducer";
import SuatChieuReducer from "../reducers/SuatChieuReducer";
export default configureStore(
    {
        reducer:{
            user : UserReducer,
            rapchieu : RapChieuReducer,
            phongchieu : PhongChieuReducer,
            suatchieu : SuatChieuReducer
        }
    }
)