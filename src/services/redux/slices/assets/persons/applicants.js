import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axioKit } from "../../../../utilities";

const url = "assets/persons/applicants";

const initialState = {
  collections: [],
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
};

export const BROWSE = createAsyncThunk(
  `${url}`,
  ({ token, data }, thunkAPI) => {
    try {
      return axioKit.universal(`${url}/browse`, token, data);
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

export const USER = createAsyncThunk(
  `${url}/user`,
  ({ token, branchId, userId }, thunkAPI) => {
    try {
      return axioKit.universal(`${url}/user`, token, { branchId, userId });
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

export const EMPLOYEES = createAsyncThunk(
  `${url}/employees`,
  ({ token, branch }, thunkAPI) => {
    try {
      return axioKit.universal(`${url}/employees`, token, { branch });
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

export const UPDATE = createAsyncThunk(
  `${url}/update`,
  ({ data, token }, thunkAPI) => {
    try {
      return axioKit.update(url, data, token);
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
    ToggleAccessModal: (state, _) => {
      state.showAccessModal = !state.showAccessModal;
    },
    ToggleViewCredential: (state, _) => {
      state.showViewCredential = !state.showViewCredential;
    },
    SetSELECTED: (state, { payload }) => {
      state.selected = payload;
      state.showAccessModal = true;
    },

    SetCREDENTIAL: (state, { payload }) => {
      console.log("clicked set credential");
      state.selected = payload;
      state.showViewCredential = true;
    },
    SetREQUIREMENTS: (state, { payload }) => {
      state.selected = payload;
      state.showAccessModal = true;
    },
    UPDATEACCESS: (state, data) => {
      // used for updating access in file201
      const { _id, access, isNew = false } = data.payload,
        { collections } = state;

      const index = collections.findIndex((item) => item._id === _id);

      const personnelAccess = [...collections[index].access];

      var newAccess = [];

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
    RESET: (state, data) => {
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
        const { payload, query } = action.payload;
        const { branchId } = query; // if we have a companyId it means browse by headquarter
        if (branchId) {
          state.collections = payload;
        } else {
          state.branches = payload.map(({ applicant, ...rest }) => rest);
          state.collections = payload.flatMap(({ applicants }) => applicants);
        }
        state.isLoading = false;
      })
      .addCase(BROWSE.rejected, (state, action) => {
        const { error } = action;
        state.message = error.message;
        state.isLoading = false;
      })

      .addCase(USER.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.message = "";
      })
      .addCase(USER.fulfilled, (state, action) => {
        const { personnels } = action.payload;
        state.personnel = personnels;
        state.isLoading = false;
      })
      .addCase(USER.rejected, (state, action) => {
        const { error } = action;
        state.message = error.message;
        state.isLoading = false;
      })

      .addCase(EMPLOYEES.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.message = "";
      })
      .addCase(EMPLOYEES.fulfilled, (state, action) => {
        // const { payload } = action.payload;
        state.collections = action.payload;
        state.isLoading = false;
      })
      .addCase(EMPLOYEES.rejected, (state, action) => {
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

        const updateCollections = (collections) => {
          const index = collections.findIndex(
            (item) => item._id === payload?._id
          );
          const oldInfo = state.collections[index];
          const newInfo = { ...oldInfo, ...payload };
          collections[index] = newInfo;
        };
        updateCollections(state.collections);
        state.message = success;
        state.isSuccess = true;
        state.formSubmitted = false;
      })
      .addCase(UPDATE.rejected, (state, action) => {
        const { error } = action;
        state.message = error.message;
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

        state.collections.splice(index, 1);
        state.message = success;
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
  RESET,
  UPDATEACCESS,
  SetSELECTED,
  SetCREDENTIAL,
  SetREQUIREMENTS,
  ToggleAccessModal,
  ToggleViewCredential,
} = reduxSlice.actions;

export default reduxSlice.reducer;
