import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axioKit, ENDPOINT } from "../../../../utilities";

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
    name: "Default Company",
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
        console.log("state.branches :", state.branches);
        console.log("SETACTIVEPLATFORM :", payload);

        const branch = state.branches.find(
          (branch) => branch._id === payload.activePlatform.branchId
        );
        console.log("SETACTIVEPLATFORM payload :", payload);

        console.log("branch :", branch);

        state.activePlatform = { branch, ...payload.activePlatform };
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
      // .addCase(LOGIN.fulfilled, (state, action) => {
      //   const { success, payload } = action.payload,
      //     { token, auth, branches, isCeo, access, company, isPatient } =
      //       payload;

      //   state.isPatient = isPatient;

      //   let _branches = [];

      //   if (isCeo) {
      //     state.isCeo = isCeo;

      //     //-NOT WORKING BY THOM
      //     let lastVisited = JSON.parse(localStorage.getItem("lastVisited"));
      //     console.log(lastVisited);

      //     // if (!lastVisited) {
      //     //   const { _id, platform } = branches.find(({ isMain }) => isMain);
      //     //   lastVisited = {
      //     //     _id,
      //     //     platform,
      //     //   };
      //     // }
      //       // localStorage.setItem("lastVisited", JSON.stringify(auth.activePortal));
      //     //-

      //     _branches = branches.map((branch) => {
      //       const _access = access.filter(
      //         (data) => branch._id === data.branchId
      //       );

      //       const lastVisit = lastVisited.branch === branch._id;

      //       return {
      //         ...branch,
      //         access: _access,
      //         lastVisit,
      //         platform: lastVisit ? lastVisit.platform : branch.platform,
      //       };
      //     });
      //   }

      //   let lastVisited = JSON.parse(localStorage.getItem("lastVisited"));

      //   lastVisited = {
      //     ...lastVisited,
      //     branch: lastVisited.branchId?._id,
      //   };

      //   _branches = branches.map((branch) => {
      //     const _access = access.filter((data) => branch._id === data.branchId);

      //     return {
      //       ...branch,
      //       platform:
      //         lastVisited.branch === branch._id
      //           ? lastVisited.platform
      //           : branch.platform,
      //       access: _access,
      //     };
      //   });
      //   const activePlatform = _branches.find(({ lastVisit }) => lastVisit);

      //   if (activePlatform) {
      //     state.activePlatform = activePlatform;
      //   } else {
      //     state.activePlatform = !!_branches.length ? _branches[0] : defaultDuty;
      //   }

      //   state.image = `${ENDPOINT}/${fileUrl}/profile.jpg`;

      //   state.resume = `${ENDPOINT}/${fileUrl}/resume.pdf`;
      //   state.prc = `${ENDPOINT}/${fileUrl}/prc.jpg`;
      //   state.board = `${ENDPOINT}/${fileUrl}/board.jpg`;
      //   state.diploma = `${ENDPOINT}/${fileUrl}/diploma.jpg`;
      //   state.medcert = `${ENDPOINT}/${fileUrl}/medcert.pdf`;

      //   state.company = company;
      //   state.activePortal = lastVisited;
      //   state.token = token;
      //   state.email = auth.email;
      //   state.auth = auth;
      //   state.access = access;
      //   state.branches = _branches;
      //   state.message = success;
      //   state.loginSuccess = true;
      //   state.isLoading = false;
      // })

      .addCase(LOGIN.fulfilled, (state, action) => {
        const { success, payload } = action.payload,
          { token, auth, branches, isCeo, access, company, isPatient } =
            payload;

        state.isPatient = isPatient;

        let _branches = [];

        if (isCeo) {
          state.isCeo = isCeo;

          _branches = branches.map((branch) => {
            const _access = access.filter(
              (data) => branch._id === data.branchId
            );

            return {
              ...branch,
              access: _access,
            };
          });
        }

        _branches = branches.map((branch) => {
          const _access = access.filter((data) => branch._id === data.branchId);

          return {
            ...branch,
            access: _access,
          };
        });

        state.activePlatform = auth.activePlatform; // <--- Changed this line

        state.image = `${ENDPOINT}/${fileUrl}/profile.jpg`;

        state.resume = `${ENDPOINT}/${fileUrl}/resume.pdf`;
        state.prc = `${ENDPOINT}/${fileUrl}/prc.jpg`;
        state.board = `${ENDPOINT}/${fileUrl}/board.jpg`;
        state.diploma = `${ENDPOINT}/${fileUrl}/diploma.jpg`;
        state.medcert = `${ENDPOINT}/${fileUrl}/medcert.pdf`;

        state.company = company;
        state.activePortal = auth.activePlatform;
        state.branches = _branches;
        state.access = access;
        state.auth = auth;
        state.email = auth.email;
        state.token = token;
        state.message = success;
        state.loginSuccess = true;
        state.isLoading = false;
      })

      //   state.image = `${ENDPOINT}/${fileUrl}/profile.jpg`;
      //   state.resume = `${ENDPOINT}/${fileUrl}/resume.pdf`;
      //   state.prc = `${ENDPOINT}/${fileUrl}/prc.jpg`;
      //   state.board = `${ENDPOINT}/${fileUrl}/board.jpg`;
      //   state.diploma = `${ENDPOINT}/${fileUrl}/diploma.jpg`;
      //   state.medcert = `${ENDPOINT}/${fileUrl}/medcert.pdf`;

      //   const branch = branches.find(
      //     (branch) => branch._id === auth.activePlatform.branchId
      //   );

      //   console.log(" LOGIN branch :", branch);

      //   state.isPatient = isPatient;
      //   state.isCeo = isCeo;
      //   state.activePlatform = { branch, ...auth.activePlatform };
      //   state.company = company;
      //   state.token = token;
      //   state.email = auth.email;
      //   state.auth = auth;
      //   state.access = access;
      //   state.branches = branches;
      //   state.message = success;
      //   state.loginSuccess = true;
      //   state.isLoading = false;
      // })
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
        console.log("UPDATE.fulfilled payload", payload);
        const branch = state.branches.find(
          (branch) => branch._id === payload.activePlatform.branchId
        );

        state.message = success;
        state.auth = payload;
        state.email = payload.email;
        localStorage.setItem("email", payload.email);
        state.activePlatform = { ...payload.activePlatform, branch };
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
          { auth, branches, access, isCeo, isPatient, company } = payload;

        state.image = `${ENDPOINT}/${fileUrl}/profile.jpg`;
        state.resume = `${ENDPOINT}/${fileUrl}/resume.pdf`;
        state.prc = `${ENDPOINT}/${fileUrl}/prc.jpg`;
        state.board = `$${ENDPOINT}/${fileUrl}/board.jpg`;
        state.diploma = `${ENDPOINT}/${fileUrl}/diploma.jpg`;
        state.medcert = `${ENDPOINT}/${fileUrl}/medcert.pdf`;

        const branch = branches.find(
          (branch) => branch._id === auth.activePlatform.branchId
        );

        state.activePlatform = { ...auth.activePlatform, branch };
        state.isPatient = isPatient;
        state.company = company;
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
