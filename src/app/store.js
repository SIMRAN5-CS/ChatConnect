import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../slices/UserSlice.js"
import chatReducer from "../slices/ChatSlice.js"

const store= configureStore({
    reducer:{
        user:userReducer,
        chat:chatReducer
    }
})
export default store