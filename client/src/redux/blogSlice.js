import { createSlice } from '@reduxjs/toolkit';

const blogSlice = createSlice({
  name: 'blog',
  initialState: {
    posts: [],
    currentPost: null,
    myPosts: [],
    loading: false,
    error: null,
    pagination: {
      page: 1,
      pages: 1,
      total: 0,
    },
  },
  reducers: {
    setPosts: (state, action) => {
      state.posts = action.payload;
    },
    setCurrentPost: (state, action) => {
      state.currentPost = action.payload;
    },
    setMyPosts: (state, action) => {
      state.myPosts = action.payload;
    },
    addPost: (state, action) => {
      state.posts.unshift(action.payload);
      state.myPosts.unshift(action.payload);
    },
    updatePost: (state, action) => {
      const index = state.posts.findIndex((p) => p._id === action.payload._id);
      if (index !== -1) {
        state.posts[index] = action.payload;
      }
      const myIndex = state.myPosts.findIndex(
        (p) => p._id === action.payload._id,
      );
      if (myIndex !== -1) {
        state.myPosts[myIndex] = action.payload;
      }
    },
    removePost: (state, action) => {
      state.posts = state.posts.filter((p) => p._id !== action.payload);
      state.myPosts = state.myPosts.filter((p) => p._id !== action.payload);
    },
    setBlogLoading: (state, action) => {
      state.loading = action.payload;
    },
    setBlogError: (state, action) => {
      state.error = action.payload;
    },
    setBlogPagination: (state, action) => {
      state.pagination = action.payload;
    },
  },
});

export const {
  setPosts,
  setCurrentPost,
  setMyPosts,
  addPost,
  updatePost,
  removePost,
  setBlogLoading,
  setBlogError,
  setBlogPagination,
} = blogSlice.actions;

export default blogSlice.reducer;
