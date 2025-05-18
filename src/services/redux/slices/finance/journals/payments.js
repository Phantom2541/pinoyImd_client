import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axioKit, dateFormat } from "../../../../utilities";
import { Statements } from "../../../../fakeDb";
import moment from "moment";
const url = "finance/journals/payments";

const initialState = {
  collections: [],
  filtered: ["loading"],
  isSuccess: false,
  isLoading: false,
  paginated: [], // paginated the filtered
  selected: {},
  month: new Date().getMonth() + 1, // 0-based index (Jan = 0)
  formSubmitted: false,
  year: new Date().getFullYear(),
  totalPages: 0,
  page: 0,
  showModal: false,
  willCreate: false,
  maxPage: 5,
};

export const BROWSE = createAsyncThunk(
  `${url}/browse`,
  async ({ token, key }, thunkAPI) => {
    try {
      return await axioKit.universal(`${url}/browse`, token, key);
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

export const Daily = createAsyncThunk(
  `${url}/daily`,
  async ({ token, key }, thunkAPI) => {
    try {
      return await axioKit.universal(`${url}/daily`, token, key);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message || error.toString()
      );
    }
  }
);
export const Monthly = createAsyncThunk(
  `${url}/monthly`,
  async ({ token, key }, thunkAPI) => {
    try {
      return await axioKit.universal(`${url}/monthly`, token, key);
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
    SetFILTERByCategories: (state, { payload }) => {
      const categoryId = Statements.getAllIdByCategory(payload);
      // console.log("categoryId:", categoryId);

      const collections = JSON.stringify(state.collections, null, 2);
      const filtered = JSON.parse(collections).filter(({ fsId }) =>
        categoryId.includes(fsId)
      );
      // console.log("filtered:", filtered);
      state.filtered = filtered;
    },
    SetEDIT: (state, { payload }) => {
      state.selected = payload;
      state.willCreate = false;
      state.showModal = true;
    },
    SetCREATE: (state, { payload }) => {
      state.selected = payload;
      state.willCreate = true;
      state.showModal = true;
    },
    SetFILTER: (state, { payload }) => {
      const { page, maxPage } = payload;
      if (page.length > 0) {
        state.totalPages = Math.ceil(payload.length / maxPage);
        if (state.page > state.totalPages) {
          state.page = state.totalPages;
        }
      }
      // state.filtered = page;
    },
    SetMONTH: (state, { payload }) => {
      let { month } = state;
      if (payload === "prev") {
        state.month = month === 0 ? 11 : month - 1;
        if (month === 11) state.year -= 1;
      } else if (payload === "next") {
        state.month = month === 11 ? 0 : month + 1;
        if (month === 0) state.year += 1;
      }
    },
    SetPAGE: (state, { payload }) => {
      state.page = payload;
    },
    SETSOURCES: (state, { payload }) => {
      state.collections = payload;
    },
    RESET: (state) => {
      state.month = moment().month() + 1;
      state.year = moment().year();
      state.isSuccess = false;
      state.formSubmitted = false;
      state.message = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(BROWSE.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(BROWSE.fulfilled, (state, action) => {
        const { payload } = action;
        state.collections = payload;
        let uniqueSource = [];
        if (payload?.length > 0)
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

        const groupByDate = payload.reduce((groups, item) => {
          const date = dateFormat(item.createdAt);
          const index = groups.findIndex((group) => group.date === date);

          if (index > -1) {
            groups[index].deals.push({ ...item, isSelected: false });
            groups[index].sum += item.amount;
          } else {
            groups.push({
              date,
              sum: item.amount,
              deals: [{ ...item, isSelected: false }],
              isSelected: false,
            });
          }
          return groups;
        }, []);

        state.totalPages =
          Math.ceil((groupByDate?.length || 0) / state.maxPage) || 1;
        state.activePage = Math.min(state.activePage, state.totalPages);
        state.filtered = groupByDate;
        state.isLoading = false;
      })
      .addCase(BROWSE.rejected, (state, { payload }) => {
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

      .addCase(UPDATE.pending, (state) => {
        state.formSubmitted = true;
      })
      .addCase(UPDATE.fulfilled, (state, { payload }) => {
        const index = state.collections.findIndex(
          (item) => item._id === payload._id
        );
        if (index !== -1) {
          state.collections[index] = payload;
        }
        state.isSuccess = true;
        state.formSubmitted = false;
      })
      .addCase(UPDATE.rejected, (state, { payload }) => {
        state.message = payload;
        state.formSubmitted = false;
      })
      .addCase(Daily.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(Daily.fulfilled, (state, { payload }) => {
        state.filtered = payload;
        state.isLoading = false;
      })
      .addCase(Daily.rejected, (state, { payload }) => {
        state.message = payload;
        state.isLoading = false;
      })
      .addCase(Monthly.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(Monthly.fulfilled, (state, { payload }) => {
        state.collections = payload;
        state.filtered = payload;
        state.isLoading = false;
      })
      .addCase(Monthly.rejected, (state, { payload }) => {
        state.message = payload;
        state.isLoading = false;
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
  SetFILTERByCategories,
  SetPAGE,
  SETSOURCES,
  SetMONTH,
  RESET,
} = reduxSlice.actions;
export default reduxSlice.reducer;
