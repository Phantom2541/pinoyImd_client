import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axioKit } from "../../../../utilities";

const name = "commerce/pos/services/deals";
const healthyClient = {
  urinalysis: {
    pe: [2, 0, 1, 1],
    ce: [0, 0, 0, 0, 0, 0, 0, 0],
    me: [1, 0, 0, 0, 0, 0],
  },
  parasitology: {
    pe: [0, 0],
    me: [0, 0, 0],
    remarks: "NO OVA OR INTESTINAL PARASITE SEEN",
  },
};

const initialState = {
  /**
   * Support tables
   */
  heads: [],
  preferences: [],
  /**
   *  Active forms
   */
  selected: {}, // Deal
  task:{}, // per form
  params: {},

  //   attributes,
  collections: [],
  filtered: [],
  showModal: false,
  maxPage: 5,
  activePage: 1,
  activeCOLAPSE: -1,
  isSuccess: false,
  isLoading: false,
  message: "",
};

export const TASKS = createAsyncThunk(
  `${name}/tasks`,
  ({ token, key }, thunkAPI) => {
    try {
      return axioKit.universal(`${name}/tasks`, token, key);
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

export const PREFERENCES = createAsyncThunk(
  `diagnostics/laboratory/preferences`,
  ({ token, branchId }, thunkAPI) => {
    try {
      return axioKit.universal(
        `diagnostics/laboratory/preferences/browse`,
        token,
        { branchId }
      );
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
export const HEADS = createAsyncThunk(
  `assets/persons/heads/browse`,
  ({ token, branchId }, thunkAPI) => {
    try {
      return axioKit.universal(`assets/persons/heads/browse`, token, {
        branchId,
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
    SetFILTERED: (state, { payload }) => {
      state.filtered = payload;
    },
    SetSELECTED: (state, { payload }) => {
      const {activeCOLAPSE, selected} = payload
      state.selected = selected;
      state.activeCOLAPSE = activeCOLAPSE;
    },
    SetTASK: (state, { payload }) => {
      state.task = payload;
    },
    SetPARAMS: (state, { payload }) => {
      state.params = payload; 

    },
    SetHEALTHY: (state, { payload }) => {
      console.log("templates", payload);

      state.task = { ...state.task, ...healthyClient[payload] };
      console.log(healthyClient[payload]);

      console.log("task", state.task);
    },
    SetMODAL: (state) => {
      state.showModal = !state.showModal;
    },
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
    RESET: (state) => {
      state.isSuccess = false;
      state.message = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(TASKS.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.message = "";
      })
      .addCase(TASKS.fulfilled, (state, action) => {
        const { payload } = action.payload;
        state.collections = payload;
        state.filtered = payload;
        state.isLoading = false;
      })
      .addCase(TASKS.rejected, (state, action) => {
        const { error } = action;
        state.message = error.message;
        state.isLoading = false;
      })
      .addCase(PREFERENCES.pending, (state) => {
        state.message = "no preferences";
      })
      .addCase(PREFERENCES.fulfilled, (state, action) => {
        const { payload } = action.payload;
        state.preferences = payload;
        state.isLoading = false;
      })
      .addCase(PREFERENCES.rejected, (state, action) => {
        const { error } = action;
        state.message = error.message;
        state.isLoading = false;
      })
      .addCase(HEADS.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.message = "";
      })
      .addCase(HEADS.fulfilled, (state, action) => {
        const { payload } = action.payload;
        state.heads = payload;
        state.isLoading = false;
      })
      .addCase(HEADS.rejected, (state, action) => {
        const { error } = action;
        state.message = error.message;
        state.isLoading = false;
      });
  },
});

export const {
  SetDEAL,
  SetSELECTED,
  SetTASK,
  SetMODAL,
  SetHEALTHY,
  SetMaxPage,
  SetActivePAGE,
  TOGGLE,
  RESET,
} = reduxSlice.actions;

export default reduxSlice.reducer;
