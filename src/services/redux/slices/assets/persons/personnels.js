import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axioKit } from "../../../../utilities";

const name = "assets/persons/personnels";

const initialState = {
  collections: [],
  personnel: {},

  isSuccess: false,
  isLoading: false,
  message: "",
};

export const BROWSE = createAsyncThunk(
  `${name}`,
  ({ token, branchId, status }, thunkAPI) => {
    try {
      return axioKit.universal(`${name}/browse`, token, { branchId, status });
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

export const PAYROLL = createAsyncThunk(
  `${name}/payroll`,
  ({ token, branchId }, thunkAPI) => {
    try {
      return axioKit.universal(`${name}/payroll`, token, { branchId });
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
  `${name}/user`,
  ({ token, branchId, userId }, thunkAPI) => {
    try {
      return axioKit.universal(`${name}/user`, token, { branchId, userId });
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
  `${name}/employees`,
  ({ token, branch }, thunkAPI) => {
    try {
      return axioKit.universal(`${name}/employees`, token, { branch });
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

export const SAVE = createAsyncThunk(`${name}/save`, (form, thunkAPI) => {
  try {
    return axioKit.save(name, form.data, form.token);
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();

    return thunkAPI.rejectWithValue(message);
  }
});

export const UPDATE_ACCESS = createAsyncThunk(
  `${name}/UPDATE_ACCESS`,
  (form, thunkAPI) => {
    try {
      return axioKit.save(name, form.data, form.token, "update-access");
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

export const UPDATE = createAsyncThunk(`${name}/update`, (form, thunkAPI) => {
  try {
    return axioKit.update(name, form.data, form.token);
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();

    return thunkAPI.rejectWithValue(message);
  }
});

export const APPLICATION = createAsyncThunk(
  `${name}/application`,
  ({ data, token }, thunkAPI) => {
    try {
      return axioKit.universal(`${name}/application`, token, {
        auth: data?._id,
      });
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
    UPDATEACCESS: (state, data) => {
      // used for updating access in file201
      const { _id, access, isNew = false } = data.payload,
        { collections } = state;

      const index = collections.findIndex(item => item._id === _id);

      const personnelAccess = [...collections[index].access];

      var newAccess = [];

      if (isNew) {
        newAccess = personnelAccess.concat(access);
      } else {
        newAccess = personnelAccess.map(pAccess => {
          if (access.find(_access => _access._id === pAccess._id)) {
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
  extraReducers: builder => {
    builder
      .addCase(UPDATE_ACCESS.pending, state => {
        state.isLoading = true;
        state.isSuccess = false;
        state.message = "";
      })
      .addCase(UPDATE_ACCESS.fulfilled, (state, action) => {
        const { success, payload } = action.payload;
        const { staffID, accessChanges } = payload;
        const { deleted, added } = accessChanges;
        const index = state.collections.findIndex(item => item._id === staffID);

        const staff = state.collections[index];
        var StaffAccess = [...staff.access];

        if (deleted.length > 0) {
          deleted.forEach(element => {
            const index = StaffAccess.findIndex(
              item => item._id === element._id
            );
            //console.log(index);
            StaffAccess.splice(index, 1);
          });
        }

        if (added.length > 0) {
          StaffAccess = [...added, ...StaffAccess];
        }
        state.collections[index] = {
          ...staff,
          access: StaffAccess,
        };

        state.message = success;
        state.isSuccess = true;
        state.isLoading = false;
      })
      .addCase(UPDATE_ACCESS.rejected, (state, action) => {
        const { error } = action;
        state.message = error.message;
        state.isLoading = false;
      })
      .addCase(BROWSE.pending, state => {
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
      .addCase(APPLICATION.pending, state => {
        state.isLoading = true;
        state.isSuccess = false;
        state.message = "";
      })
      .addCase(APPLICATION.fulfilled, (state, action) => {
        const { payload } = action.payload;
        state.collections = payload;
        state.isLoading = false;
      })
      .addCase(APPLICATION.rejected, (state, action) => {
        const { error } = action;
        state.message = error.message;
        state.isLoading = false;
      })

      .addCase(PAYROLL.pending, state => {
        state.isLoading = true;
        state.isSuccess = false;
        state.message = "";
      })
      .addCase(PAYROLL.fulfilled, (state, action) => {
        const { payload } = action.payload;
        state.collections = payload;
        state.isLoading = false;
      })
      .addCase(PAYROLL.rejected, (state, action) => {
        const { error } = action;
        state.message = error.message;
        state.isLoading = false;
      })

      .addCase(USER.pending, state => {
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

      .addCase(EMPLOYEES.pending, state => {
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

      .addCase(SAVE.pending, state => {
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

      .addCase(UPDATE.pending, state => {
        state.isLoading = true;
        state.isSuccess = false;
        state.message = "";
      })
      .addCase(UPDATE.fulfilled, (state, action) => {
        const { success, payload } = action;

        const index = state.collections.findIndex(
          item => item._id === payload._id
        );

        state.collections[index] = payload;
        state.message = success;
        state.isSuccess = true;
        state.isLoading = false;
      })
      .addCase(UPDATE.rejected, (state, action) => {
        const { error } = action;
        state.message = error.message;
        state.isLoading = false;
      });
  },
});

export const { RESET, UPDATEACCESS } = reduxSlice.actions;

export default reduxSlice.reducer;
