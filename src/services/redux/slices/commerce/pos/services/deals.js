import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  axioKit,
  dateFormat,
  fullName,
  getAge,
} from "../../../../../utilities";
import { HMO, Services } from "../../../../../fakeDb";
import { orderBy } from "lodash";

const url = "commerce/pos/services/deals";
const today = new Date();

const initialState = {
  month: new Date().getMonth() + 1, // Month as a number (1-12)
  year: new Date().getFullYear(),
  collections: [],
  transaction: { _id: "default" },
  totalPatient: 0,
  formSubmitted: false,
  filtered: [], //arranged by date
  refined: [], // filtered by collections use by cashier onboarding
  filterByCashier: "all",
  cashiers: [],
  patient: {},
  cluster: [],
  sources: [],
  source: "all",
  hmo: "all",
  filterBy: "source",
  physicians: [],
  filteredPhysicians: [],
  physician: "all",
  showModal: false,
  showRevertModal: false,
  showDiscountModal: false,
  willCreate: false,
  totalPages: 0,
  maxPage: 5,
  activePage: 1,
  selected: {},
  isSuccess: false,
  isLoading: false,
  censusLoading: false, // dedicated loader for celsus
  message: "",
  vendor: {},
  onPrint: false,
};

export const BROWSE = createAsyncThunk(`${url}`, ({ token, key }, thunkAPI) => {
  try {
    return axioKit.universal(`${url}/browse`, token, key);
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();

    return thunkAPI.rejectWithValue(message);
  }
});

