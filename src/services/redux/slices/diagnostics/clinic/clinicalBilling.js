import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { axioKit } from "../../../../utilities";

const url = "/diagnostics/clinic/appointments";

const buildFullName = (fullName = {}) =>
  [
    fullName?.lname,
    fullName?.fname,
    fullName?.mname,
    fullName?.suffix,
  ]
    .filter(Boolean)
    .join(", ")
    .trim();

const isBillingReady = (appointment = {}) => {
  const status = String(appointment?.status || "").toLowerCase();
  const hasConsultation = Boolean(appointment?.consultation?._id);
  const isSettled = Boolean(appointment?.consultation?.settlement);

  if (["paid", "cancelled"].includes(status)) return false;
  if (isSettled) return false;

  return status === "done" || hasConsultation;
};

const flattenDoneAppointments = (roster = []) =>
  roster
    .flatMap((clinic) => {
      const appointments = Array.isArray(clinic?.appointments)
        ? clinic.appointments
        : [];

      return appointments
        .filter(isBillingReady)
        .map((appointment) => ({
          ...appointment,
          clinic,
          clinicId: clinic?._id || "",
          clinicTitle: clinic?.title || "Untitled Clinic",
          physician: clinic?.physicianId || {},
          physicianId: clinic?.physicianId?._id || "",
          patientName: buildFullName(appointment?.patient?.fullName),
        }));
    })
    .sort((left, right) => {
      const leftDate = new Date(left?.updatedAt || left?.createdAt || 0).getTime();
      const rightDate = new Date(right?.updatedAt || right?.createdAt || 0).getTime();

      return rightDate - leftDate;
    });

const syncSelection = (state) => {
  const selected =
    state.collections.find(
      ({ _id }) => String(_id || "") === String(state.selectedAppointmentId || ""),
    ) || state.collections[0] || null;

  state.selectedAppointment = selected || null;
  state.selectedAppointmentId = selected?._id || "";
};

const initialState = {
  roster: [],
  collections: [],
  selectedAppointmentId: "",
  selectedAppointment: null,
  isLoading: false,
  isSuccess: false,
  message: "",
};

export const BROWSE = createAsyncThunk(
  `${url}/billing`,
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
  },
);

export const reduxSlice = createSlice({
  name: "clinicalBilling",
  initialState,
  reducers: {
    SetSelectedAppointment: (state, { payload }) => {
      state.selectedAppointmentId = payload || "";
      syncSelection(state);
    },
    RemoveSettledAppointment: (state, { payload }) => {
      state.collections = state.collections.filter(
        ({ _id }) => String(_id || "") !== String(payload || ""),
      );
      syncSelection(state);
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
        const roster = Array.isArray(action.payload?.payload)
          ? action.payload.payload
          : [];

        state.roster = roster;
        state.collections = flattenDoneAppointments(roster);
        syncSelection(state);
        state.message = action.payload?.message || "";
        state.isSuccess = true;
        state.isLoading = false;
      })
      .addCase(BROWSE.rejected, (state, action) => {
        state.message = action.payload || action.error?.message || "";
        state.isLoading = false;
      });
  },
});

export const { SetSelectedAppointment, RemoveSettledAppointment, RESET } =
  reduxSlice.actions;

export default reduxSlice.reducer;
