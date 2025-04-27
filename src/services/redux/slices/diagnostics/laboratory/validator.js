import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axioKit } from "../../../../utilities";

const url = "commerce/pos/services/deals";
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
  task: {}, // per form
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
  `${url}/tasks`,
  ({ token, key }, thunkAPI) => {
    try {
      return axioKit.universal(`${url}/tasks`, token, key);
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
  name: url,
  initialState,
  reducers: {
    SetVALIDATOR: (state, { payload }) => {
      const identifier = ["Miscellaneous", "Xray", "Ultrasound"].includes(
        payload?.form
      )
        ? "dealId"
        : "_id";

      const findIndex = (collections) =>
        collections.findIndex((item) => item?._id === payload[identifier]);

      const findFormIndex = (forms) =>
        forms.findIndex((item) => item?._id === payload?._id);

      const updateCollection = (collections, index) => {
        if (index > -1) {
          if (identifier === "_id") {
            collections[index].forms[payload.form] = payload;
          } else {
            const formIndex = findFormIndex(
              collections[index].forms[payload.form]
            );
            if (formIndex > -1) {
              collections[index].forms[payload.form][formIndex] = payload;
            }
          }
        }
      };

      updateCollection(state.collections, findIndex(state.collections));
      updateCollection(state.filtered, findIndex(state.filtered));
    },
    SetFILTERED: (state, { payload }) => {
      state.filtered = payload;
    },
    SetSELECTED: (state, { payload }) => {
      const { activeCOLAPSE, deal } = payload;
      state.selected = { ...deal };
      state.activeCOLAPSE = activeCOLAPSE;
    },
    SetTASK: (state, { payload }) => {
      const { task } = payload;
      state.task = task;
      state.showModal = true;
    },
    /**
     * for U/A, CBC, Feca
     */
    SetPARAMS: (state, { payload }) => {
      const { key, value } = payload;
      state.params = { ...state.params, [key]: value };
    },
    SetPackages: (state, { payload }) => {
      state.params = payload;
    },
    SetHEALTHY: (state, { payload }) => {
      state.task = { ...state.task, ...healthyClient[payload] };
    },
    SetPREFERENCES: (state, { payload }) => {
      state.preferences = payload;
    },
    SetHEADS: (state, { payload }) => {
      state.heads = payload;
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
  SetSELECTED,
  SetTASK,
  SetPARAMS,
  SetPackages,
  SetFILTERED,
  SetMODAL,
  SetPREFERENCES,
  SetHEADS,
  SetHEALTHY,
  SetVALIDATOR,
  SetMaxPage,
  SetActivePAGE,
  TOGGLE,
  RESET,
} = reduxSlice.actions;

export default reduxSlice.reducer;
