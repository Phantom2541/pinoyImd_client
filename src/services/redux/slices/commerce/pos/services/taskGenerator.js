import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  axioKit,
  fetchTracker,
  getDepartment,
  socket,
} from "../../../../../utilities";
import { Services } from "../../../../../fakeDb";
import {
  IDB_BROWSE,
  IDB_BULK_SAVE,
  IDB_UPDATE,
} from "../../../../../indexDB/commerce/pos/services/onboardings";

import { IDB_SAVE as IDB_SAVE_TASK } from "../../../../../indexDB/commerce/pos/services/tasks";

const url = "commerce/pos/services/deals";
const asyncThunkName = "taskGenerator";

const initialState = {
  collections: [],
  filtered: [],
  inhouse: [],
  cluster: {},
  _id: "default",
  activeStatus: "all",
  source: "",
  physician: "",
  transaction: { _id: "default" },
  isSuccess: false,
  show: false,
  isLoading: false,
  message: "",
  onPrint: false,
  form: "inhouse",
  selected: {
    _id: "default",
  },
  //pagination
  maxPage: 6, // for max page
  totalPages: 0, // for pages
  activePage: 1, // for active page
};

export const BROWSE = createAsyncThunk(
  `${asyncThunkName}/browse`,
  async ({ token, key }, thunkAPI) => {
    try {
      var res = await axioKit.universal(`${url}/browse`, token, key);
      if (res?.payload) {
        await IDB_BULK_SAVE(res.payload);
        res.payload = await IDB_BROWSE();
      }
      return res;
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
export const TASKS = createAsyncThunk(
  `${asyncThunkName}/tasks`,
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

export const TAGGING = createAsyncThunk(
  `${asyncThunkName}/tagging`,
  ({ key, token }, thunkAPI) => {
    try {
      return axioKit.universal(`${url}/tagging`, token, key);
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
export const REFORM = createAsyncThunk(
  `${asyncThunkName}/update/taskGenerator`,
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
export const SAVE = createAsyncThunk(
  `${asyncThunkName}/save`,
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

export const reduxSlice = createSlice({
  name: "taskGenerator",
  initialState,
  reducers: {
    TOGGLE: (state) => {
      state.show = !state.show;
    },
    SetCOLLECTIONS: (state, { payload }) => {
      const { department, onboardings = [] } = payload;
      state.collections = state.filtered = onboardings
        .map((item, index) => ({
          ...item,
          pn: onboardings.length - index,
          cart: item?.cart?.filter(({ packages }) =>
            Services.filterByDepartment(
              packages,
              department?.toLowerCase() === "laboratory" ? "LAB" : "RAD"
            )
          ),
        }))
        .filter(({ cart }) => cart?.length > 0);
      state.totalPages =
        Math.ceil((onboardings?.length || 0) / state.maxPage) || 1;
    },

    SetSTATUS: (state, { payload }) => {
      const { status: stats, department } = payload;
      const status = stats.toLowerCase();
      var filtered = [];
      if (status === "all") {
        filtered = [...state.collections];
      } else if (status === "generated") {
        filtered = [...state.collections].filter(({ rendered }) =>
          rendered.some(
            ({ dept }) => dept === (department === "Laboratory" ? "LAB" : "RAD")
          )
        );
      } else {
        filtered = [...state.collections].filter(
          ({ rendered }) =>
            !rendered.some(
              ({ dept }) =>
                dept === (department === "Laboratory" ? "LAB" : "RAD")
            )
        );
      }
      state.activeStatus = status;
      state.filtered = filtered;
      state.totalPages =
        Math.ceil((filtered?.length || 0) / state.maxPage) || 1;
      state.activePage = Math.min(state.activePage, state.totalPages);
    },

    InsertRealtimeOnboard: (state, { payload }) => {
      const { cart: baseCart = [], department } = payload;
      const formattedCart = baseCart
        ?.map(({ packages, ...rest }) => {
          const packagesFormatted = Services.filterByDepartment(
            packages,
            getDepartment(department)
          );
          return { packages: packagesFormatted || [], ...rest };
        })
        .filter(({ packages }) => packages?.length > 0);
      //this reducer is for received realtime onboard and set into the filtered and collections
      if (formattedCart?.length > 0) {
        state.collections.unshift(payload);
        state.filtered.unshift(payload);
      }
    },

    SetACTIVE_STATUS: (state, { payload }) => {
      state.activeStatus = payload;
    },

    SetSELECTED: (state, { payload }) => {
      const list = payload.cart?.flatMap((item) => item.packages || []);
      const _inhouse = Services.whereIn(list);
      state.inhouse = _inhouse;
      state.cluster = {};
      state.selected = payload;
      state.show = true;
    },
    SetINHOUSE: (state, { payload }) => {
      const { data, id } = payload;
      const index = state.cluster[id].findIndex((item) => item.id === data.id);
      if (index > -1) {
        const selectedSource = state.cluster[id];
        selectedSource.splice(index, 1);
        if (selectedSource.length === 0) {
          delete state.cluster[id];
        } else {
          state.cluster[id] = selectedSource;
        }
      }
      state.inhouse.push(data);
    },
    SetOUTSOURCE: (state, { payload }) => {
      const { data, id } = payload;
      const index = state.inhouse.findIndex((item) => item.id === data.id);
      if (index > -1) {
        state.inhouse.splice(index, 1);
      }
      if (!state.cluster[id]) {
        state.cluster[id] = [];
      }
      state.cluster[id].push(data);
    },

    SETSOURCE: (state, { payload }) => {
      state.source = payload.source;
      state._id = payload._id;
    },
    SETPHYSICIAN: (state, { payload }) => {
      state.physician = payload.physician;
      state._id = payload._id;
    },
    RESET: (state, { payload = {} }) => {
      state.isSuccess = false;
      state.message = "";

      if (payload?.resetCollections) state.collections = [];
    },
    SetPrinting: (state, { payload }) => {
      const { status, selected, form } = payload;
      state.onPrint = status;
      state.selected = selected;
      state.form = form;
    },
    SetActivePAGE: (state, { payload }) => {
      state.activePage = payload;
    },
    SetMaxPage: (state, { payload }) => {
      state.maxPage = payload;

      state.totalPages =
        Math.ceil((state.filtered?.length || 0) / payload) || 1;
      state.activePage = 1;
    },
    SetFILTERED: (state, { payload }) => {
      state.filtered = payload;
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
        const { payload, department } = action.payload;
        // filter by department
        const collectionsWithPN = payload
          .map((item) => ({
            ...item,
            cart: item?.cart
              ?.map(({ packages, ...rest }) => {
                const packagesFormatted = Services.filterByDepartment(
                  packages,
                  getDepartment(department)
                );
                return { packages: packagesFormatted, ...rest };
              })
              .filter(({ packages }) => packages?.length > 0),
          }))
          .filter(({ cart }) => cart?.length > 0)
          .map((item, index, arr) => ({
            ...item,
            pn: arr.length - index,
          }));

        state.collections = state.filtered = collectionsWithPN;

        state.totalPages =
          Math.ceil((payload?.length || 0) / state.maxPage) || 1;
        state.activePage = Math.min(state.activePage, state.totalPages);
        state.isLoading = false;
        fetchTracker.setLoaded("onboardings");
      })
      .addCase(BROWSE.rejected, (state, action) => {
        const { error } = action;
        state.message = error.message;
        state.isLoading = false;
      })
      .addCase(TAGGING.pending, (state) => {
        // state.isLoading = true;
        // state.isSuccess = false;
        state.message = "";
      })
      .addCase(TAGGING.fulfilled, (state, action) => {
        const { payload } = action.payload;
        const index = state.collections.findIndex((c) => c._id === payload._id);

        state.collections[index] = payload;

        state.isLoading = false;
      })
      .addCase(TAGGING.rejected, (state, action) => {
        const { error } = action;
        state.message = error.message;
        state.isLoading = false;
      })
      .addCase(TASKS.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.message = "";
      })
      .addCase(TASKS.fulfilled, (state, action) => {
        const { payload } = action.payload;
        state.collections = payload;
        state.isLoading = false;
      })
      .addCase(TASKS.rejected, (state, action) => {
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
        state.transaction = payload;
        state.isSuccess = true;
        state.isLoading = false;
      })
      .addCase(SAVE.rejected, (state, action) => {
        const { error } = action;
        state.message = error.message;
        state.isLoading = false;
      })
      .addCase(REFORM.pending, (state) => {
        state.isSuccess = false;
        state.message = "";
      })
      .addCase(REFORM.fulfilled, (state, action) => {
        const { success, payload, task } = action.payload;

        const updateCollections = (collections) => {
          const index = collections.findIndex(
            (item) => item._id === payload._id
          );
          const oldCollections = collections[index];
          collections[index] = { ...oldCollections, ...payload };
        };

        updateCollections(state.collections);
        updateCollections(state.filtered);

        IDB_UPDATE(payload);
        //this is for realtime send in task page in another client
        socket.emit("send_updated_onboarding", payload);
        if (fetchTracker.hasLoaded("tasks")) {
          //this is for saving local indexDB
          IDB_SAVE_TASK(task);
        }
        socket.emit("send_tasks", task);
        state.message = success;
        state.isSuccess = true;
        state.isLoading = false;
      })
      .addCase(REFORM.rejected, (state, action) => {
        const { error } = action;
        state.message = error.message;
        state.isLoading = false;
      });
  },
});

export const {
  RESET,
  SetCOLLECTIONS,
  SETSOURCE,
  SetSTATUS,
  SETPHYSICIAN,
  SetSELECTED,
  TOGGLE,
  SetOUTSOURCE,
  SetINHOUSE,
  SetPrinting,
  SetActivePAGE,
  SetMaxPage,
  SetACTIVE_STATUS,
  SetFILTERED,
  //socket
  InsertRealtimeOnboard,
  UpdateRealtimeOnboard,
} = reduxSlice.actions;

export default reduxSlice.reducer;
