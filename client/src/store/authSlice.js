import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    loading: false,
    user: null,
    userProfile: null,
  },
  reducers: {
    //actions
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setUser: (state, action) => {
      state.user = action.payload;
    },
    setUserProfile: (state, action) => {
      state.userProfile = action.payload;
    },
    removeUser(state) {
      state.user = null;
    },
  },
});

export const { setLoading, setUser, setUserProfile, removeUser } =
  authSlice.actions;

export default authSlice.reducer;
