import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Project, ProjectUpdate, UpdateComment } from "../../types";
import {
  FetchCreateProject,
  FetchCreateProjectuPDATE,
  FetchCreateUpdateComment,
  FetchGetCommentsByUpdate,
  FetchGetProjectUpdates,
  FetchGetTeamProjects,
} from "../api/project";
import { CreateHealthCheckAsync } from "./healthcheck";

export interface ProjectState {
  projects: Project[] | undefined;
  activeProject: Project | undefined;
  activeProjectUpdates: ProjectUpdate[] | undefined;
  activeUpdate: ProjectUpdate | undefined;
  error: string | null;
}

export const initialState: ProjectState = {
  projects: undefined,
  activeProject: undefined,
  activeProjectUpdates: undefined,
  activeUpdate: undefined,
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

// export const CreateProjectUpdateAsync = createAsyncThunk<
//   ProjectUpdate,
//   ProjectUpdate,
//   { rejectValue: string }
// >("project/createprojectupdate", async (projectUpdate, thunkAPI) => {
//   try {
//     const createdProjectUpdate = await FetchCreateProjectuPDATE(projectUpdate);
//     if (createdProjectUpdate) {
//       return createdProjectUpdate;
//     } else {
//       return thunkAPI.rejectWithValue(
//         "Ett fel inträffade vid skapande av projekt uppdatering."
//       );
//     }
//   } catch (error) {
//     return thunkAPI.rejectWithValue(
//       "Ett fel inträffade vid skapande av projekt uppdatering."
//     );
//   }
// });

export const CreateProjectUpdateAsync = createAsyncThunk<
  { projectUpdate: ProjectUpdate; updateComment: UpdateComment }, // Typen av returvärdet
  { projectUpdate: ProjectUpdate; updateComment: UpdateComment }, // Typen av argumentet
  { rejectValue: string }
>(
  "project/createprojectupdate",
  async ({ projectUpdate, updateComment }, thunkAPI) => {
    try {
      const createdProjectUpdate = await FetchCreateProjectuPDATE(
        projectUpdate
      );
      updateComment.projectUpdateId = createdProjectUpdate.id;
      const createdUpdateComment = await FetchCreateUpdateComment(
        updateComment
      );

      if (createdProjectUpdate && createdUpdateComment) {
        return {
          projectUpdate: createdProjectUpdate,
          updateComment: createdUpdateComment,
        };
      } else {
        return thunkAPI.rejectWithValue(
          "Ett fel inträffade vid skapande av projektuppdatering eller kommentar."
        );
      }
    } catch (error) {
      return thunkAPI.rejectWithValue(
        "Ett fel inträffade vid skapande av projektuppdatering eller kommentar."
      );
    }
  }
);

export const GetProjectUpdatesAsync = createAsyncThunk<
  ProjectUpdate[],
  string,
  { rejectValue: string }
>("project/getUpdates", async (projectId, thunkAPI) => {
  try {
    const updates = await FetchGetProjectUpdates(projectId);
    if (updates) {
      return updates;
    } else {
      return thunkAPI.rejectWithValue(
        "Ett fel inträffade vid hämtande av projektuppdateringar."
      );
    }
  } catch (error) {
    return thunkAPI.rejectWithValue(
      "Ett fel inträffade vid hämtande av projektuppdateringar."
    );
  }
});

export const CreateCommentAsync = createAsyncThunk<
  UpdateComment,
  UpdateComment,
  { rejectValue: string }
>("project/createupdatecomment", async (updateComment, thunkAPI) => {
  try {
    const createdComment = await FetchCreateUpdateComment(updateComment);
    if (createdComment) {
      return createdComment;
    } else {
      return thunkAPI.rejectWithValue(
        "Ett fel inträffade vid skapande av uppdaterings kommentar."
      );
    }
  } catch (error) {
    return thunkAPI.rejectWithValue(
      "Ett fel inträffade vid skapande av projekt uppdatering."
    );
  }
});

export const GetUpdatesByProjectAsync = async (projectId: string) => {
  try {
    const updates = await FetchGetProjectUpdates(projectId);
    return updates;
  } catch (error) {
    console.log("no updates");
  }
};

export const GetCommentsByProjectAsync = async (projectUpdateId: string) => {
  try {
    const comments = await FetchGetCommentsByUpdate(projectUpdateId);
    return comments;
  } catch (error) {
    console.log("no comments");
  }
};

const saveActiveProjectToLocalStorage = (project: Project) => {
  localStorage.setItem("activeProject", JSON.stringify(project));
};
const loadActiveProjectFromLocalStorage = (): Project | undefined => {
  const storedActiveProject = localStorage.getItem("activeProject");
  return storedActiveProject ? JSON.parse(storedActiveProject) : undefined;
};

const projectSlice = createSlice({
  name: "project",
  initialState,
  reducers: {
    setActiveProject: (state, action) => {
      const projectId = action.payload;
      const activeProject = state.projects?.find(
        (project: Project) => project.id === projectId
      );
      if (activeProject) {
        state.activeProject = activeProject;
        saveActiveProjectToLocalStorage(activeProject);
      }
    },
    getActiveProject: (state) => {
      const activeProject = loadActiveProjectFromLocalStorage();
      if (activeProject) {
        state.activeProject = activeProject;
      }
    },
  },
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
      })
      .addCase(CreateProjectUpdateAsync.fulfilled, (state, action) => {
        if (action.payload) {
          if (state.activeProjectUpdates) {
            state.activeProjectUpdates.push(action.payload.projectUpdate);
            state.activeUpdate = action.payload.projectUpdate;
          } else {
            state.activeProjectUpdates = [];
            state.activeProjectUpdates.push(action.payload.projectUpdate);
          }
          state.error = null;
        }
      })
      .addCase(CreateProjectUpdateAsync.rejected, (state) => {
        state.activeUpdate = undefined;
        state.error = "Något gick fel.";
      })
      .addCase(GetProjectUpdatesAsync.fulfilled, (state, action) => {
        if (action.payload) {
          state.activeProjectUpdates = action.payload;
          state.error = null;
        }
      })
      .addCase(GetProjectUpdatesAsync.rejected, (state) => {
        state.error = "Något gick fel.";
      });
  },
});

export const { getActiveProject, setActiveProject } = projectSlice.actions;
export const projectReducer = projectSlice.reducer;
