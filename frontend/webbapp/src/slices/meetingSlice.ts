import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { CreateMeetingDTO, Meeting, Team, MeetingRoom } from "../../types";
import { FetchCreateMeeting, FetchGetMyMeetings, FetchGetMeetingRoomByTeam } from "../api/meeting";


interface MeetingState {
  meetings: Meeting[] | undefined;
  teams: Team[] | undefined;
  meetingroom: MeetingRoom | undefined;
  error: string | null;
}

export const initialState: MeetingState = {
  meetings: undefined,
  teams: undefined,
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
      console.log("created meeting: ", createdMeeting);
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
    Meeting[],
  void,
  { rejectValue: string }
>("meeting/getmymeetings", async (_, thunkAPI) => {
  try {
    const myMeetings = await FetchGetMyMeetings();
    if (myMeetings) {
      console.log("Möten hämtade:", myMeetings);
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
      .addCase(GetMyMeetingsAsync.fulfilled, (state, action) => {
        console.log("Fulfilled action payload:", action.payload);
        if (action.payload) {
          state.meetings = action.payload;
          state.error = null;
        }
      })
      .addCase(GetMyMeetingsAsync.rejected, (state) => {
        state.meetings = undefined;
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