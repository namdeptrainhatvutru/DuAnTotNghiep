import { configureStore } from "@reduxjs/toolkit";
import UserReducer from "../reducers/UserReducer"
import RapChieuReducer from "../reducers/RapChieuReducer"
import PhongChieuReducer from "../reducers/PhongChieuReducer";
import SuatChieuReducer from "../reducers/SuatChieuReducer";
import PhimReducer from "../reducers/PhimReducer";
import ThanhToanReducer from "../reducers/ThanhToanReducer"
import GheReducer from "../reducers/GheReducer"
export default configureStore(
    {
        reducer:{
            user : UserReducer,
            rapchieu : RapChieuReducer,
            phongchieu : PhongChieuReducer,
            suatchieu : SuatChieuReducer,
            phim : PhimReducer,
            thanhtoan: ThanhToanReducer,
            ghe : GheReducer,
        }
    }
)