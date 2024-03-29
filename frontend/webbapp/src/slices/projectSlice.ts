import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Project } from "../../types";
import { FetchCreateProject, FetchGetTeamProjects } from "../api/project";
import { CreateHealthCheckAsync } from "./healthcheck";

export interface ProjectState {
  projects: Project[] | undefined;
  error: string | null;
}

export const initialState: ProjectState = {
  projects: undefined,
  error: null,
};

export const CreateProjectAsync = createAsyncThunk<
  Project,
  Project,
  { rejectValue: string }
>("project/createproject", async (project, thunkAPI) => {
  try {
    const createdProject = await FetchCreateProject(project);
    if (createdProject) {
      return createdProject;
    } else {
      return thunkAPI.rejectWithValue(
        "Ett fel inträffade vid skapande av project."
      );
    }
  } catch (error) {
    return thunkAPI.rejectWithValue(
      "Ett fel inträffade vid skapande av project."
    );
  }
});

export const GetTeamProjectsAsync = createAsyncThunk<
  Project[],
  string,
  { rejectValue: string }
>("project/getProjects", async (teamId, thunkAPI) => {
  try {
    const projects = await FetchGetTeamProjects(teamId);
    if (projects) {
      return projects;
    } else {
      return thunkAPI.rejectWithValue(
        "Ett fel inträffade vid hämtande av projects."
      );
    }
  } catch (error) {
    return thunkAPI.rejectWithValue(
      "Ett fel inträffade vid hämtande av projects."
    );
  }
});

// export const GetProfileHealthChecksAsync = createAsyncThunk<
//   ProfileHealthCheck[],
//   string,
//   { rejectValue: string }
// >("healthcheck/getprofilehealthchecks", async (healthcheckId, thunkAPI) => {
//   try {
//     const profileHealthChecks = await FetchGetProfileHealthChecks(
//       healthcheckId
//     );
//     if (profileHealthChecks) {
//       return profileHealthChecks;
//     } else {
//       return thunkAPI.rejectWithValue(
//         "Ett fel inträffade vid hämtande av profilehealthchecks."
//       );
//     }
//   } catch (error) {
//     return thunkAPI.rejectWithValue(
//       "Ett fel inträffade vid hämtande av profilehealthchecks."
//     );
//   }
// });

// export const GetProfileHealthChecksByProfileAsync = createAsyncThunk<
//   ProfileHealthCheck[],
//   string,
//   { rejectValue: string }
// >(
//   "healthcheck/getprofilehealthchecksbyprofile",
//   async (profileId, thunkAPI) => {
//     try {
//       const profileHealthChecks = await FetchGetProfileHealthChecksByProfile(
//         profileId
//       );
//       if (profileHealthChecks) {
//         return profileHealthChecks;
//       } else {
//         return thunkAPI.rejectWithValue(
//           "Ett fel inträffade vid hämtande av profilehealthchecks."
//         );
//       }
//     } catch (error) {
//       return thunkAPI.rejectWithValue(
//         "Ett fel inträffade vid hämtande av profilehealthchecks."
//       );
//     }
//   }
// );

// export const CreateProfileHealthCheckAsync = createAsyncThunk<
//   ProfileHealthCheck,
//   ProfileHealthCheck,
//   { rejectValue: string }
// >(
//   "healthcheck/createprofilehealthcheck",
//   async (profileHealthCheck, thunkAPI) => {
//     try {
//       const createdProfileHealthCheck = await FetchCreateProfileHealthCheck(
//         profileHealthCheck
//       );
//       if (createdProfileHealthCheck) {
//         return createdProfileHealthCheck;
//       } else {
//         return thunkAPI.rejectWithValue(
//           "Ett fel inträffade vid skapande av profile healthcheck."
//         );
//       }
//     } catch (error) {
//       return thunkAPI.rejectWithValue(
//         "Ett fel inträffade vid skapande av profile healthcheck."
//       );
//     }
//   }
// );

const projectSlice = createSlice({
  name: "project",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(CreateProjectAsync.fulfilled, (state, action) => {
        if (action.payload) {
          if (state.projects) {
            state.projects.push(action.payload);
          } else {
            state.projects = [];
            state.projects.push(action.payload);
          }
          state.error = null;
        }
      })
      .addCase(CreateHealthCheckAsync.rejected, (state) => {
        state.error = "Något gick fel.";
      })
      .addCase(GetTeamProjectsAsync.fulfilled, (state, action) => {
        if (action.payload) {
          state.projects = action.payload;
          state.error = null;
        }
      })
      .addCase(GetTeamProjectsAsync.rejected, (state) => {
        state.error = "Något gick fel.";
      });
    //   .addCase(GetTeamHealthChecksAsync.fulfilled, (state, action) => {
    //     if (action.payload) {
    //       console.log("HÄMTAT: ", action.payload);
    //       state.healthchecks = action.payload;
    //       state.error = null;
    //     }
    //   })
    //   .addCase(GetTeamHealthChecksAsync.rejected, (state) => {
    //     state.healthchecks = undefined;
    //     state.error = "Något gick fel.";
    //   })
    //   .addCase(GetProfileHealthChecksAsync.fulfilled, (state, action) => {
    //     if (action.payload) {
    //       state.profileHealthChecks = action.payload;
    //       state.error = null;
    //     }
    //   })
    //   .addCase(GetProfileHealthChecksAsync.rejected, (state) => {
    //     state.profileHealthChecks = undefined;
    //     state.error = "Något gick fel.";
    //   })
    //   .addCase(
    //     GetProfileHealthChecksByProfileAsync.fulfilled,
    //     (state, action) => {
    //       if (action.payload) {
    //         state.profileHealthChecks = action.payload;
    //         state.error = null;
    //       }
    //     }
    //   )
    //   .addCase(GetProfileHealthChecksByProfileAsync.rejected, (state) => {
    //     state.profileHealthChecks = undefined;
    //     state.error = "Något gick fel.";
    //   })
    //   .addCase(CreateProfileHealthCheckAsync.fulfilled, (state, action) => {
    //     if (action.payload) {
    //       state.profileHealthChecks?.push(action.payload);
    //       state.error = null;
    //     }
    //   })
    //   .addCase(CreateProfileHealthCheckAsync.rejected, (state) => {
    //     state.error = "Något gick fel.";
    //   });
  },
});

export const projectReducer = projectSlice.reducer;
