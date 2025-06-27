import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axioKit } from "../../../../utilities";

const url = "assets/persons/personnels";

const initialState = {
  collections: [],
  personnel: {},
  /**
   * Responsible for access control
   */
  _id: "",
  staff: {},
  contract: {},
  access: [], // Permissions or features that are available
  granted: [], // Permissions that have been acquired or activated or stock
  queued: [], // permissions are lined up for activation.
  revoked: [], // Permissions that have been removed or denied
  company: [],
  updateTracker: {
    isLoading: false,
    fieldName: "",
  },
  isSuccess: false,
  isLoading: false,
  formSubmitted: false,
  message: "",
  showModal: false,
  selected: {},
  willCreate: false,
  /**
   * Footer
   */
  filtered: [],
  maxPage: 5,
  activePage: 1,
  totalPages: 0,
};

export const BROWSE = createAsyncThunk(
  `${url}`,
  ({ token, branchId, status }, thunkAPI) => {
    try {
      return axioKit.universal(`${url}/browse`, token, { branchId, status });
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
export const BOARD_MEMBERS = createAsyncThunk(
  `${url}/board_members`,
  ({ token, params }, thunkAPI) => {
    try {
      return axioKit.universal(`${url}/board_members`, token, params);
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

export const COMPANY = createAsyncThunk(
  `${url}/company`,
  ({ token, params }, thunkAPI) => {
    try {
      return axioKit.universal(`${url}/company`, token, params);
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
  `${url}/payroll`,
  ({ token, params }, thunkAPI) => {
    try {
      return axioKit.universal(`${url}/payroll`, token, params);
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

export const UPDATE_ACCESS = createAsyncThunk(
  `${url}/UPDATE_ACCESS`,
  (form, thunkAPI) => {
    try {
      return axioKit.save(url, form.data, form.token, "update-access");
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

export const APPLICATION = createAsyncThunk(
  `${url}/application`,
  ({ data, token }, thunkAPI) => {
    try {
      return axioKit.universal(`${url}/application`, token, data);
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
    SetUPDATE_TRACKER: (state, data) => {
      state.updateTracker.fieldName = data.payload;
    },
    SetPAYROLL: (state, { payload }) => {
      const index = state?.collections?.findIndex(
        ({ user }) => user?._id === payload?.particular
      );
      state.collections[index]?.payroll.push(payload);
    },
    SETOnHotSEAT: (state, { payload }) => {
      // set default values
      state.staff = payload.user;
      state.contract = payload.contract;
      state._id = payload._id;
      state.access = payload.access;
    },
    SETQUEUED: (state, { payload }) => {
      // pending access to be granted
      const { _id, access } = payload;

      const index = state.access.queued.findIndex((item) => item._id === _id);

      if (index >= 0) {
        state.access.permited[index].access = access;
      } else {
        state.access.permited.unshift({ _id, access });
        state.access.available = state.access.available.filter(
          (item) => item._id !== _id
        );
      }
    },
    SETREVOKED: (state, { payload }) => {
      const { _id, access } = payload;
      // remove access
      state.access.permited = state.access.permited.filter(
        (item) => item._id !== payload._id
      );
      state.access.available = state.access.available.unshift({ _id, access });
    },
    SetSELECTED: (state, { payload }) => {
      console.log("payload", payload);

      state.selected = payload;
      state.willCreate = false;
      state.showModal = true;
    },
    SetFILTERED: (state, { payload }) => {
      state.filtered = payload;
    },
    SetMaxPage: (state, { payload }) => {
      state.maxPage = payload;
      state.activePage = 1;
    },
    SetActivePAGE: (state, { payload }) => {
      state.activePage = payload;
    },
    TOGGLE: (state) => {
      state.showModal = false;
    },
    RESET: (state, data) => {
      state.isSuccess = false;
      state.message = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(UPDATE_ACCESS.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.message = "";
      })
      .addCase(UPDATE_ACCESS.fulfilled, (state, action) => {
        const { success, payload } = action.payload;
        const { staffID, accessChanges } = payload;
        const { deleted, added } = accessChanges;
        if (state.collections.length === 0) return;
        const index = state.collections.findIndex(
          (item) => item._id === staffID
        );

        const staff = state.collections[index];
        var StaffAccess = [...staff.access];

        if (deleted.length > 0) {
          deleted.forEach((element) => {
            const index = StaffAccess.findIndex(
              (item) => item._id === element._id
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
      .addCase(BROWSE.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.message = "";
      })
      .addCase(BROWSE.fulfilled, (state, action) => {
        const { payload } = action.payload;
        state.collections = state.filtered = payload.sort((a, b) => {
          const aDesignation = String(a?.contract?.designation || "");
          const bDesignation = String(b?.contract?.designation || "");
          return aDesignation.localeCompare(bDesignation);
        });
        state.totalPages =
          Math.ceil((payload?.length || 0) / state.maxPage) || 1;
        state.activePage = Math.min(state.activePage, state.totalPages);
        state.isLoading = false;
      })
      .addCase(BROWSE.rejected, (state, action) => {
        const { error } = action;
        state.message = error.message;
        state.isLoading = false;
      })
      .addCase(BOARD_MEMBERS.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.message = "";
      })
      .addCase(BOARD_MEMBERS.fulfilled, (state, action) => {
        const { payload } = action.payload;
        state.collections = state.filtered = payload.sort((a, b) => {
          const aDesignation = String(a?.contract?.designation || "");
          const bDesignation = String(b?.contract?.designation || "");
          return aDesignation.localeCompare(bDesignation);
        });
        state.totalPages =
          Math.ceil((payload?.length || 0) / state.maxPage) || 1;
        state.activePage = Math.min(state.activePage, state.totalPages);
        state.isLoading = false;
      })

      .addCase(BOARD_MEMBERS.rejected, (state, action) => {
        const { error } = action;
        state.message = error.message;
        state.isLoading = false;
      })
      .addCase(COMPANY.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.message = "";
      })
      .addCase(COMPANY.fulfilled, (state, action) => {
        const { success, payload } = action.payload;
        state.company = payload; // Fix typo
        state.isSuccess = success;
        state.isLoading = false;
      })
      .addCase(COMPANY.rejected, (state, action) => {
        const { error } = action;
        state.message = error.message;
        state.isLoading = false;
      })
      .addCase(APPLICATION.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.message = "";
      })
      .addCase(APPLICATION.fulfilled, (state, { payload }) => {
        console.log("payload", payload);

        state.collections = payload;
        state.isLoading = false;
      })
      .addCase(APPLICATION.rejected, (state, action) => {
        const { error } = action;
        state.message = error.message;
        state.isLoading = false;
      })

      .addCase(PAYROLL.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.message = "";
      })
      .addCase(PAYROLL.fulfilled, (state, action) => {
        const { payload } = action.payload;
        state.collections = payload;
        state.totalPages =
          Math.ceil((payload?.length || 0) / state.maxPage) || 1;
        state.activePage = Math.min(state.activePage, state.totalPages);
        state.isLoading = false;
      })
      .addCase(PAYROLL.rejected, (state, action) => {
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
      .addCase(EMPLOYEES.fulfilled, (state, { payload }) => {
        state.collections = payload.sort((a, b) => {
          const aDesignation = String(a?.contract?.designation || "");
          const bDesignation = String(b?.contract?.designation || "");
          return aDesignation.localeCompare(bDesignation);
        });
      })
      .addCase(EMPLOYEES.rejected, (state, action) => {
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
        const { success, payload } = action.payload;
        state.message = success;
        if (state.collections) state.collections.unshift(payload);
        state.isSuccess = true;
        state.formSubmitted = false;
      })
      .addCase(SAVE.rejected, (state, action) => {
        const { error } = action;
        state.message = error.message;
        state.formSubmitted = false;
      })

      .addCase(UPDATE.pending, (state) => {
        state.updateTracker.isLoading = true;
        state.formSubmitted = true;
        state.isSuccess = false;
        state.message = "";
      })
      .addCase(UPDATE.fulfilled, (state, action) => {
        const { success, payload } = action;

        const index = state.collections.findIndex(
          (item) => item._id === payload._id
        );
        const oldPersonnel = { ...state.collections[index] };
        state.collections[index] = { ...oldPersonnel, ...payload };
        state.message = success;
        state.isSuccess = true;
        state.formSubmitted = false;
        state.updateTracker = {
          fieldName: "",
          isLoading: false,
        };
      })
      .addCase(UPDATE.rejected, (state, action) => {
        const { error } = action;
        state.formSubmitted = true;
        state.message = error.message;
        state.isUpdating = false;
      });
  },
});

export const {
  SETOnHotSEAT,
  SETQUEUED,
  SETREVOKED,
  SetPAYROLL,
  UPDATEACCESS,
  SetSELECTED,
  SetActivePAGE,
  SetMaxPage,
  TOGGLE,
  RESET,
  SetUPDATE_TRACKER,
} = reduxSlice.actions;

export default reduxSlice.reducer;
