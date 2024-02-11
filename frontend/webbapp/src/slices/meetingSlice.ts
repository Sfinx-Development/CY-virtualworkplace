import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { CreateMeetingDTO, Meeting, MeetingRoom, MeetingOccasion } from "../../types";
import { FetchCreateMeeting,FetchCreateTeamMeeting, FetchGetMyMeetings, FetchGetMeetingRoomByTeam } from "../api/meeting";


interface MeetingState {
  meetings: Meeting[] | undefined;
  occasions: MeetingOccasion[] | undefined;
  teamMeetings: Meeting[] | undefined;
  meetingroom: MeetingRoom | undefined;
  error: string | null;
}

export const initialState: MeetingState = {
  meetings: undefined,
  occasions: undefined,
 teamMeetings: undefined,
  meetingroom: undefined,
  error: null,
};

export const createMeetingAsync = createAsyncThunk<
  Meeting,
  CreateMeetingDTO,
  { rejectValue: string }
>("meeting/createMeeting", async (meeting, thunkAPI) => {
  try {
    const createdMeeting = await FetchCreateMeeting(meeting);
    if (createdMeeting) {
      return createdMeeting;
    } else {
      return thunkAPI.rejectWithValue("failed to add meeting");
    }
  } catch (error) {
    console.error("Error creating meeting:", error);
    return thunkAPI.rejectWithValue("Något gick fel.");
  }
});

export const createTeamMeetingAsync = createAsyncThunk<
  Meeting,
  CreateMeetingDTO,
  { rejectValue: string }
>("meeting/createTeamMeeting", async (meeting, thunkAPI) => {
  try {
    const createdMeeting = await FetchCreateTeamMeeting(meeting);
    if (createdMeeting) {
      return createdMeeting;
    } else {
      return thunkAPI.rejectWithValue("failed to add meeting");
    }
  } catch (error) {
    console.error("Error creating meeting:", error);
    return thunkAPI.rejectWithValue("Något gick fel.");
  }
});

export const GetMyMeetingsAsync = createAsyncThunk<
  MeetingOccasion[],
  string,
  { rejectValue: string }
>("meeting/getmymeetings", async (profileId, thunkAPI) => {
  try {
    const myMeetings = await FetchGetMyMeetings(profileId);
    if (myMeetings) {
      return myMeetings;
    } else {
      return thunkAPI.rejectWithValue(
        "Ett fel inträffade vid hämtning av lag."
      );
    }
  } catch (error) {
    return thunkAPI.rejectWithValue("Ett fel inträffade vid hämtning av lag.");
  }
});

export const Getmyactiveroom = createAsyncThunk<
  MeetingRoom,
  string,
  { rejectValue: string }
>("meetingroom/getmyactiveroom", async (teamId, thunkAPI) => {
  try {
    const myActiveRoom = await FetchGetMeetingRoomByTeam(teamId);
    if (myActiveRoom) {
      console.log("Room hämtade:", myActiveRoom);
      return myActiveRoom;
    } else {
      return thunkAPI.rejectWithValue(
        "Ett fel inträffade vid hämtning av lag."
      );
    }
  } catch (error) {
    return thunkAPI.rejectWithValue("Ett fel inträffade vid hämtning av team.");
  }
});



const meetingSlice = createSlice({
  name: "meeting",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createMeetingAsync.fulfilled, (state, action) => {
        if (action.payload) {
          state.meetings?.push(action.payload);
          state.error = null;
        }
      })
      .addCase(createMeetingAsync.rejected, (state) => {
        state.error = "Något gick fel med skapandet av team.";
      })
      .addCase(createTeamMeetingAsync.fulfilled, (state, action) => {
        if (action.payload) {
          state.teamMeetings?.push(action.payload);
          state.error = null;
        }
      })
      .addCase(createTeamMeetingAsync.rejected, (state) => {
        state.error = "Något gick fel med skapandet av team.";
      })
      .addCase(GetMyMeetingsAsync.fulfilled, (state, action) => {
        console.log("Fulfilled action payload:", action.payload);
        if (action.payload) {
          console.log(action.payload)
          state.occasions = action.payload;
          state.error = null;
        }
      })
      .addCase(GetMyMeetingsAsync.rejected, (state) => {
        state.occasions = undefined;
        state.error = "Något gick fel med hämtandet av möte.";
      })
      .addCase(Getmyactiveroom.fulfilled, (state, action) => {
        console.log("Fulfilled action payload:", action.payload);
        if (action.payload) {
          console.log(action.payload)
          state.meetingroom = action.payload; // Uppdatera meetingroom i state
          state.error = null;
        }
      })
      .addCase(Getmyactiveroom.rejected, (state) => {
        state.meetingroom = undefined;
        state.error = "Något gick fel med hämtandet av mötesrum.";
      });
   
    
  },
});

export const meetingReducer = meetingSlice.reducer;
