import { configureStore } from "@reduxjs/toolkit";
import UserReducer from "../reducers/UserReducer"

export default configureStore(
    {
        reducer:{
            user : UserReducer
        }
    }
)