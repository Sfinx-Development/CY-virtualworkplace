import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  FileDTO,
  Project,
  ProjectNoDate,
  ProjectUpdate,
  ProjectUpdateNoDate,
  UpdateComment,
  UpdateCommentNoDate,
} from "../../types";
import {
  FetchCreateFile,
  FetchCreateProject,
  FetchCreateProjectuPDATE,
  FetchCreateUpdateComment,
  FetchDeleteFile,
  FetchDeleteProject,
  FetchDeleteUpdateComment,
  FetchEditProject,
  FetchEditUpdateComment,
  FetchGetCommentsByUpdate,
  FetchGetFilesByUpdateComment,
  FetchGetProjectUpdates,
  FetchGetTeamProjects,
} from "../api/project";
import { CreateHealthCheckAsync } from "./healthcheck";

export interface ProjectState {
  projects: ProjectNoDate[] | undefined;
  activeProject: ProjectNoDate | undefined;
  activeProjectUpdates: ProjectUpdateNoDate[] | undefined;
  activeUpdate: ProjectUpdateNoDate | undefined;
  activeComments: UpdateCommentNoDate[] | undefined;
  error: string | null;
}

export const initialState: ProjectState = {
  projects: undefined,
  activeProject: undefined,
  activeProjectUpdates: undefined,
  activeUpdate: undefined,
  activeComments: undefined,
  error: null,
};

export const CreateProjectAsync = createAsyncThunk<
  ProjectNoDate,
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
  ProjectNoDate[],
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
  {
    projectUpdate: ProjectUpdateNoDate;
    updateComment: UpdateCommentNoDate;
    files?: FileList;
  },
  {
    projectUpdate: ProjectUpdate;
    updateComment: UpdateComment;
    files?: FileList;
  },
  { rejectValue: string }
