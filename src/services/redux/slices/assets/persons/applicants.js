import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axioKit } from "../../../../utilities";

const url = "assets/persons/applicants";

const initialState = {
  collections: [],
  filtered: [],
  branches: [],
  activeBranch: "",
  personnel: {},
  selected: {},
  formSubmitted: false,
  showAccessModal: false,
  showViewCredential: false,
  isSuccess: false,
  isLoading: false,
  message: "",
  activePage: 1,
  maxPage: 5,
  totalPages: 0,
};

export const BROWSE = createAsyncThunk(
  `${url}`,
  async ({ token, data }, thunkAPI) => {
    try {
      const response = await axioKit.universal(`${url}/browse`, token, data);
      return { payload: response, query: data }; // ensure query is included
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const SECRETARY = createAsyncThunk(
  `${url}/secretary`,
  ({ token, data }, thunkAPI) => {
    try {
      return axioKit.universal(`${url}/secretary`, token, data);
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);
export const USER = createAsyncThunk(
  `${url}/user`,
  ({ token, branchId, userId }, thunkAPI) => {
    try {
      return axioKit.universal(`${url}/user`, token, { branchId, userId });
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const EMPLOYEES = createAsyncThunk(
  `${url}/employees`,
  ({ token, branch }, thunkAPI) => {
    try {
      return axioKit.universal(`${url}/employees`, token, { branch });
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const SAVE = createAsyncThunk(`${url}/save`, (form, thunkAPI) => {
  try {
    return axioKit.save(url, form.data, form.token);
  } catch (error) {
    const message =
      error.response?.data?.message || error.message || error.toString();
    return thunkAPI.rejectWithValue(message);
  }
});

export const UPDATE = createAsyncThunk(
  `${url}/update`,
  ({ data, token }, thunkAPI) => {
    try {
      return axioKit.update(url, data, token);
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const DESTROY = createAsyncThunk(
  `${url}/destroy`,
  ({ data, token }, thunkAPI) => {
    try {
      return axioKit.destroy(url, data, token);
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const reduxSlice = createSlice({
  name: url,
  initialState,
  reducers: {
    ToggleAccessModal: (state) => {
      state.showAccessModal = !state.showAccessModal;
    },
    ToggleViewCredential: (state) => {
      state.showViewCredential = !state.showViewCredential;
    },
    SetSELECTED: (state, { payload }) => {
      state.selected = payload;
      state.showAccessModal = true;
    },
    SetMaxPage: (state, { payload }) => {
      state.maxPage = payload;
      state.activePage = 1;
    },
    setActivePage: (state, { payload }) => {
      state.activePage = payload;
    },
    SetCREDENTIAL: (state, { payload }) => {
      state.selected = payload;
      state.showViewCredential = true;
    },
    SetREQUIREMENTS: (state, { payload }) => {
      state.selected = payload;
      state.showAccessModal = true;
    },
    UPDATEACCESS: (state, data) => {
      const { _id, access, isNew = false } = data.payload;
      const { collections } = state;
      const index = collections.findIndex((item) => item._id === _id);
      const personnelAccess = [...collections[index].access];
      let newAccess = [];

      if (isNew) {
        newAccess = personnelAccess.concat(access);
      } else {
        newAccess = personnelAccess.map((pAccess) => {
          if (access.find((_access) => _access._id === pAccess._id)) {
            return {
              ...pAccess,
              status: !pAccess.status,
            };
          }
          return pAccess;
        });
      }

      state.collections[index].access = newAccess;
    },
    RESET: (state) => {
      state.isSuccess = false;
      state.message = "";
    },
    SetFilteredApplicants: (state, { payload }) => {
      const { branchId, physicianId } = payload;

      if (!branchId || !physicianId) {
        state.filtered = [];
        return;
      }

      // Optional debug log (pang-troubleshoot)
      console.log("Filtering by:", branchId, physicianId);
      console.log("Total applicants:", state.collections.length);

      state.filtered = state.collections.filter(
        (applicant) =>
          applicant.branchId === branchId &&
          applicant.physicianId === physicianId
      );
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(BROWSE.fulfilled, (state, action) => {
        const { payload, query = {} } = action.payload || {};
        const { branchId } = query;
        if (branchId) {
          state.collections = payload.payload;
          state.filtered = state.collections;
        } else {
          state.branches = Array.isArray(payload)
            ? payload.map(({ applicant, ...rest }) => rest)
            : [];
          state.collections = Array.isArray(payload)
            ? payload.flatMap(({ applicants }) => applicants)
            : [];
          state.filtered = state.collections;
        }

        state.isLoading = false;
      })

      .addCase(BROWSE.rejected, (state, action) => {
        state.message = action.error.message;
        state.isLoading = false;
      })

      .addCase(SECRETARY.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.message = "";
      })
      .addCase(SECRETARY.fulfilled, (state, action) => {
        const { payload } = action.payload || {};
        console.log("payload", payload);
        state.collections = payload;
        state.filtered = payload;
        console.log("state.collections", state.collections);

        // const { branchId } = query;

        // if (branchId) {
        //   state.collections = state.filtered = payload;
        // } else {
        //   state.branches = Array.isArray(payload)
        //     ? payload.map(({ applicant, ...rest }) => rest)
        //     : [];
        //   state.collections = Array.isArray(payload)
        //     ? payload.flatMap(({ applicants }) => applicants)
        //     : [];
        // }

        state.isLoading = false;
      })

      .addCase(SECRETARY.rejected, (state, action) => {
        state.message = action.error.message;
        state.isLoading = false;
      })

      .addCase(USER.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.message = "";
      })
      .addCase(USER.fulfilled, (state, action) => {
        state.personnel = action.payload.personnels;
        state.isLoading = false;
      })
      .addCase(USER.rejected, (state, action) => {
        state.message = action.error.message;
        state.isLoading = false;
      })

      .addCase(EMPLOYEES.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.message = "";
      })
      .addCase(EMPLOYEES.fulfilled, (state, action) => {
        state.collections = action.payload;
        state.isLoading = false;
      })
      .addCase(EMPLOYEES.rejected, (state, action) => {
        state.message = action.error.message;
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
        state.isSuccess = true;
        state.isLoading = false;
      })
      .addCase(SAVE.rejected, (state, action) => {
        state.message = action.error.message;
        state.isLoading = false;
      })

      .addCase(UPDATE.pending, (state) => {
        state.formSubmitted = true;
        state.isSuccess = false;
        state.message = "";
      })
      .addCase(UPDATE.fulfilled, (state, action) => {
        const { success, payload } = action.payload;
        const index = state.collections.findIndex(
          (item) => item._id === payload?._id
        );
        if (index !== -1) {
          const oldInfo = state.collections[index];
          state.collections[index] = { ...oldInfo, ...payload };
        }
        state.filtered = state.collections.filter(
          (applicant) =>
            applicant.branchId === payload.branchId &&
            applicant.physicianId === payload.physicianId
        );
        state.message = success;
        state.isSuccess = true;
        state.formSubmitted = false;
      })
      .addCase(UPDATE.rejected, (state, action) => {
        state.message = action.error.message;
        state.formSubmitted = false;
      })

      .addCase(DESTROY.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.message = "";
      })
      .addCase(DESTROY.fulfilled, (state, action) => {
        const { success, payload } = action.payload;
        const index = state.collections.findIndex(
          (item) => item._id === payload
        );
        if (index !== -1) {
          state.collections.splice(index, 1);
        }
        state.message = success;
        state.isSuccess = true;
        state.isLoading = false;
      })
      .addCase(DESTROY.rejected, (state, action) => {
        state.message = action.error.message;
        state.isLoading = false;
      });
  },
});

export const {
  RESET,
  UPDATEACCESS,
  SetSELECTED,
  SetCREDENTIAL,
  SetREQUIREMENTS,
  ToggleAccessModal,
  ToggleViewCredential,
  SetFilteredApplicants,
  SetMaxPage,
  setActivePage,
} = reduxSlice.actions;

export default reduxSlice.reducer;
