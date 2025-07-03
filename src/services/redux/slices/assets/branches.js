import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axioKit } from "../../../utilities";

const url = "assets/branches";

const initialState = {
  collections: [],
  filtered: [],
  formSubmitted: false,
  didSearch: false,
  selected: {},
  page: 0,
  isSuccess: false,
  // main loading
  isLoading: false,
  // form loading
  isLoadingForm: false,
  willCreate: false,
  message: "",
  showModal: false,
  department: "LAB",
  /**
   * Footer
   */
  maxPage: 5,
  activePage: 1,
  totalPages: 0,
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
export const SEARCH = createAsyncThunk(
  `${url}/search`,
  ({ token, key }, thunkAPI) => {
    try {
      return axioKit.universal(`${url}/search`, token, { searchKey: key });
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

export const SAVE = createAsyncThunk(
  `${url}/save`,
  ({ data, token }, thunkAPI) => {
    try {
      return axioKit.save(url, data, token);
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

export const UPDATE_TAT = createAsyncThunk(
  `${url}/update_tat`,
  ({ data, token }, thunkAPI) => {
    try {
      return axioKit.update(url, data, token, "update_tat");
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
      return axioKit.update(url, data, token);
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

export const ASSIGN_AO = createAsyncThunk(
  `${url}/ASSIGN_AO`,
  ({ data, token }, thunkAPI) => {
    try {
      return axioKit.update(url, data, token, "assign_ao");
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

export const UNTAG_PERSONNEL = createAsyncThunk(
  `${url}/untag_personnel`,
  ({ data, token }, thunkAPI) => {
    try {
      return axioKit.update(url, data, token, "untag_personnel");
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
export const UntagPHYSICIAN = createAsyncThunk(
  `${url}/untagPhysician`,
  ({ data, token }, thunkAPI) => {
    try {
      return axioKit.update(`${url}/untagPhysician`, data, token);
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
export const TagPHYSICIAN = createAsyncThunk(
  `${url}/tagPhysician`,
  ({ data, token }, thunkAPI) => {
    try {
      return axioKit.update(`${url}/tagPhysician`, data, token);
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
    SetCREATE: (state) => {
      state.selected = {
        department: state.department,
        mode: "",
        section: "",
        expectedAt: "",
      };
      state.willCreate = true;
      state.showModal = true;
    },
    SetEDIT: (state, { payload }) => {
      state.selected = payload;
      state.willCreate = false;
      state.showModal = true;
    },
    SetSELECTED: (state, { payload }) => {
      state.selected = payload;
      state.showModal = true;
      state.willCreate = false;
    },

    SetMODAL: (state) => {
      state.showModal = !state.showModal;
    },
    /**
     *  Footer
     */
    SetFILTERED: (state, { payload }) => {
      state.filtered = payload;
    },
    SetMaxPage: (state, { payload }) => {
      state.maxPage = payload;
      state.activePage = 1;
    },
    SetActivePAGE: (state, { payload }) => {
      state.activePage = payload;
    },
    TOGGLE: (state) => {
      state.showModal = !state.showModal;
      state.selected = {};
    },
    SetCOLLECTIONS: (state, { payload }) => {
      state.collections = payload;
      state.filtered = payload.filter(
        ({ department }) => department === state.department
      );
    },
    SetDepartment: (state, { payload }) => {
      state.department = payload;
      state.filtered = state.collections.filter(
        ({ department }) => department === state.department
      );
    },
    RESET: (state) => {
      state.isSuccess = false;
      state.isLoading = false;
      state.formSubmitted = false;
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
      .addCase(BROWSE.fulfilled, (state, { payload }) => {
        state.collections = state.filtered = payload;

        let totalPAges = Math.floor(payload.length / state.maxPage);
        if (payload.length % state.maxPage > 0) totalPAges += 1;
        state.totalPages = totalPAges;
        if (state.activePage > totalPAges) {
          state.activePage = totalPAges;
        }
        state.isLoading = false;
      })
      .addCase(BROWSE.rejected, (state, action) => {
        const { error } = action;
        state.message = error.message;
        state.isLoading = false;
      })
      .addCase(SEARCH.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.message = "";
      })
      .addCase(SEARCH.fulfilled, (state, action) => {
        state.collections = action.payload;
        state.isLoading = false;
        state.isSuccess = true;
      })
      .addCase(SEARCH.rejected, (state, action) => {
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
        const { success, payload } = action.payload;
        state.message = success;
        state.collections.unshift(payload);
        state.filtered.unshift(payload);
        state.isSuccess = true;
        state.formSubmitted = false;
      })
      .addCase(SAVE.rejected, (state, action) => {
        const { error } = action;
        state.message = error.message;
        state.formSubmitted = false;
      })
      .addCase(UPDATE_TAT.pending, (state) => {
        state.formSubmitted = true;
        state.isSuccess = false;
        state.message = "";
      })
      .addCase(UPDATE_TAT.fulfilled, (state, action) => {
        const { success } = action.payload;
        // state.collections = payload;
        // state.filtered = payload.filter(
        //   ({ department }) => department === state.department
        // );
        // console.log("state.department", state.department);

        state.message = success;
        state.isSuccess = true;
        state.formSubmitted = false;
      })
      .addCase(UPDATE_TAT.rejected, (state, action) => {
        const { error } = action;
        state.message = error.message;
        state.formSubmitted = false;
      })

      .addCase(UPDATE.pending, (state) => {
        state.formSubmitted = true;
        state.isSuccess = false;
        state.message = "";
      })
      .addCase(UPDATE.fulfilled, (state, action) => {
        const { success, payload } = action.payload;
        if (state.collections.length > 0) {
          const updateCollections = (collections) => {
            const index = collections.findIndex(
              (item) => item._id === payload._id
            );
            collections[index] = payload;
          };

          updateCollections(state.collections);
          updateCollections(state.filtered);
        }
        state.message = success;
        state.isSuccess = true;
        state.formSubmitted = false;
      })
      .addCase(UPDATE.rejected, (state, action) => {
        const { error } = action;
        state.message = error.message;
        state.formSubmitted = false;
      })

      .addCase(ASSIGN_AO.pending, (state) => {
        state.formSubmitted = true;
        state.isSuccess = false;
        state.message = "";
      })

      .addCase(ASSIGN_AO.fulfilled, (state, action) => {
        const { success, payload } = action.payload;
        if (state.collections.length > 0) {
          const { newPersonnel = false, createdPersonnel } = payload;
          const getIndex = (collections) =>
            collections.findIndex(({ _id }) => _id === payload._id);
          const collectionIndex = getIndex(state.collections);
          const filteredIndex = getIndex(state.filtered);

          const filteredOldInfo = { ...state.filtered[filteredIndex] };
          const collectionOldInfo = { ...state.collections[collectionIndex] };
          if (newPersonnel) {
            filteredOldInfo.personnels.unshift(createdPersonnel);
            collectionOldInfo.personnels.unshift(createdPersonnel);
          }

          state.collections[collectionIndex] = {
            ...collectionOldInfo,
            ...payload,
          };

          state.filtered[filteredIndex] = {
            ...filteredOldInfo,
            ...payload,
          };
        }
        state.message = success;
        state.isSuccess = true;
        state.formSubmitted = false;
      })
      .addCase(ASSIGN_AO.rejected, (state, action) => {
        const { error } = action;
        state.message = error.message;
        state.formSubmitted = false;
      })

      .addCase(UNTAG_PERSONNEL.pending, (state) => {
        state.formSubmitted = true;
        state.isSuccess = false;
        state.message = "";
      })

      .addCase(UNTAG_PERSONNEL.fulfilled, (state, action) => {
        const { success, payload } = action.payload;
        if (state.collections.length > 0) {
          // const { newPersonnel = false, createdPersonnel } = payload;
          const getIndex = (collections) =>
            collections.findIndex(({ _id }) => _id === payload._id);
          const collectionIndex = getIndex(state.collections);
          const filteredIndex = getIndex(state.filtered);

          const filteredOldInfo = { ...state.filtered[filteredIndex] };
          const collectionOldInfo = { ...state.collections[collectionIndex] };

          const getPersonnelIndex = (personnels) =>
            personnels.findIndex(({ _id }) => _id === payload?.personnelID);

          const personnelsCollection = [...collectionOldInfo.personnels];

          personnelsCollection.splice(
            getPersonnelIndex(personnelsCollection),
            1
          );

          const personnelsFiltered = [...filteredOldInfo.personnels];
          personnelsFiltered.splice(getPersonnelIndex(personnelsFiltered), 1);

          state.collections[collectionIndex] = {
            ...collectionOldInfo,
            personnels: personnelsCollection,
          };

          state.filtered[filteredIndex] = {
            ...filteredOldInfo,
            personnels: personnelsFiltered,
          };
        }
        state.message = success;
        state.isSuccess = true;
        state.formSubmitted = false;
      })
      .addCase(UNTAG_PERSONNEL.rejected, (state, action) => {
        const { error } = action;
        state.message = error.message;
        state.formSubmitted = false;
      })
      .addCase(DESTROY.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.message = "";
      })
      .addCase(DESTROY.fulfilled, (state, action) => {
        const { success, payload } = action.payload;
        const index = state.collections.findIndex(
          (item) => item._id === payload
        );
        const findex = state.filtered.findIndex((item) => item._id === payload);

        state.collections.splice(index, 1);
        state.filtered.splice(findex, 1);

        state.message = success;
        state.isSuccess = true;
        state.isLoading = false;
      })
      .addCase(DESTROY.rejected, (state, action) => {
        const { error } = action;
        state.message = error.message;
        state.isLoading = false;
      })
      .addCase(TagPHYSICIAN.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.message = "";
      })
      .addCase(TagPHYSICIAN.fulfilled, (state, action) => {
        const { success } = action.payload;
        // const { affiliated, providerId } = payload;
        // const index = state.collections.findIndex(
        //   (item) => item._id === providerId
        // );
        // const provider = state.collections[index];
        // provider.affiliated.unshift(affiliated);
        // state.collections[index] = provider;
        state.message = success;
        state.isSuccess = true;
        state.isLoading = false;
      })
      .addCase(TagPHYSICIAN.rejected, (state, action) => {
        const { error } = action;
        state.message = error.message;
        state.isLoading = false;
      })
      .addCase(UntagPHYSICIAN.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.message = "";
      })
      .addCase(UntagPHYSICIAN.fulfilled, (state, action) => {
        const { success, payload } = action;
        const index = state.collections.findIndex(
          (item) => item._id === payload
        );

        state.collections.splice(index, 1);
        state.message = success;
        state.isSuccess = true;
        state.isLoading = false;
      })
      .addCase(UntagPHYSICIAN.rejected, (state, action) => {
        const { error } = action;
        state.message = error.message;
        state.isLoading = false;
      });
  },
});

export const {
  SetFILTERED,
  SetSELECTED,
  SetCOLLECTIONS,
  SetDepartment,
  TOGGLE,
  SetCREATE,
  SetEDIT,
  RESET,
  SetMaxPage,
  SetActivePAGE,
} = reduxSlice.actions;

export default reduxSlice.reducer;
