import SendIcon from "@mui/icons-material/Send";
import {
  Button,
  Card,
  Container,
  TextField,
  Typography,
  styled,
} from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { Message, MessageOutgoing } from "../../../types";
import ChatMessage from "../../components/ChatMessage";
import {
  GetConversationParticipant,
  GetTeamConversation,
} from "../../slices/conversationSlice";
import {
  CreateMessageAsync,
  DeleteMessageAsync,
  EditMessageAsync,
  GetTeamConversationMessages,
  liveUpdateMessageDeleted,
  liveUpdateMessageEdited,
  liveUpdateMessageSent,
  messageDeleted,
  messageEdited,
  messageSent,
} from "../../slices/messageSlice";
import { GetMyProfileAsync, GetTeamProfiles } from "../../slices/profileSlice";
import { useAppDispatch, useAppSelector } from "../../slices/store";
import { getActiveTeam } from "../../slices/teamSlice";
import { theme1 } from "../../theme";
import ChatConnector from "./ChatConnection";

const StyledTextField = styled(TextField)({
  "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
    borderColor: "lightgray",
  },
});

export default function ChatRoom() {
  const dispatch = useAppDispatch();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeTeam = useAppSelector((state) => state.teamSlice.activeTeam);
  const profilesInTeam = useAppSelector((state) => state.profileSlice.profiles);

  const activeProfile = useAppSelector(
    (state) => state.profileSlice.activeProfile
  );

  const messagesFromSlice = useAppSelector(
    (state) => state.messageSlice.messages
  );
  const messages = [...messagesFromSlice].sort(
    (a, b) =>
      new Date(a.dateCreated).getTime() - new Date(b.dateCreated).getTime()
  );

  const teamConversation = useAppSelector(
    (state) => state.conversationSlice.teamConversation
  );

  const activeParticipant = useAppSelector(
    (state) => state.conversationSlice.activeConversationParticipant
  );

  const [content, setContent] = useState("");
  const [isEditMode, setIsEditMode] = useState(false);
  const [messageIdToEdit, setMessageIdToEdit] = useState("");
  const [editedContent, setEditedContent] = useState("");

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    const connection = ChatConnector.getInstance();

    connection.events = {
      messageSent: (message: Message) => {
        dispatch(messageSent(message));
        scrollToBottom();
      },
      //fix
      messageEdited: (message: Message) => {
        dispatch(messageEdited(message));
        scrollToBottom();
      },
      messageDeleted: (messageId: string) => {
        dispatch(messageDeleted(messageId));
        scrollToBottom();
      },
    };
  }, []);

  useEffect(() => {
    scrollToBottom();
    dispatch(getActiveTeam());
  }, []);

  const handleDeleteMessage = (messageId: string) => {
    dispatch(DeleteMessageAsync(messageId));
    dispatch(liveUpdateMessageDeleted(messageId));
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (activeTeam) {
      dispatch(GetMyProfileAsync(activeTeam.id));
      dispatch(GetTeamConversation(activeTeam.id));
      dispatch(GetTeamConversationMessages(activeTeam.id));
      dispatch(GetTeamProfiles(activeTeam.id));
    }
  }, [activeTeam]);

  useEffect(() => {
    if (teamConversation && activeProfile) {
      dispatch(
        GetConversationParticipant({
          profileId: activeProfile.id,
          conversationId: teamConversation.id,
        })
      );
    }
  }, [teamConversation]);

  const handleSendMessage = () => {
    if (activeParticipant && content.trim() !== "") {
      const message: MessageOutgoing = {
        conversationParticipantId: activeParticipant.id,
        content: content,
        messageId: "",
      };
      dispatch(CreateMessageAsync(message))
        .then((action) => {
          const createdMessage = action.payload;
          if (typeof createdMessage !== "string" && createdMessage) {
            // Skicka det nya meddelandet till SignalR-hubben
            dispatch(liveUpdateMessageSent(createdMessage));
            setContent("");
            scrollToBottom();
          }
        })
        .catch((error) => {
          console.error("Error sending message:", error);
        });
    }
    scrollToBottom();
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleEditMessage();
      setIsEditMode(false);
    }
  };

  const handleSetEditMode = (message: Message) => {
    setIsEditMode(true);
    setMessageIdToEdit(message.id);
    setEditedContent(message.content);
  };

  const handleEditMessage = () => {
    if (editedContent && isEditMode && messageIdToEdit) {
      const message = messages.find((m) => m.id == messageIdToEdit);
      if (message) {
        const messageToEdit: MessageOutgoing = {
          conversationParticipantId: message.conversationParticipantId,
          content: editedContent,
          messageId: message.id,
        };
        dispatch(EditMessageAsync(messageToEdit))
          .then((action) => {
            const editedMessage = action.payload;
            if (typeof editedMessage !== "string" && editedMessage) {
              dispatch(liveUpdateMessageEdited(editedMessage));
              setContent("");
              scrollToBottom();
            }
          })
          .catch((error) => {
            console.error("Error sending message:", error);
          });
      }
    }
  };

  const getProfilesAvatar = (profileId: string) => {
    const profile = profilesInTeam?.find((p) => p.id == profileId);
    if (profile) {
      return profile.avatarUrl;
    }
  };

  // const isMobile = window.innerWidth <= 500;
  const chatColor = theme1.palette.chat.main;
  return (
    <Container
      sx={{
        padding: "20px",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <Card
        className="card-content"
        sx={{
          padding: 2,
          backgroundColor: "#f5f5f5",
          height: "350px",
          flexGrow: 1,
          overflow: "auto",
        }}
      >
        <Typography variant="h6">{activeTeam?.name} - Chat</Typography>
        {Array.isArray(messages) &&
          activeParticipant &&
          messages.map((message) => {
            if (message.id) {
              return (
                <ChatMessage
                  message={message}
                  key={message.id}
                  activeParticipant={activeParticipant}
                  getProfilesAvatar={() => getProfilesAvatar(message.profileId)}
                  handleDeleteMessage={() => handleDeleteMessage(message.id)}
                  handleSetEditMode={() => handleSetEditMode(message)}
                  isEditMode={isEditMode}
                  messageIdToEdit={messageIdToEdit}
                  handleKeyPress={(event) => handleKeyPress(event)}
                  editedContent={editedContent}
                  setEditedContent={setEditedContent}
                />
              );
            }
            return null;
          })}
        <div ref={messagesEndRef} />
      </Card>
      <Container
        sx={{
          display: "flex",
          alignItems: "center",
          marginTop: "10px",
        }}
      >
        <StyledTextField
          fullWidth
          variant="outlined"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          sx={{
            input: {
              color: "black",
              marginRight: "10px",
              borderColor: chatColor,
            },
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSendMessage();
          }}
        />
        <Button
          variant="contained"
          onClick={handleSendMessage}
          sx={{
            backgroundColor: content.trim() != "" ? chatColor : "lightgray",
            marginLeft: 2,
          }}
        >
          <SendIcon sx={{ color: "white" }} />
        </Button>
      </Container>
    </Container>
  );
}
