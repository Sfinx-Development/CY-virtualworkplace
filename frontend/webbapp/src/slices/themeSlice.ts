import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { CreateTeamDTO, Team } from "../../types";
import { FetchCreateTeam, FetchGetMyTeams } from "../api/team";

interface TeamState {
  teams: Team[] | undefined;
  error: string | null;
}

export const initialState: TeamState = {
  teams: undefined,
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
  reducers: {},
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

export const teamReducer = teamSlice.reducer;
