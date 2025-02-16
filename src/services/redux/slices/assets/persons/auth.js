import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axioKit, ENDPOINT } from "../../../../utilities";

const name = "auth",
  maxPage = Number(localStorage.getItem("maxPage")) || 5,
  token = localStorage.getItem("token") || "",
  email = localStorage.getItem("email") || "",
  activePlatform = localStorage.getItem("activePlatform") ,
  defaultDuty = {
    _id: "",
    designation: 1,
    platform: "patron",
    name: "Default Duty", // branch
    company: null, // company name
  },
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
  onDuty: defaultDuty,
  isCeo: false,
  maxPage,
  loginSuccess: false,
  isSuccess: false,
  isLoading: false,
  message: "",
};

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
          { token, auth, branches,  access, company, isPatient } = payload;
        
        state.isPatient = isPatient;

        let _branches = [];

        // if (isCeo) {
        //   state.isCeo = isCeo;

        //   //-NOT WORKING BY THOM
        //   let lastVisited = JSON.parse(localStorage.getItem("lastVisited"));
        //   console.log(lastVisited);
          
        //   // if (!lastVisited) {
        //   //   const { _id, platform } = branches.find(({ isMain }) => isMain);
        //   //   lastVisited = {
        //   //     _id,
        //   //     platform,
        //   //   };
        //   // }
        //     // localStorage.setItem("lastVisited", JSON.stringify(auth.activePlatform));
        //   //-

        //   _branches = branches.map((branch) => {
        //     const _access = access.filter(
        //       (data) => branch._id === data.branchId
        //     );

        //     const lastVisit = lastVisited.branch === branch._id;

        //     return {
        //       ...branch,
        //       access: _access,
        //       lastVisit,
        //       platform: lastVisit ? lastVisit.platform : branch.platform,
        //     };
        //   });
        // }

        let activePlatform = JSON.parse(localStorage.getItem("lastVisited"));
        
        activePlatform = {...activePlatform, branch:activePlatform.branchId?._id}

        console.log('activePlatform',activePlatform);
        
        _branches = branches.map((branch) => {
          const _access = access.filter((data) => branch._id === data.branchId);

          return {
            ...branch,
            platform: activePlatform.branch === branch._id ? activePlatform.platform : branch.platform,
            access: _access,
          };
        });
        const onDuty = _branches.find(({ lastVisit }) => lastVisit);

        if (onDuty) {
          state.onDuty = onDuty;
        } else {
          state.onDuty = !!_branches.length ? _branches[0] : defaultDuty;
        }

        state.image = `${ENDPOINT}/${fileUrl}/profile.jpg`;

        state.resume = `${ENDPOINT}/${fileUrl}/resume.pdf`;
        state.prc = `${ENDPOINT}/${fileUrl}/prc.jpg`;
        state.board = `${ENDPOINT}/${fileUrl}/board.jpg`;
        state.diploma = `${ENDPOINT}/${fileUrl}/diploma.jpg`;
        state.medcert = `${ENDPOINT}/${fileUrl}/medcert.pdf`;

        state.company = company;
        state.activePlatform = activePlatform.platform;
        state.token = token;
        state.email = auth.email;
        state.auth = auth;
        state.access = access;
        state.branches = _branches;
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
        console.log('payload',payload);
        
        state.message = success;
        state.auth = payload;
        state.email = payload.email;
        localStorage.setItem("email", payload.email);
        state.activePlatform = payload.activePlatform?.platform;
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
          { auth, branches, access, isCeo, company, isPatient } = payload;

        state.isPatient = isPatient;
        
        let _branches = [];

        if (isCeo) {
          state.isCeo = isCeo;

          //-NOT WORKING BY THOM
          let activePlatform = JSON.parse(localStorage.getItem("lastVisited"));
          // if (!activePlatform) {
          //   const { _id, platform } = branches.find(({ isMain }) => isMain);
          //   activePlatform = {
          //     _id,
          //     platform,
          //   };
          //   localStorage.setItem("activePlatform", JSON.stringify(activePlatform));
          // }
          //-

          _branches = branches.map((branch) => {
            const _access = access.filter(
              (data) => branch._id === data.branchId
            );

            return {
              ...branch,
              access: _access,
              activePlatform:activePlatform.branchId?._id === branch._id,
              platform: activePlatform.branchId?._id === branch._id ? activePlatform.platform : branch.platform,
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
        const onDuty = _branches.find(({ lastVisit }) => lastVisit);

        if (onDuty) {
          state.onDuty = onDuty;
        } else {
          state.onDuty = !!_branches.length ? _branches[0] : defaultDuty;
        }

        state.image = `${ENDPOINT}/${fileUrl}/profile.jpg`;

        state.resume = `${ENDPOINT}/${fileUrl}/resume.pdf`;
        state.prc = `${ENDPOINT}/${fileUrl}/prc.jpg`;
        state.board = `$${ENDPOINT}/${fileUrl}/board.jpg`;
        state.diploma = `${ENDPOINT}/${fileUrl}/diploma.jpg`;
        state.medcert = `${ENDPOINT}/${fileUrl}/medcert.pdf`;

        state.company = company;
        state.branches = _branches;
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
