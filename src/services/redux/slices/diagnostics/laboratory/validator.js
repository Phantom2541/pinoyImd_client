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
  sections: [],
  /**
   *  Active forms
   */
  selected: {}, // Deal
  task: {}, // per form
  params: {},
  work: {}, //this is for working area

  //   attributes,
  collections: [],
  filtered: [],
  filteredStatus: [],
  byGroup: "all",
  byStatus: "all",
  showWorkArea: false, //this is for working area
  showModal: false,
  showRadReader: false, //for viewing of uploaded x-ray
  isLoadingHeads: false,
  totalPages: 0,
  page: 1,
  maxPage: 5,
  activePage: 1,
  activeCOLAPSE: -1,
  isSuccess: false,
  print: false,
  isLoading: false,
  formSubmitted: false,
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

export const WORK_AREA = createAsyncThunk(
  `${url}/work_area`,
  ({ data, token, baseURL }, thunkAPI) => {
    try {
      return axioKit.update(baseURL, data, token);
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
    RECEIVE_A15: (state, { payload }) => {
      const index = state.collections.findIndex(
        (item) => item._id === payload._id
      );
      if (index > -1) {
        const updateCollections = (collections) => {
          const data = collections[index];
          collections[index] = {
            ...data,
            diagnostic: { ...data?.diagnostic, Chemistry: payload },
          };
        };
        if (state.task._id === payload._id && state.task.form === "Chemistry") {
          state.task = { ...state.task, packages: payload.packages };
        }

        updateCollections(state.collections);
        updateCollections(state.filtered);
        updateCollections(state.filteredStatus);
      }
    },
    SetVALIDATOR: (state, { payload }) => {
      const { form: _form } = payload;
      const form = ["Pheripheral Blood Smear", "2DEcho"].includes(_form)
        ? _form
        : capitalize(payload?.form);
      const identifier = ["Miscellaneous", "Xray", "Ultrasound"].includes(form)
        ? "dealId"
        : "_id";

      const findIndex = (collections) =>
        collections?.findIndex((item) => item?._id === payload[identifier]);
      const findFormIndex = (forms) =>
        forms.findIndex((item) => item?._id === payload?._id);

      const updateCollection = (collections, index) => {
        if (index < 0) return;
        var updated = { ...collections[index], status: payload.status };
        if (identifier === "_id") {
          updated.diagnostic[form] = payload;
        } else {
          const formIndex = findFormIndex(updated.diagnostic[form]);
          if (formIndex > -1) updated.diagnostic[form][formIndex] = payload;
        }
        if (updated._id === state.selected._id) state.selected = updated;
        collections[index] = updated;
      };

      updateCollection(state.collections, findIndex(state.collections));
      updateCollection(state.filtered, findIndex(state.filtered));
      updateCollection(state.filteredStatus, findIndex(state.filteredStatus));
    },
    SetRAD_READER: (state, { payload }) => {
      state.showRadReader = true;
      state.task = payload;
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
    SetCOLLECTIONS: (state, { payload }) => {
      state.collections = payload;
      state.filtered = payload;
    },
    SetByGroup: (state, action) => {
      const selectedKey = action.payload; // e.g., "Chemistry"
      if (selectedKey === "all") {
        state.filteredStatus = state.filtered;
      } else {
        state.filteredStatus = state.filtered.filter((task) => {
          return task.diagnostic && task.diagnostic[selectedKey];
        });
      }
      state.byGroup = action.payload;
      state.byStatus = "all";
      state.activePage = 1;
    },
    SetByStatus: (state, action) => {
      const { status, statusKey = "hasDone" } = action.payload;

      const groupBy = state.byGroup;
      const diagnosticGroup =
        groupBy === "all"
          ? state.filtered
          : state.filtered.filter((task) => {
              return task.diagnostic && task.diagnostic[groupBy];
            });

      if (status === "all") {
        state.filteredStatus = diagnosticGroup;
      } else {
        const isDone = status === "true";

        state.filteredStatus = diagnosticGroup.filter((task) => {
          if (!task.diagnostic) return false;
          const diagnostics =
            groupBy === "all"
              ? Object.values(task.diagnostic)
              : [task?.diagnostic[groupBy]];

          return diagnostics
            .flat(Infinity)
            [isDone ? "every" : "some"]((diag) => {
              const stat = diag?.[statusKey];
              return (stat ?? false) === isDone;
            });
        });
      }
      state.byStatus = status;
      state.activePage = 1;
    },
    SetFILTERED_STATUS: (state, { payload }) => {
      state.filteredStatus = payload;
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

    SetWorkArea: (state, { payload }) => {
      state.work = payload;
      state.showWorkArea = true;
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
    SetHEALTHY_RAD: (state, { payload }) => {
      state.task = { ...state.task, ...payload };
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
      state.showModal = !state.showModal;
    },
    TOGGLE_WORK_AREA: (state, _) => {
      state.showWorkArea = !state.showWorkArea;
    },
    TOGGLE_RAD_READER: (state, _) => {
      state.showRadReader = !state.showRadReader;
      state.task = {};
    },
    RESET: (state) => {
      state.isSuccess = false;
      state.formSubmitted = false;
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
        state.sections = [
          ...new Set(
            payload.flatMap(({ diagnostic }) => Object.keys(diagnostic))
          ),
        ].sort();

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
      .addCase(WORK_AREA.pending, (state) => {
        state.formSubmitted = true;
        state.isSuccess = false;
        state.message = "";
      })
      .addCase(WORK_AREA.fulfilled, (state, action) => {
        const { payload, section } = action.payload;
        const updateCollections = (collections) => {
          const index = collections.findIndex(
            (item) => item?._id === payload?._id
          );
          const deal = collections[index];
          collections[index] = {
            ...deal,
            diagnostic: { ...deal.diagnostic, [section]: payload },
          };
        };
        updateCollections(state.collections);
        updateCollections(state.filtered);
        updateCollections(state.filteredStatus);

        state.formSubmitted = false;
      })
      .addCase(WORK_AREA.rejected, (state, action) => {
        const { error } = action;
        state.message = error.message;
        state.formSubmitted = false;
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
        state.collections = state.filtered = [];
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
        state.isLoadingHeads = true;
        state.isSuccess = false;
        state.message = "";
      })
      .addCase(HEADS.fulfilled, (state, action) => {
        const { payload } = action.payload;
        state.heads = payload;
        state.isLoadingHeads = false;
      })
      .addCase(HEADS.rejected, (state, action) => {
        const { error } = action;
        state.message = error.message;
        state.isLoadingHeads = false;
      });
  },
});

export const {
  SetCOLLECTIONS,
  SetSELECTED,
  SetPatient,
  SetTASK,
  SetRAD_READER,
  SetWorkArea,
  SetPARAMS,
  SetPrint,
  SetPackages,
  SetFILTERED,
  SetFILTERED_STATUS,
  SetByGroup,
  SetByStatus,
  SetMODAL,
  SetPREFERENCES,
  SetHEADS,
  SetHEALTHY, //LAB
  SetHEALTHY_RAD,
  SetVALIDATOR,
  SetMaxPage,
  SetActivePAGE,
  TOGGLE,
  TOGGLE_WORK_AREA,
  TOGGLE_RAD_READER,
  RESET,

  //this is for LIS  socket to receive realtime result from A15
  RECEIVE_A15,
} = reduxSlice.actions;

export default reduxSlice.reducer;
