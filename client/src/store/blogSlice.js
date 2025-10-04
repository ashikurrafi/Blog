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
  },
});

export const { setBlog, setYourBlogs } = blogSlice.actions;

export default blogSlice.reducer;