>(
  "project/createprojectupdate",
  async ({ projectUpdate, updateComment, files }, thunkAPI) => {
    try {
      const createdProjectUpdate = await FetchCreateProjectuPDATE(
        projectUpdate
      );
      updateComment.projectUpdateId = createdProjectUpdate.id;
      const createdUpdateComment = await FetchCreateUpdateComment(
        updateComment
      );

      if (files) {
        Array.from(files).forEach(async (f) => {
          const formData = new FormData();
          formData.append("file", f);
          formData.append("fileName", f.name);
          formData.append("updateCommentId", createdUpdateComment.id);
          await FetchCreateFile(formData);
        });
      }

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
  ProjectUpdateNoDate[],
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

export const GetFilesByUpdateCommentAsync = createAsyncThunk<
  FileDTO[],
  string,
  { rejectValue: string }
>("project/getfiles", async (updateCommentId, thunkAPI) => {
  try {
    const files = await FetchGetFilesByUpdateComment(updateCommentId);
    if (files) {
      return files;
    } else {
      return thunkAPI.rejectWithValue(
        "Ett fel inträffade vid hämtande av filer."
      );
    }
  } catch (error) {
    return thunkAPI.rejectWithValue(
      "Ett fel inträffade vid hämtande av filer."
    );
  }
});

export const GetUpdateCommentsAsync = createAsyncThunk<
  UpdateCommentNoDate[],
  string,
  { rejectValue: string }
>("project/getcomments", async (projectUpdateId, thunkAPI) => {
  try {
    const updates = await FetchGetCommentsByUpdate(projectUpdateId);
    if (updates) {
      return updates;
    } else {
      return thunkAPI.rejectWithValue(
        "Ett fel inträffade vid hämtande av kommentarer."
      );
    }
  } catch (error) {
    return thunkAPI.rejectWithValue(
      "Ett fel inträffade vid hämtande av projektuppdateringar."
    );
  }
});

export const CreateCommentAsync = createAsyncThunk<
  UpdateCommentNoDate,
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

export const EditCommentAsync = createAsyncThunk<
  UpdateCommentNoDate,
  UpdateComment,
  { rejectValue: string }
>("project/editupdatecomment", async (updateComment, thunkAPI) => {
  try {
    const updatedComment = await FetchEditUpdateComment(updateComment);
    if (updatedComment) {
      return updatedComment;
    } else {
      return thunkAPI.rejectWithValue(
        "Ett fel inträffade vid redigering av uppdaterings kommentar."
      );
    }
  } catch (error) {
    return thunkAPI.rejectWithValue(
      "Ett fel inträffade vid redigering av projekt kommentar."
    );
  }
});

export const DeleteCommentAsync = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>("project/deleteupdatecomment", async (updateCommentId, thunkAPI) => {
  try {
    const isDeleted = await FetchDeleteUpdateComment(updateCommentId);
    if (isDeleted) {
      return updateCommentId;
    } else {
      return thunkAPI.rejectWithValue(
        "Ett fel inträffade vid borttagning av uppdaterings kommentar."
      );
    }
  } catch (error) {
    return thunkAPI.rejectWithValue(
      "Ett fel inträffade vid borttagning av projekt kommentar."
    );
  }
});

export const EditProjectAsync = createAsyncThunk<
  ProjectNoDate,
  Project,
  { rejectValue: string }
>("project/editproject", async (project, thunkAPI) => {
  try {
    const updatedProject = await FetchEditProject(project);
    if (updatedProject) {
      return updatedProject;
    } else {
      return thunkAPI.rejectWithValue(
        "Ett fel inträffade vid redigering av projekt."
      );
    }
  } catch (error) {
    return thunkAPI.rejectWithValue(
      "Ett fel inträffade vid redigering av projekt."
    );
  }
});

export const DeleteProjectAsync = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>("project/deleteproject", async (projectId, thunkAPI) => {
  try {
    const isDeleted = await FetchDeleteProject(projectId);
    if (isDeleted) {
      return projectId;
    } else {
      return thunkAPI.rejectWithValue(
        "Ett fel inträffade vid borttagning av projekt."
      );
    }
  } catch (error) {
    return thunkAPI.rejectWithValue(
      "Ett fel inträffade vid borttagning av projekt."
    );
  }
});

export const DeleteFileAsync = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>("project/deletefile", async (fileId, thunkAPI) => {
  try {
    const isDeleted = await FetchDeleteFile(fileId);
    if (isDeleted) {
      return fileId;
    } else {
      return thunkAPI.rejectWithValue(
        "Ett fel inträffade vid borttagning av fil."
      );
    }
  } catch (error) {
    return thunkAPI.rejectWithValue(
      "Ett fel inträffade vid borttagning av projekt."
    );
  }
});

const saveActiveProjectToLocalStorage = (project: ProjectNoDate) => {
  localStorage.setItem("activeProject", JSON.stringify(project));
};
const saveActiveUpdateToLocalStorage = (update: ProjectUpdateNoDate) => {
  localStorage.setItem("activeUpdate", JSON.stringify(update));
};
const loadActiveProjectFromLocalStorage = (): ProjectNoDate | undefined => {
  const storedActiveProject = localStorage.getItem("activeProject");
  return storedActiveProject ? JSON.parse(storedActiveProject) : undefined;
};
const loadActiveUpdateFromLocalStorage = ():
  | ProjectUpdateNoDate
  | undefined => {
  const storedActiveUpdate = localStorage.getItem("activeUpdate");
  return storedActiveUpdate ? JSON.parse(storedActiveUpdate) : undefined;
};

const projectSlice = createSlice({
  name: "project",
  initialState,
  reducers: {
    setActiveProject: (state, action) => {
      const projectId = action.payload;
      const activeProject = state.projects?.find(
        (project: ProjectNoDate) => project.id === projectId
      );
      if (activeProject) {
        state.activeProject = activeProject;
        saveActiveProjectToLocalStorage(activeProject);
      }
    },
    setActiveUpdate: (state, action) => {
      state.activeUpdate = action.payload;
      saveActiveUpdateToLocalStorage(action.payload);
    },
    getActiveProject: (state) => {
      const activeProject = loadActiveProjectFromLocalStorage();
      if (activeProject) {
        state.activeProject = activeProject;
      }
    },
    getActiveUpdate: (state) => {
      const activeUpdate = loadActiveUpdateFromLocalStorage();
      if (activeUpdate) {
        state.activeUpdate = activeUpdate;
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
      })
      .addCase(GetUpdateCommentsAsync.fulfilled, (state, action) => {
        if (action.payload) {
          state.activeComments = action.payload;
          state.error = null;
        }
      })
      .addCase(GetUpdateCommentsAsync.rejected, (state) => {
        state.error = "Något gick fel.";
      })
      .addCase(DeleteProjectAsync.fulfilled, (state, action) => {
        if (action.payload) {
          const filteredProjects = state.projects?.filter(
            (m) => m.id != action.payload
          );
          state.projects = filteredProjects;
          state.error = null;
        }
      })
      .addCase(DeleteProjectAsync.rejected, (state) => {
        state.error = "Något gick fel när projektet skulle tas bort.";
      })
      .addCase(EditProjectAsync.fulfilled, (state, action) => {
        if (action.payload) {
          if (state.projects) {
            const index = state.projects.findIndex(
              (m) => m.id === action.payload.id
            );
            if (index !== -1) {
              state.projects[index] = action.payload;
            }
          }
          state.error = null;
        }
      })
      .addCase(EditProjectAsync.rejected, (state) => {
        state.error = "Något gick fel.";
      })
      .addCase(DeleteCommentAsync.fulfilled, (state, action) => {
        if (action.payload) {
          const filteredProjects = state.activeComments?.filter(
            (m) => m.id != action.payload
          );
          state.activeComments = filteredProjects;
          state.error = null;
        }
      })
      .addCase(DeleteCommentAsync.rejected, (state) => {
        state.error = "Något gick fel när kommentaren skulle tas bort.";
      })
      .addCase(EditCommentAsync.fulfilled, (state, action) => {
        if (action.payload) {
          if (state.activeComments) {
            const index = state.activeComments.findIndex(
              (m) => m.id === action.payload.id
            );
            if (index !== -1) {
              state.activeComments[index] = action.payload;
            }
          }
          state.error = null;
        }
      })
      .addCase(EditCommentAsync.rejected, (state) => {
        state.error = "Något gick fel.";
      });
  },
});

export const {
  getActiveProject,
  setActiveProject,
  setActiveUpdate,
  getActiveUpdate,
} = projectSlice.actions;
export const projectReducer = projectSlice.reducer;
