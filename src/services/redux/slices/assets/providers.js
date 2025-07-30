import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axioKit } from "../../../utilities";

const url = "assets/providers";
const categories = [
  { text: "Supplier", value: "supplier", title: "Supplier of Materials " },
  {
    text: "Laboratory",
    value: "laboratory",
    title: "Laboratory services only. ",
  },
  { text: "Radiology", value: "radiology", title: "Radiology services only." },
  {
    text: "Diagnostic",
    value: "diagnostic",
    title: "Laboratory and Radiology services.",
  },
  { text: "Pharmacy", value: "pharmacy", title: "Pharmacy only" },
  { text: "Infirmary", value: "infirmary", title: "Complete medical services" },
  {
    text: "Rehabilitation",
    value: "rehabilitation",
    title: "Rehabilitation services only (PT).",
  },
  { text: "Support", value: "support", title: "Support company" },
  { text: "Ghost", value: "ghost", title: "Unregistered Company" },
];
const contractCategories = [
  { text: "Subcontract", value: "sbc" },
  { text: "Special Subcontract", value: "ssc" },
];
const initialState = {
  collections: [],
  categories: categories,
  contractCategories,
  paginated: [],
  // enrolled: [],
  formSubmitted: false,
  searchResults: [],
  category: "", // this is the default active category in insource
  isSuccess: false,
  isLoading: false,
  didSearch: false,
  selected: {},
  page: 0,
  showModal: false,
  showRegisterModal: false,
  showCompanyModal: false,
  showPriceModal: false,
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
export const FILTERBYCATEGORY = createAsyncThunk(
  `${url}/filterbycategory`,
  async ({ keys, token }, thunkAPI) => {
    try {
      return await axioKit.universal(`${url}/filterbycategory`, token, keys);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message || error.toString()
      );
    }
  }
);

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
      return axioKit.save(url, data, token, "register_branch");
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message || error.toString()
      );
    }
  }
);
export const UPDATE = createAsyncThunk(
  `${url}/update`,
  async ({ data, token }, thunkAPI) => {
    try {
      return axioKit.update(url, data, token);
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
      return axioKit.update(url, form.data, form.token, "specific_update");
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
      state.didSearch = payload;
    },
    ADD_AFFILIATED: (state, { payload }) => {
      // this  function is used  in the cashier pos to add a new physician
      const register = payload;
      const fakeDB = localStorage.getItem("activePlatform");
      if (fakeDB) {
        const { branchId } = JSON.parse(fakeDB);
        const sourcesFakeDB = localStorage.getItem(`source_${branchId}`);

        if (sourcesFakeDB && register.isRegister && register?.source?._id) {
          //to update the source and add a new physician register
          const sources = JSON.parse(sourcesFakeDB);
          const index = sources.findIndex(
            (source) => source._id === register?.source?._id
          );
          sources[index]?.clients?.affiliated?.unshift(register?.physician);
          state.collections = sources;
          localStorage.setItem(`source_${branchId}`, JSON.stringify(sources));
        }
      }
    },
    SetSOURCE: (state, { payload }) => {
      state.selected = payload;
      state.showModal = true;
    },
    SetSELECTED: (state, { payload }) => {
      console.log("SetSELECTED payload", payload);

      state.selected = payload;
      state.willCreate = false;
      state.showModal = true;
    },

    SetSEARCHRESULTS: (state, { payload }) => {
      state.searchResults = payload;
      state.didSearch = true;
    },

    SetCATEGORY: (state, { payload }) => {
      const filter = state.collections.filter(
        ({ contract, status }) => (contract || status) === payload
      );
      const baseCollections = !payload ? state.collections : filter;
      state.filtered = baseCollections;
      state.totalPages =
        Math.ceil((baseCollections?.length || 0) / state.maxPage) || 1;
      state.activePage = Math.min(state.activePage, state.totalPages);
      state.category = payload;
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

      const updateCollections = (collections) => {
        const index = collections.findIndex((e) => e._id === providerId);
        if (isUpdateBranch) {
          // manipulate clients updating
          collections[index] = {
            ...state.collections[index],
            clients: { ...branch },
          };
        } else {
          //manipulate affiliateds
          if (index < 0) return console.log("provider not found");
          const provider = { ...collections[index] };

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

          collections[index] = {
            ...provider,
            clients: { ...clients, affiliated: affiliateds },
          };
        }
      };
      updateCollections(state.collections);
      updateCollections(state.filtered);

      state.selected = payload;
      state.willCreate = false;
    },
    SetPricelist: (state, { payload }) => {
      console.log("payload", payload);

      state.showPriceModal = true;
      state.selected = payload;
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

    TogglePrice: (state) => {
      state.showPriceModal = !state.showPriceModal;
      state.selected = {};
    },
    SetFILTER: (state, { payload }) => {
      state.didSearch = false;
      if (payload.length > 0) {
        state.totalPages = Math.ceil(payload.length / state.maxPage);
        if (state.page > state.totalPages) {
          state.page = state.totalPages;
        }
      }
      state.filtered = payload;
    },
    SetFILTERED: (state, { payload }) => {
      state.filtered = payload;
    },
    SetINSOURCE: (state, { payload }) => {
      state.collections = payload;
    },
    ResetFILTER: (state) => {
      const { collections } = state;
      state.totalPages = Math.ceil(collections.length / state.maxPage);
      if (state.page > state.totalPages) {
        state.page = state.totalPages;
      }
      state.filtered = collections;
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
      state.activePage = payload;
    },
    TOGGLE: (state) => {
      state.showModal = !state.showModal;
      state.selected = {};
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
      })
      .addCase(BROWSE.fulfilled, (state, { payload }) => {
        const { payload: data } = payload;
        state.collections = data;
        state.isSuccess = true;
        state.isLoading = false;
      })
      .addCase(BROWSE.rejected, (state, { payload }) => {
        state.message = payload;
        state.isLoading = false;
      })
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
        console.log("payload", payload);

        state.collections = state.filtered = payload.payload;
        const { page, maxPage } = state;
        if (payload.length > 0) {
          let totalPAges = Math.floor(payload.length / state.maxPage);
          if (payload.length % maxPage > 0) totalPAges += 1;
          state.totalPages = totalPAges;
          if (page > totalPAges) {
            state.page = totalPAges;
          }
        }
        state.totalPages =
          Math.ceil((payload.payload?.length || 0) / state.maxPage) || 1;
        state.activePage = Math.min(state.activePage, state.totalPages);
        localStorage.setItem("insource", JSON.stringify(payload.payload));
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
        state.formSubmitted = true;
      })
      .addCase(SAVE.fulfilled, (state, { payload }) => {
        state.collections.unshift(payload);
        state.filtered.unshift(payload);
        state.isSuccess = true;
        state.formSubmitted = false;
      })
      .addCase(SAVE.rejected, (state, { payload }) => {
        state.message = payload;
        state.formSubmitted = false;
      })
      .addCase(REGISTER_BRANCH.pending, (state) => {
        state.formSubmitted = true;
      })
      .addCase(REGISTER_BRANCH.fulfilled, (state, { payload }) => {
        const { payload: data } = payload;
        const { isGhostProvider } = data;
        const updateCollections = (collections) => {
          if (isGhostProvider) {
            const index = collections.findIndex(({ _id }) => data._id === _id);

            collections[index] = data;
          } else {
            collections.unshift(data);
          }
        };
        updateCollections(state.collections);
        updateCollections(state.filtered);

        state.isSuccess = true;
        state.formSubmitted = false;
      })
      .addCase(REGISTER_BRANCH.rejected, (state, { payload }) => {
        state.message = payload;
        state.formSubmitted = false;
      })
      .addCase(UPDATE.pending, (state) => {
        state.formSubmitted = true;
      })
      .addCase(UPDATE.fulfilled, (state, { payload }) => {
        const { payload: data } = payload;

        var _collections = state.collections;
        const index = _collections.findIndex((item) => item._id === data._id);
        _collections[index] = data;
        state.filtered = _collections.filter(({ contract, status }) => {
          if (state.category) {
            return (contract || status) === state.category;
          } else {
            return true;
          }
        });
        state.collections = _collections;
        state.isSuccess = true;
        state.formSubmitted = false;
      })
      .addCase(UPDATE.rejected, (state, { payload }) => {
        state.message = payload;
        state.formSubmitted = false;
      })

      .addCase(SPECIFIC_UPDATE.pending, (state) => {
        state.formSubmitted = true;
      })
      .addCase(SPECIFIC_UPDATE.fulfilled, (state, { payload }) => {
        const { payload: data, success } = payload;
        const { updatedKey, _id } = data;
        const updateCollections = (collections) => {
          const index = collections.findIndex((item) => item._id === _id);
          collections[index] = {
            ...collections[index],
            [updatedKey]: data[updatedKey],
          };
        };

        updateCollections(state.collections);
        updateCollections(state.filtered);

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

        const updateCollections = (collections) => {
          const index = collections.findIndex((item) => item._id === payload);
          collections.splice(index, 1);
        };

        updateCollections(state.collections);
        updateCollections(state.filtered);
        state.message = success;
        state.isSuccess = true;
        state.isLoading = false;
      })
      .addCase(DESTROY.rejected, (state, action) => {
        const { error } = action;
        state.message = error.message;
        state.isLoading = false;
      })
      .addCase(FILTERBYCATEGORY.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.message = "";
      })
      .addCase(FILTERBYCATEGORY.fulfilled, (state, action) => {
        const { payload, success } = action.payload;
        state.collections = state.filtered = payload;
        state.totalPages =
          Math.ceil((payload?.length || 0) / state.maxPage) || 1;
        state.activePage = Math.min(state.activePage, state.totalPages);

        state.isSuccess = success;
        state.isLoading = false;
      })
      .addCase(FILTERBYCATEGORY.rejected, (state, action) => {
        const { error } = action;
        state.message = error.message;
        state.isLoading = false;
      });
  },
});

export const {
  ADD_AFFILIATED,
  SetSELECTED,
  SetCREATE,
  SetFILTER,
  SetINSOURCE,
  SetCATEGORY,
  ResetFILTER,
  SetPAGE,
  SETSOURCES,
  SetSEARCHRESULTS,
  SetPricelist,
  TogglePrice,
  ToggleDidSearch,
  RESET_COLLECTIONS,
  SetREGISTER,
  ToggleRegister,
  TOGGLE,
  SetSOURCE,
  SetBRANCHES,
  SetMaxPage,
  SetActivePAGE,
  RESET,
  SetFILTERED,
} = reduxSlice.actions;
export default reduxSlice.reducer;
