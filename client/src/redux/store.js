import { combineReducers, configureStore } from '@reduxjs/toolkit';
import authSlice from './authSlice';
import blogSlice from './blogSlice';
import categorySlice from './categorySlice';
import commentSlice from './commentSlice';
import uiSlice from './uiSlice';

import {
  FLUSH,
  PAUSE,
  PERSIST,
  persistReducer,
  PURGE,
  REGISTER,
  REHYDRATE,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';

const persistConfig = {
  key: 'root',
  version: 1,
  storage,
  whitelist: ['auth', 'ui'], // Only persist auth and ui
};
const rootReducer = combineReducers({
  auth: authSlice,
  blog: blogSlice,
  category: categorySlice,
  comment: commentSlice,
  ui: uiSlice,
});
const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});
export default store;
