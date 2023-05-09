import { createSlice } from "@reduxjs/toolkit";

export const counterSlice = createSlice({
  name: "counter",
  initialState: {
    loading: 0,
  },
  reducers: {
    increment: (state) => {
      state.loading += 1;
    },
    decrement: (state) => {
      state.loading -= 1;
    },
    incrementByAmount: (state, action) => {
      state.loading += action.payload;
      if (state.loading < 0) {
        state.loading = 0;
      }
    },
  },
});

// Action creators are generated for each case reducer function
export const { increment, decrement, incrementByAmount } = counterSlice.actions;

export default counterSlice.reducer;
