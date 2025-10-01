import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axioKit, socket } from "../../../../utilities";

const url = "/diagnostics/clinic/appointments";

const initialState = {
  filter: [],
  paginated: [],
  patient: {},
  patientId: null,
  physician: "",
  activeSched: "",
  activePhysician: { _id: null },
  // Bread attributes
  selected: {}, // assurance
  diagnostic: {}, //for storing selected forms
  roster: [],
  collections: [],
  cluster: [], //for eHR pagination data UI
  scheds: [],
  filtered: [],
  physicians: [],
  page: 0,
  willCreate: false,
  showModal: false,
  showResultModal: false,
  showPatientModal: false,
  showTransacModal: false,
  willCreateEhr: false,
  showModalEhr: false,
  showModalVs: false,
  willCreateVs: false,
  showModalMiniEhr: false,

  /**
   * pagination
   */

  maxPage: 5,
  totalPages: 0,
  activePage: 1,
  formSubmitted: false,
  isSavingDone: false,
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

export const GET_BY_SCHED = createAsyncThunk(
  `${url}/getBySched`,
  ({ token, key }, thunkAPI) => {
    try {
      return axioKit.universal(`${url}/getBySched`, token, key);
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

//get the details of active appointment in eHR page
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

export const CHECKUP = createAsyncThunk(
  `${url}/checkup`,
  ({ token, data }, thunkAPI) => {
    try {
      return axioKit.universal(`${url}/checkup`, token, data);
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

export const DONE = createAsyncThunk(`${url}/done`, (form, thunkAPI) => {
  try {
    return axioKit.update(url, form.data, form.token, "done");
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();

    return thunkAPI.rejectWithValue(message);
  }
});

export const SET_EMR = createAsyncThunk(`${url}/set_emr`, (form, thunkAPI) => {
  try {
    return axioKit.update(url, form.data, form.token, "setEMR");
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();

    return thunkAPI.rejectWithValue(message);
  }
});

export const SET_VS = createAsyncThunk(`${url}/set_vs`, (form, thunkAPI) => {
  try {
    return axioKit.update(url, form.data, form.token, "setVS");
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

export const arrangeSchedules = (schedules = []) => {
  if (schedules.length === 0) return [];
  const scheds = schedules
    .map(({ days, start, end }) => {
      return days.map((day) => {
        const code = generateScheduleCode(day);
        return `${day}${String(start.hour).padStart(2, "0")}${String(
          end.hour
        ).padStart(2, "0")}-${code}`;
      });
    })
    .flat();

  return sortSchedules(scheds);
};
function getDefaultSchedule(scheds) {
  if (!scheds || scheds.length === 0) return "";

  const dayMap = {
    0: "Sun", // Sunday
    1: "M", // Monday
    2: "T", // Tuesday
    3: "W", // Wednesday
    4: "TH", // Thursday
    5: "F", // Friday
    6: "Sat", // Saturday
  };

  const today = new Date().getDay();

  for (let i = 0; i < 7; i++) {
    const checkDay = dayMap[(today + i) % 7];

    const match = scheds.find((s) => s.startsWith(checkDay));
    if (match) return match;
  }

  return scheds[0];
}

export const reduxSlice = createSlice({
  name: url,
  initialState,
  reducers: {
    SetDONE_CHECKUP: (state, { payload }) => {
      if (state.roster.length > 0) {
        const clinicIndex = state.roster.findIndex(
          ({ _id }) => _id === payload.clinic
        );

        if (clinicIndex > -1) {
          const appointments = state.roster[clinicIndex]?.appointments || [];
          const appointmentIndex = appointments.findIndex(
            ({ _id }) => _id === payload._id
          );

          if (appointmentIndex > -1) {
            state.roster[clinicIndex].appointments[appointmentIndex] = payload;
          }
        }
      }
      const updateCollections = (collections) => {
        if (collections.length > 0) {
          const index = collections.findIndex(({ _id }) => _id === payload._id);
          if (index > -1) {
            collections[index] = payload;
          }
        }
      };

      updateCollections(state.collections);
      updateCollections(state.filtered);
    },
    SetSETTLED: (state, { payload }) => {
      const update = (collections) => {
        const index = collections.findIndex(({ _id }) => _id === payload);
        collections.splice(index, 1);
      };
      update(state.collections);
      update(state.filtered);
    },
    SetPATIENT: (state, { payload }) => {
      state.patient = payload;
    },
    SetPHYSICIAN: (state, { payload }) => {
      if (!payload) {
        const appointments = state.roster.flatMap(
          ({ appointments }) => appointments
        );
        state.filtered = appointments;
        state.collections = appointments;
        state.activePhysician = {};
        state.activeSched = "";
      } else {
        const clinic = state.roster.find(
          ({ physicianId }) => physicianId?._id === payload
        );
        const { schedules = [], physicianId = {}, appointments = [] } = clinic;
        const _schedules = arrangeSchedules(schedules);
        state.scheds = _schedules;
        state.activePhysician = physicianId;
        state.collections = appointments;
        state.filtered = appointments;
        state.activeSched = "";
      }
    },

    SetDIAGNOSTIC: (state, { payload }) => {
      state.diagnostic = payload;
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
    setMiniEhrModal: (state, { payload }) => {
      state.selected = payload;
      state.showModalMiniEhr = true;
    },
    setShowModalEhr: (state, { payload }) => {
      const {
        familyHistory = {},
        socialHistory = {},
        conditions = {},
        surgeries = {},
        obGyneHistory = {},
        patient = {},
      } = payload || {};

      const ehr = {
        familyHistory,
        habits: socialHistory?.habits || {},
        conditions,
        surgeries,
        isMale: patient?.isMale,
        obGyneHistory,
        patient: payload?.patient,
      };
      state.selected = ehr;
      state.showModalEhr = true;
    },
    setShowModalVs: (state, { payload }) => {
      const { appointment, vitals, patient, _id = "" } = payload;
      state.selected = { ...vitals, appointment, patient, _id };
      state.willCreateVs = false;
      state.showModalVs = true;
    },

    SetFILTER: (state, { payload }) => {
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
    SetSCHED: (state, { payload }) => {
      const { sched = "", isSearch = false } = payload;

      if (isSearch) {
        state.filtered = [...state.filtered];
      } else if (!sched) {
        state.filtered = state.collections;
      } else {
        state.filtered = state.collections.filter(
          ({ sched: sc }) => sc === sched
        );
      }
      state.activeSched = sched;
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
    SetFILTERED: (state, { payload }) => {
      state.filtered = payload;
    },
    SetCLUSTER: (state, { payload }) => {
      state.cluster = payload;
    },
    SetRESULT: (state, { payload }) => {
      state.selected = payload;
      state.showResultModal = true;
    },
    SetTRANSAC: (state, { payload }) => {
      state.selected = payload;
      state.showTransacModal = true;
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
    TOGGLE_RESULT_MODAL: (state) => {
      state.showResultModal = !state.showResultModal;
    },
    TOGGLE_TRANSAC_MODAL: (state) => {
      state.showTransacModal = !state.showTransacModal;
    },
    TOGGLE_PATIENT_MODAL: (state, { payload }) => {
      const formattedName = payload?.includes(",")
        ? payload
        : payload?.split(" ").join(",");

      state.selected = { defaultSearch: formattedName };
      state.showPatientModal = !state.showPatientModal;
    },
    TOGGLEEMR: (state) => {
      state.showModalEhr = !state.showModalEhr;
    },
    TOGGLEMINIEMR: (state) => {
      state.showModalMiniEhr = !state.showModalMiniEhr;
    },
    TOGGLEVS: (state) => {
      state.showModalVs = !state.showModalVs;
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
        state.activePhysician = payload[0].physicianId;
        state.collections = payload[0].appointments;

        state.scheds = arrangeSchedules(payload[0]?.schedules);
        state.activeSched = state.scheds[0];
        state.filtered = payload[0].appointments.filter(
          ({ sched }) => sched === state.activeSched
        );

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

      .addCase(GET_BY_SCHED.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.message = "";
      })

      .addCase(GET_BY_SCHED.fulfilled, (state, action) => {
        const { success, payload = [] } = action.payload;
        state.cluster = payload;
        state.isSuccess = success;
        state.isLoading = false;
      })
      .addCase(GET_BY_SCHED.rejected, (state, action) => {
        const { error } = action;
        state.message = error.message;
        state.isLoading = false;
      })
      .addCase(CHECKUP.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.message = "";
      })
      .addCase(CHECKUP.fulfilled, (state, action) => {
        const { success, payload = [], schedules } = action.payload;
        // initial values for pagination
        state.collections = payload.sort((a, b) => a.qn - b.qn);
        state.scheds = arrangeSchedules(schedules);

        state.activeSched = getDefaultSchedule(arrangeSchedules(schedules));
        state.filtered = state.collections.filter(
          ({ sched }) => sched === state.activeSched
        );
        state.totalPages = Math.ceil(payload?.length / state.maxPage) || 1;
        state.activePage = Math.min(state.activePage, state.totalPages);
        state.isSuccess = success;
        state.isLoading = false;
      })
      .addCase(CHECKUP.rejected, (state, action) => {
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
        const { success, payload = {} } = action.payload;
        state.patient = payload;
        state.isSuccess = success;
        state.isLoading = false;
        state.patientId = payload.patient._id;
      })
      .addCase(FIND.rejected, (state, action) => {
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
        const { payload } = action.payload;
        state.collections.unshift(payload);
        state.filtered.unshift(payload);
        if (state.roster.length > 0) {
          const index = state.roster.findIndex(
            (item) => item._id === payload.clinic
          );
          const { appointments = [] } = state.roster[index] || {};
          appointments.unshift(payload);
          state.roster[index] = { ...state.roster[index], appointments };
        }
        state.showModal = false;
        state.isSuccess = true;
        state.formSubmitted = false;
      })
      .addCase(SAVE.rejected, (state, action) => {
        const { error } = action;
        state.message = error.message;
        state.formSubmitted = false;
        state.isSuccess = false;
      })
      .addCase(SET_EMR.pending, (state) => {
        state.isSuccess = false;
        state.formSubmitted = true;
        state.message = "";
      })
      .addCase(SET_EMR.fulfilled, (state, action) => {
        const { success, payload } = action.payload;

        const updateCollections = (collections) => {
          const index = collections.findIndex(
            (item) => item.patient?._id === payload.patient
          );
          if (index > -1) {
            collections[index] = { ...collections[index], ehr: payload };
          }
        };
        updateCollections(state.collections);
        updateCollections(state.filtered);

        state.formSubmitted = false;
        state.message = success;
        state.isSuccess = true;
      })
      .addCase(SET_EMR.rejected, (state, action) => {
        const { error } = action;
        state.message = error.message;
        state.isSuccess = false;
        state.formSubmitted = false;
      })
      .addCase(SET_VS.pending, (state) => {
        state.isSuccess = false;
        state.formSubmitted = true;
        state.message = "";
      })
      .addCase(SET_VS.fulfilled, (state, action) => {
        const { success, payload } = action.payload;
        const updateCollections = (collections) => {
          const index = collections.findIndex(
            (item) => item._id === payload.appointment
          );
          if (index > -1) {
            collections[index] = {
              ...collections[index],
              consultation: payload,
            };
          }
        };
        updateCollections(state.collections);
        updateCollections(state.filtered);
        state.formSubmitted = false;
        state.message = success;
        state.isSuccess = true;
      })
      .addCase(SET_VS.rejected, (state, action) => {
        const { error } = action;
        state.message = error.message;
        state.isSuccess = false;
        state.formSubmitted = false;
      })

      .addCase(UPDATE.pending, (state) => {
        state.isSuccess = false;
        state.formSubmitted = true;
        state.message = "";
      })
      .addCase(UPDATE.fulfilled, (state, action) => {
        const updated = action.payload; // backend returns the updated appointment
        const index = state.collections.findIndex(
          (item) => item._id === updated._id
        );

        if (index !== -1) {
          state.collections[index] = updated;
        } else {
          state.collections.unshift(updated);
        }

        state.filtered = state.collections.filter(
          ({ sched }) => sched === state.activeSched
        );
        state.showModal = false;
        state.formSubmitted = false;
        state.message = "Appointment updated successfully!";
        state.isSuccess = true;
      })

      .addCase(UPDATE.rejected, (state, action) => {
        const { error } = action;
        state.message = error.message;
        state.isSuccess = false;
        state.formSubmitted = false;
      })
      .addCase(DONE.pending, (state) => {
        state.isSuccess = false;
        state.isUpdateDone = true;
        state.message = "";
      })
      .addCase(DONE.fulfilled, (state, action) => {
        const { success, payload, isDone = true } = action.payload;
        const getIndex = (collections) =>
          collections.findIndex(({ _id }) => _id === payload._id);
        const findNext = (startIdx, dir) => {
          let idx = startIdx + dir;
          while (
            idx >= 0 &&
            idx < state.cluster.length &&
            !["confirmed", "halt"].includes(state.cluster[idx]?.status)
          ) {
            idx += dir;
          }
          return idx >= 0 && idx < state.cluster.length ? idx : -1;
        };

        const apptIndex = getIndex(state.cluster);
        let nextIdx = findNext(apptIndex, +1);

        // Step 2: kung wala, try backward
        if (nextIdx === -1) {
          nextIdx = findNext(apptIndex, -1);
        }

        // Step 3: kung wala pa rin, manatili sa kasalukuyan
        if (nextIdx === -1) {
          nextIdx = apptIndex;
        }

        state.patient = state.cluster[nextIdx]
          ? JSON.parse(JSON.stringify(state.cluster[nextIdx]))
          : {};

        const updateCollections = (collections) => {
          const index = getIndex(collections);
          collections[index] = { ...collections[index], ...payload };
          // collections.splice(index, 1);
        };
        updateCollections(state.collections);
        updateCollections(state.filtered);
        updateCollections(state.cluster);
        if (isDone) {
          socket.emit("send_checkup_done", {
            data: payload,
            roomID: payload?.userId,
          });
        }
        state.isUpdateDone = false;
        state.message = success;
        state.isSuccess = true;
      })
      .addCase(DONE.rejected, (state, action) => {
        const { error } = action;
        state.message = error.message;
        state.isSuccess = false;
        state.isUpdateDone = false;
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
  SetDONE_CHECKUP,
  SetPATIENT,
  SetSETTLED,
  SetTRANSAC,
  SetDIAGNOSTIC,
  SetFILTERED,
  SetCLUSTER,
  SetRESULT,
  SetPHYSICIAN,
  SetSCHED,
  SetCREATE,
  setShowModalEhr,
  setShowModalVs,
  setMiniEhrModal,
  SetEDIT,
  SetFILTER,
  SetPAGE,
  TOGGLE_PATIENT_MODAL,
  TOGGLE_RESULT_MODAL,
  TOGGLE,
  TOGGLEMINIEMR,
  TOGGLEEMR,
  TOGGLEVS,
  TOGGLE_TRANSAC_MODAL,
  /**
   * for pagination
   */
  SetMaxPage,
  SetActivePAGE,
  RESET,
} = reduxSlice.actions;

export default reduxSlice.reducer;
