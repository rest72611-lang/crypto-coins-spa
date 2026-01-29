import { configureStore } from "@reduxjs/toolkit";
import { coinsReducer } from "./CoinsSlice";

// Configure the global Redux store
// Each key inside "reducer" represents a slice name in the state tree
export const store = configureStore({
  reducer: {
    // Coins slice handles coins list and selected coin ids
    coins: coinsReducer,
  },
});

// RootState represents the full shape of the Redux state tree
// Used for typing useSelector
export type RootState = ReturnType<typeof store.getState>;

// AppDispatch represents the dispatch function type
// Used for typing useDispatch
export type AppDispatch = typeof store.dispatch;

