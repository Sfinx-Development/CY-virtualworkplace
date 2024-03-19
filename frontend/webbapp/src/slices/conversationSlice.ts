import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Conversation, ConversationParticipant } from "../../types";
import {
  FetchGetConversationParticipant,
  FetchGetTeamConversation,
} from "../api/conversation";
import { FetchUpdateLastActive } from "../api/conversationParticipant";

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
      console.log("konverstion hämtade:", conversation);
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
        console.log("Deltagare hämtade:", participant);
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

//egen slice?
export const UpdateLastActive = createAsyncThunk<
  ConversationParticipant,
  ConversationParticipant,
  { rejectValue: string }
>(
  "conversation/updateLastActive",
  async (conversationParticipant, thunkAPI) => {
    try {
      const participant = await FetchUpdateLastActive(conversationParticipant);
      if (participant) {
        console.log("Deltagare uppdaterad:", participant);
        return participant;
      } else {
        return thunkAPI.rejectWithValue(
          "Ett fel inträffade vid uppdatering av deltagare."
        );
      }
    } catch (error) {
      return thunkAPI.rejectWithValue(
        "Ett fel inträffade vid uppdatering av deltagare."
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
        console.log("Fulfilled action payload:", action.payload);
        if (action.payload) {
          console.log(action.payload);
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
      })
      .addCase(UpdateLastActive.fulfilled, (state, action) => {
        if (action.payload) {
          state.activeConversationParticipant = action.payload;
          state.error = null;
        }
      })
      .addCase(UpdateLastActive.rejected, (state) => {
        state.activeConversationParticipant = undefined;
        state.error =
          "Något gick fel med uppdatering av deltagarens senast aktiva tid.";
      });
  },
});

export const conversationReducer = conversationSlice.reducer;
