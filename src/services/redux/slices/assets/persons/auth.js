import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  axioKit,
  Cloudinary,
  employment,
  ENDPOINT,
} from "../../../../utilities";
import { Access, Policy } from "../../../../fakeDb";
import { SETAFFILIATIONPLATFORM } from "./affiliations";

const url = "auth",
  maxPage = Number(localStorage.getItem("maxPage")) || 5,
  token = localStorage.getItem("token") || "",
  email = localStorage.getItem("email") || "",
  safeParseJSON = (value, fallback = {}) => {
    try {
      return value ? JSON.parse(value) : fallback;
    } catch (error) {
      return fallback;
    }
  },
  activePlatform = safeParseJSON(localStorage.getItem("activePlatform")),
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

const normalizePlatforms = (platforms = []) =>
  Array.from(
    new Set(
      (Array.isArray(platforms) ? platforms : [])
        .flatMap((item) => {
          if (typeof item === "string") return [item];
          if (typeof item === "number") return [item];
          if (Array.isArray(item?.platform)) return item.platform;
          if (Array.isArray(item)) return item;
          if (typeof item?.platform === "string") return [item.platform];
          if (typeof item?.id === "number") return [item.id];
          return [];
        })
        .map((platform) => Access.normalizePlatformKey(platform))
        .filter(Boolean)
    )
  );

const uniquePlatforms = (platforms = []) =>
  Array.from(new Set(platforms.filter(Boolean)));

const findCurrentAffiliation = (branches = [], activeAffiliation = "") =>
  branches.find(
    ({ affiliationId, _id }) =>
      String(affiliationId || _id) === String(activeAffiliation || "")
  ) || null;

