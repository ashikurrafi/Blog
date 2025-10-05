import { createSlice } from "@reduxjs/toolkit";

const blogSlice = createSlice({
  name: "blog",
  initialState: {
    blog: null,
    yourBlogs: null,
  },
  reducers: {
    //actions
    setBlog: (state, action) => {
      state.blog = action.payload;
    },
    setYourBlogs: (state, action) => {
      state.yourBlogs = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const { setBlog, setYourBlogs, setError } = blogSlice.actions;

export default blogSlice.reducer;
