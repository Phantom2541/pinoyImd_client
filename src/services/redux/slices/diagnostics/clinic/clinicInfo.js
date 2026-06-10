import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axioKit } from "../../../../utilities";

const url = "/diagnostics/clinic/informations";

const getCollections = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.payload)) return payload.payload;
  return [];
};

const syncCollection = (state, clinic) => {
  if (!clinic?._id) return;

  const collectionIndex = state.collections.findIndex(
    (item) => item?._id === clinic._id
  );
  const filteredIndex = state.filtered.findIndex((item) => item?._id === clinic._id);

  if (collectionIndex > -1) {
    state.collections[collectionIndex] = clinic;
  } else {
    state.collections.unshift(clinic);
  }

  if (filteredIndex > -1) {
    state.filtered[filteredIndex] = clinic;
  } else {
    state.filtered.unshift(clinic);
  }

  state.totalPages = Math.ceil(state.filtered.length / state.maxPage) || 1;
  state.activePage = Math.min(state.activePage, state.totalPages);
};

const initialState = {
  clinic: {},
  filter: [],
  paginated: [],

  // Bread attributes
  selected: {}, // assurance
  page: 0,
  willCreate: false,
  showModal: false,

  /**
   * pagination
   */
  collections: [],
  filtered: [],
  maxPage: 5,
  totalPages: 0,
  activePage: 1,
  isSuccess: false,
  isLoading: false,
  formSubmitted: false,
  message: "",
};

export const BROWSE = createAsyncThunk(
  `${url}`,
  ({ token, params }, thunkAPI) => {
    try {
      return axioKit.universal(`${url}/browse`, token, params);
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

export const GET_CLINIC = createAsyncThunk(
  `${url}/GET_CLINIC`,
  ({ token, params }, thunkAPI) => {
    try {
      return axioKit.universal(`${url}/get_clinic`, token, params);
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
    return axioKit.update(url, form.data, form.token);
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();

    return thunkAPI.rejectWithValue(message);
  }
});

export const DESTROY = createAsyncThunk(
  `${url}/destroy`,
  ({ data, token }, thunkAPI) => {
    try {
      return axioKit.destroy(url, data, token);
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
    SetEDIT: (state, { payload }) => {
      state.selected = payload;
      state.willCreate = false;
      state.showModal = true;
    },
    SetCREATE: (state, { payload }) => {
      state.selected = {
        lo: "",
        norm: "",
        hi: "",
        serviceId: payload.serviceId,
      };
      state.willCreate = true;
      state.showModal = true;
    },
    SetFILTER: (state, { payload }) => {
      const { page, maxPage } = state;
      if (payload.length > 0) {
        let totalPages = Math.floor(payload.length / maxPage);
        if (payload.length % maxPage > 0) totalPages += 1;
        state.totalPages = totalPages;
        if (page > totalPages) {
          state.page = totalPages;
        }
      }
      state.filter = payload;
    },
    SetPagination: (state) => {
      // {
      //   payload;
      // }getPage
      const { page, max } = state;
      // if (getPage) return array;

      state.paginated = state.filter.slice(
        (page - 1) * max,
        max + (page - 1) * max
      );
    },
    SetPAGE: (state, { payload }) => {
      state.page = payload;
    },
    RESET: (state) => {
      state.isSuccess = false;
      state.message = "";
    },
    /**
     *  for pagination
     */
    SetMaxPage: (state, { payload }) => {
      state.maxPage = payload;
      state.activePage = 1;
    },
    SetActivePAGE: (state, { payload }) => {
      state.activePage = payload;
    },
    TOGGLE: (state) => {
      state.showModal = !state.showModal;
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
        const clinics = getCollections(action.payload);
        state.collections = clinics;
        state.filtered = clinics;
        state.totalPages = Math.ceil(clinics.length / state.maxPage) || 1;
        state.activePage = Math.min(state.activePage, state.totalPages);
        state.message = action.payload?.success || "";
        state.isSuccess = true;
        state.isLoading = false;
      })
      .addCase(BROWSE.rejected, (state, action) => {
        const { error } = action;
        state.message = error.message;
        state.isLoading = false;
      })

      .addCase(GET_CLINIC.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.message = "";
      })
      .addCase(GET_CLINIC.fulfilled, (state, action) => {
        state.clinic = action.payload;
        state.isLoading = false;
      })
      .addCase(GET_CLINIC.rejected, (state, action) => {
        const { error } = action;
        state.message = error.message;
        state.isLoading = false;
      })

      .addCase(SAVE.pending, (state) => {
        state.formSubmitted = true;
        state.isSuccess = false;
        state.message = "";
      })
      .addCase(SAVE.fulfilled, (state, action) => {
        state.clinic = action.payload;
        syncCollection(state, action.payload);
        state.showModal = false;
        state.message = "Clinic saved successfully.";
        state.isSuccess = true;
        state.formSubmitted = false;
      })
      .addCase(SAVE.rejected, (state, action) => {
        const { error } = action;
        state.message = error.message;
        state.formSubmitted = false;
      })

      .addCase(UPDATE.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.message = "";
      })
      .addCase(UPDATE.fulfilled, (state, action) => {
        syncCollection(state, action.payload);
        state.clinic = action.payload;
        state.showModal = false;
        state.message = "Clinic updated successfully.";
        state.isSuccess = true;
        state.isLoading = false;
      })
      .addCase(UPDATE.rejected, (state, action) => {
        const { error } = action;
        state.message = error.message;
        state.isLoading = false;
      })
      .addCase(DESTROY.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.message = "";
      })
      .addCase(DESTROY.fulfilled, (state, action) => {
        const clinicId = action.payload;
        const index = state.collections.findIndex(
          (item) => item?._id === clinicId
        );
        const filteredIndex = state.filtered.findIndex(
          (item) => item?._id === clinicId
        );
        if (index > -1) state.collections.splice(index, 1);
        if (filteredIndex > -1) state.filtered.splice(filteredIndex, 1);
        state.totalPages = Math.ceil(state.filtered.length / state.maxPage) || 1;
        state.activePage = Math.min(state.activePage, state.totalPages);
        state.message = "Clinic deleted successfully.";
        state.isSuccess = true;
        state.isLoading = false;
      })
      .addCase(DESTROY.rejected, (state, action) => {
        const { error } = action;
        state.message = error.message;
        state.isLoading = false;
      });
  },
});

export const {
  SetCREATE,
  SetEDIT,
  SetFILTER,
  SetPAGE,
  /**
   * for pagination
   */
  SetMaxPage,
  SetActivePAGE,
  TOGGLE,
  RESET,
} = reduxSlice.actions;

export default reduxSlice.reducer;
