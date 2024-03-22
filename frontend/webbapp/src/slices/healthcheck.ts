import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { HealthCheck, ProfileHealthCheck } from "../../types";
import {
  FetchCreateHealthCheck,
  FetchCreateProfileHealthCheck,
  FetchGetProfileHealthChecks,
  FetchGetProfileHealthChecksByProfile,
  FetchGetTeamHealthChecks,
} from "../api/healthcheck";

export interface HealthCheckState {
  healthchecks: HealthCheck[] | undefined;
  activeHealthCheck: HealthCheck | undefined;
  profileHealthChecks: ProfileHealthCheck[] | undefined;
  activeProfileHealthCheck: ProfileHealthCheck | undefined;
  error: string | null;
}

export const initialState: HealthCheckState = {
  healthchecks: undefined,
  activeHealthCheck: undefined,
  profileHealthChecks: undefined,
  activeProfileHealthCheck: undefined,
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

export const GetProfileHealthChecksAsync = createAsyncThunk<
  ProfileHealthCheck[],
  string,
  { rejectValue: string }
>("healthcheck/getprofilehealthchecks", async (healthcheckId, thunkAPI) => {
  try {
    const profileHealthChecks = await FetchGetProfileHealthChecks(
      healthcheckId
    );
    if (profileHealthChecks) {
      return profileHealthChecks;
    } else {
      return thunkAPI.rejectWithValue(
        "Ett fel inträffade vid hämtande av profilehealthchecks."
      );
    }
  } catch (error) {
    return thunkAPI.rejectWithValue(
      "Ett fel inträffade vid hämtande av profilehealthchecks."
    );
  }
});

export const GetProfileHealthChecksByProfileAsync = createAsyncThunk<
  ProfileHealthCheck[],
  string,
  { rejectValue: string }
>(
  "healthcheck/getprofilehealthchecksbyprofile",
  async (profileId, thunkAPI) => {
    try {
      const profileHealthChecks = await FetchGetProfileHealthChecksByProfile(
        profileId
      );
      if (profileHealthChecks) {
        return profileHealthChecks;
      } else {
        return thunkAPI.rejectWithValue(
          "Ett fel inträffade vid hämtande av profilehealthchecks."
        );
      }
    } catch (error) {
      return thunkAPI.rejectWithValue(
        "Ett fel inträffade vid hämtande av profilehealthchecks."
      );
    }
  }
);

export const CreateProfileHealthCheckAsync = createAsyncThunk<
  ProfileHealthCheck,
  ProfileHealthCheck,
  { rejectValue: string }
>(
  "healthcheck/createprofilehealthcheck",
  async (profileHealthCheck, thunkAPI) => {
    try {
      const createdProfileHealthCheck = await FetchCreateProfileHealthCheck(
        profileHealthCheck
      );
      if (createdProfileHealthCheck) {
        return createdProfileHealthCheck;
      } else {
        return thunkAPI.rejectWithValue(
          "Ett fel inträffade vid skapande av profile healthcheck."
        );
      }
    } catch (error) {
      return thunkAPI.rejectWithValue(
        "Ett fel inträffade vid skapande av profile healthcheck."
      );
    }
  }
);

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
      })
      .addCase(GetProfileHealthChecksAsync.fulfilled, (state, action) => {
        if (action.payload) {
          state.profileHealthChecks = action.payload;
          state.error = null;
        }
      })
      .addCase(GetProfileHealthChecksAsync.rejected, (state) => {
        state.profileHealthChecks = undefined;
        state.error = "Något gick fel.";
      })
      .addCase(
        GetProfileHealthChecksByProfileAsync.fulfilled,
        (state, action) => {
          if (action.payload) {
            state.profileHealthChecks = action.payload;
            state.error = null;
          }
        }
      )
      .addCase(GetProfileHealthChecksByProfileAsync.rejected, (state) => {
        state.profileHealthChecks = undefined;
        state.error = "Något gick fel.";
      })
      .addCase(CreateProfileHealthCheckAsync.fulfilled, (state, action) => {
        if (action.payload) {
          state.profileHealthChecks?.push(action.payload);
          state.error = null;
        }
      })
      .addCase(CreateProfileHealthCheckAsync.rejected, (state) => {
        state.error = "Något gick fel.";
      });
  },
});

export const healthcheckReducer = healthcheckSlice.reducer;
