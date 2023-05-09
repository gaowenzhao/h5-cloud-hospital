import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const userSlice = createSlice({
  name: "user",
  initialState: {
    userInfo: {},
    token: "",
    userId: "",
    role: "", // user或者worker
  },
  reducers: {
    setUserInfo: (state,action={}) => {
      state.userInfo = action.payload
    },
    setToken: (state,action={}) => {
      state.token = action.payload
    },
    setUserId: (state,action={}) => {
      state.userId = action.payload
    },
    setUserRole: (state,action={}) => {
      state.role = action.payload
    },
  }
});

// Action creators are generated for each case reducer function
export const { setToken, setUserInfo, setUserId, setUserRole } = userSlice.actions

export default userSlice.reducer;
