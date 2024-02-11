import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { CreateMeetingDTO, Meeting, MeetingRoom, MeetingOccasion } from "../../types";
import { FetchCreateMeeting,FetchCreateTeamMeeting, FetchGetMyMeetings, FetchGetMeetingRoomByTeam, FetchGetMyPastMeetings, FetchDeleteMeeting } from "../api/meeting";


interface MeetingState {
  meetings: Meeting[] | undefined;
  occasions: MeetingOccasion[] | undefined;
  teamMeetings: Meeting[] | undefined;
  pastOccasions: MeetingOccasion[] | undefined;
  meetingroom: MeetingRoom | undefined;
  deletemeeting: MeetingOccasion | undefined;
  error: string | null;
}

export const initialState: MeetingState = {
  meetings: undefined,
  occasions: undefined,
 teamMeetings: undefined,
 pastOccasions: undefined,
  meetingroom: undefined,
  deletemeeting: undefined,
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

export const GetMyPastMeetingsAsync = createAsyncThunk<
  MeetingOccasion[],
  string,
  { rejectValue: string }
>("meeting/getmypastmeetings", async (profileId, thunkAPI) => {
  try {
    const myPastMeetings = await FetchGetMyPastMeetings(profileId);
    if (myPastMeetings) {
      return myPastMeetings;
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

export const DeleteMeetingAsync = createAsyncThunk<void, string, { rejectValue: string }>(
  "meeting/deletemeeting",
  async (meetingId, thunkAPI) => {
    try {
      // Call your API function to delete the meeting by ID
      await FetchDeleteMeeting(meetingId);
    } catch (error) {
      console.error("Error deleting meeting:", error);
      return thunkAPI.rejectWithValue("Något gick fel vid radering av möte.");
    }
  }
);






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
      .addCase(GetMyPastMeetingsAsync.fulfilled, (state, action) => {
        console.log("Fulfilled action payload:", action.payload);
        if (action.payload) {
          console.log(action.payload)
          state.pastOccasions = action.payload;
          state.error = null;
        }
      })
      .addCase(GetMyPastMeetingsAsync.rejected, (state) => {
        state.pastOccasions = undefined;
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
      })
      .addCase(DeleteMeetingAsync.fulfilled, (state) => {
        // Since DeleteMeetingAsync is a delete operation, there might not be a payload.
        state.deletemeeting = undefined;
        state.error = null;
      })
      .addCase(DeleteMeetingAsync.rejected, (state) => {
        state.occasions = undefined;
        state.error = "Något gick fel med radering av möte.";
      })
      
   
    
  },
});

export const meetingReducer = meetingSlice.reducer;