export const HUNDREDDATA = createAsyncThunk(
  `${url}/showFormsByDepartment`,
  ({ token, key }, thunkAPI) => {
    try {
      return axioKit.universal(`${url}/showFormsByDepartment`, token, key);
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

export const VOUCHERS = createAsyncThunk(
  `${url}/vouchers`,
  ({ token, key }, thunkAPI) => {
    try {
      return axioKit.universal(`${url}/vouchers`, token, key);
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
export const OUTSOURCES = createAsyncThunk(
  `${url}/outsources`,
  ({ token, keys }, thunkAPI) => {
    try {
      return axioKit.universal(`${url}/outsources`, token, keys);
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
export const INSOURCES = createAsyncThunk(
  `${url}/insources`,
  ({ token, keys }, thunkAPI) => {
    try {
      return axioKit.universal(`${url}/insources`, token, keys);
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
export const CASHIER = createAsyncThunk(
  `${url}/cashier`,
  ({ token, key }, thunkAPI) => {
    try {
      return axioKit.universal(`${url}/cashier`, token, key);
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

export const TRACKER = createAsyncThunk(
  `${url}/tracker`,
  ({ token, key }, thunkAPI) => {
    try {
      return axioKit.universal(`${url}/tracker`, token, key);
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

export const CENSUS = createAsyncThunk(
  `${url}/ledger`,
  ({ token, key }, thunkAPI) => {
    try {
      return axioKit.universal(`${url}/ledger`, token, key);
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

export const YEARLY = createAsyncThunk(
  `${url}/yearly`,
  ({ token, branchId, year }, thunkAPI) => {
    try {
      return axioKit.universal(`${url}/yearly`, token, {
        branchId,
        year,
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

export const GENERATE_SOA = createAsyncThunk(
  `${url}/GENERATE_SOA`,
  ({ data, token }, thunkAPI) => {
    try {
      return axioKit.save(url, data, token, "generate_soa");
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

export const UPDATE100DATA = createAsyncThunk(
  `${url}/updateFormsByDepartment`,
  (form, thunkAPI) => {
    try {
      return axioKit.update(
        url,
        form.data,
        form.token,
        "updateFormsByDepartment"
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

export const UPDATE = createAsyncThunk(`${url}/update`, (form, thunkAPI) => {
  try {
    return axioKit.update(url, form.data, form.token);
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();

    return thunkAPI.rejectWithValue(message);
  }
});

export const UPDATE_INFO = createAsyncThunk(
  `${url}/UPDATE_INFO`,
  ({ data, token }, thunkAPI) => {
    try {
      return axioKit.update(url, data, token, "update_info");
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

export const DENY_ONBOARDING = createAsyncThunk(
  `${url}/DENY_ONBOARDING`,
  ({ data, token }, thunkAPI) => {
    try {
      return axioKit.update(url, data, token, "deny_onboarding");
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

/**
 * Automatic generate URL.
 */
export const LABRESULT = createAsyncThunk(
  `${url}/results`,
  ({ token, data }, thunkAPI) => {
    try {
      // \diagnostics\laboratory\result\miscellaneous
      const department = ["Laboratory", "Radiology"].includes(data.department)
        ? data.department
        : "clinic";
      return axioKit.save(
        `diagnostics/${department.toLowerCase()}/result/${data.form.toLowerCase()}`,
        data,
        token
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

export const REVERT_SALE = createAsyncThunk(
  `${url}/REVERT_SALE`,
  ({ data, token }, thunkAPI) => {
    try {
      return axioKit.update(url, data, token, "revert_sale");
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

export const MANAGERUPDATE = createAsyncThunk(
  `${url}/managerUpdate`,
  ({ key, token }, thunkAPI) => {
    try {
      return axioKit.universal(`${url}/managerUpdate`, token, key);
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

const arrangeDealsByDate = (state, collections) => {
  // Group the filtered results by date and assign to state filtered,totalpages,activepage
  const groupByDate = collections.reduce((groups, item) => {
    const date = dateFormat(item.createdAt);
    const time = new Date(item.createdAt).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

    const group = groups.find((g) => g.date === date);
    if (group) {
      group.deals.push({ ...item, isSelected: false });
    } else {
      groups.push({
        date,
        time,
        deals: [{ ...item, isSelected: false }],
        isSelected: false,
      });
    }
    return groups;
  }, []);
  state.filtered = groupByDate;
  // Set pagination and assign to state
  state.totalPages = Math.ceil(groupByDate.length / state.maxPage) || 1;
  state.activePage = Math.min(state.activePage, state.totalPages);
};

const getPhysicians = (collections) => {
  let uniquePhysicians = [];
  if (collections.length > 0)
    uniquePhysicians = [
      ...new Map(
        collections.map(({ physicianId }) => [
          physicianId?._id || "NoPhysician",
          {
            _id: physicianId?._id || "",
            fullName: physicianId?.fullName || "No Physician",
          },
        ])
      ).values(),
    ].filter(({ _id }) => _id);

  const physicianWithAmount = [...uniquePhysicians].map((p) => {
    const total = collections
      .filter(({ physicianId }) => physicianId?._id === p._id)
      .reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);
    return { ...p, total, fullName: fullName(p.fullName) };
  });

  // Compute and append "No Physician" entry
  const noPhysicianAmount = collections
    .filter(({ physicianId }) => !physicianId?._id)
    .reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);

  if (noPhysicianAmount > 0) {
    physicianWithAmount.unshift({
      _id: "NoPhysician",
      fullName: "No Physician",
      total: noPhysicianAmount,
    });
  }
  return physicianWithAmount;
};

export const reduxSlice = createSlice({
  name: url,
  initialState,
  reducers: {
    SetTOTAL: (state, { payload }) => {
      state.total = payload;
    },
    SetFILTERED: (state, { payload }) => {
      state.filtered = payload;
    },

    SetREVERT: (state, { payload }) => {
      state.selected = payload;
      state.showRevertModal = true;
    },
    SetDISCOUNT: (state, { payload }) => {
      state.selected = payload;
      state.showDiscountModal = true;
    },
    ToggleDiscountModal: (state) => {
      state.showDiscountModal = !state.showDiscountModal;
      state.selected = {};
    },
    ToggleRevertModal: (state) => {
      state.showRevertModal = !state.showRevertModal;
      state.selected = {};
    },
    SetFilterByCASHIER: (state, { payload }) => {
      if (payload !== state.filterByCashier)
        if (payload === "all") {
          state.refined = state.collections;
        } else {
          state.refined = state.collections.filter(
            ({ cashierId }) => cashierId._id.toString() === payload.toString()
          );
        }
      state.filterByCashier = payload;
    },

    SetSORTING: (state, { payload: sortBy }) => {
      const formattedDeals = [...state.collections].map((deal) => {
        const { source, customerId, physicianId } = deal;
        const sourceName = source?.displayname || source?.name;
        const physician = physicianId?.fullName?.lname;
        return {
          ...deal,
          sourceName,
          customer: fullName(customerId?.fullName),
          card: HMO.getName(deal.hmo),
          physician,
        };
      });

      const updateCollections = (collections) => {
        state.collections = collections;
        state.refined = collections;
      };
      switch (sortBy) {
        case "patient":
          updateCollections(orderBy(formattedDeals, "customer", "asc"));
          break;
        case "time":
          updateCollections(orderBy(formattedDeals, "createdAt", "desc"));
          break;
        case "source":
          updateCollections(orderBy(formattedDeals, "sourceName", "asc"));
          break;
        case "refined":
          updateCollections(orderBy(formattedDeals, "card", "asc"));
          break;
        default:
          updateCollections(orderBy(formattedDeals, "physician", "asc"));
          break;
      }
    },

    SetFilterBySOURCE: (state, { payload }) => {
      const { value, vendor } = payload;
      state.hmo = "all";
      let filtered = state.collections.filter(
        ({ category }) => category !== "wls"
      );
      // Filter logic based on source
      if (value === "all" || value.length < 10) {
        state.vendor = {};
      } else if (value === "NoSource") {
        filtered = filtered.filter(({ source }) => !source?._id);
        state.vendor = "noSource";
      } else {
        filtered = filtered.filter(
          ({ source }) => source?._id === value.toString()
        );
        state.vendor = vendor;
      }
      arrangeDealsByDate(state, filtered);
    },
    SetFilterByCARD: (state, { payload }) => {
      state.vendor = {};
      let filtered = state.collections.filter(
        ({ category }) => category === "wls"
      );
      if (payload === "all" || payload.length > 10 || payload === "NoSource") {
        state.hmo = "all";
      } else {
        state.hmo = payload;
        filtered = filtered.filter(({ hmo = "" }) => hmo && hmo === payload);
      }

      arrangeDealsByDate(state, filtered);
    },

    SetFilterByPhysician: (state, { payload }) => {
      // Only update filter if it changed
      // if (payload !== state.filterByPhysician) {
      //   if (payload === "all") {
      //     state.filtered = state.collections;
      //   } else {
      //     state.filtered = state.collections.filter(
      //       ({ physicianId }) =>
      //         physicianId?._id?.toString() === payload.toString()
      //     );
      //   }
      //   state.filterByPhysician = payload;
      // }
    },
    SetFilterBySourceAndPhysician: (state, { payload }) => {
      const { source, physician } = payload;
      let filtered = state.collections;
      // Filter by physician if not 'all'
      if (physician !== "all") {
        if (physician === "NoPhysician") {
          state.physician = "No Physician";
          filtered = filtered.filter(({ physicianId }) => !physicianId?._id);
        } else {
          filtered = filtered.filter(
            ({ physicianId }) => physicianId?._id === physician
          );
          state.physician = state.physicians.find(
            ({ _id }) => _id === physician
          )?.fullName;
        }
      } else {
        state.physician = "All";
      }

      // Filter by source
      if (source === "NoSource") {
        const noSource = filtered.filter(({ source }) => !source);
        state.filteredPhysicians = getPhysicians(noSource);
        filtered = noSource;
        state.vendor = "noSource";
        state.source = "No Source";
      } else if (source !== "all") {
        const foundDeals = filtered.filter(
          ({ source: src }) => src?._id === source
        );
        //to get all physicians in collections because the filtered is already filtered by physician
        const dealsWithoutPhysicians = state.collections.filter(
          ({ source: src }) => src?._id === source
        );
        filtered = foundDeals;
        state.filteredPhysicians = getPhysicians(dealsWithoutPhysicians);

        //for displaying of header in filter
        state.vendor = source;
        const { displayname } = state.sources.find(({ _id }) => _id === source);
        state.source = displayname;
      } else {
        state.filteredPhysicians = state.physicians;
        state.vendor = {};
        state.source = "All";
      }
      arrangeDealsByDate(state, filtered);
    },
    SetFilterByOUTSOURCE: (state, { payload }) => {
      if (payload !== state.filterBySource)
        if (payload === "all") {
          state.filtered = state.collections;
          state.vendor = "";
        } else {
          state.filtered = state.collections.filter(
            ({ outsource }) => outsource?._id.toString() === payload.toString()
          );
          state.outsource = payload;
        }
      state.filterBySource = payload;
    },

    SetVOUCHERS: (state, { payload }) => {
      state.collections = payload;
      state.filtered = payload;
    },
    // SetCluster: (state, { payload }) => {
    //   state.cluster = payload;
    // },
    SetCluster: (state, { payload = [] }) => {
      const { cutoff = 0, _id = "" } = state.vendor || {};
      const isFilterBySource = state.filterBy === "source";
      if (_id || state.hmo !== "all") {
        const fakeDB = localStorage.getItem("cluster");
        let parseVoucher = fakeDB ? JSON.parse(fakeDB) : {};
        /* 
             {
             source:{
               123123123:[],
               2312312412:[],
             },
             hmo:{
              itc:[],
              clh:[], 
             }  
          
          } */
        const storage = parseVoucher[state.filterBy];
        const baseKey = isFilterBySource ? _id : state.hmo;

        if (storage?.[baseKey]?.length > 0) {
          state.cluster = storage[baseKey];
        } else {
          const now = new Date();
          const cutoffDate = new Date(
            now.getFullYear(),
            now.getMonth(),
            Number(cutoff) || 1
          );

          const filteredPayload = payload
            ?.filter((item) => {
              const itemDate = new Date(item.date); // assuming item.date is like "March 24, 2025"
              return itemDate <= cutoffDate;
            })
            .map((voucher) => ({ ...voucher, hasSelected: true }));

          state.cluster = filteredPayload;

          localStorage.setItem(
            "cluster",
            JSON.stringify({
              ...parseVoucher,
              [state.filterBy]: {
                ...parseVoucher[state.filterBy],
                [baseKey]: filteredPayload,
              },
            })
          );
        }
      }
    },

    CHECK_CUTOFF: (state, { payload }) => {
      const { cutoff, _id } = state.vendor;
      const now = new Date();
      const cutoffDate = new Date(
        now.getFullYear(),
        now.getMonth(),
        Number(cutoff) || 1
      );

      const _collections = state.collections.map((item) => {
        const { createdAt, source } = item;

        if (
          new Date(createdAt) <= cutoffDate &&
          source?._id.toString() === _id
        ) {
          return { ...item, hasSelected: true };
        } else {
          return item;
        }
      });

      const selectedDates = [
        ...new Set(
          _collections
            .filter(
              ({ hasSelected, source }) =>
                hasSelected === true &&
                source?._id?.toString() === state.vendor?._id?.toString()
            )
            .map(({ createdAt }) => dateFormat(createdAt))
        ),
      ];

      const result = selectedDates.map((date) => ({
        date,
        vendorId: state.vendor._id,
      }));
      state.collections = _collections;
      state.cluster = result;
      localStorage.setItem("cluster", JSON.stringify(result));
      localStorage.setItem("vouchers", JSON.stringify(_collections));
    },

    CHECK_BULK: (state, { payload }) => {
      const { deals, date } = payload;
      const parseVoucher = JSON.parse(localStorage.getItem("cluster" || "{}"));
      const cluster = [...state.cluster];
      const index = cluster.findIndex((item) => item.date === date);
      const foundCluster = cluster[index];
      const { hasSelected = false } = foundCluster || {};
      if (hasSelected) {
        cluster.splice(index, 1);
      } else {
        //remove existing cluster and insert new cluster
        if (index > -1) cluster.splice(index, 1);
        cluster.push({ date, deals, hasSelected: true });
      }

      state.cluster = cluster;
      const baseKey =
        state.filterBy === "source" ? state.vendor._id : state.hmo;

      localStorage.setItem(
        "cluster",
        JSON.stringify({
          ...parseVoucher,
          [state.filterBy]: {
            ...parseVoucher[state.filterBy],
            [baseKey]: cluster,
          },
        })
      );
    },

    CHECK_DEAL: (state, { payload }) => {
      if (!state.vendor?._id && state.hmo === "all")
        return "Kindly select a filter type (source,card) and corresponding client to proceed with SOA generation .";

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
        //if cluster is not exist
        _cluster.push({ date, deals: [deal], hasSelected: totalDeals === 1 });
      }
      state.cluster = _cluster;

      const parseVoucher = JSON.parse(localStorage.getItem("cluster" || "{}"));
      const baseKey =
        state.filterBy === "source" ? state.vendor._id : state.hmo;
      localStorage.setItem(
        "cluster",
        JSON.stringify({
          ...parseVoucher,
          [state.filterBy]: {
            ...parseVoucher[state.filterBy],
            [baseKey]: _cluster,
          },
        })
      );
    },

    SetSELECTED: (state, { payload }) => {
      state.selected = payload;
      state.showModal = true;
      state.willCreate = false;
    },
    SetREFINED: (state, { payload }) => {
      state.refined = payload;
    },
    SetPatient: (state, { payload }) => {
      state.patient = payload;
      const isSenior = getAge(payload.dob, true) > 59; // Use payload instead of customer
      state.privilege = payload.privilege || (isSenior ? 2 : 0);
    },
    SetMODAL: (state) => {
      state.showModal = !state.showModal;
    },
    SetToggleMODAL: (state, { payload }) => {
      state.showModal = !state.showModal;
      state.patient = payload;
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
    SetFILTERBY: (state, { payload }) => {
      state.filterBy = payload;
    },

    RESET: (state, { payload = {} }) => {
      state.isSuccess = false;
      state.message = "";
      // state.isLoading = false;
      state.formSubmitted = false;
      if (payload?.resetCollections) state.collections = [];
    },
    ResetDATE: (state) => {
      state.month = today.getMonth() + 1;
      state.year = today.getFullYear();
    },
    SetPrinting: (state, { payload }) => {
      const { status, selected } = payload;
      state.onPrint = status;
      state.selected = { ...selected };
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
        const { payload, success } = action.payload;
        state.collections = state.refined = payload.map(({ cart, ...rest }) => {
          const _cart = cart.map(({ menuId, ...etc }) => {
            const packagesDisplay = Services.whereIn(menuId.packages)
              .map(({ abbreviation }) => abbreviation)
              .join(", ");
            return {
              ...etc,
              packagesDisplay,
              menuId,
            };
          });

          return {
            ...rest,
            cart: _cart, // ← remains as array of cart items
          };
        });
        let uniqueSource = [];
        if (payload.length > 0)
          uniqueSource = [
            ...new Map(
              payload.map(({ source }) => [
                source?._id || "NoSource",
                {
                  _id: source?._id || "NoSource",
                  displayname: source?.displayname || "No Source",
                  affiliated: source?.affiliated || [],
                  isMembership: source?.category === "mbs",
                },
              ])
            ).values(),
          ];
        state.sources = uniqueSource;
        const physicianWithAmount = getPhysicians(payload);
        state.physicians = physicianWithAmount;
        state.filteredPhysicians = physicianWithAmount;
        arrangeDealsByDate(state, payload);
        state.isSuccess = success;
        state.isLoading = false;
      })
      .addCase(BROWSE.rejected, (state, action) => {
        const { error } = action;
        state.message = error.message;
        state.isLoading = false;
      })

      .addCase(VOUCHERS.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.message = "";
      })
      .addCase(VOUCHERS.fulfilled, (state, action) => {
        const { payload, success } = action.payload;
        state.collections = state.filtered = payload;
        let uniqueSource = [];
        if (payload.length > 0)
          uniqueSource = [
            ...new Map(
              payload.map(({ source }) => [
                source?._id || "NoSource",
                {
                  _id: source?._id || "NoSource",
                  displayname: source?.displayname || "No Source",
                },
              ])
            ).values(),
          ];
        state.sources = uniqueSource;
        state.totalPages =
          Math.ceil((payload?.length || 0) / state.maxPage) || 1;
        state.activePage = Math.min(state.activePage, state.totalPages);
        state.isSuccess = success;
        state.isLoading = false;
      })
      .addCase(VOUCHERS.rejected, (state, action) => {
        const { error } = action;
        state.message = error.message;
        state.isLoading = false;
      })
      .addCase(HUNDREDDATA.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.message = "";
      })
      .addCase(HUNDREDDATA.fulfilled, (state, action) => {
        const { data, success } = action.payload;
        state.collections = data;
        state.isSuccess = success;
        state.isLoading = false;
      })
      .addCase(HUNDREDDATA.rejected, (state, action) => {
        const { error } = action;
        state.message = error.message;
        state.isLoading = false;
      })
      .addCase(OUTSOURCES.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.message = "";
      })
      .addCase(OUTSOURCES.fulfilled, (state, action) => {
        const { payload, success } = action.payload;
        state.collections = state.filtered = payload;
        state.totalPages =
          Math.ceil((payload?.length || 0) / state.maxPage) || 1;
        state.activePage = Math.min(state.activePage, state.totalPages);
        state.isSuccess = success;
        state.isLoading = false;
      })
      .addCase(OUTSOURCES.rejected, (state, action) => {
        const { error } = action;
        state.message = error.message;
        state.isLoading = false;
      })
      .addCase(INSOURCES.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.message = "";
      })
      .addCase(INSOURCES.fulfilled, (state, action) => {
        const { payload, success } = action.payload;
        state.collections = state.filtered = payload;
        console.log("payload", payload);

        state.totalPages =
          Math.ceil((payload?.length || 0) / state.maxPage) || 1;
        state.activePage = Math.min(state.activePage, state.totalPages);
        state.isSuccess = success;
        state.isLoading = false;
      })
      .addCase(INSOURCES.rejected, (state, action) => {
        const { error } = action;
        state.message = error.message;
        state.isLoading = false;
      })
      .addCase(CASHIER.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.message = "";
      })
      .addCase(CASHIER.fulfilled, (state, action) => {
        const { payload } = action.payload;
        state.collections = state.filtered = payload;
        state.totalPages = payload.length;
        state.isLoading = false;
      })
      .addCase(CASHIER.rejected, (state, action) => {
        const { error } = action;
        state.message = error.message;
        state.isLoading = false;
      })
      .addCase(UPDATE100DATA.pending, (state) => {
        state.formSubmitted = true;
        state.isSuccess = false;
        state.message = "";
      })
      .addCase(UPDATE100DATA.fulfilled, (state, action) => {
        const { success, data } = action.payload;

        state.collections = data;

        state.message = success;
        state.isSuccess = true;
        state.formSubmitted = false;
      })
      .addCase(UPDATE100DATA.rejected, (state, action) => {
        const { error } = action;
        state.message = error.message;
        state.formSubmitted = false;
      })
      .addCase(MANAGERUPDATE.pending, (state) => {
        state.formSubmitted = true;
        state.isSuccess = false;
        state.message = "";
      })
      .addCase(MANAGERUPDATE.fulfilled, (state, action) => {
        const { success, payload } = action.payload,
          { _id, deletedAt, amount, discount, authorizedBy } = payload;

        const updateCollections = (collections) => {
          const index = collections.findIndex((c) => c._id === _id);
          collections[index] = {
            ...collections[index],
            amount,
            discount, // Ensure discount is also updated
            deletedAt, // Keep track of deletion status
            authorizedBy, // Keep track of deletion status
          };
        };
        updateCollections(state.collections);
        updateCollections(state.filtered);
        updateCollections(state.refined);
        state.message = success;
        state.isSuccess = true;
        state.formSubmitted = false;
      })
      .addCase(MANAGERUPDATE.rejected, (state, action) => {
        const { error } = action;
        state.message = error.message;
        state.formSubmitted = false;
      })
      .addCase(REVERT_SALE.pending, (state) => {
        state.formSubmitted = true;
        state.isSuccess = false;
        state.message = "";
      })
      .addCase(REVERT_SALE.fulfilled, (state, action) => {
        const { payload, success } = action.payload;
        const index = state.collections.findIndex(({ _id }) => _id === payload);
        const { deletedAt, remarks, ...rest } = { ...state.collections[index] };
        state.collections[index] = rest;
        state.formSubmitted = false;
        state.message = success;
        state.isSuccess = true;
      })
      .addCase(REVERT_SALE.rejected, (state, action) => {
        const { error } = action;
        state.message = error.message;
        state.formSubmitted = false;
        state.isSuccess = false;
      })

      .addCase(TRACKER.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.message = "";
      })
      .addCase(TRACKER.fulfilled, (state, action) => {
        const { payload } = action.payload;
        state.collections = payload;
        state.isLoading = false;
      })
      .addCase(TRACKER.rejected, (state, action) => {
        const { error } = action;
        state.message = error.message;
        state.isLoading = false;
      })

      .addCase(CENSUS.pending, (state) => {
        state.census = {
          // this is used for ledger
          daily: {},
          grossSales: 0,
          menus: {},
          services: {},
          expenses: 0,
          patients: 0,
          isEmpty: true,
        };
        state.censusLoading = true;
        state.isSuccess = false;
        state.message = "";
      })

      .addCase(CENSUS.fulfilled, (state, action) => {
        const { sales = [], ...rest } = action.payload.census;

        const daily = sales?.reduce((daily, { createdAt, amount, ...rest }) => {
          const day = new Date(createdAt).toDateString(),
            obj = daily[day] || (daily[day] = { sales: [], total: 0 });

          obj.sales.push({ createdAt, amount, ...rest });
          obj.total += amount;
          return daily;
        }, {});

        state.census = { ...rest, daily };
        state.censusLoading = false;
      })
      .addCase(CENSUS.rejected, (state, action) => {
        const { error } = action;
        state.message = error.message;
        state.censusLoading = false;
      })
      .addCase(YEARLY.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.message = "";
      })
      .addCase(YEARLY.fulfilled, (state, action) => {
        const { payload } = action.payload;
        state.collections = payload;
        state.isLoading = false;
      })
      .addCase(YEARLY.rejected, (state, action) => {
        const { error } = action;
        state.message = error.message;
        state.isLoading = false;
      })
      .addCase(SAVE.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.message = "";
      })
      .addCase(SAVE.fulfilled, (state, action) => {
        const { success, payload } = action.payload;
        state.message = success;
        state.transaction = payload;
        state.isSuccess = true;
        state.isLoading = false;
      })
      .addCase(SAVE.rejected, (state, action) => {
        const { error } = action;
        state.message = error.message;
        state.isLoading = false;
      })

      .addCase(GENERATE_SOA.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.message = "";
      })
      .addCase(GENERATE_SOA.fulfilled, (state, action) => {
        const { success, payload } = action.payload;
        state.collections = state.collections.filter(
          ({ _id }) => !payload.includes(_id)
        );
        state.message = success;
        state.transaction = payload;
        state.isSuccess = true;
        state.isLoading = false;
      })
      .addCase(GENERATE_SOA.rejected, (state, action) => {
        const { error } = action;
        state.message = error.message;
        state.isLoading = false;
      })

      .addCase(PROCESS_ONBOARDING.pending, (state) => {
        state.formSubmitted = true;
        state.isSuccess = false;
        state.message = "";
      })
      .addCase(PROCESS_ONBOARDING.fulfilled, (state, action) => {
        const { success, payload } = action.payload;

        const updateCollections = (collections) => {
          const index = collections.findIndex(({ _id }) => _id === payload);
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

      .addCase(DENY_ONBOARDING.pending, (state) => {
        state.formSubmitted = true;
        state.isSuccess = false;
        state.message = "";
      })
      .addCase(DENY_ONBOARDING.fulfilled, (state, action) => {
        const { success, payload } = action.payload;

        const updateCollections = (collections) => {
          const index = collections.findIndex(({ _id }) => _id === payload);
          collections.splice(index, 1);
        };

        updateCollections(state.collections);
        updateCollections(state.filtered);
        state.message = success;
        state.isSuccess = true;
        state.formSubmitted = false;
      })
      .addCase(DENY_ONBOARDING.rejected, (state, action) => {
        const { error } = action;
        state.message = error.message;
        state.formSubmitted = false;
      })

      .addCase(UPDATE_INFO.pending, (state) => {
        state.formSubmitted = true;
        state.isSuccess = false;
        state.message = "";
      })
      .addCase(UPDATE_INFO.fulfilled, (state, action) => {
        const { success, payload } = action.payload;
        const updateCollections = (collections) => {
          const index = collections.findIndex(({ _id }) => _id === payload._id);
          collections[index] = {
            ...state.collections[index],
            ...payload,
          };
        };

        updateCollections(state.collections);
        updateCollections(state.filtered);
        updateCollections(state.refined);

        state.message = success;
        state.isSuccess = true;
        state.formSubmitted = false;
      })
      .addCase(UPDATE_INFO.rejected, (state, action) => {
        const { error } = action;
        state.message = error.message;
        state.formSubmitted = false;
      })

      .addCase(LABRESULT.pending, (state) => {
        // state.isLoading = true;
        state.isSuccess = false;
        state.message = "";
        state.showModal = false;
      })
      .addCase(LABRESULT.fulfilled, (state, action) => {
        const { success, payload } = action.payload;
        console.log("payload", payload);

        state.message = success;
        state.showModal = false;
        if (Array.isArray(state.collections) && state.collections.length > 0) {
          const identifier = ["Miscellaneous", "Xray"].includes(payload?.form)
            ? "dealId"
            : "_id";

          const targetId = payload?.[identifier];

          if (!targetId) {
            console.warn(
              "Missing identifier value in payload:",
              identifier,
              payload
            );
            return;
          }

          const index = state.collections.findIndex(
            (item) => item && item._id === targetId
          );

          if (index !== -1 && state.collections[index]) {
            if (identifier === "dealId") {
              if (Array.isArray(state.collections[index].miscellaneous)) {
                state.collections[index].miscellaneous[payload?.miscIndex] =
                  payload;
              } else {
                console.warn("Missing miscellaneous array at index", index);
              }
            } else {
              const form = payload.form?.toLowerCase();
              state.collections[index][form] = payload;
            }
          } else {
            console.warn(
              "Item not found in collections for",
              identifier,
              targetId
            );
          }
        }

        state.isSuccess = true;
        state.isLoading = false;
        state.showModal = false;
      })
      .addCase(LABRESULT.rejected, (state, action) => {
        const { error } = action;
        state.message = error.message;
        state.isLoading = false;
      })

      .addCase(UPDATE.pending, (state) => {
        // state.isLoading = true; comment this to stop loading and refreshing UI
        state.isSuccess = false;
        state.formSubmitted = true;
        state.message = "";
      })
      .addCase(UPDATE.fulfilled, (state, action) => {
        const { success, payload } = action.payload;

        const index = state.collections.findIndex(
          (item) => item._id === payload._id
        );
        state.transaction = {
          ...payload,
          _id: state.transaction._id === payload._id ? "default" : payload._id,
        };

        const currentValue = { ...state.collections[index] };

        state.collections[index] = { ...currentValue, ...payload };
        state.message = success;
        state.isSuccess = true;
        state.formSubmitted = false;
        state.isLoading = false;
      })
      .addCase(UPDATE.rejected, (state, action) => {
        const { error } = action;
        state.formSubmitted = false;
        state.message = error.message;
        state.isLoading = false;
      });
  },
});

export const {
  SetTOTAL,
  SetToggleModal,
  SetFILTERBY,
  SetFILTERED,
  SetREFINED,
  SetSORTING,
  SetFilterByCASHIER,
  SetFilterBySOURCE,
  SetFilterByCARD,
  SetFilterByPhysician,
  SetFilterBySourceAndPhysician,
  SetFilterByOUTSOURCE,
  CHECK_CUTOFF,
  SetSELECTED,
  CHECK_BULK,
  CHECK_DEAL,
  SetVOUCHERS,
  SetREVERT,
  SetDISCOUNT,
  SetCluster,
  ISCHECKED,
  PICK_VOUCHER_DEAL,
  ToggleDiscountModal,
  SetMODAL,
  SetMaxPage,
  SetActivePAGE,
  ToggleRevertModal,
  SetPatient,
  SetMONTH,
  RESET,
  ResetDATE,
  SetPrinting,
} = reduxSlice.actions;

export default reduxSlice.reducer;
