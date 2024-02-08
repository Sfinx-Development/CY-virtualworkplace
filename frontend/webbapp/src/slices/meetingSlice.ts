import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { CreateMeetingDTO, Meeting } from "../../types";
import { FetchCreateMeeting, FetchGetMyMeetings } from "../api/meeting";

interface MeetingState {
  meetings: Meeting[] | undefined;
  error: string | null;
}

export const initialState: MeetingState = {
  meetings: undefined,
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

export const GetMyMeetingsAsync = createAsyncThunk<
  Meeting[],
  void,
  { rejectValue: string }
>("meeting/getmymeetings", async (_, thunkAPI) => {
  try {
    const myMeetings = await FetchGetMyMeetings();
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
        if (action.payload) {
          state.meetings = action.payload;
          state.error = null;
        }
      })
      .addCase(GetMyMeetingsAsync.rejected, (state) => {
        state.meetings = undefined;
        state.error = "Något gick fel med hämtandet av möte.";
      });
  },
});

export const meetingReducer = meetingSlice.reducer;
