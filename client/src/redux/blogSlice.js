import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  loading: false,
  blog: null,
  yourBlog: null,
};

const blogSlice = createSlice({
  name: "blog",
  initialState,
  reducers: {
    setBlog: (state, action) => {
      state.blog = action.payload;
    },
    setYourBlog: (state, action) => {
      state.yourBlog = action.payload;
    },
  },
});

export const { setBlog, setYourBlog } = blogSlice.actions;

export default blogSlice.reducer;
