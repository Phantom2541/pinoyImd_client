import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axioKit } from "../../../../utilities";

const url = "/diagnostics/clinic/appointments";

const dayOrder = {
  Sun: 0,
  M: 1,
  T: 2,
  W: 3,
  TH: 4,
  F: 5,
  Sat: 6,
};

const formatTime = ({ hour, min } = {}) => {
  if (typeof hour !== "number") return "--:--";

  const safeMin = typeof min === "number" ? min : 0;
  const suffix = hour >= 12 ? "PM" : "AM";
  const normalizedHour = hour % 12 || 12;

  return `${String(normalizedHour).padStart(2, "0")}:${String(
    safeMin,
  ).padStart(2, "0")} ${suffix}`;
};

const buildLocation = (location = {}) =>
  [location?.room, location?.floor, location?.building, location?.address]
    .filter(Boolean)
    .join(", ");

const buildPhysicianName = (physician = {}) => {
  const fullName = physician?.fullName || {};
  const parts = [
    fullName?.fname,
    fullName?.mname,
    fullName?.lname,
    fullName?.suffix,
  ].filter(Boolean);

  return parts.join(" ").trim();
};

const flattenRoster = (roster = []) =>
  roster
    .flatMap((clinic) => {
      const physician = clinic?.physicianId || {};
      const physicianId = physician?._id || "";
      const physicianName = buildPhysicianName(physician);
      const clinicTitle = clinic?.title || "Untitled Clinic";
      const clinicStatus = clinic?.status || "";
      const schedules = Array.isArray(clinic?.schedules) ? clinic.schedules : [];

      return schedules.flatMap((schedule, scheduleIndex) => {
        const days = Array.isArray(schedule?.days) ? schedule.days : [];

        return days.map((day) => ({
          _id: `${clinic?._id || "clinic"}-${scheduleIndex}-${day}`,
          clinicId: clinic?._id || "",
          clinicTitle,
          clinicStatus,
          physicianId,
          physicianName,
          day,
          start: schedule?.start || {},
          end: schedule?.end || {},
          startLabel: formatTime(schedule?.start),
          endLabel: formatTime(schedule?.end),
          timeLabel: `${formatTime(schedule?.start)} - ${formatTime(
            schedule?.end,
          )}`,
          type: schedule?.type || "onsite",
          slot: schedule?.slot ?? "",
          capacity: schedule?.capacity ?? "",
          duration: schedule?.duration ?? "",
          location: buildLocation(schedule?.location),
          room: schedule?.location?.room || "",
          floor: schedule?.location?.floor || "",
          building: schedule?.location?.building || "",
          address: schedule?.location?.address || "",
          raw: schedule,
        }));
      });
    })
    .sort((left, right) => {
      const dayDiff = (dayOrder[left.day] ?? 99) - (dayOrder[right.day] ?? 99);
      if (dayDiff !== 0) return dayDiff;

      const hourDiff = (left.start?.hour ?? 99) - (right.start?.hour ?? 99);
      if (hourDiff !== 0) return hourDiff;

      const minuteDiff = (left.start?.min ?? 99) - (right.start?.min ?? 99);
      if (minuteDiff !== 0) return minuteDiff;

      return String(left.physicianName || "").localeCompare(
        String(right.physicianName || ""),
      );
    });

const applyFilters = (state) => {
  const { collections, physicianFilter, dayFilter } = state;

  state.filtered = collections.filter((item) => {
    const matchesPhysician =
      !physicianFilter || String(item.physicianId || "") === physicianFilter;
    const matchesDay = !dayFilter || item.day === dayFilter;

    return matchesPhysician && matchesDay;
  });
};

const initialState = {
  roster: [],
  collections: [],
  filtered: [],
  physicianOptions: [],
  physicianFilter: "",
  dayFilter: "",
  isLoading: false,
  isSuccess: false,
  message: "",
};

export const BROWSE = createAsyncThunk(
  `${url}/flatSchedules`,
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
  name: "clinicalSchedules",
  initialState,
  reducers: {
    SetPhysicianFilter: (state, { payload }) => {
      state.physicianFilter = payload || "";
      applyFilters(state);
    },
    SetDayFilter: (state, { payload }) => {
      state.dayFilter = payload || "";
      applyFilters(state);
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
        const payload = Array.isArray(action.payload?.payload)
          ? action.payload.payload
          : [];
        const collections = flattenRoster(payload);
        const physicianOptions = Array.from(
          new Map(
            collections
              .filter((item) => item.physicianId)
              .map((item) => [
                String(item.physicianId),
                {
                  _id: item.physicianId,
                  name: item.physicianName,
                },
              ]),
          ).values(),
        );

        state.roster = payload;
        state.collections = collections;
        state.filtered = collections;
        state.physicianOptions = physicianOptions;
        state.message = action.payload?.message || "";
        state.isSuccess = true;
        state.isLoading = false;
      })
      .addCase(BROWSE.rejected, (state, action) => {
        const { error } = action;
        state.message = error.message;
        state.isLoading = false;
      });
  },
});

export const { SetPhysicianFilter, SetDayFilter, RESET } = reduxSlice.actions;

export default reduxSlice.reducer;
