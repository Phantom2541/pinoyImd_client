import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  claimstub: (() => {
    try {
      const stored = localStorage.getItem("claimStub");
      return stored ? JSON.parse(stored) : {};
    } catch (e) {
      return {};
    }
  })(),
};

const printoutSlice = createSlice({
  name: "printout",
  initialState,
  reducers: {
    SetCLAIMSTUB: (state, { payload }) => {
      state.claimstub = payload;
      localStorage.setItem("claimStub", JSON.stringify(payload));
    },
  },
});

export const { SetCLAIMSTUB } = printoutSlice.actions;
export default printoutSlice.reducer;
