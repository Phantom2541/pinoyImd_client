import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axioKit } from "../../../../utilities";

const url = "assets/persons/heads";

const initialState = {
  collections: [],
  filtered: [],
  showModal: false,
  willCreate: false,
  willUpdate: false,
  selected: {},
  formSubmitted: false,
  isSuccess: false,
  isLoading: false,
  message: "",
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
    RESET: (state) => {
      state.isSuccess = false;
      state.formSubmitted = false;
      state.message = "";
    },
    SetCREATE: (state) => {
      state.selected = {
        user: "",
        department: "",
        section: "",
        fullName: {
          fname: "",
          mname: "",
          lname: "",
          suffix: "",
        },
        prc: {
          id: "",
          from: "",
          to: "",
        },
      };

      state.willCreate = true;
      state.showModal = true;
    },
    SetEDIT: (state, { payload }) => {
      const { user = {}, ...rest } = payload;
      const { fullName = {}, prc = {} } = user;

      // Remove `from` from prc dynamically
      const { from, ...filteredPrc } = prc;

      state.selected = {
        ...rest,
        ...fullName, // all keys from fullName (fname, lname, etc.)
        ...filteredPrc, // all keys from prc, except `from`
      };

      state.willCreate = false;
      state.showModal = true;
    },
    SetUPDATE: (state, { payload }) => {
      state.selected = payload;
      state.willUpdate = true;
      state.showModal = true;
    },
    SetPRC: (state, { payload }) => {
      console.log("payloadd in set prc", payload);
      const { prc, userId } = payload;
      const updateCollections = (collections) => {
        const foundUser = collections.filter(
          ({ user }) => user?._id === userId
        );
        foundUser.forEach((element) => {
          const index = collections.findIndex(({ _id }) => _id === element._id);
          const oldData = { ...collections[index] };
          collections[index] = { ...oldData, user: { ...oldData.user, prc } };
        });
      };

      updateCollections(state.collections);
      updateCollections(state.filtered);
    },
    SetSELECTED: (state, { payload }) => {
      state.selected = payload;
      state.showModal = true;
      state.willCreate = false;
    },
    TOGGLE: (state) => {
      state.showModal = !state.showModal;
      state.selected = {};
    },
    SetCOLLECTIONS: (state, { payload }) => {
      state.collections = payload;
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
        state.collections = state.filtered = payload;
        state.isLoading = false;
      })
      .addCase(BROWSE.rejected, (state, action) => {
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
        state.isSuccess = true;
        state.formSubmitted = false;
      })
      .addCase(SAVE.rejected, (state, action) => {
        const { error } = action;
        state.message = error.message;
        state.formSubmitted = false;
      })

      .addCase(UPDATE.pending, (state) => {
        state.formSubmitted = true;
        state.isSuccess = false;
        state.message = "";
      })
      .addCase(UPDATE.fulfilled, (state, action) => {
        const { success, payload } = action.payload;
        const index = state.collections.findIndex(
          (item) => item?._id === payload._id
        );

        state.collections[index] = payload;
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
        const { success } = action.payload;
        const index = state.collections.findIndex(
          (item) => item?._id === action.payload
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
  SetCREATE,
  SetEDIT,
  SetUPDATE,
  SetPRC,
  SetCOLLECTIONS,
  SetSELECTED,
  SetFILTERED,
  TOGGLE,
  SetMaxPage,
  SetActivePAGE,
} = reduxSlice.actions;

export default reduxSlice.reducer;
