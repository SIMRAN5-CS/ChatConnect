import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { doc, getDoc } from "firebase/firestore"
import { db } from "../lib/firebase";


export const fetchUser = createAsyncThunk("user/fetchUser", async (uid, { rejectWithValue, getState }) => {
  const { currentUser } = getState()

  if (!uid) {
    return null
  }
  console.log(currentUser)
  try {

    const docRef = doc(db, "users", uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      console.log("data of user exists in db")
      return docSnap.data();
    } else {
      console.log("no data of user exists in db")
      return rejectWithValue("no user found")
    }
  } catch (error) {
    console.log("error fetching the user data")
    return rejectWithValue("error occured")
  }
})
const UserSlice = createSlice({
  name: "user",
  initialState: {
    currentUser: null,
    isLoading: false,
    error: null
  },
  extraReducers: (builder) => {
    builder.addCase(fetchUser.pending, (state, action) => {
      state.isLoading = true
      state.error = null

    })
    builder.addCase(fetchUser.fulfilled, (state, action) => {
      state.isLoading = false
      state.currentUser = action.payload
      state.error = null

    })
    builder.addCase(fetchUser.rejected, (state, action) => {
      state.isLoading = false
      state.currentUser = null
      state.error = action.payload
    })
  },
  reducers: {

  }

})
export default UserSlice.reducer