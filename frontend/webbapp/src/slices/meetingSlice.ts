import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  CreateMeetingDTO,
  MeetingNoDate,
  MeetingOccasion,
  MeetingOccasionNoDate,
} from "../../types";
import {
  FetchCreateMeeting,
  FetchCreateTeamMeeting,
  FetchDeleteMeeting,
  FetchEditMeeting,
  FetchGetMyMeetings,
  FetchGetMyOccasions,
  FetchGetMyPastMeetings,
} from "../api/meeting";

export interface MeetingState {
  meetings: MeetingNoDate[] | undefined;
  activeMeetingId: string | undefined;
  occasions: MeetingOccasionNoDate[] | undefined;
  teamMeetings: MeetingNoDate[] | undefined;
  pastOccasions: MeetingOccasionNoDate[] | undefined;
  deletemeeting: MeetingOccasion | undefined;
  error: string | null;
}

export const initialState: MeetingState = {
  meetings: undefined,
  activeMeetingId: undefined,
  occasions: undefined,
  teamMeetings: undefined,
  pastOccasions: undefined,
  deletemeeting: undefined,
  error: null,
};

export const createMeetingAsync = createAsyncThunk<
  MeetingNoDate,
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
  MeetingNoDate,
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

export const GetMyOccasionsAsync = createAsyncThunk<
  MeetingOccasionNoDate[],
  string,
  { rejectValue: string }
>("meeting/getmyoccasions", async (profileId, thunkAPI) => {
  try {
    const myMeetings = await FetchGetMyOccasions(profileId);
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

export const GetMyMeetingsAsync = createAsyncThunk<
  MeetingNoDate[],
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

export const EditMeetingAsync = createAsyncThunk<
  MeetingNoDate,
  MeetingNoDate,
  { rejectValue: string }
>("meeting/editmeeting", async (meeting, thunkAPI) => {
  try {
    const editedMeeting = await FetchEditMeeting(meeting);
    if (editedMeeting) {
      return editedMeeting;
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
  MeetingOccasionNoDate[],
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

export const DeleteMeetingAsync = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>("meeting/deletemeeting", async (meetingId, thunkAPI) => {
  try {
    const isDeleted = await FetchDeleteMeeting(meetingId);
    if (isDeleted) {
      return meetingId;
    } else {
      return thunkAPI.rejectWithValue(
        "Ett fel inträffade vid raderande av meddelande."
      );
    }
  } catch (error) {
    return thunkAPI.rejectWithValue(
      "Ett fel inträffade vid raderande av meddelande."
    );
  }
});

const meetingSlice = createSlice({
  name: "meeting",
  initialState,
  reducers: {
    setActiveMeeting: (state, action: PayloadAction<string>) => {
      state.activeMeetingId = action.payload;
    },
  },
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
        if (action.payload) {
          state.meetings = action.payload;
          state.error = null;
        }
      })
      .addCase(GetMyOccasionsAsync.rejected, (state) => {
        state.occasions = undefined;
        state.error = "Något gick fel med hämtandet av occasions.";
      })
      .addCase(GetMyOccasionsAsync.fulfilled, (state, action) => {
        if (action.payload) {
          state.occasions = action.payload;
          state.error = null;
        }
      })
      .addCase(GetMyMeetingsAsync.rejected, (state) => {
        state.meetings = undefined;
        state.error = "Något gick fel med hämtandet av möte.";
      })
      .addCase(GetMyPastMeetingsAsync.fulfilled, (state, action) => {
        if (action.payload) {
          state.pastOccasions = action.payload;
          state.error = null;
        }
      })
      .addCase(GetMyPastMeetingsAsync.rejected, (state) => {
        state.pastOccasions = undefined;
        state.error = "Något gick fel med hämtandet av möte.";
      })
      .addCase(DeleteMeetingAsync.fulfilled, (state, action) => {
        if (action.payload) {
          const filteredOccasions = state.occasions?.filter(
            (occasion) => occasion.meetingId !== action.payload
          );
          state.occasions = filteredOccasions;

          const filteredPastOccasions = state.pastOccasions?.filter(
            (pastOccasion) => pastOccasion.meetingId !== action.payload
          );
          state.pastOccasions = filteredPastOccasions;

          state.error = null;
        }
      })

      // .addCase(DeleteMeetingAsync.fulfilled, (state, action) => {
      //   if (action.payload) {
      //     const filteredMeetings = state.occasions?.filter(
      //       (m) => m.meetingId != action.payload
      //     );
      //     state.occasions = filteredMeetings;
      //     state.error = null;
      //   }
      // })
      .addCase(DeleteMeetingAsync.rejected, (state) => {
        state.error = "Något gick fel när meddelandet skulle tas bort.";
      })
      .addCase(EditMeetingAsync.fulfilled, (state, action) => {
        if (action.payload) {
          // Uppdatera mötet i meetings (om det finns)
          if (state.meetings) {
            const index = state.meetings.findIndex(
              (m) => m.id === action.payload.id
            );
            if (index !== -1) {
              state.meetings[index] = action.payload;
            }
          }

          // Uppdatera mötet i occasions (om det finns)
          if (state.occasions) {
            const occasionIndex = state.occasions.findIndex(
              (o) => o.meetingId === action.payload.id
            );
            if (occasionIndex !== -1) {
              state.occasions[occasionIndex].date = action.payload.date;
              state.occasions[occasionIndex].name = action.payload.name;
              state.occasions[occasionIndex].description =
                action.payload.description;
            }
          }

          state.error = null;
        }
      })

      .addCase(EditMeetingAsync.rejected, (state) => {
        state.error = "Något gick fel.";
      });
  },
});

export const { setActiveMeeting } = meetingSlice.actions;

export const meetingReducer = meetingSlice.reducer;
