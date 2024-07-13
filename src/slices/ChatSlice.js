import { configureStore, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { useSelector } from "react-redux";
//creating thunk
export const updateChat=createAsyncThunk('chat/updateChat',({chatId,user},{getState})=>{
    const currentUser= getState().user.currentUser
    console.log("currentuser in chatslice",currentUser)
    // Check if current user is blocked
    if (user.blocked.includes(currentUser.id)) {
        console.log("chatId in ChatSlice",chatId)
        return { chatId:chatId, user:null, currentUser, isCurrentUserBlocked: true, isReceiverBlocked: false };
      }
      // Check if receiver is blocked
    else  if (currentUser.blocked.includes(user.id)) {
        console.log("chatId in ChatSlice",chatId)
        return { chatId:chatId, user, currentUser, isCurrentUserBlocked: false, isReceiverBlocked: true };
      }
      // Neither is blocked
    else 
    console.log("chatId in ChatSlice",chatId)
    return { chatId:chatId, user, currentUser, isCurrentUserBlocked: false, isReceiverBlocked: false };


})


const ChatSlice= createSlice({
    name:"chat",
    initialState:{
        chatId:"",
        user:null,
        isCurrentUserBlocked:false,
        isReceiverBlocked:false
    },
    reducers:{
        changeBlock:(state,action)=>{
            state.isReceiverBlocked= !state.isReceiverBlocked
        }
       
    },
    extraReducers:(builder)=>{
        builder.addCase(updateChat.fulfilled,(state,action)=>{
            const { chatId, user, isCurrentUserBlocked, isReceiverBlocked } = action.payload;
            state.chatId = chatId;
            state.user = user;
            state.isCurrentUserBlocked = isCurrentUserBlocked;
            state.isReceiverBlocked = isReceiverBlocked;
        })

        
    }

})
export default ChatSlice.reducer
export const {changeBlock} = ChatSlice.actions