export const SETACTIVEAFFILIATION = createAsyncThunk(
  `${url}/setActiveAffiliation`,
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

export const UPDATE_INFO = createAsyncThunk(
  `${url}/update_info`,
  ({ data, token }, thunkAPI) => {
    try {
      return axioKit.update("assets/persons/users", data, token, "update_info");
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

export const UPLOAD = createAsyncThunk(
  `${url}/upload`,
  ({ data, token }, thunkAPI) => {
    try {
      return axioKit.upload(data, token, (progress) => {
        thunkAPI.dispatch(
          UPLOADBAR(Math.round((progress.loaded * 100) / progress.total))
        );
      });
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

export const DESTROY_IMG = createAsyncThunk(
  `${url}/destroy`,
  ({ data, token }, thunkAPI) => {
    try {
      return axioKit.destroy(
        "/assets/persons/auth",
        data,
        token,
        "destroy_img"
      );
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

//set active platform
const setAP = (state, payload) => {
  const {
    branches = [],
    isPhysician = false,
    activeAffiliation,
  } = payload;
  const requestedAffiliationId =
    activeAffiliation || state.auth?.activeAffiliation || "";
  const fallbackAffiliationId =
    branches.length === 1 ? branches[0]?.affiliationId || branches[0]?._id : "";
  const affiliationId = requestedAffiliationId || fallbackAffiliationId || "";

  if (!affiliationId) {
    state.activePlatform = {};
    localStorage.removeItem("activePlatform");
    return "";
  }
  const branch =
    findCurrentAffiliation(branches, affiliationId) ||
    (branches.length === 1 ? branches[0] : null);
  if (!branch) {
    state.activePlatform = {};
    localStorage.removeItem("activePlatform");
    return "";
  }

  const branchPlatforms = normalizePlatforms(branch?.platforms);
  const _access = branchPlatforms.filter((platform) => platform !== "physician");
  const { contract = { designation: -1 }, status, clinic } = branch || {};
  const normalizedContractStatus = String(contract?.soe || "")
    .trim()
    .toLowerCase();
  const normalizedBranchStatus = String(status || "")
    .trim()
    .toLowerCase();
  const contractEmploymentStatus = employment.isEmployed(
    normalizedContractStatus
  );
  const resolvedEmploymentStatus =
    typeof contractEmploymentStatus === "boolean"
      ? normalizedContractStatus
      : normalizedBranchStatus;
  const isEmployed = employment.isEmployed(
    isPhysician ? "active" : resolvedEmploymentStatus
  );
  const designation = isPhysician ? 122 : contract?.designation;
  const department = Policy.getDepartment(designation) || "";
  const role = Policy.getPosition(designation) || {};
  const availablePlatforms = uniquePlatforms([
    ..._access,
    ...(isPhysician ? ["physician"] : []),
  ]);
  const currentPlatform = String(branch?.activePlatform || "")
    .trim()
    .toLowerCase();
  const selectedPlatform = availablePlatforms.includes(currentPlatform)
    ? currentPlatform
    : availablePlatforms.length === 1
    ? availablePlatforms[0]
    : availablePlatforms[0] || "patron";
  const activePlatform = {
    affiliationId,
    branchId: branch?.branch || branch?.branchId || branch?._id,
    branch,
    company: branch?.companyId || {},
    platforms: isEmployed ? availablePlatforms : [],
    access: isEmployed ? uniquePlatforms([...availablePlatforms, "patron"]) : ["patron"],
    department,
    role,
    isPhysician,
    position: designation,
    clinic,
    platform: isEmployed ? selectedPlatform : "",
  };
  if (affiliationId && String(state.auth?.activeAffiliation || "") !== String(affiliationId)) {
    state.auth = {
      ...state.auth,
      activeAffiliation: affiliationId,
    };
  }
  localStorage.setItem("activePlatform", JSON.stringify(activePlatform));
  state.activePlatform = activePlatform;
  state.company = branch?.companyId;
};

//formatted Active Platform
const initializeInformation = (state, payload) => {
  const {
    token,
    auth,
    branches,
    isCeo,
    access,
    isPatient,
    isPhysician = false,
  } = payload;
  //set active platforms
  setAP(state, {
    isPhysician,
    branches,
    activeAffiliation: auth.activeAffiliation,
  });
  state.isPatient = isPatient;
  state.isCeo = isCeo;
  //if we have a token it means user is logged in
  if (token) {
    state.token = token;
  }
  state.email = auth.email;
  state.auth = auth;
  state.access = access;
  state.branches = branches;
  state.image = `${Cloudinary.getEndpoint()}/${auth?.pid || ""}/users/${
    auth.email
  }/profile.png?v=${Date.now()}`;

  state.resume = `${ENDPOINT}${fileUrl}/resume.pdf`;
  state.prc = `${ENDPOINT}${fileUrl}/prc.jpg`;
  state.board = `${ENDPOINT}${fileUrl}/board.jpg`;
  state.diploma = `${ENDPOINT}${fileUrl}/diploma.jpg`;
  state.medcert = `${ENDPOINT}${fileUrl}/medcert.pdf`;
};

export const reduxSlice = createSlice({
  name: url,
  initialState,
  reducers: {
    SetAUTH: (state, { payload }) => {
      state.auth = payload;
      state.email = payload.email;
    },
    UPLOADBAR: (state, data) => {
      state.progressBar = data.payload;
    },
    OverrideActivePlatform: (state, { payload }) => {
      state.activePlatform = payload;
      localStorage.setItem("activePlatform", JSON.stringify(payload));
    },
    SyncAffiliationPlatform: (state, { payload }) => {
      const { affiliationId, platform } = payload || {};
      const normalizedAffiliationId = String(affiliationId || "");
      const normalizedPlatform = String(platform || "")
        .trim()
        .toLowerCase();

      if (!normalizedAffiliationId || !normalizedPlatform) return;

      state.branches = (state.branches || []).map((branch) =>
        String(branch.affiliationId || branch._id || "") ===
        normalizedAffiliationId
          ? {
              ...branch,
              activePlatform: normalizedPlatform,
            }
          : branch
      );

      if (
        String(state.auth?.activeAffiliation || "") === normalizedAffiliationId
      ) {
        const updatedActivePlatform = {
          ...state.activePlatform,
          platform: normalizedPlatform,
        };

        state.activePlatform = updatedActivePlatform;
        localStorage.setItem(
          "activePlatform",
          JSON.stringify(updatedActivePlatform)
        );
      }
    },

    PatchSessionPlatform: (state, action) => {
      const { isHMO = false, isBranch = false, data } = action.payload;
      const current = state.activePlatform;
      const updatedBranchId = String(data?._id || "");

      if (isBranch && updatedBranchId) {
        state.branches = (state.branches || []).map((affiliation) => {
          const branchRef = affiliation?.branch || {};
          const matchesBranch =
            String(branchRef?._id || affiliation?.branchId || "") ===
            updatedBranchId;

          if (!matchesBranch) return affiliation;

          return {
            ...affiliation,
            name: data?.name ?? affiliation?.name,
            displayname: data?.displayname ?? affiliation?.displayname,
            code: data?.code ?? affiliation?.code,
            branch: {
              ...branchRef,
              ...data,
            },
          };
        });
      }

      const updatedBranch = {
        ...current.branch,
        ...(isBranch ? data : {}),
        ...(Array.isArray(data) && !isHMO && !isBranch ? { tat: data } : {}),
      };

      const updatedCompanyId = {
        ...current.branch.companyId,
        ...(isHMO ? { hmo: data } : {}),
      };

      const updatedPlatform = {
        ...current,
        branch: {
          ...updatedBranch,
          companyId: updatedCompanyId,
        },
      };

      state.activePlatform = updatedPlatform;
      localStorage.setItem("activePlatform", JSON.stringify(updatedPlatform));
    },

    SetPatientCategories: (state, { payload }) => {
      const _activePlatform = {
        ...state.activePlatform,
        branch: {
          ...state.activePlatform.branch,
          companyId: {
            ...state.activePlatform.branch.companyId,
            pc: payload,
          },
        },
      };
      state.activePlatform = _activePlatform;
      localStorage.setItem("activePlatform", JSON.stringify(_activePlatform));
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
      .addCase(SETACTIVEAFFILIATION.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.message = "";
      })
      .addCase(SETACTIVEAFFILIATION.fulfilled, (state, action) => {
        const { success = "", payload = {} } = action.payload || {};
        const convert = (data) => JSON.parse(JSON.stringify(data));
        const updatedBranches = convert(state.branches).map((branch) => {
          if (
            String(branch.affiliationId || branch._id) ===
            String(payload?.currentAffiliation?._id || "")
          ) {
            return {
              ...branch,
              activePlatform: payload.currentAffiliation.activePlatform,
            };
          }

          return branch;
        });

        state.auth = {
          ...state.auth,
          ...payload,
        };
        state.branches = updatedBranches;

        setAP(state, {
          branches: updatedBranches,
          isPhysician: state.activePlatform.isPhysician,
          activeAffiliation: payload.activeAffiliation,
        });

        state.showModal = false;
        state.message = success;
        state.isSuccess = true;
        state.isLoading = false;
      })
      .addCase(SETACTIVEAFFILIATION.rejected, (state, action) => {
        const { error } = action;
        state.message = error.message;
        state.isLoading = false;
      })
      .addCase(SETAFFILIATIONPLATFORM.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.message = "";
      })
      .addCase(SETAFFILIATIONPLATFORM.fulfilled, (state, action) => {
        const success =
          action.payload?.success || "Platform updated successfully.";
        const payload = action.payload?.payload || action.payload;
        const normalizedPlatform = Access.normalizePlatformKey(
          payload?.activePlatform,
        );
        const updatedBranches = (state.branches || []).map((branch) => {
          if (
            String(branch.affiliationId || branch._id) ===
            String(payload?._id || "")
          ) {
            return {
              ...branch,
              ...(normalizedPlatform
                ? { activePlatform: normalizedPlatform }
                : {}),
            };
          }

          return branch;
        });

        state.branches = updatedBranches;

        setAP(state, {
          branches: updatedBranches,
          isPhysician: state.activePlatform.isPhysician,
          activeAffiliation: state.auth?.activeAffiliation,
        });

        state.showModal = false;
        state.message = success;
        state.isSuccess = true;
        state.isLoading = false;
      })
      .addCase(SETAFFILIATIONPLATFORM.rejected, (state, action) => {
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
        const { success, payload } = action.payload;
        initializeInformation(state, payload);
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
        const { success = "", payload = {} } = action.payload || {};
        state.message = success;
        state.auth = payload;
        state.email = payload.email;
        setAP(state, {
          branches: JSON.parse(JSON.stringify(state.branches)),
          isPhysician: state.activePlatform.isPhysician,
          activeAffiliation: payload.activeAffiliation,
        });
        state.isLoading = false;
        state.isSuccess = true;
      })
      .addCase(UPDATE.rejected, (state, action) => {
        const { error } = action;
        state.message = error.message;
        state.isLoading = false;
      })

      .addCase(UPDATE_INFO.pending, (state) => {
        state.formSubmitted = true;
        state.isSuccess = false;
        state.message = "";
      })
      .addCase(UPDATE_INFO.fulfilled, (state, action) => {
        // const { success, payload } = action.payload;
        state.formSubmitted = false;
        state.isSuccess = true;
      })
      .addCase(UPDATE_INFO.rejected, (state, action) => {
        const { error } = action;
        state.message = error.message;
        state.formSubmitted = false;
      })

      .addCase(VALIDATEREFRESH.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.message = "";
      })
      .addCase(VALIDATEREFRESH.fulfilled, (state, action) => {
        const { payload } = action.payload;
        initializeInformation(state, payload);
        state.isLoading = false;
      })
      .addCase(VALIDATEREFRESH.rejected, (state, action) => {
        const { error } = action;
        state.message = error.message;
        state.isLoading = false;
      })

      .addCase(UPLOAD.pending, (state) => {
        state.formSubmitted = true;
        state.isSuccess = false;
        state.message = "";
      })
      .addCase(UPLOAD.fulfilled, (state, _) => {
        state.isSuccess = true;
        state.formSubmitted = false;
        state.message = "Sucessfully uploaded!";
      })
      .addCase(UPLOAD.rejected, (state, action) => {
        const { error } = action;
        state.formSubmitted = false;
        state.message = error.message;
      })
      .addCase(DESTROY_IMG.pending, (state) => {
        state.formSubmitted = true;
        state.isSuccess = false;
        state.message = "";
      })
      .addCase(DESTROY_IMG.fulfilled, (state, action) => {
        const { success } = action.payload;
        state.message = success;
        state.isSuccess = true;
        state.formSubmitted = false;
      })
      .addCase(DESTROY_IMG.rejected, (state, action) => {
        const { error } = action;
        state.message = error.message;
        state.formSubmitted = false;
      });
  },
});

export const {
  RESET,
  OverrideActivePlatform,
  SyncAffiliationPlatform,
  SetAUTH,
  SetCOMPANY,
  MAXPAGE,
  UPLOADBAR,
  IMAGE,
  NETWORK,
  PatchSessionPlatform,
  SetPatientCategories,
} = reduxSlice.actions;

export default reduxSlice.reducer;
