import * as signalR from "@microsoft/signalr";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  Conversation,
  ConversationParticipant,
  Message,
  MessageOutgoing,
} from "../../types";
import {
  FetchGetConversationParticipant,
  FetchGetTeamConversation,
  FetchGetTeamMessages,
} from "../api/conversation";
import { FetchUpdateLastActive } from "../api/conversationParticipant";
import {
  FetchCreateMessage,
  FetchDeleteMessage,
  FetchEditMessage,
} from "../api/message";
import ChatConnector from "../pages/AfterChosenTeam/ChatConnection";

export interface MessageState {
  messages: Message[];
  error: string | null;
  teamConversation: Conversation | undefined;
  activeConversation: Conversation | undefined;
  activeConversationParticipant: ConversationParticipant | undefined;
}

export const initialState: MessageState = {
  messages: [],
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

export const GetTeamConversationMessages = createAsyncThunk<
  Message[],
  string,
  { rejectValue: string }
>("message/getTeamConversationMessages", async (teamId, thunkAPI) => {
  try {
    const messages = await FetchGetTeamMessages(teamId);
    if (messages) {
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

export const liveUpdateMessageSent = createAsyncThunk(
  "message/liveUpdateMessageSent",
  async (message: Message) => {
    const connection = ChatConnector.getInstance();
    try {
      if (
        connection.getConnectionState() !== signalR.HubConnectionState.Connected
      ) {
        await connection.start();
      }
      if (
        connection.getConnectionState() === signalR.HubConnectionState.Connected
      ) {
        await connection.invokeHubMethod<Message>("MessageSent", message);
      } else {
        console.error(
          "SignalR chatconnection is not in the 'Connected' state."
        );
      }
    } catch (error) {
      console.error("Error: ", error);
    }
  }
);

export const liveUpdateMessageEdited = createAsyncThunk(
  "message/liveUpdateMessageEdited",
  async (message: Message) => {
    const connection = ChatConnector.getInstance();
    try {
      if (
        connection.getConnectionState() !== signalR.HubConnectionState.Connected
      ) {
        await connection.start();
      }
      if (
        connection.getConnectionState() === signalR.HubConnectionState.Connected
      ) {
        await connection.invokeHubMethod<Message>("MessageEdited", message);
      } else {
        console.error(
          "SignalR chatconnection is not in the 'Connected' state."
        );
      }
    } catch (error) {
      console.error("Error: ", error);
    }
  }
);

export const liveUpdateMessageDeleted = createAsyncThunk(
  "message/liveUpdateMessageDeleted",
  async (messageId: string) => {
    const connection = ChatConnector.getInstance();
    try {
      if (
        connection.getConnectionState() !== signalR.HubConnectionState.Connected
      ) {
        await connection.start();
      }
      if (
        connection.getConnectionState() === signalR.HubConnectionState.Connected
      ) {
        await connection.invokeHubMethod<string>("MessageDeleted", messageId);
      } else {
        console.error(
          "SignalR chatconnection is not in the 'Connected' state."
        );
      }
    } catch (error) {
      console.error("Error: ", error);
    }
  }
);

//SIGNAL R
export const messageSent = createAsyncThunk(
  "message/messageSent",
  async (message: Message) => {
    return message;
  }
);

export const messageEdited = createAsyncThunk(
  "message/messageEdited",
  async (message: Message) => {
    return message;
  }
);

export const messageDeleted = createAsyncThunk(
  "message/messageDeleted",
  async (messageId: string) => {
    return messageId;
  }
);

//

const messageSlice = createSlice({
  name: "message",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(GetTeamConversationMessages.fulfilled, (state, action) => {
        if (action.payload) {
          state.messages = action.payload;
          state.error = null;
        }
      })
      .addCase(GetTeamConversationMessages.rejected, (state) => {
        state.messages = [];
        state.error = "Något gick fel med hämtandet av konversation.";
      })
      .addCase(CreateMessageAsync.fulfilled, (state, action) => {
        if (action.payload) {
          // state.messages.push(action.payload);
          state.error = null;
        }
      })
      .addCase(CreateMessageAsync.rejected, (state) => {
        state.error = "Något gick fel med skapandet av meddelandet.";
      })
      .addCase(EditMessageAsync.fulfilled, (state, action) => {
        //går via signalr men borde kolla hur detta funkar bäst
        if (action.payload) {
          // const index = state.messages.findIndex(
          //   (m) => m.id === action.payload.id
          // );
          // if (index !== -1) {
          //   state.messages[index].content = action.payload.content;
          // }
          state.error = null;
        }
      })
      .addCase(EditMessageAsync.rejected, (state) => {
        state.error = "Något gick fel med redigering av meddelandet.";
      })
      .addCase(DeleteMessageAsync.fulfilled, (state, action) => {
        if (action.payload) {
          // const filteredMessages = state.messages.filter(
          //   (m) => m.id != action.payload
          // );
          // state.messages = filteredMessages;
          state.error = null;
        }
      })
      .addCase(DeleteMessageAsync.rejected, (state) => {
        state.error = "Något gick fel när meddelandet skulle tas bort.";
      })
      .addCase(messageSent.fulfilled, (state, action) => {
        if (action.payload && state.teamConversation) {
          if (action.payload.conversationId == state.teamConversation.id)
            state.messages.push(action.payload);
        }
      })
      .addCase(messageEdited.fulfilled, (state, action) => {
        if (action.payload) {
          const editedMessageIndex = state.messages.findIndex(
            (m) => m.id === action.payload.id
          );
          if (editedMessageIndex !== -1) {
            state.messages[editedMessageIndex].content = action.payload.content;
          }
        }
      })
      .addCase(messageDeleted.fulfilled, (state, action) => {
        if (action.payload) {
          // Filtrera bort det raderade meddelandet från meddelandelistan
          state.messages = state.messages.filter(
            (m) => m.id !== action.payload
          );
        }
      })
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

export const messageReducer = messageSlice.reducer;
