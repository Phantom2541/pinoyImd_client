import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axioKit } from "../../../utilities";

const url = "assets/companies";

const initialState = {
  collections: [],
  hmo: [],
  filtered: [],
  isSuccess: false,
  formSubmitted: false,
  isLoading: false,
  message: "",
  showModal: false,
  willCreate: false,
  willUPDATE: false,
  selected: {},
  /**
   * for pagination
   */
  collections: [],
  filtered: [],
  paginated: [],
  page: 0,
  maxPage: 5,
  activePage: 1,
  totalPages: 0,
  isSuccess: false,
  isloading: false,
  message: "",
};

export const BROWSE = createAsyncThunk(
  `${url}/browse`,
  ({ token, key }, thunkAPI) => {
    try {
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

export const FIND = createAsyncThunk(
  `${url}/find`,
  ({ token, key }, thunkAPI) => {
    try {
      return axioKit.universal(`${url}/find`, token, key);
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

export const VENDORS = createAsyncThunk(
  `${url}/vendors`,
  ({ token, key }, thunkAPI) => {
    try {
      return axioKit.universal(`${url}/vendors`, token, key);
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

export const OUTSOURCE = createAsyncThunk(
  `${url}/outsource`,
  ({ token, key }, thunkAPI) => {
    try {
      return axioKit.universal(`${url}/outsource`, token, key);
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

export const GETBRANCHES = createAsyncThunk(
  `${url}/getBranches`,
  ({ token }, thunkAPI) => {
    try {
      return axioKit.universal(`${url}/getBranches`, token);
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

export const SAVE = createAsyncThunk(
  `${url}/save`,
  ({ data, token }, thunkAPI) => {
    try {
      return axioKit.save(url, data, token);
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
    SetUPDATE: (state, { payload }) => {
      state.selected = payload;
      state.willUPDATE = true;
      state.showModal = true;
    },
    SetEDIT: (state, { payload }) => {
      state.selected = payload;
      state.willCreate = false;
      state.showModal = true;
    },
    SetCREATE: (state) => {
      state.selected = {
        name: "",
        agent: "",
        email: "",
        phone: "",
      };
      state.willCreate = true;
      state.showModal = true;
    },
    SetFILTER: (state, { payload }) => {
      const { page, maxPage } = state;
      if (payload.length > 0) {
        let totalPAges = Math.floor(payload.length / state.maxPage);
        if (payload.length % state.maxPage > 0) totalPAges += 1;
        state.totalPages = totalPAges;
        if (state.activePage > totalPAges) {
          state.activePage = totalPAges;
        }
      }
      state.filtered = payload;
    },
    SetHMO: (state, { payload }) => {
      console.log("payload", payload);

      state.hmo = payload;
    },
    SetPagination: (state) => {
      // {
      //   payload;
      // }getPage
      const { page, max } = state;
      // if (getPage) return array;

      state.paginated = state.filtered.slice(
        (page - 1) * max,
        max + (page - 1) * max
      );
    },
    SetCOLLECTIONS: (state, { payload }) => {
      state.collections = payload;
    },
    SetFILTERED: (state, { payload }) => {
      state.filtered = payload;
    },
    SetSELECTED: (state, { payload }) => {
      state.selected = payload;
      state.showModal = true;
    },
    TOGGLE: (state) => {
      state.showModal = !state.showModal;
      state.selected = {};
    },
    /**
     * for pagination
     */
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
        state.collections = state.filtered = action.payload;
        state.isLoading = false;
      })
      .addCase(BROWSE.rejected, (state, action) => {
        const { error } = action;
        state.message = error.message;
        state.isLoading = false;
      })
      .addCase(FIND.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.message = "";
      })
      .addCase(FIND.fulfilled, (state, action) => {
        state.collections = state.filtered = action.payload;
        state.isLoading = false;
      })
      .addCase(FIND.rejected, (state, action) => {
        const { error } = action;
        state.message = error.message;
        state.isLoading = false;
      })

      .addCase(VENDORS.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.message = "";
      })
      .addCase(VENDORS.fulfilled, (state, action) => {
        state.collections = action.payload;
        state.isLoading = false;
      })
      .addCase(VENDORS.rejected, (state, action) => {
        const { error } = action;
        state.message = error.message;
        state.isLoading = false;
      })

      .addCase(OUTSOURCE.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.message = "";
      })
      .addCase(OUTSOURCE.fulfilled, (state, action) => {
        state.collections = action.payload;
        state.isLoading = false;
      })
      .addCase(OUTSOURCE.rejected, (state, action) => {
        const { error } = action;
        state.message = error.message;
        state.isLoading = false;
      })

      .addCase(GETBRANCHES.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.message = "";
      })
      .addCase(GETBRANCHES.fulfilled, (state, action) => {
        state.collections = action.payload;
        state.isLoading = false;
      })
      .addCase(GETBRANCHES.rejected, (state, action) => {
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
        state.collections.unshift(payload);
        state.filtered.unshift(payload);
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
        const { success, payload } = action.payload;

        // ✅ Retrieve current localStorage object
        const activePlatform = JSON.parse(
          localStorage.getItem("activePlatform")
        );

        if (activePlatform?.branch) {
          const branch = activePlatform?.branch;
          const { companyId } = branch;
          localStorage.setItem(
            "activePlatform",
            JSON.stringify({
              ...activePlatform,
              branch: {
                ...branch,
                companyId: { ...companyId, hmo: payload.hmo },
              },
            })
          );
        }

        state.hmo = payload?.hmo;

        const findex = state.filtered?.findIndex(
          (item) => item._id === payload._id
        );
        if (findex !== -1 && findex !== undefined) {
          state.filtered[findex] = payload;
        }

        state.message = success;
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
  SetUPDATE,
  SetCOLLECTIONS,
  SetFILTERED,
  SetMaxPage,
  SetActivePAGE,
  TOGGLE,
  SetSELECTED,
  SetEDIT,
  SetHMO,
  SetCREATE,
  SetFILTER,
} = reduxSlice.actions;

export default reduxSlice.reducer;
