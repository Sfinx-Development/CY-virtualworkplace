import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Message, MessageOutgoing } from "../../types";
import { FetchGetTeamMessages } from "../api/conversation";
import {
  FetchCreateMessage,
  FetchDeleteMessage,
  FetchEditMessage,
} from "../api/message";

interface MessageState {
  messages: Message[];
  error: string | null;
}

export const initialState: MessageState = {
  messages: [],
  error: null,
};

export const GetTeamConversationMessages = createAsyncThunk<
  Message[],
  string,
  { rejectValue: string }
>("message/getTeamConversationMessages", async (teamId, thunkAPI) => {
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

export const CreateMessageAsync = createAsyncThunk<
  Message,
  MessageOutgoing,
  { rejectValue: string }
>("message/createMesssage", async (message, thunkAPI) => {
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

export const EditMessageAsync = createAsyncThunk<
  Message,
  MessageOutgoing,
  { rejectValue: string }
>("message/editMessage", async (message, thunkAPI) => {
  try {
    const editedMessage = await FetchEditMessage(message);
    if (editedMessage) {
      return editedMessage;
    } else {
      return thunkAPI.rejectWithValue(
        "Ett fel inträffade vid redigering av meddelande."
      );
    }
  } catch (error) {
    return thunkAPI.rejectWithValue(
      "Ett fel inträffade vid redigering av meddelande."
    );
  }
});

export const DeleteMessageAsync = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>("message/deleteMessage", async (messageId, thunkAPI) => {
  try {
    const isDeleted = await FetchDeleteMessage(messageId);
    if (isDeleted) {
      return messageId;
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

const messageSlice = createSlice({
  name: "message",
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
      .addCase(EditMessageAsync.fulfilled, (state, action) => {
        console.log(
          "Fulfilled action payload for editing message:",
          action.payload
        );
        if (action.payload) {
          const index = state.messages.findIndex(
            (m) => m.id === action.payload.id
          );
          if (index !== -1) {
            state.messages[index].content = action.payload.content;
          }
          state.error = null;
        }
      })
      .addCase(EditMessageAsync.rejected, (state) => {
        state.error = "Något gick fel med redigering av meddelandet.";
      })
      .addCase(DeleteMessageAsync.fulfilled, (state, action) => {
        console.log("Fulfilled action payload:", action.payload);
        if (action.payload) {
          const filteredMessages = state.messages.filter(
            (m) => m.id != action.payload
          );
          state.messages = filteredMessages;
          state.error = null;
        }
      })
      .addCase(DeleteMessageAsync.rejected, (state) => {
        state.error = "Något gick fel när meddelandet skulle tas bort.";
      });
  },
});

export const messageReducer = messageSlice.reducer;
