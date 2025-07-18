import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axioKit, getAge } from "../../../../utilities";
import { capitalize } from "lodash";

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
  patient: {},
  privilege: -1,
  /**
   *  Active forms
   */
  selected: {}, // Deal
  task: {}, // per form
  params: {},

  //   attributes,
  collections: [],
  filtered: [],
  filteredStatus: [],
  byGroup: "all",
  byStatus: "all",
  showModal: false,
  totalPages: 0,
  page: 1,
  maxPage: 5,
  activePage: 1,
  activeCOLAPSE: -1,
  isSuccess: false,
  print: false,
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

export const TRACKER = createAsyncThunk(
  `${url}/tracker`,
  ({ token, key }, thunkAPI) => {
    try {
      return axioKit.universal(`${url}/tracker`, token, key);
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
  name: "validator",
  initialState,
  reducers: {
    SetVALIDATOR: (state, { payload }) => {
      const form = capitalize(payload.form);
      const identifier = ["Miscellaneous", "Xray", "Ultrasound"].includes(form)
        ? "dealId"
        : "_id";

      const findIndex = (collections) =>
        collections.findIndex((item) => item?._id === payload[identifier]);
      const findFormIndex = (forms) =>
        forms.findIndex((item) => item?._id === payload?._id);

      const updateCollection = (collections, index) => {
        console.log("index", index);
        if (index > -1) {
          if (identifier === "_id") {
            collections[index].diagnostic[form] = payload;
          } else {
            const formIndex = findFormIndex(
              collections[index].diagnostic[form]
            );
            if (formIndex > -1) {
              collections[index].diagnostic[form][formIndex] = payload;
            }
          }
        }
      };

      updateCollection(state.collections, findIndex(state.collections));
      updateCollection(state.filtered, findIndex(state.filtered));
      updateCollection(state.filteredStatus, findIndex(state.filteredStatus));
    },
    SetFILTERED: (state, { payload }) => {
      if (payload.length > 0) {
        state.totalPages = Math.ceil(payload.length / state.maxPage);
        if (state.page > state.totalPages) {
          state.page = state.totalPages;
        }
      }
      state.filtered = payload;
    },
    SetByGroup: (state, action) => {
      state.byGroup = action.payload;
      console.log("SetByGroup action.payload :", action.payload);
      const selectedKey = action.payload; // e.g., "Chemistry"

      if (selectedKey === "all") {
        state.filteredStatus = state.filtered;
      } else {
        state.filteredStatus = state.filtered.filter((task) => {
          return task.diagnostic && task.diagnostic[selectedKey];
        });
      }
    },
    SetByStatus: (state, action) => {
      const filter = action.payload;

      if (filter === "all") {
        state.filteredStatus = state.filtered;
      } else {
        const isDone = filter === "true";

        state.filteredStatus = state.filtered.filter((task) => {
          if (!task.diagnostic) return false;

          const diagnostics = Object.values(task.diagnostic);

          if (isDone) {
            // Keep if any diagnostic hasDone === true
            return diagnostics.some((d) => d.hasDone === true);
          } else {
            // Keep if all diagnostics are missing hasDone or have hasDone !== true
            return diagnostics.every((d) => d.hasDone !== true);
          }
        });
      }
    },
    SetSELECTED: (state, { payload }) => {
      const { activeCOLAPSE, deal } = payload;
      state.selected = { ...deal };
      state.activeCOLAPSE = activeCOLAPSE;
    },
    SetPatient: (state, { payload }) => {
      state.patient = payload;
      const isSenior = getAge(payload.dob, true) > 59; // Use payload instead of customer
      state.privilege = payload.privilege || (isSenior ? 2 : 0);
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
    SetPrint: (state) => {
      state.print = true;
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
    TOGGLE: (state, { payload }) => {
      console.log("payload", payload);
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
        state.filteredStatus = payload;
        state.totalPages =
          Math.ceil((payload?.length || 0) / state.maxPage) || 1;
        state.activePage = Math.min(state.activePage, state.totalPages);
        state.isLoading = false;
      })
      .addCase(TASKS.rejected, (state, action) => {
        const { error } = action;
        state.message = error.message;
        state.isLoading = false;
      })

      .addCase(TRACKER.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.message = "";
      })
      .addCase(TRACKER.fulfilled, (state, action) => {
        const { payload } = action.payload;
        state.collections = state.filtered = payload;
        state.isLoading = false;
      })
      .addCase(TRACKER.rejected, (state, action) => {
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
  SetPatient,
  SetTASK,
  SetPARAMS,
  SetPrint,
  SetPackages,
  SetFILTERED,
  SetByGroup,
  SetByStatus,
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
