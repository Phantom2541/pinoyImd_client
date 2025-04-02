import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axioKit } from "../../../utilities";

const url = "assets/providers";

const initialState = {
  collections: [],
  paginated: [],
  // enrolled: [],
  formSubmitted: false,
  searchResults: [],
  isSuccess: false,
  isLoading: false,
  didSearch: false,
  selected: {},
  page: 0,
  showModal: false,
  showRegisterModal: false,
  showCompanyModal: false,
  willCreate: false,
  /**
   * Footer
   */
  filtered: [],
  maxPage: 5,
  activePage: 1,
  totalPages: 0,
};
export const BROWSE = createAsyncThunk(
  `${url}/browse`,
  async ({ key, token }, thunkAPI) => {
    try {
      return await axioKit.universal(`${url}/browse`, token, key);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message || error.toString()
      );
    }
  }
);

// export const UTILITIES = createAsyncThunk(
//   `${url}/browse`,
//   async ({ key, token }, thunkAPI) => {
//     try {
//       return await axioKit.universal(`${url}/browse`, token, key);
//     } catch (error) {
//       return thunkAPI.rejectWithValue(
//         error.response?.data?.message || error.message || error.toString()
//       );
//     }
//   }
// );

export const GETENROLLED = createAsyncThunk(
  `${url}/enrollements`,
  async ({ key, token }, thunkAPI) => {
    try {
      return await axioKit.universal(`${url}/enrollements`, token, key);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message || error.toString()
      );
    }
  }
);

export const INSOURCE = createAsyncThunk(
  `${url}/insource`,
  async ({ key, token }, thunkAPI) => {
    try {
      return await axioKit.universal(`${url}/insource`, token, key);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message || error.toString()
      );
    }
  }
);

export const OUTSOURCE = createAsyncThunk(
  `${url}/outsource`,
  async ({ key, token }, thunkAPI) => {
    try {
      return await axioKit.universal(`${url}/outsource`, token, key);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message || error.toString()
      );
    }
  }
);

export const TIEUPS = createAsyncThunk(
  `${url}/tieups`,
  async ({ token, key }, thunkAPI) => {
    try {
      return await axioKit.universal(`${url}/tieups`, token, key);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message || error.toString()
      );
    }
  }
);

export const LIST = createAsyncThunk(`${url}/list`, async (token, thunkAPI) => {
  try {
    return await axioKit.universal(`${url}/list`, token);
  } catch (error) {
    return thunkAPI.rejectWithValue(
      error.response?.data?.message || error.message || error.toString()
    );
  }
});

export const SAVE = createAsyncThunk(`${url}/save`, async (form, thunkAPI) => {
  try {
    return await axioKit.save(url, form.data, form.token);
  } catch (error) {
    return thunkAPI.rejectWithValue(
      error.response?.data?.message || error.message || error.toString()
    );
  }
});

export const REGISTER_BRANCH = createAsyncThunk(
  `${url}/REGISTER_BRANCH`,
  async ({ token, data }, thunkAPI) => {
    try {
      return await axioKit.save(url, data, token, "register_branch");
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message || error.toString()
      );
    }
  }
);
export const UPDATE = createAsyncThunk(
  `${url}/update`,
  async (form, thunkAPI) => {
    try {
      return await axioKit.update(url, form.data, form.token);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message || error.toString()
      );
    }
  }
);

