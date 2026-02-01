import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CoinCardModel } from "../Components/Models/CoinCardModel";

// Shape of the Coins slice state
type CoinsState = {
  coins: CoinCardModel[];
  selectedIds: string[];
};

// Initial state
const initialState: CoinsState = {
  coins: [],
  selectedIds: [],
};

const coinsSlice = createSlice({
  name: "coins",
  initialState,

  reducers: {

    // ✅ MINIMAL FIX
    setCoins(state, action: PayloadAction<any>) {
      state.coins = Array.isArray(action.payload) ? action.payload : [];
    },

    setSelectedIds(state, action: PayloadAction<string[]>) {
      state.selectedIds = action.payload;
    },

    addSelectedId(state, action: PayloadAction<string>) {
      const id = action.payload;
      if (!state.selectedIds.includes(id)) {
        state.selectedIds.push(id);
      }
    },

    removeSelectedId(state, action: PayloadAction<string>) {
      const id = action.payload;
      state.selectedIds = state.selectedIds.filter(x => x !== id);
    },
  },
});

export const coinsActions = coinsSlice.actions;
export const coinsReducer = coinsSlice.reducer;



