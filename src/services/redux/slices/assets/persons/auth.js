import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axioKit, ENDPOINT } from "../../../../utilities";
import { Policy } from "../../../../fakeDb";

const url = "auth",
  maxPage = Number(localStorage.getItem("maxPage")) || 5,
  token = localStorage.getItem("token") || "",
  email = localStorage.getItem("email") || "",
  activePlatform =
    localStorage.getItem("activePlatform") !== "undefined" &&
    localStorage.getItem("activePlatform"),
  fileUrl = `/public/users/companies/${email}`;

const initialState = {
  auth: {}, // user details
  activePlatform, // active platform for sidebar and routes
  position: undefined,
  token,
  email, // email for login detection
  image: "", // user image
  isPatient: true,
  resume: "",
  prc: "",
  board: "",
  diploma: "",
  medcert: "",

  progressBar: -1, // upload progress
  isOnline: navigator.onLine,
  branches: [], // list of connected branches
  access: [], // list of accessible platforms
  company: {
    url: "Pinoy iMD",
    subname: "Medical Diagnostic Center",
  },
  isCeo: false,
  maxPage,
  loginSuccess: false,
  isSuccess: false,
  isRejected: false,
  isLoading: false,
  formSubmitted: false,
  message: "",
};

export const SETACTIVEPLATFORM = createAsyncThunk(
  `${url}/setActivePlatform`,
  ({ data, token }, thunkAPI) => {
    try {
      return axioKit.update(`assets/persons/users`, data, token);
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
export const CHANGEPASSWORD = createAsyncThunk(
  `${url}/changePassword`,
  ({ data, token }, thunkAPI) => {
    try {
      return axioKit.changePassword(data, token);
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

export const LOGIN = createAsyncThunk(
  `${url}/login`,
  ({ email, password }, thunkAPI) => {
    try {
      return axioKit.login(email, password);
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

export const VALIDATEREFRESH = createAsyncThunk(
  `${url}/validateRefresh`,
  (token, thunkAPI) => {
    try {
      return axioKit.validateRefresh(token);
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

export const UPDATE = createAsyncThunk(
  `${url}/update`,
  ({ data, token }, thunkAPI) => {
    try {
      return axioKit.update("assets/persons/users", data, token);
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

export const UPLOAD = createAsyncThunk(`${url}/upload`, (form, thunkAPI) => {
  try {
    return axioKit.upload(form.data, form.token, (progress) => {
      thunkAPI.dispatch(
        UPLOADBAR(Math.round((progress.loaded * 100) / progress.total))
      );
    });
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();

    return thunkAPI.rejectWithValue(message);
  }
});

export const reduxSlice = createSlice({
  name: url,
  initialState,
  reducers: {
    UPLOADBAR: (state, data) => {
      state.progressBar = data.payload;
    },
    SetActivePlatform: (state, action) => {
      const { branch } = state.activePlatform;
      const { companyId } = branch;

      const _activePlatform = {
        ...state.activePlatform,
        branch: {
          ...branch,
          companyId: { ...companyId, hmo: action.payload },
        },
      };
      state.activePlatform = _activePlatform;
    },

    IMAGE: (state, { payload }) => {
      state.image = payload;
      state.progressBar = -1;
    },
    NETWORK: (state, data) => {
      state.isOnline = data.payload;
    },
    MAXPAGE: (state, data) => {
      state.maxPage = data.payload;
    },
    RESET: (state) => {
      state.isSuccess = false;
      state.formSubmitted = false;
      state.isRejected = false;
      state.loginSuccess = false;
      state.message = "";
    },
    SetCOMPANY: (state, { payload }) => {
      state.company = payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(SETACTIVEPLATFORM.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.message = "";
      })
      .addCase(SETACTIVEPLATFORM.fulfilled, (state, action) => {
        const { success, payload } = action.payload;
        const branch = state.branches.find(
          (branch) => branch._id === payload.activePlatform.branchId
        );
        const _access = state.access
          .filter(
            ({ branchId }) => branchId === payload.activePlatform.branchId
          )
          .map((a) => a.platform);

        const { contract = { designation: -1 } } = branch || {};
        const department = Policy.getDepartment(contract.designation) || {};

        state.activePlatform = {
          branch,
          position: contract.designation,
          branchId: payload.activePlatform.branchId,
          ...payload.activePlatform,
          access: [..._access],
          department,
        };
        state.showModal = false;
        state.message = success;
        state.isSuccess = true;
        state.isLoading = false;
      })
      .addCase(SETACTIVEPLATFORM.rejected, (state, action) => {
        const { error } = action;
        state.message = error.message;
        state.isLoading = false;
      })
      .addCase(CHANGEPASSWORD.pending, (state) => {
        state.formSubmitted = true;
        state.isSuccess = false;
        state.message = "";
      })
      .addCase(CHANGEPASSWORD.fulfilled, (state, action) => {
        const { success } = action.payload;
        state.isSuccess = true;
        state.isRejected = false;
        state.message = success;
        state.formSubmitted = false;

        setTimeout(() => {
          localStorage.clear();
          window.location.href = "/";
        }, 2500);
      })
      .addCase(CHANGEPASSWORD.rejected, (state, action) => {
        const { error } = action;
        state.message = error.message;
        state.formSubmitted = false;
        state.isRejected = true;
      })

      .addCase(LOGIN.pending, (state) => {
        state.isLoading = true;
        state.loginSuccess = false;
        state.message = "";
      })
      .addCase(LOGIN.fulfilled, (state, action) => {
        const { success, payload } = action.payload,
          { token, auth, branches, isCeo, access, isPatient } = payload;
        const { branchId } = auth.activePlatform;
        if (branchId) {
          const _access = access
            .filter(({ branchId: bID }) => bID === branchId)
            .map((a) => a.platform);

          const branch = branches.find((branch) => branch._id === branchId);
          const { contract = { designation: -1 } } = branch || {};
          const department = Policy.getDepartment(contract.designation) || "";
          const role = Policy.getPosition(contract.designation) || {};
          const activePlatform = {
            ...auth.activePlatform,
            branch,
            access: [..._access, "patron"],
            department,
            role,
            position: contract.designation,
          };
          localStorage.setItem(
            "activePlatform",
            JSON.stringify(activePlatform)
          );
          state.activePlatform = activePlatform;
          state.company = branch?.companyId;
        }
        state.isPatient = isPatient;
        state.isCeo = isCeo;
        state.token = token;
        state.email = auth.email;
        state.auth = auth;
        state.access = access;
        state.branches = branches;
        state.message = success;
        state.loginSuccess = true;
        state.isLoading = false;
        state.image = `${ENDPOINT}/public/users/${auth.email}/profile.jpg`;
        state.resume = `${ENDPOINT}${fileUrl}/resume.pdf`;
        state.prc = `${ENDPOINT}${fileUrl}/prc.jpg`;
        state.board = `${ENDPOINT}${fileUrl}/board.jpg`;
        state.diploma = `${ENDPOINT}${fileUrl}/diploma.jpg`;
        state.medcert = `${ENDPOINT}${fileUrl}/medcert.pdf`;
      })
      .addCase(LOGIN.rejected, (state, action) => {
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
        const { success, payload } = action.payload;
        const branch = state.branches.find(
          ({ _id }) => _id === payload.activePlatform.branchId
        );

        const { contract = { designation: -1 } } = branch || {};
        state.message = success;
        state.auth = payload;
        state.email = payload.email;
        state.activePlatform = {
          ...payload.activePlatform,
          branch,
          position: contract.designation,
        };
        state.isLoading = false;
        state.isSuccess = true;
      })
      .addCase(UPDATE.rejected, (state, action) => {
        const { error } = action;
        state.message = error.message;
        state.isLoading = false;
      })

      .addCase(VALIDATEREFRESH.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.message = "";
      })
      .addCase(VALIDATEREFRESH.fulfilled, (state, action) => {
        const { payload } = action.payload,
          { auth, branches, isPatient, access } = payload;

        const { activePlatform } = auth;

        if (activePlatform) {
          const branch = branches.find(
            (branch) => branch._id === activePlatform.branchId
          );

          const _access = access
            .filter(
              ({ branchId }) =>
                String(branchId) === String(activePlatform.branchId)
            )
            .map((a) => a.platform);

          const { contract = { designation: -1 } } = branch || {};
          const department = Policy.getDepartment(contract.designation) || "";
          const role = Policy.getPosition(contract.designation) || {};
          state.activePlatform = {
            ...activePlatform,
            branch,
            access: [..._access],
            department,
            role,
            position: contract.designation,
          };
          state.company = branch?.companyId;
          state.image = `${ENDPOINT}/public/users/${auth.email}/profile.jpg`;
          state.resume = `${ENDPOINT}${fileUrl}/resume.pdf`;
          state.prc = `${ENDPOINT}${fileUrl}/prc.jpg`;
          state.board = `${ENDPOINT}${fileUrl}/board.jpg`;
          state.diploma = `${ENDPOINT}${fileUrl}/diploma.jpg`;
          state.medcert = `${ENDPOINT}${fileUrl}/medcert.pdf`;
        }

        /**
         * this will control the topbar selections
         */

        state.isPatient = isPatient;
        // lookup for active platform
        state.branches = branches;
        state.access = access;
        state.auth = auth;
        state.email = auth.email;
        state.isLoading = false;
      })
      .addCase(VALIDATEREFRESH.rejected, (state, action) => {
        const { error } = action;
        state.message = error.message;
        state.isLoading = false;
      })

      .addCase(UPLOAD.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.message = "";
      })
      .addCase(UPLOAD.fulfilled, (state, _) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.message = "Sucessfully uploaded!";
      })
      .addCase(UPLOAD.rejected, (state, action) => {
        const { error } = action;
        state.message = error.message;
        state.isLoading = false;
      });
  },
});

export const {
  RESET,
  SetCOMPANY,
  MAXPAGE,
  UPLOADBAR,
  IMAGE,
  NETWORK,
  SetActivePlatform,
} = reduxSlice.actions;

export default reduxSlice.reducer;
