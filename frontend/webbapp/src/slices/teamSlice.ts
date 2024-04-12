import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { CreateTeamDTO, Team, TeamRequest } from "../../types";
import {
  FetchCreateTeam,
  FetchGetMyTeamRequests,
  FetchGetMyTeams,
  FetchJoinTeam,
  FetchUpdateTeam,
} from "../api/team";

export interface TeamState {
  teams: Team[] | undefined;
  activeTeam: Team | undefined;
  teamRequests: TeamRequest[] | undefined;
  error: string | null;
}

const saveTeamToLocalStorage = (activeTeam: Team) => {
  localStorage.setItem("activeTeam", JSON.stringify(activeTeam));
};
const loadTeamFromLocalStorage = (): Team | undefined => {
  const storedTeam = localStorage.getItem("activeTeam");
  return storedTeam ? JSON.parse(storedTeam) : undefined;
};

export const initialState: TeamState = {
  teams: undefined,
  activeTeam: undefined,
  teamRequests: undefined,
  error: null,
};

export const createTeamAsync = createAsyncThunk<
  Team,
  CreateTeamDTO,
  { rejectValue: string }
>("team/createTeam", async (team, thunkAPI) => {
  try {
    const createdTeam = await FetchCreateTeam(team);
    if (createdTeam) {
      return createdTeam;
    } else {
      return thunkAPI.rejectWithValue("failed to add team");
    }
  } catch (error) {
    return thunkAPI.rejectWithValue("Något gick fel.");
  }
});

export const createJoinAsync = createAsyncThunk<
  Team | TeamRequest,
  { code: string; role: string },
  { rejectValue: string }
>("team/joinTeam", async ({ code, role }, thunkAPI) => {
  try {
    const joinedTeam = await FetchJoinTeam({ code, role });
    if (joinedTeam) {
      return joinedTeam;
    } else {
      return thunkAPI.rejectWithValue("failed to join team");
    }
  } catch (error) {
    return thunkAPI.rejectWithValue("Något gick fel.");
  }
});

export const updateAsync = createAsyncThunk<
  Team,
  Team,
  { rejectValue: string }
>("team/update", async (team, thunkAPI) => {
  try {
    const updatedTeam = await FetchUpdateTeam(team);
    if (updatedTeam) {
      return updatedTeam;
    } else {
      return thunkAPI.rejectWithValue("failed to update team");
    }
  } catch (error) {
    return thunkAPI.rejectWithValue("Något gick fel.");
  }
});

export const GetMyTeamsAsync = createAsyncThunk<
  Team[],
  void,
  { rejectValue: string }
>("team/getmyteams", async (_, thunkAPI) => {
  try {
    const myTeams = await FetchGetMyTeams();
    if (myTeams) {
      return myTeams;
    } else {
      return thunkAPI.rejectWithValue(
        "Ett fel inträffade vid hämtning av lag."
      );
    }
  } catch (error) {
    return thunkAPI.rejectWithValue("Ett fel inträffade vid hämtning av lag.");
  }
});

export const GetMyTeamRequestsAsync = createAsyncThunk<
  TeamRequest[],
  void,
  { rejectValue: string }
>("team/getmyteamrequests", async (_, thunkAPI) => {
  try {
    const myTeamRequests = await FetchGetMyTeamRequests();
    if (myTeamRequests) {
      return myTeamRequests;
    } else {
      return thunkAPI.rejectWithValue(
        "Ett fel inträffade vid hämtning av förfrågningar."
      );
    }
  } catch (error) {
    return thunkAPI.rejectWithValue(
      "Ett fel inträffade vid hämtning av förfrågningar."
    );
  }
});

const teamSlice = createSlice({
  name: "team",
  initialState,
  reducers: {
    setActiveTeam: (state, action) => {
      const teamId = action.payload;
      const activeTeam = state.teams?.find((team) => team.id === teamId);
      if (activeTeam) {
        state.activeTeam = activeTeam;
        saveTeamToLocalStorage(activeTeam);
      }
    },
    getActiveTeam: (state) => {
      const activeTeam = loadTeamFromLocalStorage();
      if (activeTeam) {
        console.log("ACTIVE TEAM: ", activeTeam);
        state.activeTeam = activeTeam;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createTeamAsync.fulfilled, (state, action) => {
        if (action.payload) {
          state.teams?.push(action.payload);
          state.error = null;
        }
      })
      .addCase(createTeamAsync.rejected, (state) => {
        state.error = "Något gick fel med skapandet av team.";
      })
      .addCase(createJoinAsync.fulfilled, (state, action) => {
        if (action.payload) {
          if ("type" in action.payload && action.payload.type === "Team") {
            state.teams?.push(action.payload as Team);
          } else if (
            "type" in action.payload &&
            action.payload.type === "TeamRequest"
          ) {
            state.teamRequests?.push(action.payload as TeamRequest);
          }
          state.error = null;
        }
      })
      .addCase(createJoinAsync.rejected, (state) => {
        state.error = "Något gick fel med att gå med i team.";
      })
      .addCase(updateAsync.fulfilled, (state, action) => {
        if (action.payload && state.teams) {
          const index = state.teams.findIndex((t) => t.id == action.payload.id);
          if (index) {
            state.teams[index] = action.payload;
          }
        }
      })
      .addCase(updateAsync.rejected, (state) => {
        state.error = "Något gick fel med att uppdatera team.";
      })
      .addCase(GetMyTeamsAsync.fulfilled, (state, action) => {
        if (action.payload) {
          state.teams = action.payload;
          state.error = null;
        }
      })
      .addCase(GetMyTeamsAsync.rejected, (state) => {
        state.teams = undefined;
        state.error = "Något gick fel med hämtandet av team.";
      })
      .addCase(GetMyTeamRequestsAsync.fulfilled, (state, action) => {
        if (action.payload) {
          state.teamRequests = action.payload;
          state.error = null;
        }
      })
      .addCase(GetMyTeamRequestsAsync.rejected, (state) => {
        state.teamRequests = undefined;
        state.error = "Något gick fel med hämtandet av förfrågningar.";
      });
  },
});

export const { setActiveTeam, getActiveTeam } = teamSlice.actions;
export const teamReducer = teamSlice.reducer;
