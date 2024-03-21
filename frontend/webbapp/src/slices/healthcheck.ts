import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { HealthCheck } from "../../types";
import { FetchCreateHealthCheck } from "../api/healthcheck";

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
      });
  },
});

export const healthcheckReducer = healthcheckSlice.reducer;
