import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axioKit } from "../../../../utilities";
import { Services } from "../../../../../services/fakeDb/index";

const url = "diagnostics/laboratory/preferences";

const initialState = {
  collections: [],
  cluster: [],
  filtered: [],
  totalPages: 1,
  activePage: 1,
  maxPage: 5,
  template: "",
  isSuccess: false,
  isLoading: false,
  formSubmitted: false,
  message: "",
};

export const BROWSE = createAsyncThunk(
  `${url}`,
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
    SetCLUSTER: (state, { payload }) => {
      state.cluster = payload;
      state.totalPages = Math.ceil(payload.length / state.maxPage);
    },
    SetFILTEREDbyDEPARTMENT: (state, { payload }) => {
      const { template, department } = payload;

      const _filtered =
        !template && !department
          ? state.collections
          : state.collections.filter(
              ({ template: t, department: d }) =>
                (!template || t === template) &&
                (!department || d === department)
            );

      state.template = template;
      state.filtered = _filtered;
      state.cluster = _filtered;
      state.totalPages = Math.ceil(_filtered.length / state.maxPage);
    },

    SetFILTERED: (state, { payload }) => {
      if (payload === -1) {
        state.filtered = [...state.collections];
        state.cluster = state.collections;
        state.totalPages = Math.ceil(state.collections.length / state.maxPage);
      } else {
        state.cluster = [...payload];
        state.filtered = [...payload];
        state.totalPages = Math.ceil(payload.length / state.maxPage);
      }
    },
    SetPREFERENCES: (state, { payload }) => {
      state.cluster = state.filtered = state.collections = [...payload];
      state.isLoading = false;
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
      .addCase(BROWSE.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.message = "";
      })
      .addCase(BROWSE.fulfilled, (state, action) => {
        const { payload } = action.payload;
        const services = [...Services.collections].map((service) => {
          const references = payload.filter(
            ({ serviceId }) => serviceId === service.id
          );
          return { ...service, references };
        });
        state.cluster = [...services];
        state.filtered = [...services];
        state.collections = [...services];
        localStorage.setItem("preferences", JSON.stringify(services));
        state.totalPages = Math.ceil(services.length / state.maxPage);
        state.activePage = 1;
        state.maxPage = 5;
        state.isLoading = false;
      })
      .addCase(BROWSE.rejected, (state, action) => {
        const { error } = action;
        state.message = error.message;
        state.formSubmitted = false;
      })

      .addCase(SAVE.pending, (state) => {
        state.formSubmitted = true;
        state.isSuccess = false;
        state.message = "";
      })
      .addCase(SAVE.fulfilled, (state, action) => {
        const { success, payload } = action.payload;

        const targetId = payload.serviceId;

        const updateReferences = (list) => {
          const item = list.find((item) => item.id === targetId);
          if (item) {
            if (Array.isArray(item.references)) {
              item.references.push(payload);
            } else {
              item.references = [payload];
            }
          }
        };

        // Update collections
        updateReferences(state.collections);

        // Update if exists in filtered/cluster
        updateReferences(state.filtered);
        updateReferences(state.cluster);

        // Save to localStorage
        localStorage.setItem("preferences", JSON.stringify(state.collections));
        state.message = success;
        state.isSuccess = true;
        state.formSubmitted = false;
      })

      .addCase(SAVE.rejected, (state, action) => {
        const { error } = action;
        state.message = error.message;
        state.formSubmitted = false;
      })

      .addCase(UPDATE.pending, (state) => {
        // state.isLoading = true;
        state.isSuccess = false;
        state.message = "";
      })
      .addCase(UPDATE.fulfilled, (state, action) => {
        const { success, payload } = action.payload;

        const updateItem = (list) => {
          const serviceIndex = list.findIndex(
            (item) => item.id === payload.serviceId
          );
          if (serviceIndex === -1) {
            console.warn("🚫 Walang tumugma sa serviceId:", payload.serviceId);
            return;
          }

          const service = list[serviceIndex];

          // Update matching reference inside references[]
          const refIndex = service.references?.findIndex(
            (ref) => ref._id === payload._id
          );
          if (refIndex !== -1 && refIndex !== undefined) {
            service.references[refIndex] = {
              ...service.references[refIndex],
              ...payload,
            };
          } else {
            // Optional: push if reference not found (only if you want this behavior)
            console.warn("⚠️ Reference not found. Payload will be added.");
            service.references = [...(service.references || []), payload];
          }

          // Update main item (service), preserving existing structure
          list[serviceIndex] = {
            ...service,
            // Don't overwrite references again — already updated in place
          };
        };

        updateItem(state.collections);
        updateItem(state.filtered);
        updateItem(state.cluster);

        state.message = success;
        state.isSuccess = true;
        state.isLoading = false;

        localStorage.setItem("preferences", JSON.stringify(state.collections));
      })

      .addCase(UPDATE.rejected, (state, action) => {
        const { error } = action;
        state.message = error.message;
        state.isLoading = false;
      })
      .addCase(DESTROY.pending, (state) => {
        state.isSuccess = false;
        state.message = "";
      })
      .addCase(DESTROY.fulfilled, (state, action) => {
        const { success, payload } = action.payload;

        const updateCollections = (collections) => {
          const service = collections.find(
            (item) => item.id === payload.serviceId
          );
          const { references } = service;
          const index = references.findIndex(
            (item) => item._id === payload._id
          );
          references.splice(index, 1);
        };
        updateCollections(state.collections);
        updateCollections(state.cluster);
        updateCollections(state.filtered);
        localStorage.setItem("preferences", JSON.stringify(state.collections));
        state.message = success;
        state.isSuccess = true;
      })
      .addCase(DESTROY.rejected, (state, action) => {
        const { error } = action;
        state.message = error.message;
      });
  },
});

export const {
  RESET,
  SetCLUSTER,
  SetFILTERED,
  SetFILTEREDbyDEPARTMENT,
  SetPREFERENCES,
  SetMaxPage,
  SetActivePAGE,
} = reduxSlice.actions;

export default reduxSlice.reducer;
