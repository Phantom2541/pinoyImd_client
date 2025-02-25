import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axioKit, ENDPOINT } from "../../../../utilities";
import { Policy } from "../../../../fakeDb";

const name = "auth",
  maxPage = Number(localStorage.getItem("maxPage")) || 5,
  token = localStorage.getItem("token") || "",
  email = localStorage.getItem("email") || "",
  activePlatform = localStorage.getItem("activePlatform"),
  fileUrl = `public/${email}`;

const initialState = {
  auth: {}, // user details
  activePlatform, // active platform for sidebar and routes
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
    name: "Pinoy iMD",
    subname: "Medical Diagnostic Center",
  },
  isCeo: false,
  maxPage,
  loginSuccess: false,
  isSuccess: false,
  isLoading: false,
  message: "",
};

export const SETACTIVEPLATFORM = createAsyncThunk(
  `${name}/setActivePlatform`,
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
  `${name}/changePassword`,
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
  `${name}/login`,
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
  `${name}/validateRefresh`,
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
  `${name}/update`,
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

export const UPLOAD = createAsyncThunk(`${name}/upload`, (form, thunkAPI) => {
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
  name,
  initialState,
  reducers: {
    UPLOADBAR: (state, data) => {
      state.progressBar = data.payload;
    },
    IMAGE: (state, data) => {
      state.image = data.payload;
      state.progressBar = -1;
    },
    NETWORK: (state, data) => {
      state.isOnline = data.payload;
    },
    MAXPAGE: (state, data) => {
      localStorage.setItem("maxPage", data.payload);
      state.maxPage = data.payload;
    },
    RESET: (state) => {
      state.isSuccess = false;
      state.loginSuccess = false;
      state.message = "";
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

        state.activePlatform = {
          branch,
          branchId: payload.activePlatform.branchId,
          ...payload.activePlatform,
          access: [..._access],
          // role:Policy.find(({ personel.contract.designation }) => name === payload.activePlatform.role),
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
        state.isLoading = true;
        state.isSuccess = false;
        state.message = "";
      })
      .addCase(CHANGEPASSWORD.fulfilled, (state, action) => {
        const { success } = action.payload;
        state.isSuccess = true;
        state.message = success;
        state.isLoading = false;

        setTimeout(() => {
          localStorage.clear();
          window.location.href = "/";
        }, 2500);
      })
      .addCase(CHANGEPASSWORD.rejected, (state, action) => {
        const { error } = action;
        state.message = error.message;
        state.isLoading = false;
      })

      .addCase(LOGIN.pending, (state) => {
        state.isLoading = true;
        state.loginSuccess = false;
        state.message = "";
      })
      .addCase(LOGIN.fulfilled, (state, action) => {
        const { success, payload } = action.payload,
          { token, auth, branches, isCeo, access, isPatient } = payload;

        state.isPatient = isPatient;

        state.isCeo = isCeo;
        state.image = `${ENDPOINT}/${fileUrl}/profile.jpg`;
        state.resume = `${ENDPOINT}/${fileUrl}/resume.pdf`;
        state.prc = `${ENDPOINT}/${fileUrl}/prc.jpg`;
        state.board = `${ENDPOINT}/${fileUrl}/board.jpg`;
        state.diploma = `${ENDPOINT}/${fileUrl}/diploma.jpg`;
        state.medcert = `${ENDPOINT}/${fileUrl}/medcert.pdf`;

        const branch = branches.find(
          (branch) => branch._id === auth.activePlatform.branchId
        );
        console.log("LOGIN.fulfilled payload", branch);

        const _access = access
          .filter(({ branchId }) => branchId === auth.activePlatform.branchId)
          .map((a) => a.platform);

        state.isPatient = isPatient;
        state.isCeo = isCeo;
        state.activePlatform = {
          branch,
          ...auth.activePlatform,
          access: [..._access],
        };
        state.company = branch.companyId;
        state.token = token;
        state.email = auth.email;
        state.auth = auth;
        state.access = access;
        state.branches = branches;
        state.message = success;
        state.loginSuccess = true;
        state.isLoading = false;
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
          (branch) => branch._id === payload.activePlatform.branchId
        );

        state.message = success;
        state.auth = payload;
        state.email = payload.email;
        localStorage.setItem("email", payload.email);
        state.activePlatform = {
          ...payload.activePlatform,
          branch,
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
          { auth, branches, isCeo, isPatient, company, access } = payload;

        state.image = `${ENDPOINT}/${fileUrl}/profile.jpg`;
        state.resume = `${ENDPOINT}/${fileUrl}/resume.pdf`;
        state.prc = `${ENDPOINT}/${fileUrl}/prc.jpg`;
        state.board = `$${ENDPOINT}/${fileUrl}/board.jpg`;
        state.diploma = `${ENDPOINT}/${fileUrl}/diploma.jpg`;
        state.medcert = `${ENDPOINT}/${fileUrl}/medcert.pdf`;

        const branch = branches.find(
          (branch) => branch._id === auth.activePlatform.branchId
        );

        const _access = access
          .filter(({ branchId }) => branchId === auth.activePlatform.branchId)
          .map((a) => a.platform);

        const department = Policy.getDepartment(branch?.contract?.designation);
        state.activePlatform = {
          ...auth.activePlatform,
          branch,
          access: [..._access],
          ...department,
        };

        state.branches = branches;
        state.isPatient = isPatient;
        state.company = company;
        state.access = access;

        state.isCeo = isCeo;
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
      .addCase(UPLOAD.fulfilled, (state, action) => {
        state.isLoading = false;
      })
      .addCase(UPLOAD.rejected, (state, action) => {
        const { error } = action;
        state.message = error.message;
        state.isLoading = false;
      });
  },
});

export const { RESET, MAXPAGE, UPLOADBAR, IMAGE, NETWORK } = reduxSlice.actions;

export default reduxSlice.reducer;
