import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axioKit } from "../../../../utilities";

const url = "/diagnostics/clinic/appointments";

const initialState = {
  filter: [],
  paginated: [],
  physician: "",
  // Bread attributes
  selected: {}, // assurance
  page: 0,
  willCreate: false,
  showModal: false,
  /**
   * pagination
   */
  roster: [],
  collections: [],
  scheds: [],
  filtered: [],
  physicians: [],
  maxPage: 5,
  totalPages: 0,
  activePage: 1,
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
    SetPHYSICIAN: (state, { payload }) => {
      const arrangePayload = (collections) => {
        return collections.flatMap(({ user, appointments = [] }) => {
          return appointments?.map((appt) => ({
            ...appt,
            doctor: user,
          }));
        });
      };
      if (payload === "all") {
        state.physician = payload;
        state.filtered = arrangePayload(state.collections);
      } else {
        state.filtered =
          state.collections.find(({ user }) => user._id === payload)
            ?.appointments || [];
        state.physician = payload;
      }
    },
    SetEDIT: (state, { payload }) => {
      state.selected = payload;
      state.willCreate = false;
      state.showModal = true;
    },
    SetCREATE: (state, { payload }) => {
      state.selected = {
        lo: "",
        norm: "",
        hi: "",
        serviceId: payload.serviceId,
      };
      state.willCreate = true;
      state.showModal = true;
    },
    SetFILTER: (state, { payload }) => {
      console.log("payload", payload);

      const { page, maxPage } = state;
      if (payload.length > 0) {
        let totalPages = Math.floor(payload.length / maxPage);
        if (payload.length % maxPage > 0) totalPages += 1;
        state.totalPages = totalPages;
        if (page > totalPages) {
          state.page = totalPages;
        }
      }
      state.filtered = payload;
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
    SetPAGE: (state, { payload }) => {
      state.page = payload;
    },
    RESET: (state) => {
      state.isSuccess = false;
      state.message = "";
    },
    /**
     *  for pagination
     */
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
  },
  extraReducers: (builder) => {
    builder
      .addCase(BROWSE.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.message = "";
      })
      .addCase(BROWSE.fulfilled, (state, action) => {
        const { success, payload = [] } = action.payload;
        state.roster = payload;
        state.physicians = payload.map(({ physicianId }) => physicianId);
        // initial values
        state.physician = payload[0].physicianId;
        state.collections = payload[0].appointments;
        state.filtered = payload[0].appointments;
        // 👉 result: ["M0709-0915","W0709-0917", ...]
        const scheds = (payload[0]?.schedules || [])
          .map(({ days, start, end }) => {
            return days.map((day) => {
              const code = generateScheduleCode(day);
              return `${day}${String(start.hour).padStart(2, "0")}${String(
                end.hour
              ).padStart(2, "0")}-${code}`;
            });
          })
          .flat();
        state.scheds = sortSchedules(scheds);

        state.totalPages = Math.ceil(payload?.length / state.maxPage) || 1;
        state.activePage = Math.min(state.activePage, state.totalPages);
        state.isSuccess = success;
        state.isLoading = false;
      })
      .addCase(BROWSE.rejected, (state, action) => {
        const { error } = action;
        state.message = error.message;
        state.isLoading = false;
      })

      .addCase(SAVE.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.message = "";
      })
      .addCase(SAVE.fulfilled, (state, { payload }) => {
        state.collections.unshift(payload);
        state.showModal = false;
        state.isSuccess = true;
        state.isLoading = false;
      })
      .addCase(SAVE.rejected, (state, action) => {
        const { error } = action;
        state.message = error.message;
        state.isLoading = false;
      })

      .addCase(UPDATE.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.message = "";
      })
      .addCase(UPDATE.fulfilled, (state, action) => {
        const { success, payload } = action;
        const index = state.collections.findIndex(
          (item) => item._id === payload._id
        );

        state.collections[index] = payload;
        state.showModal = false;
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
        const { success } = action;
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

// utils/dateHelpers.js

// fixed day map
const dayMap = { Sun: 0, M: 1, T: 2, W: 3, TH: 4, F: 5, Sat: 6 };

// hanapin next date ng given day (hal. "M" → next Monday)
export function getNextDateOfDay(day) {
  const dayIndex = dayMap[day];
  if (dayIndex === undefined) return null;

  const today = new Date();
  const diff = (dayIndex + 7 - today.getDay()) % 7 || 7;
  const result = new Date(today);
  result.setDate(today.getDate() + diff);
  return result;
}

// format MMDD (e.g. Sep 15 → "0915")
export function formatMMDD(date) {
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return `${mm}${dd}`;
}

// main function: ibalik ang nearest MMDD
export function generateScheduleCode(day) {
  const date = getNextDateOfDay(day);
  return date ? formatMMDD(date) : null;
}

// order reference
const dayOrder = { Sun: 0, M: 1, T: 2, W: 3, TH: 4, F: 5, Sat: 6 };

function parseSchedule(code) {
  // ex: "M0709-0915" -> day=M, start=07
  const match = code.match(/^([A-Za-z]+)(\d{2})/);
  if (!match) return null;
  return {
    day: match[1],
    startHour: parseInt(match[2], 10),
  };
}

export function sortSchedules(schedules) {
  return [...schedules].sort((a, b) => {
    const pa = parseSchedule(a);
    const pb = parseSchedule(b);

    // kung may invalid, ilagay sa dulo
    if (!pa || !pb) return 0;

    // compare by day
    if (dayOrder[pa.day] !== dayOrder[pb.day]) {
      return dayOrder[pa.day] - dayOrder[pb.day];
    }

    // compare by startHour
    return pa.startHour - pb.startHour;
  });
}

export const {
  SetPHYSICIAN,
  SetCREATE,
  SetEDIT,
  SetFILTER,
  SetPAGE,
  /**
   * for pagination
   */
  SetMaxPage,
  SetActivePAGE,
  TOGGLE,
  RESET,
} = reduxSlice.actions;

export default reduxSlice.reducer;
