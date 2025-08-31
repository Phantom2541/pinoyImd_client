import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axioKit } from "../../../utilities";
const url = "assets/persons/applicants";

const initialState = {
  collections: [],
  frontImage: "", // base64
  backImage: "",
};

export const SAVE = createAsyncThunk(`${url}/save`, (form, thunkAPI) => {
  try {
    return axioKit.save(url, form.data, form.token);
  } catch (error) {
    const message =
      error.response?.data?.message || error.message || error.toString();
    return thunkAPI.rejectWithValue(message);
  }
});

export const reduxSlice = createSlice({
  name: "idGenerator",
  initialState,
  reducers: {
    setFrontImage: (state, { payload }) => {
      state.frontImage = payload;
    },
    setBackImage: (state, { payload }) => {
      state.backImage = payload;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(SAVE.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.message = "";
      })
      .addCase(SAVE.fulfilled, (state, action) => {
        const { success, payload } = action.payload;
        state.message = success;
        state.collections.unshift(payload);
        state.isSuccess = true;
        state.isLoading = false;
      })
      .addCase(SAVE.rejected, (state, action) => {
        state.message = action.error.message;
        state.isLoading = false;
      });
  },
});

export const { setFrontImage, setBackImage } = reduxSlice.actions;

export default reduxSlice.reducer;
