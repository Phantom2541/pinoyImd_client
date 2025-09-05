import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axioKit } from "../../../utilities";
import { Services } from "../../../fakeDb";

const url = "portal/results";

const initialState = {
  preferences: [],
  result: {},
  activeType: "",
  hasRender: false,
  isResultAvailable: false,
  isResultReady: false,
  countdownCompleted: false,
  rendered: {},
  forms: [],
  isSuccess: false,
  // main loading
  isLoading: false,
  // form loading
  message: "",
};

export const BROWSE = createAsyncThunk(
  `${url}/browse`,
  ({ token, key }, thunkAPI) => {
    try {
      return axioKit.universal(`${url}/browse`, token, key);
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

const getDepartmentIndex = (departments) => {
  const department = departments[0];
  switch (department) {
    case "LAB":
      return 0;
    default:
      return 1;
  }
};

const arrangeDiagnostic = (department, diagnostic) => {
  var _diagnostic = {};
  const sections = Object.keys(diagnostic);
  sections.forEach((element) => {
    if (Array.isArray(diagnostic[element])) {
      for (let index = 0; index < diagnostic[element].length; index++) {
        const result = diagnostic[element][index];
        const { packages } = result;
        const label = Services.whereIn(
          department === "LAB" ? packages : [packages]
        )
          .map(({ abbreviation }) => abbreviation)
          .join(",");
        _diagnostic[label] = { ...result, form: element };
      }
    } else {
      _diagnostic[element] = diagnostic[element];
    }
  });
  return _diagnostic;
};

export const reduxSlice = createSlice({
  name: url,
  initialState,
  reducers: {
    RESET: (state) => {
      state.isSuccess = false;
      state.isLoading = false;
      state.message = "";
    },
    SetCOUNTDOWN_COMPLETED: (state, { payload }) => {
      state.countdownCompleted = payload;
    },
    SetHAS_RESULT: (state, _) => {
      state.hasResult = true;
    },
    SetACTIVE_TYPE: (state, { payload }) => {
      const { diagnostic } = state.result;
      state.isResultReady = diagnostic[payload]?.hasDone || false;
      state.activeType = payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(BROWSE.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.message = "";
      })
      .addCase(BROWSE.fulfilled, (state, { payload }) => {
        const { payload: data } = payload;
        const { result, preferences } = data;
        const {
          diagnostic: _diagnostic = {},
          department,
          rendered: rendereds,
        } = result;
        const diagnostic = arrangeDiagnostic(department[0], _diagnostic);
        const departmentIndex = getDepartmentIndex(department);
        const rendered = rendereds[0]; // get the rendered for the current department
        var forms = [];

        if (rendered?._id) {
          const resultTypes = Object.keys(diagnostic);
          if (resultTypes?.length > 0) {
            const activeType = resultTypes[0];
            state.isResultAvailable = true;
            state.activeType = activeType;
            state.hasRender = true;
            state.isResultReady = diagnostic[activeType]?.hasDone || false;
          }
        } else {
          state.hasRender = false;
        }

        //for services
        const services = [...Services.collections].map((service) => {
          const references = preferences.filter(
            ({ serviceId }) => serviceId === service.id
          );
          return { ...service, references };
        });

        if (result?.forms) {
          forms = result?.forms[departmentIndex];
        }

        state.result = { ...result, diagnostic };
        state.preferences = services;
        state.rendered = rendered;
        state.forms = forms;
        state.isLoading = false;
      })
      .addCase(BROWSE.rejected, (state, action) => {
        const { error } = action;
        state.message = error.message;
        state.isLoading = false;
      });
  },
});

export const { SetACTIVE_TYPE, SetHAS_RESULT, SetCOUNTDOWN_COMPLETED, RESET } =
  reduxSlice.actions;

export default reduxSlice.reducer;
