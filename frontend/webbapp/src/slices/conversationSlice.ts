import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  Conversation,
  ConversationParticipant,
  Message,
  MessageInput,
} from "../../types";
import {
  FetchCreateMessage,
  FetchGetConversationParticipant,
  FetchGetTeamConversation,
  FetchGetTeamMessages,
} from "../api/conversation";

interface ConversationState {
  teamConversation: Conversation | undefined;
  activeConversation: Conversation | undefined;
  activeConversationParticipant: ConversationParticipant | undefined;
  messages: Message[];
  error: string | null;
}

export const initialState: ConversationState = {
  teamConversation: undefined,
  activeConversation: undefined,
  activeConversationParticipant: undefined,
  messages: [],
  error: null,
};

export const GetTeamConversationMessages = createAsyncThunk<
  Message[],
  string,
  { rejectValue: string }
>("conversation/getTeamConversationMessages", async (teamId, thunkAPI) => {
  try {
    const messages = await FetchGetTeamMessages(teamId);
    if (messages) {
      console.log("meddelanden hämtade:", messages);
      return messages;
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

export const CreateMessageAsync = createAsyncThunk<
  Message,
  MessageInput,
  { rejectValue: string }
>("conversation/createMesssage", async (message, thunkAPI) => {
  try {
    const createdMessage = await FetchCreateMessage(message);
    if (createdMessage) {
      console.log("meddelandet skapat:", createdMessage);
      return createdMessage;
    } else {
      return thunkAPI.rejectWithValue(
        "Ett fel inträffade vid skapande av meddelande."
      );
    }
  } catch (error) {
    return thunkAPI.rejectWithValue(
      "Ett fel inträffade vid hämtning av konversation."
    );
  }
});

const conversationSlice = createSlice({
  name: "conversation",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(GetTeamConversationMessages.fulfilled, (state, action) => {
        console.log("Fulfilled action payload:", action.payload);
        if (action.payload) {
          console.log(action.payload);
          state.messages = action.payload;
          state.error = null;
        }
      })
      .addCase(GetTeamConversationMessages.rejected, (state) => {
        state.messages = [];
        state.error = "Något gick fel med hämtandet av konversation.";
      })
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
      .addCase(CreateMessageAsync.fulfilled, (state, action) => {
        console.log("Fulfilled action payload:", action.payload);
        if (action.payload) {
          state.messages.push(action.payload);
          state.error = null;
        }
      })
      .addCase(CreateMessageAsync.rejected, (state) => {
        state.error = "Något gick fel med skapandet av meddelandet.";
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
