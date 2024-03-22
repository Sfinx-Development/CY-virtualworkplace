import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { HealthCheck } from "../../types";
import {
  FetchCreateHealthCheck,
  FetchGetTeamHealthChecks,
} from "../api/healthcheck";

export interface HealthCheckState {
  healthchecks: HealthCheck[] | undefined;
  activeHealthCheck: HealthCheck | undefined;
  error: string | null;
}

export const initialState: HealthCheckState = {
  healthchecks: undefined,
  activeHealthCheck: undefined,
  error: null,
};

export const CreateHealthCheckAsync = createAsyncThunk<
  HealthCheck,
  HealthCheck,
  { rejectValue: string }
>("healthcheck/createhealthcheck", async (healthcheck, thunkAPI) => {
  try {
    const createdHealthCheck = await FetchCreateHealthCheck(healthcheck);
    if (createdHealthCheck) {
      return createdHealthCheck;
    } else {
      return thunkAPI.rejectWithValue(
        "Ett fel inträffade vid skapande av healthcheck."
      );
    }
  } catch (error) {
    return thunkAPI.rejectWithValue(
      "Ett fel inträffade vid skapande av healthcheck."
    );
  }
});

export const GetTeamHealthChecksAsync = createAsyncThunk<
  HealthCheck[],
  string,
  { rejectValue: string }
>("healthcheck/gethealthcheck", async (profileId, thunkAPI) => {
  try {
    const healthchecks = await FetchGetTeamHealthChecks(profileId);
    if (healthchecks) {
      return healthchecks;
    } else {
      return thunkAPI.rejectWithValue(
        "Ett fel inträffade vid hämtande av healthchecks."
      );
    }
  } catch (error) {
    return thunkAPI.rejectWithValue(
      "Ett fel inträffade vid hämtande av healthchecks."
    );
  }
});

const healthcheckSlice = createSlice({
  name: "healthcheck",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(CreateHealthCheckAsync.fulfilled, (state, action) => {
        if (action.payload) {
          state.healthchecks?.push(action.payload);
          state.error = null;
        }
      })
      .addCase(CreateHealthCheckAsync.rejected, (state) => {
        state.error = "Något gick fel.";
      })
      .addCase(GetTeamHealthChecksAsync.fulfilled, (state, action) => {
        if (action.payload) {
          console.log("HÄMTAT: ", action.payload);
          state.healthchecks = action.payload;
          state.error = null;
        }
      })
      .addCase(GetTeamHealthChecksAsync.rejected, (state) => {
        state.healthchecks = undefined;
        state.error = "Något gick fel.";
      });
  },
});

export const healthcheckReducer = healthcheckSlice.reducer;
