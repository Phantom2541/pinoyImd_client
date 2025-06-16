import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axioKit } from "../../../utilities";
import { Services } from "../../../fakeDb";

const url = "portal/results";

const initialState = {
  preferences: [],
  filtered: [],
  formSubmitted: false,
  didSearch: false,
  selected: {},
  result: {},
  page: 0,
  isSuccess: false,
  // main loading
  isLoading: false,
  // form loading
  isLoadingForm: false,
  willCreate: false,
  message: "",
  showModal: false,
  /**
   * Footer
   */
  maxPage: 5,
  activePage: 1,
  totalPages: 0,
};

export const BROWSE = createAsyncThunk(
  `${url}/browse`,
  ({ token, key }, thunkAPI) => {
    try {
      console.log("key", key);

      return axioKit.universal(`${url}/browse`, token, key);
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
  name: url,
  initialState,
  reducers: {
    RESET: (state) => {
      state.isSuccess = false;
      state.isLoading = false;
      state.formSubmitted = false;
      state.message = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(BROWSE.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.message = "";
      })
      .addCase(BROWSE.fulfilled, (state, { payload }) => {
        const { payload: data } = payload;
        const { result, preferences } = data;

        const services = [...Services.collections].map((service) => {
          const references = preferences.filter(
            ({ serviceId }) => serviceId === service.id
          );
          return { ...service, references };
        });
        state.result = result;

        state.preferences = services;
        state.isLoading = false;
      })
      .addCase(BROWSE.rejected, (state, action) => {
        const { error } = action;
        state.message = error.message;
        state.isLoading = false;
      });
  },
});

export const { RESET } = reduxSlice.actions;

export default reduxSlice.reducer;
