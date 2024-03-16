import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Conversation, ConversationParticipant } from "../../types";
import {
  FetchGetConversationParticipant,
  FetchGetTeamConversation,
} from "../api/conversation";

export interface ConversationState {
  teamConversation: Conversation | undefined;
  activeConversation: Conversation | undefined;
  activeConversationParticipant: ConversationParticipant | undefined;
  error: string | null;
}

export const initialState: ConversationState = {
  teamConversation: undefined,
  activeConversation: undefined,
  activeConversationParticipant: undefined,
  error: null,
};

export const GetTeamConversation = createAsyncThunk<
  Conversation,
  string,
  { rejectValue: string }
>("conversation/getTeamConversation", async (teamId, thunkAPI) => {
  try {
    const conversation = await FetchGetTeamConversation(teamId);
    if (conversation) {
      return conversation;
    } else {
      return thunkAPI.rejectWithValue(
        "Ett fel inträffade vid hämtning av konversation."
      );
    }
  } catch (error) {
    return thunkAPI.rejectWithValue(
      "Ett fel inträffade vid hämtning av konversation."
    );
  }
});

export const GetConversationParticipant = createAsyncThunk<
  ConversationParticipant,
  { profileId: string; conversationId: string },
  { rejectValue: string }
>(
  "conversation/getConversationParticipant",
  async ({ profileId, conversationId }, thunkAPI) => {
    try {
      const participant = await FetchGetConversationParticipant(
        conversationId,
        profileId
      );
      if (participant) {
        return participant;
      } else {
        return thunkAPI.rejectWithValue(
          "Ett fel inträffade vid hämtning av deltagare."
        );
      }
    } catch (error) {
      return thunkAPI.rejectWithValue(
        "Ett fel inträffade vid hämtning av konversation."
      );
    }
  }
);

const conversationSlice = createSlice({
  name: "conversation",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(GetTeamConversation.fulfilled, (state, action) => {
        if (action.payload) {
          state.teamConversation = action.payload;
          state.error = null;
        }
      })
      .addCase(GetTeamConversation.rejected, (state) => {
        state.teamConversation = undefined;
        state.error = "Något gick fel med hämtandet av konversation.";
      })
      .addCase(GetConversationParticipant.fulfilled, (state, action) => {
        if (action.payload) {
          state.activeConversationParticipant = action.payload;
          state.error = null;
        }
      })
      .addCase(GetConversationParticipant.rejected, (state) => {
        state.activeConversationParticipant = undefined;
        state.error = "Något gick fel med hämtandet av deltagare.";
      });
  },
});

export const conversationReducer = conversationSlice.reducer;
