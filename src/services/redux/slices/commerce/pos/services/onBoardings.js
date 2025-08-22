import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axioKit, capitalize } from "../../../../../utilities";

const url = "/commerce/pos/services/onboardings";
const today = new Date();

const initialState = {
  collections: [],
  filtered: [],
  cluster: [],
  formSubmitted: false,
  didSearch: false,
  selected: {},
  supplier: "all", //this is value for soa records header select
  status: "pending",
  vendor: { _id: "" },
  vendorId: "",
  page: 0,
  isSuccess: false,
  // main loading
  isLoading: false,
  // form loading
  isLoadingForm: false,
  willCreate: false,
  message: "",
  showModal: false,
  showProcess: false,
  activeTab: "labRequest",
  month: new Date().getMonth() + 1, // 0-based index (Jan = 0)
  year: new Date().getFullYear(),
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

export const SEND_OUTS = createAsyncThunk(
  `${url}/sendOuts`,
  ({ token, params }, thunkAPI) => {
    try {
      return axioKit.universal(`${url}/sendOuts`, token, params);
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
export const PATIENT = createAsyncThunk(
  `${url}/patient`,
  ({ token, key }, thunkAPI) => {
    try {
      return axioKit.universal(`${url}/patient`, token, key);
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

export const PROCESS_ONBOARDING = createAsyncThunk(
  `${url}/PROCESS_ONBOARDING`,
  ({ data, token }, thunkAPI) => {
    try {
      return axioKit.update(url, data, token, "process_onboarding");
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

export const SOA_RECORDS = createAsyncThunk(
  `${url}/soa_records`,
  ({ token, key }, thunkAPI) => {
    try {
      return axioKit.universal(`${url}/soa_records`, token, key);
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

export const GENERATE_SOA = createAsyncThunk(
  `${url}/genearte_soa`,
  (form, thunkAPI) => {
    try {
      return axioKit.update(url, form.data, form.token, "generate_bill_soa");
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
    SetSENDOUT_TASK_RESULT: (state, { payload }) => {
      if (payload?._id) {
        const form = capitalize(payload?.form);
        const identifier = ["Miscellaneous", "Xray", "Ultrasound"].includes(
          form
        )
          ? "dealId"
          : "_id";

        const findIndex = (collections) =>
          collections?.findIndex(
            ({ dealId, vendor = {} }) =>
              dealId?._id === payload[identifier] &&
              payload?.soTo?._id === vendor?._id
          );
        const findFormIndex = (forms) =>
          forms.findIndex((item) => item?._id === payload?._id);

        const updateCollection = (collections, index) => {
          if (index > -1) {
            if (identifier === "_id") {
              collections[index].dealId.soDiagnostic[form] = payload;
            } else {
              const formIndex = findFormIndex(
                collections[index]?.dealId.soDiagnostic[form]
              );
              if (formIndex > -1) {
                collections[index].dealId.soDiagnostic[form][formIndex] =
                  payload;
              }
            }
          }
        };
        updateCollection(state.collections, findIndex(state.collections));
        updateCollection(state.filtered, findIndex(state.filtered));
      }
    },
    SetVALIDATE_ID: (state, { payload }) => {
      const updateCollections = (collections) => {
        const onboardingUsers = collections.filter(
          ({ pid }) => pid._id === payload._id
        );

        onboardingUsers.forEach((element) => {
          const index = collections.findIndex(({ _id }) => _id === element._id);
          collections[index] = {
            ...collections[index],
            pid: payload,
          };
        });
      };
      updateCollections(state.filtered);
      updateCollections(state.collections);
    },
    SetSTATUS: (state, { payload }) => {
      if (payload === "all") {
        state.filtered = state.collections;
      } else if (payload === "done") {
        state.filtered = state.collections.filter(
          ({ status }) => status === "done"
        );
      } else {
        state.filtered = state.collections.filter(
          ({ status }) => status !== "done"
        );
      }
      state.status = payload;
    },
    SetVENDOR: (state, { payload }) => {
      if (payload === "all") {
        state.filtered = state.collections;
        state.vendorId = "";
      } else {
        state.filtered = state.collections.filter(
          ({ vendor }) => vendor._id === payload
        );
        state.vendorId = payload;
      }
    },
    FilterByVendor: (state, { payload }) => {
      const { value, vendor } = payload;
      if (value === "all") {
        state.filtered = state.collections;
        state.source = "";
        state.vendor = {};
        state.supplier = "all";
      } else {
        state.filtered = state.collections.filter(
          ({ vendor: v }) => v?._id === value
        );
        state.supplier = value;
        state.vendor = vendor;
      }
    },

    SetSoaCluster: (state, { payload }) => {
      const { soa = [], _id } = state.vendor;
      const fakeDB = localStorage.getItem("billing");
      let parseVoucher = fakeDB ? JSON.parse(fakeDB) : {};
      if (!_id && !soa) return;
      if (parseVoucher[_id]?.length > 0) {
        state.cluster = parseVoucher[_id];
      } else {
        state.cluster = [];
      }
    },
    CHECK_BULK_SOA: (state, { payload }) => {
      const { deals, date } = payload;
      const cluster = [...state.cluster];
      const index = cluster.findIndex((item) => item.date === date);
      const foundCluster = cluster[index];
      const { hasSelected = false } = foundCluster || {};
      if (hasSelected) {
        cluster.splice(index, 1);
      } else {
        if (index > -1) cluster.splice(index, 1);
        cluster.push({ date, deals, hasSelected: true });
      }

      state.cluster = cluster;

      console.log(
        "vendor in check bulk",
        JSON.parse(JSON.stringify(state.vendor))
      );

      localStorage.setItem(
        "billing",
        JSON.stringify({
          ...JSON.parse(localStorage.getItem("billing" || "{}")),
          [state.vendor?._id]: cluster,
        })
      );
    },

    CHECK_SOA: (state, { payload }) => {
      if (!state.vendor._id)
        return "please select source first to proceed in picking voucher";

      const { date, deal, totalDeals } = payload; //ex. totalDeals=5
      /* 
          The purpose of 'totalDeals' is to determine how many deals exist on a specific date. 
          If 'totalDeals' is equal to the number of deals in the local storage store for that date,
          it means that all deals for that date have already been checked.
      */
      const _cluster = [...state.cluster];
      const _clusterIndex = _cluster.findIndex((item) => item?.date === date);
      if (_clusterIndex > -1) {
        //if cluster is already exist
        const { deals = [] } = _cluster[_clusterIndex];
        const _deals = [...deals];

        const dealIndex = _deals.findIndex((item) => item?._id === deal?._id);
        // if deal is already exist remove it
        // if deal is not exist push it to deals
        dealIndex > -1 ? _deals.splice(dealIndex, 1) : _deals.push(deal);
        // update cluster deals
        const _oldCluster = _cluster[_clusterIndex];

        if (_deals.length === 0) {
          _cluster.splice(_clusterIndex, 1);
        } else {
          _cluster[_clusterIndex] = {
            ..._oldCluster,
            deals: _deals,
            hasSelected: totalDeals === _deals.length,
          };
        }
      } else {
        _cluster.push({ date, deals: [deal], hasSelected: totalDeals === 1 });
      }
      state.cluster = _cluster;
      localStorage.setItem(
        "billing",
        JSON.stringify({
          ...JSON.parse(localStorage.getItem("billing" || "{}")),
          [state.vendor?._id]: _cluster,
        })
      );
    },
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
      console.log("payload", payload);
      state.selected = payload;
      state.showModal = true;
    },

    SetPROCESS: (state, { payload }) => {
      state.selected = payload;
      state.showProcess = true;
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

    SetMONTH: (state, { payload }) => {
      if (payload === "next") {
        if (state.month === 12) {
          state.month = 1;
          state.year += 1;
        } else {
          state.month += 1;
        }
      } else {
        if (state.month === 1) {
          state.month = 12;
          state.year -= 1;
        } else {
          state.month -= 1;
        }
      }
    },
    ResetDATE: (state) => {
      state.month = today.getMonth() + 1;
      state.year = today.getFullYear();
    },
    setYear: (state, action) => {
      state.year = Number(action.payload);
    },
    TOGGLE: (state, { payload }) => {
      if (payload) {
        state.showProcess = !state.showProcess;
      } else {
        state.showModal = !state.showModal;
      }
      state.selected = {};
    },
    SetCOLLECTIONS: (state, { payload }) => {
      const { page, maxPage } = state;
      if (payload.length > 0) {
        let totalPAges = Math.floor(payload.length / state.maxPage);
        if (payload.length % maxPage > 0) totalPAges += 1;
        state.totalPages = totalPAges;
        if (page > totalPAges) {
          state.page = totalPAges;
        }
      }
      state.collections = payload;
      state.filtered = payload.filter(
        ({ department }) => department === state.department
      );
    },
    SetActiveTAB: (state, { payload }) => {
      state.activeTab = payload;
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
      .addCase(BROWSE.fulfilled, (state, action) => {
        const { payload } = action.payload;
        state.collections = state.filtered = payload || [];

        let totalPages = Math.floor(payload.length / state.maxPage);

        if (payload.length % state.maxPage > 0) totalPages += 1;
        state.totalPages = totalPages;
        if (state.activePage > totalPages) {
          state.activePage = totalPages;
        }
        state.isLoading = false;
      })
      .addCase(BROWSE.rejected, (state, action) => {
        const { error } = action;
        state.message = error.message;
        state.isLoading = false;
      })
      .addCase(SOA_RECORDS.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.message = "";
      })
      .addCase(SOA_RECORDS.fulfilled, (state, { payload }) => {
        state.collections = state.filtered = payload.payload || [];
        let totalPages = Math.ceil(state.filtered.length / state.maxPage);
        state.totalPages = totalPages;
        if (state.activePage > totalPages) {
          state.activePage = totalPages;
        }
        state.isLoading = false;
      })
      .addCase(SOA_RECORDS.rejected, (state, action) => {
        const { error } = action;
        state.message = error.message;
        state.isLoading = false;
      })
      .addCase(GENERATE_SOA.pending, (state) => {
        state.formSubmitted = true;
        state.isSuccess = false;
        state.message = "";
      })
      .addCase(GENERATE_SOA.fulfilled, (state, action) => {
        const { success, payload } = action.payload;
        const { onboardingIDS } = payload;
        state.vendor.soa = null;
        const updateCollections = (collections) => {
          return collections.filter(
            (item) => !onboardingIDS.includes(item._id)
          );
        };
        state.collections = updateCollections(state.collections);
        state.filtered = updateCollections(state.filtered);

        //update localstorage
        const cluster = state.cluster
          .map((clusterItem) => ({
            ...clusterItem,
            deals: clusterItem.deals.filter(
              (deal) => !onboardingIDS.includes(deal._id)
            ),
          }))
          .filter((clusterItem) => clusterItem.deals.length > 0);

        localStorage.setItem(
          "billing",
          JSON.stringify({
            ...JSON.parse(localStorage.getItem("billing" || "{}")),
            [state.vendor?._id]: cluster,
          })
        );
        state.supplier = "all";
        state.message = success;
        state.isSuccess = true;
        state.formSubmitted = false;
      })
      .addCase(GENERATE_SOA.rejected, (state, action) => {
        const { error } = action;
        state.message = error.message;
        state.formSubmitted = false;
      })
      .addCase(SEND_OUTS.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.message = "";
      })
      .addCase(SEND_OUTS.fulfilled, (state, { payload }) => {
        state.collections = state.filtered = payload.payload || [];
        let totalPages = Math.ceil(state.filtered.length / state.maxPage);
        state.totalPages = totalPages;
        if (state.activePage > totalPages) {
          state.activePage = totalPages;
        }
        state.isLoading = false;
      })
      .addCase(SEND_OUTS.rejected, (state, action) => {
        const { error } = action;
        state.message = error.message;
        state.isLoading = false;
      })
      .addCase(PATIENT.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.message = "";
      })
      .addCase(PATIENT.fulfilled, (state, action) => {
        const { data, success } = action.payload;
        state.collections = state.filtered = data;

        state.totalPages = Math.ceil((data?.length || 0) / state.maxPage) || 1;
        state.activePage = Math.min(state.activePage, state.totalPages);
        state.isSuccess = success;
        state.isLoading = false;
      })
      .addCase(PATIENT.rejected, (state, action) => {
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
      .addCase(PROCESS_ONBOARDING.pending, (state) => {
        state.formSubmitted = true;
        state.isSuccess = false;
        state.message = "";
      })
      .addCase(PROCESS_ONBOARDING.fulfilled, (state, action) => {
        const { success, payload } = action.payload;

        const updateCollections = (collections) => {
          const index = collections.findIndex(({ _id }) => _id === payload._id);
          collections.splice(index, 1);
        };

        updateCollections(state.collections);
        updateCollections(state.filtered);
        state.message = success;
        state.isSuccess = true;
        state.formSubmitted = false;
      })
      .addCase(PROCESS_ONBOARDING.rejected, (state, action) => {
        const { error } = action;
        state.message = error.message;
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
            const oldData = { ...collections[index] };
            if (payload.status === "denied") {
              collections.splice(index, 1);
            } else {
              collections[index] = { ...oldData, ...payload };
            }
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

      .addCase(DESTROY.pending, (state) => {
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
      })
      .addCase(DESTROY.rejected, (state, action) => {
        const { error } = action;
        state.message = error.message;
        state.isLoading = false;
      });
  },
});

export const {
  SetSENDOUT_TASK_RESULT,
  FilterByVendor, //for soa records
  SetSoaCluster,
  CHECK_BULK_SOA,
  CHECK_SOA,
  SetFILTERED,
  SetVALIDATE_ID,
  SetSELECTED,
  SetPROCESS,
  SetSTATUS,
  SetVENDOR,
  SetCOLLECTIONS,
  SetActiveTAB,
  TOGGLE,
  SetCREATE,
  SetEDIT,
  RESET,
  SetMaxPage,
  SetActivePAGE,
  SetMONTH,
  setYear,
  ResetDATE,
} = reduxSlice.actions;

export default reduxSlice.reducer;
