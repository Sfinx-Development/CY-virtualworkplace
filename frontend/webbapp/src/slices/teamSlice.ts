import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { CreateTeamDTO, Team } from "../../types";
import { FetchCreateTeam, FetchGetMyTeams, FetchJoinTeam } from "../api/team";

interface TeamState {
  teams: Team[] | undefined;
  activeTeam: Team | undefined;
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
      console.log("created team: ", createdTeam);
      return createdTeam;
    } else {
      return thunkAPI.rejectWithValue("failed to add team");
    }
  } catch (error) {
    return thunkAPI.rejectWithValue("Något gick fel.");
  }
});

export const createJoinAsync = createAsyncThunk<
  Team,
  { code: string; role: string },
  { rejectValue: string }
>("team/joinTeam", async ({ code, role }, thunkAPI) => {
  try {
    const joinedTeam = await FetchJoinTeam({ code, role });
    if (joinedTeam) {
      console.log("joined team: ", joinedTeam);
      return joinedTeam;
    } else {
      return thunkAPI.rejectWithValue("failed to join team");
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
      console.log("Teams hämtade:", myTeams);
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
          state.teams?.push(action.payload);
          state.error = null;
        }
      })
      .addCase(createJoinAsync.rejected, (state) => {
        state.error = "Något gick fel med att gå med i team.";
      })
      .addCase(GetMyTeamsAsync.fulfilled, (state, action) => {
        console.log("Fulfilled action payload:", action.payload);
        if (action.payload) {
          state.teams = action.payload;
          state.error = null;
        }
      })
      .addCase(GetMyTeamsAsync.rejected, (state) => {
        state.teams = undefined;
        state.error = "Något gick fel med hämtandet av team.";
      });
  },
});

export const { setActiveTeam, getActiveTeam } = teamSlice.actions;
export const teamReducer = teamSlice.reducer;
