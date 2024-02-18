import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditIcon from "@mui/icons-material/Edit";
import {
  Avatar,
  Button,
  Card,
  Container,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import { format } from "date-fns";
import { useEffect, useRef, useState } from "react";
import { MessageOutgoing } from "../../../types";
import {
  GetConversationParticipant,
  GetTeamConversation,
} from "../../slices/conversationSlice";
import {
  CreateMessageAsync,
  DeleteMessageAsync,
  EditMessageAsync,
  GetTeamConversationMessages,
} from "../../slices/messageSlice";
import { GetMyProfileAsync, GetTeamProfiles } from "../../slices/profileSlice";
import { useAppDispatch, useAppSelector } from "../../slices/store";
import { getActiveTeam } from "../../slices/teamSlice";
import { theme1 } from "../../theme";

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

  useEffect(() => {
    scrollToBottom();
    dispatch(getActiveTeam());
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleDeleteMessage = (messageId: string) => {
    console.log("MESSAGE ID ÄR: ", messageId);
    dispatch(DeleteMessageAsync(messageId));
  };

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
    //just det hur hantera här?!1
    if (activeParticipant && content != "") {
      console.log("PARTICIPANTID: ", activeParticipant.id);
      const message: MessageOutgoing = {
        conversationParticipantId: activeParticipant.id,
        content: content,
        messageId: "",
      };
      dispatch(CreateMessageAsync(message));
      setContent("");
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleEditMessage();
      setIsEditMode(false);
    }
  };

  const handleEditMessage = () => {
    if (editedContent && isEditMode && messageIdToEdit) {
      console.log("REDIGAR TILLLLL: ", editedContent);
      //dispatcha edit message och stopppa in messageidtoedit samt editedcontent
      const message = messages.find((m) => m.id == messageIdToEdit);
      if (message) {
        const messageToEdit: MessageOutgoing = {
          conversationParticipantId: message.conversationParticipantId,
          content: editedContent,
          messageId: message.id,
        };
        dispatch(EditMessageAsync(messageToEdit));
      }
    }
  };

  const getProfilesAvatar = (profileId: string) => {
    const profile = profilesInTeam?.find((p) => p.id == profileId);
    if (profile) {
      return profile.avatarUrl;
    }
  };
  function formatDate(dateString: Date) {
    const date = new Date(dateString);
    return format(date, "yyyy-MM-dd HH:mm");
  }

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
          backgroundColor: "transparent",
          border: 2,
          borderColor: "lightgrey",
          flexGrow: 1,
          height: "350px",
          overflow: "auto",
        }}
      >
        <Typography>{activeTeam?.name} - chatt </Typography>
        {Array.isArray(messages) &&
          activeParticipant &&
          messages.map((message) => (
            <Card
              key={message.id}
              sx={{
                padding: 1.5,
                marginTop: 1,
                backgroundColor:
                  message.conversationParticipantId === activeParticipant.id
                    ? "rgba(200, 200, 200, 0.4)"
                    : "rgba(243, 228, 250, 0.4)",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                  }}
                >
                  {message.fullName && (
                    <Typography
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        fontWeight: "bold",
                        fontSize: 14,
                      }}
                    >
                      <Avatar
                        src={getProfilesAvatar(message.profileId)}
                        sx={{ height: 20, width: 20, marginRight: 1 }}
                      />

                      {message.fullName}
                    </Typography>
                  )}
                  <Typography style={{ marginLeft: "8px", fontSize: 12 }}>
                    {formatDate(message.dateCreated)}
                  </Typography>
                </div>

                {message.conversationParticipantId === activeParticipant.id ? (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                    }}
                  >
                    <IconButton
                      sx={{ color: "black", padding: 0, marginRight: 0.5 }}
                      onClick={() => {
                        handleDeleteMessage(message.id);
                      }}
                    >
                      <DeleteOutlineIcon sx={{ padding: 0, fontSize: 20 }} />
                    </IconButton>
                    <IconButton
                      sx={{
                        color: "black",
                        padding: 0,
                      }}
                      onClick={() => {
                        setIsEditMode(true);
                        setMessageIdToEdit(message.id);
                        setEditedContent(message.content);
                      }}
                    >
                      <EditIcon sx={{ padding: 0, fontSize: 20 }} />
                    </IconButton>
                  </div>
                ) : null}
              </div>
              {isEditMode && messageIdToEdit == message.id ? (
                <TextField
                  value={editedContent}
                  onChange={(e) => setEditedContent(e.target.value)}
                  type="text"
                  fullWidth
                  variant="outlined"
                  onKeyDown={handleKeyPress}
                />
              ) : (
                <Typography style={{ fontSize: 14, marginLeft: 25 }}>
                  {message.content}
                </Typography>
              )}

              <div ref={messagesEndRef} />
            </Card>
          ))}
        <Container
          sx={{
            display: "flex",
            alignItems: "center",
            marginTop: "10px",
            flex: 1,
          }}
        >
          <TextField
            label="Skriv meddelande"
            fullWidth
            variant="outlined"
            value={content}
            type="text"
            onChange={(e) => setContent(e.target.value)}
            sx={{ marginRight: "10px" }}
            onKeyDown={(e) => {
              if (e.key == "Enter") {
                e.preventDefault();
                handleSendMessage();
              }
            }}
          />
          <Button
            variant="contained"
            sx={{ backgroundColor: chatColor }}
            onClick={handleSendMessage}
          >
            Skicka
          </Button>
        </Container>
      </Card>
    </Container>
  );
}