export const SPECIFIC_UPDATE = createAsyncThunk(
  `${url}/SPECIFIC_UPDATE`,
  async (form, thunkAPI) => {
    try {
      return await axioKit.update(
        url,
        form.data,
        form.token,
        "specific_update"
      );
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message || error.toString()
      );
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

export const reduxSlice = createSlice({
  name: url,
  initialState,
  reducers: {
    ToggleDidSearch: (state, { payload }) => {
      console.log("toggle didSearch");
      state.didSearch = payload;
    },
    SetSOURCE: (state, { payload }) => {
      state.selected = payload;
      state.showModal = true;
    },

    ToggleModal: (state) => {
      state.showCompanyModal = !state.showCompanyModal;
      state.isSuccess = false;
    },
    SetEDIT: (state, { payload }) => {
      state.selected = payload;
      state.willCreate = false;
      state.showModal = true;
    },

    SetSEARCHRESULTS: (state, { payload }) => {
      state.searchResults = payload;
      state.didSearch = true;
    },
    SetBRANCHES: (state, { payload }) => {
      const {
        branch = {},
        affiliated = {},
        providerId = "",
        physicianId = "",
        isUpdatePhysician = false,
        isUpdateBranch = false,
      } = payload;

      const index = state.collections.findIndex((e) => e._id === providerId);

      if (isUpdateBranch) {
        // manipulate clients updating
        state.collections[index] = {
          ...state.collections[index],
          clients: { ...branch },
        };
      } else {
        //manipulate affiliateds
        if (index < 0) return console.log("provider not found");
        const provider = { ...state.collections[index] };

        const { clients = {} } = provider || {};

        const affiliateds = [...clients?.affiliated];
        if (physicianId) {
          const affiliatedIndex = affiliateds.findIndex(
            (e) => e._id === physicianId
          );
          if (isUpdatePhysician) {
            affiliateds[affiliatedIndex] = affiliated;
          } else {
            affiliateds.splice(affiliatedIndex, 1);
          }
        } else {
          affiliateds.unshift(affiliated);
        }

        state.collections[index] = {
          ...provider,
          clients: { ...clients, affiliated: affiliateds },
        };

        state.selected = payload;
        state.willCreate = false;
        state.showModal = true;
      }
    },
    SetCREATE: (state, { payload }) => {
      state.selected = payload;
      state.willCreate = true;
      state.showModal = true;
    },
    SetREGISTER: (state, { payload }) => {
      state.selected = payload;
      state.showRegisterModal = true;
    },
    ToggleRegister: (state) => {
      state.showRegisterModal = !state.showRegisterModal;
      state.selected = {};
    },
    SetFILTER: (state, { payload }) => {
      const { page, maxPage } = payload;
      if (page.length > 0) {
        state.totalPages = Math.ceil(payload.length / maxPage);
        if (state.page > state.totalPages) {
          state.page = state.totalPages;
        }
      }
      state.filtered = page;
    },
    RESET_COLLECTIONS: (state) => {
      state.didSearch = false;
    },
    SetPAGE: (state, { payload }) => {
      state.page = payload;
    },
    SETSOURCES: (state, { payload }) => {
      state.collections = payload;
    },
    /**
     *  Footer
     */
    SetMaxPage: (state, { payload }) => {
      state.maxPage = payload;
      state.activePage = 1;
    },
    SetActivePAGE: (state, { payload }) => {
      console.log("payload", payload);

      state.activePage = payload;
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

      .addCase(GETENROLLED.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(GETENROLLED.fulfilled, (state, { payload }) => {
        const { payload: data } = payload;
        state.enrolled = data;
        state.isSuccess = true;
        state.isLoading = false;
      })
      .addCase(GETENROLLED.rejected, (state, { payload }) => {
        state.message = payload;
        state.isLoading = false;
      })

      .addCase(OUTSOURCE.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(OUTSOURCE.fulfilled, (state, { payload }) => {
        const { payload: data } = payload;
        state.collections = data;
        state.filtered = data;
        state.paginated = data;

        state.paginated = state.filtered = data;
        state.totalPages = Math.ceil(data?.length / state.maxPage) || 1;
        state.activePage = Math.min(state.activePage, state.totalPages);
        state.isSuccess = true;
        state.isLoading = false;
      })

      .addCase(OUTSOURCE.rejected, (state, { payload }) => {
        state.message = payload;
        state.isLoading = false;
      })

      .addCase(INSOURCE.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(INSOURCE.fulfilled, (state, { payload }) => {
        state.collections = payload.payload;
        state.isLoading = false;
      })
      .addCase(INSOURCE.rejected, (state, { payload }) => {
        state.message = payload;
        state.isLoading = false;
      })
      .addCase(TIEUPS.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(TIEUPS.fulfilled, (state, { payload }) => {
        state.collections = payload;
        state.isLoading = false;
      })
      .addCase(TIEUPS.rejected, (state, { payload }) => {
        state.message = payload;
        state.isLoading = false;
      })
      .addCase(LIST.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(LIST.fulfilled, (state, { payload }) => {
        state.collections = payload;
        state.isLoading = false;
      })
      .addCase(LIST.rejected, (state, { payload }) => {
        state.message = payload;
        state.isLoading = false;
      })
      .addCase(SAVE.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(SAVE.fulfilled, (state, { payload }) => {
        state.collections.unshift(payload);
        state.isSuccess = true;
        state.isLoading = false;
      })
      .addCase(SAVE.rejected, (state, { payload }) => {
        state.message = payload;
        state.isLoading = false;
      })
      .addCase(REGISTER_BRANCH.pending, (state) => {
        state.formSubmitted = true;
      })
      .addCase(REGISTER_BRANCH.fulfilled, (state, { payload }) => {
        const { payload: data } = payload;
        const { isGhostProvider } = data;
        if (isGhostProvider) {
          const index = state.collections.findIndex(
            ({ _id }) => data._id === _id
          );

          state.collections[index] = data;
        } else {
          state.collections.unshift(data);
        }
        state.isSuccess = true;
        state.formSubmitted = false;
      })
      .addCase(REGISTER_BRANCH.rejected, (state, { payload }) => {
        state.message = payload;
        state.formSubmitted = false;
      })
      .addCase(UPDATE.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(UPDATE.fulfilled, (state, { payload }) => {
        const index = state.collections.findIndex(
          (item) => item._id === payload._id
        );
        if (index !== -1) {
          state.collections[index] = payload;
        }
        state.isSuccess = true;
        state.isLoading = false;
      })
      .addCase(UPDATE.rejected, (state, { payload }) => {
        state.message = payload;
        state.isLoading = false;
      })

      .addCase(SPECIFIC_UPDATE.pending, (state) => {
        state.formSubmitted = true;
      })
      .addCase(SPECIFIC_UPDATE.fulfilled, (state, { payload }) => {
        const { payload: data, success } = payload;
        const { updatedKey, _id } = data;
        const index = state.collections.findIndex((item) => item._id === _id);
        state.collections[index] = {
          ...state.collections[index],
          [updatedKey]: data[updatedKey],
        };
        state.isSuccess = true;
        state.formSubmitted = false;
        state.message = success;
      })
      .addCase(SPECIFIC_UPDATE.rejected, (state, { payload }) => {
        state.message = payload;
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

export const {
  SetEDIT,
  SetCREATE,
  SetFILTER,
  SetPAGE,
  SETSOURCES,
  SetSEARCHRESULTS,

  ToggleModal,
  ToggleDidSearch,
  RESET_COLLECTIONS,
  SetREGISTER,
  ToggleRegister,
  SetSOURCE,
  SetBRANCHES,
  SetMaxPage,
  SetActivePAGE,
  RESET,
} = reduxSlice.actions;
export default reduxSlice.reducer;
