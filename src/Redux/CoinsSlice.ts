import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CoinCardModel } from "../Components/Models/CoinCardModel";

// Shape of the Coins slice state
// coins        -> all available coins fetched from API
// selectedIds -> ids of coins selected by the user
type CoinsState = {
  coins: CoinCardModel[];
  selectedIds: string[];
};

// Initial state for the slice
const initialState: CoinsState = {
  coins: [],
  selectedIds: [],
};

// Coins slice manages coin list and user selections
const coinsSlice = createSlice({
  name: "coins",
  initialState,

  reducers: {
    // Replace the entire coins array
    setCoins(state, action: PayloadAction<CoinCardModel[]>) {
      state.coins = action.payload;
    },

    // Replace all selected coin ids at once
    setSelectedIds(state, action: PayloadAction<string[]>) {
      state.selectedIds = action.payload;
    },

    // Add a coin id to selection (if not already selected)
    addSelectedId(state, action: PayloadAction<string>) {
      const id = action.payload;

      // Prevent duplicates
      if (!state.selectedIds.includes(id)) {
        state.selectedIds.push(id);
      }
    },

    // Remove a coin id from selection
    removeSelectedId(state, action: PayloadAction<string>) {
      const id = action.payload;

      // Create a new array without the removed id
      state.selectedIds = state.selectedIds.filter((x) => x !== id);
    },
  },
});

// Export auto-generated action creators
export const coinsActions = coinsSlice.actions;

// Export reducer for store configuration
export const coinsReducer = coinsSlice.reducer;


