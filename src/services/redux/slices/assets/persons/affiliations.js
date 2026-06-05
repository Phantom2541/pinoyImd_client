import { createAsyncThunk } from "@reduxjs/toolkit";
import { axioKit } from "../../../../utilities";

export const SETAFFILIATIONPLATFORM = createAsyncThunk(
  "affiliations/setActivePlatform",
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
  },
);
