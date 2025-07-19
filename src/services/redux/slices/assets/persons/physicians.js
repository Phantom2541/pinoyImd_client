import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axioKit } from "../../../../utilities";

const url = "assets/persons/physicians";

const initialState = {
  collections: [],
  filtered: [],
  isSuccess: false,
  isLoading: false,
  formSubmitted: false,
  message: "",
  showModal: false,
  closeModal: false,
  willCreate: false,
  details: {}, //this is for subscriber home page
  selected: {},
  displayName: "",
  paginated: [],
  page: 0,
  maxPage: 5,
  activePage: 1,
  totalPages: 0,
};

export const BROWSE = createAsyncThunk(
  `${url}/browse`,
  ({ token, branchId }, thunkAPI) => {
    try {
      return axioKit.universal(`${url}/browse`, token, { branchId });
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

export const SEARCH = createAsyncThunk(
  `${url}/SEARCH`,
  ({ token, key }, thunkAPI) => {
    try {
      return axioKit.universal(`${url}/search`, token, key);
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

export const FILTER = createAsyncThunk(
  `${url}/filter`,
  ({ token, key }, thunkAPI) => {
    try {
      return axioKit.universal(`${url}/filter`, token, key);
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

export const TIEUPS = createAsyncThunk(
  `${url}/tieups`,
  ({ token, key }, thunkAPI) => {
    try {
      return axioKit.universal(`${url}/tieups`, token, key);
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

export const SAVE = createAsyncThunk(`${url}/save`, (form, thunkAPI) => {
  try {
    return axioKit.save(url, form.data, form.token);
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();

    return thunkAPI.rejectWithValue(message);
  }
});

export const UPDATE = createAsyncThunk(`${url}/update`, (form, thunkAPI) => {
  try {
    console.log("running again");
    return axioKit.update(url, form.data, form.token);
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();

    return thunkAPI.rejectWithValue(message);
  }
});

export const DESTROY = createAsyncThunk(`${url}/destroy`, (form, thunkAPI) => {
  try {
    return axioKit.destroy(url, form.data, form.token);
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();

    return thunkAPI.rejectWithValue(message);
  }
});

export const reduxSlice = createSlice({
  name: url,
  initialState,
  reducers: {
    SetPHYSICIANS: (state, { payload }) => {
      state.collections = payload;
    },
    SETPHYSICIAN: (state, { payload }) => {
      state.selected = payload;

      state.selectedId = payload?._id;
      const full = payload?.fullName || {};
      state.displayName = `${full.lname || ""}, ${full.fname || ""}${
        full.mname ? " " + full.mname : ""
      }`;
    },
    ADD_PHYSICIAN: (state, { payload }) => {
      const physiciansFakeDB = localStorage.getItem("physicians") || "[]";
      const physicians = JSON.parse(physiciansFakeDB);
      physicians.unshift(payload);
      state.collections = physicians;
      localStorage.setItem("physicians", JSON.stringify(physicians));
    },
    SetFILTERED: (state, { payload }) => {
      state.filtered = payload;
    },
    TOGGLE: (state) => {
      state.showModal = !state.showModal;
      state.selected = {};
      state.closeModal = !state.closeModal;
      console.log("toggle", state.closeModal);
    },
    SetCREATE: (state) => {
      state.selected = {
        name: "",
        email: "",
        phone: "",
      };
      state.willCreate = true;

      state.showModal = true;
    },
    SetMaxPage: (state, { payload }) => {
      state.maxPage = payload;
      state.activePage = 1;
      console.log("maxPage", state.maxPage);
    },
    SetActivePAGE: (state, { payload }) => {
      state.activePage = payload;
      console.log("activePage", state.activePage);
    },
    RESET: (state) => {
      state.isSuccess = false;
      state.formSubmitted = false;
      state.collections = [];
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
      .addCase(BROWSE.fulfilled, (state, action) => {
        const { payload } = action.payload;
        state.collections = payload;
        state.isLoading = false;
      })
      .addCase(BROWSE.rejected, (state, action) => {
        const { error } = action;
        state.message = error.message;
        state.isLoading = false;
      })

      .addCase(SEARCH.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.message = "";
      })
      .addCase(SEARCH.fulfilled, (state, action) => {
        const { payload } = action.payload;
        state.collections = payload;
        state.isLoading = false;
      })
      .addCase(SEARCH.rejected, (state, action) => {
        const { error } = action;
        state.message = error.message;
        state.isLoading = false;
      })
      .addCase(FILTER.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.message = "";
      })
      .addCase(FILTER.fulfilled, (state, { payload }) => {
        state.collections = payload.payload;
        state.isLoading = false;
      })
      .addCase(FILTER.rejected, (state, action) => {
        const { error } = action;
        state.message = error.message;
        state.isLoading = false;
      })
      .addCase(TIEUPS.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.message = "";
      })
      .addCase(TIEUPS.fulfilled, (state, action) => {
        const { payload } = action;
        const { page, maxPage } = state;
        if (payload.length > 0) {
          let totalPAges = Math.floor(payload.length / state.maxPage);
          if (payload.length % maxPage > 0) totalPAges += 1;
          state.totalPages = totalPAges;
          if (page > totalPAges) {
            state.page = totalPAges;
          }
        }
        state.collections = payload;
        state.filtered = payload;
        console.log("payload", payload);

        state.isLoading = false;
      })
      .addCase(TIEUPS.rejected, (state, action) => {
        const { error } = action;
        state.message = error.message;
        state.isLoading = false;
      })

      .addCase(SAVE.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.message = "";
      })
      .addCase(SAVE.fulfilled, (state, action) => {
        const { success, payload } = action.payload;

        state.message = success;
        state.collections.unshift(payload);
        state.filtered.unshift(payload);
        // payload?.length > 0 &&
        //   payload.map((data) =>

        //     //kasi pwede siyang mag add ng madaming physicians kaya minap ko kasi array yung return niya
        //     state.collections.tieups.unshift(data)
        //   );

        state.isSuccess = true;
        state.isLoading = false;
      })
      .addCase(SAVE.rejected, (state, action) => {
        const { error } = action;
        state.message = error.message;
        state.isLoading = false;
      })

      .addCase(UPDATE.pending, (state) => {
        state.formSubmitted = true;
        state.isSuccess = false;
        state.message = "";
      })
      .addCase(UPDATE.fulfilled, (state, action) => {
        const { success, payload } = action.payload;
        if (state.collections.length > 0) {
          const index = state?.collections?.tieups?.findIndex(
            (item) => item?._id === payload?._id
          );

          state.collections[index] = payload;
        }

        state.message = success;
        state.isSuccess = true;
        state.formSubmitted = false;
      })
      .addCase(UPDATE.rejected, (state, action) => {
        const { error } = action;
        state.message = error?.message || "";
        state.formSubmitted = false;
      })
      .addCase(DESTROY.pending, (state) => {
        // state.isLoading = true;
        state.isSuccess = false;
        state.message = "";
      })
      .addCase(DESTROY.fulfilled, (state, action) => {
        const { success, payload } = action.payload;
        const index = state.collections.findIndex(
          (item) => item._id === payload
        );

        state.collections.splice(index, 1);
        state.message = success;
        state.isSuccess = true;
        // state.isLoading = false;
      })
      .addCase(DESTROY.rejected, (state, action) => {
        const { error } = action;
        state.message = error.message;
        // state.isLoading = false;
      });
  },
});

export const {
  ADD_PHYSICIAN,
  SetPHYSICIANS,
  SETPHYSICIAN,
  RESET,
  SetFILTERED,
  SetCREATE,
  SetActivePAGE,
  SetMaxPage,
  TOGGLE,
} = reduxSlice.actions;

export default reduxSlice.reducer;
