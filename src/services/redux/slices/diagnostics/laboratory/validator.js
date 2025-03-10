import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axioKit } from "../../../../utilities";

const name = "commerce/pos/services/deals";
// const healthyClient = {
//   urinalysis: {
//     pe: [2, 0, 1, 1],
//     ce: [0, 0, 0, 0, 0, 0, 0, 0],
//     me: [1, 0, 0, 0, 0, 0],
//   },
//   parasitology: {
//     pe: [0, 0],
//     me: [0, 0, 0],
//     remarks: "NO OVA OR INTESTINAL PARASITE SEEN",
//   },
// };

const initialState = {
  collections: [],
  filtered: [],
  selected: {},
  showModal: false,
  maxPage: 1,
  activePage: 1,
  isSuccess: false,
  isLoading: false,
  message: "",
};

export const TASKS = createAsyncThunk(
  `${name}/tasks`,
  ({ token, key }, thunkAPI) => {
    try {
      return axioKit.universal(`${name}/tasks`, token, key);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();

      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const reduxSlice = createSlice({
  name,
  initialState,
  reducers: {
    SetFILTERED: (state, { payload }) => {
      state.filtered = payload;
    },
    SetSELECTED: (state, { payload }) => {
      state.selected = payload;
      state.showModal = true;
    },
    SetMODAL: (state) => {
      state.showModal = !state.showModal;
    },
    SetMaxPage: (state, { payload }) => {
      state.maxPage = payload;
      state.activePage = 1;
    },
    SetActivePAGE: (state, { payload }) => {
      state.activePage = payload;
    },
    RESET: (state) => {
      state.isSuccess = false;
      state.message = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(TASKS.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.message = "";
      })
      .addCase(TASKS.fulfilled, (state, action) => {
        const { payload } = action.payload;
        state.collections = payload;
        state.filtered = payload;
        state.isLoading = false;
      })
      .addCase(TASKS.rejected, (state, action) => {
        const { error } = action;
        state.message = error.message;
        state.isLoading = false;
      });
  },
});

export const { SetSELECTED, SetMODAL, SetMaxPage, SetActivePAGE, RESET } =
  reduxSlice.actions;

export default reduxSlice.reducer;
