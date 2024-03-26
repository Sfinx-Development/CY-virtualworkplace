import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditIcon from "@mui/icons-material/Edit";
import SendIcon from "@mui/icons-material/Send";
import {
  Avatar,
  Button,
  Card,
  IconButton,
  TextField,
  Typography,
  styled,
} from "@mui/material";
import { format } from "date-fns";
import { useEffect, useRef, useState } from "react";
import { is800Mobile, isMobile } from "../../../globalConstants";
import {
  ConversationParticipant,
  Message,
  MessageOutgoing,
} from "../../../types";
import ChatMessage from "../../components/ChatMessage";
import {
  GetConversationParticipant,
  GetTeamConversation,
  UpdateLastActive,
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
import { GetTeamProfiles, getActiveProfile } from "../../slices/profileSlice";
import { useAppDispatch, useAppSelector } from "../../slices/store";
import { getActiveTeam } from "../../slices/teamSlice";
import { theme1 } from "../../theme";
import ChatConnector from "./ChatConnection";

const StyledTextField = styled(TextField)({
  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      borderColor: "lightgray",
    },
    "&:hover fieldset": {
      borderColor: "lightgray",
    },
    "&.Mui-focused fieldset": {
      borderColor: "lightgray",
    },
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

  const audioRef = useRef<HTMLAudioElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    return () => {
      if (activeParticipant) {
        const updatedParticipant: ConversationParticipant = {
          id: activeParticipant.id,
          profileId: activeParticipant.profileId,
          conversationId: activeParticipant.conversationId,
          lastActive: new Date(),
        };
        dispatch(UpdateLastActive(updatedParticipant));
      }
    };
  }, []);

  useEffect(() => {
    const connection = ChatConnector.getInstance();

    connection.events = {
      messageSent: (message: Message) => {
        dispatch(messageSent(message));
        scrollToBottom();
        if (activeProfile) {
          if (audioRef.current && message.profileId != activeProfile.id) {
            audioRef.current.play();
          }
        }
      },
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
    dispatch(getActiveProfile());
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
      // dispatch(GetMyProfileAsync(activeTeam.id));
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
            // skickar det nya meddelandet till SignalR-hubben
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

  const chatColor = theme1.palette.chat.main;

  function formatDate(dateString: Date) {
    const date = new Date(dateString);
    return format(date, "yyyy-MM-dd HH:mm");
  }

  return (
    <div
      style={{
        padding: isMobile ? 2 : "20px",
        minHeight: "100%",
        display: "flex",
        width: "100%",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-between",
        // background: "linear-gradient(45deg, #333333, #666666)",
        // animation: `${gradientAnimation} 10s ease infinite`,
      }}
    >
      <audio
        ref={audioRef}
        src="/message.mp3"
        style={{ display: "none" }}
        itemType="mp3"
      />
      <Card
        className="card-content"
        sx={{
          padding: 2,
          backgroundColor: "transparent",
          height: is800Mobile ? "650px" : "500px",
          width: "80%",
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
                <div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      marginBottom: 2,
                      justifyContent:
                        message.profileId == activeProfile?.id
                          ? "flex-end"
                          : "flex-start",
                    }}
                  >
                    {message.fullName && (
                      <Avatar
                        src={getProfilesAvatar(message.profileId)}
                        alt={message.fullName}
                        sx={{
                          marginRight: 1,
                          width: isMobile ? 18 : 23,
                          height: isMobile ? 18 : 23,
                        }}
                      />
                    )}
                    <Typography
                      sx={{
                        fontWeight: 600,
                        fontSize: isMobile ? 10 : 13,
                        color: "#666666",
                      }}
                    >
                      {message.fullName}
                    </Typography>
                    <Typography
                      sx={{
                        marginLeft: 1,
                        fontSize: isMobile ? 10 : 13,
                        color: "#666666",
                      }}
                    >
                      {formatDate(message.dateCreated)}
                    </Typography>
                    {message.profileId == activeProfile?.id ? (
                      <div>
                        <IconButton
                          size="small"
                          sx={{ padding: 0, marginLeft: 1 }}
                          onClick={() => handleSetEditMode(message)}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          size="small"
                          sx={{ padding: 0, marginLeft: 1 }}
                          onClick={() => handleDeleteMessage(message.id)}
                        >
                          <DeleteOutlineIcon />
                        </IconButton>
                      </div>
                    ) : null}
                  </div>
                  <ChatMessage
                    message={message}
                    key={message.id}
                    activeParticipant={activeParticipant}
                    getProfilesAvatar={() =>
                      getProfilesAvatar(message.profileId)
                    }
                    handleDeleteMessage={() => handleDeleteMessage(message.id)}
                    handleSetEditMode={() => handleSetEditMode(message)}
                    isEditMode={isEditMode}
                    messageIdToEdit={messageIdToEdit}
                    handleKeyPress={(event) => handleKeyPress(event)}
                    editedContent={editedContent}
                    setEditedContent={setEditedContent}
                  />
                </div>
              );
            }
            return null;
          })}
        <div ref={messagesEndRef} />
      </Card>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          marginTop: "10px",
          width: "80%",
        }}
      >
        <StyledTextField
          fullWidth
          variant="outlined"
          value={content}
          type="text"
          label="Skriv ett meddelande"
          onChange={(e) => setContent(e.target.value)}
          sx={{
            input: {
              color: "black",
              borderColor: chatColor,
              backgroundColor: "white",
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
      </div>
    </div>
  );
}
