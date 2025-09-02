import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axioKit } from "../../../utilities";
const url = "assets/persons/applicants";

const initialState = {
  collections: [],
  frontImage: "", // base64
  backImage: "", // base64
  frontLoading: false,
  backLoading: false,
  layout: "portrait",
  floatingValue: null,
  cursorPos: { x: 0, y: 0 },
  selectedSide: "front",
  selectedValue: null,
  showAllValues: false,
  lockAspect: false,
  loading: true,
  editMode: false,
};
// database query
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
  name: "idCalibrator",
  initialState,
  reducers: {
    setFrontImage: (state, { payload }) => {
      state.frontImage = payload;
    },
    setBackImage: (state, { payload }) => {
      state.backImage = payload;
    },
    setFrontLoading: (state, { payload }) => {
      state.frontLoading = payload;
    },
    setBackLoading: (state, { payload }) => {
      state.backLoading = payload;
    },
    setLayout: (state, { payload }) => {
      state.layout = payload;
    },
    setFloatingValue: (state, { payload }) => {
      state.floatingValue = payload;
    },
    setCursorPos: (state, { payload }) => {
      state.cursorPos = payload;
    },
    setSelectedSide: (state, { payload }) => {
      state.selectedSide = payload;
    },
    setSelectedValue: (state, { payload }) => {
      state.selectedValue = payload;
    },
    setShowAllValues: (state, { payload }) => {
      state.showAllValues = payload;
    },
    setLockAspect: (state, { payload }) => {
      state.lockAspect = payload;
    },
    setLoading: (state, { payload }) => {
      state.loading = payload;
    },
    setEditMode: (state, { payload }) => {
      state.editMode = payload;
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

export const {
  setFrontImage,
  setBackImage,
  setFrontLoading,
  setBackLoading,
  setLayout,
  setFloatingValue,
  setCursorPos,
  setSelectedSide,
  setSelectedValue,
  setShowAllValues,
  setLockAspect,
  setLoading,
  setEditMode,
} = reduxSlice.actions;

export default reduxSlice.reducer;
