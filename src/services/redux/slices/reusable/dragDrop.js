import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axioKit } from "../../../utilities";

const name = "results/preferences";
const DEFAULT_ROLES = [
  { name: "Admin", _id: "1" },
  { name: "User", _id: "2" },
  { name: "Guest", _id: "3" },
  { name: "Super Admin", _id: "4" },
  { name: "Manager", _id: "5" },
];
const initialState = {
  collections: DEFAULT_ROLES,
  clusters: [],
  isSuccess: false,
  isLoading: false,
  message: "",
};

export const reduxSlice = createSlice({
  name,
  initialState,
  reducers: {
    SetCollections: (state, action) => {
      state.collections = action.payload;
    },
    SetClusters: (state, action) => {
      state.clusters = action.payload;
    },
    RESET: (state) => {
      state.isSuccess = false;
      state.message = "";
    },
  },
});

export const { RESET, SetClusters, SetCollections, DROP } = reduxSlice.actions;

export default reduxSlice.reducer;
