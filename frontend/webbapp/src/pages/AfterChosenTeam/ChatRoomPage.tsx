import { Button, Card, Container, TextField, Typography } from "@mui/material";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import { MessageInput } from "../../../types";
import {
  CreateMessageAsync,
  GetConversationParticipant,
  GetTeamConversation,
  GetTeamConversationMessages,
} from "../../slices/conversationSlice";
import { GetMyProfileAsync } from "../../slices/profileSlice";
import { useAppDispatch, useAppSelector } from "../../slices/store";
import { getActiveTeam } from "../../slices/teamSlice";
import { theme1 } from "../../theme";

export default function ChatRoom() {
  const dispatch = useAppDispatch();

  const activeTeam = useAppSelector((state) => state.teamSlice.activeTeam);

  const activeProfile = useAppSelector(
    (state) => state.profileSlice.activeProfile
  );

  const messagesFromSlice = useAppSelector(
    (state) => state.conversationSlice.messages
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

  useEffect(() => {
    dispatch(getActiveTeam());
  }, []);

  useEffect(() => {
    if (activeTeam) {
      dispatch(GetMyProfileAsync(activeTeam.id));
      dispatch(GetTeamConversation(activeTeam.id));
      dispatch(GetTeamConversationMessages(activeTeam.id));
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
      const message: MessageInput = {
        conversationParticipantId: activeParticipant.id,
        content: content,
      };
      dispatch(CreateMessageAsync(message));
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
        sx={{
          padding: 2,
          backgroundColor: "transparent",
          border: 2,
          borderColor: chatColor,
          flexGrow: 1,
        }}
      >
        <Typography>{activeTeam?.name} - chatt </Typography>
        {Array.isArray(messages) &&
          activeParticipant &&
          messages.map((message) => (
            <Card
              key={message.id}
              sx={{
                marginTop: 2,
                backgroundColor:
                  message.conversationParticipantId === activeParticipant.id
                    ? "lightgrey"
                    : chatColor,
                display: "flex",
                flexDirection: "column",
                alignItems:
                  message.conversationParticipantId === activeParticipant.id
                    ? "flex-end"
                    : "flex-start",
              }}
            >
              <div style={{ display: "flex", flexDirection: "row" }}>
                <Typography style={{ fontWeight: "bold", fontSize: 12 }}>
                  {message.fullName}
                </Typography>
                <Typography style={{ marginLeft: "8px", fontSize: 12 }}>
                  {formatDate(message.dateCreated)}
                </Typography>
              </div>

              <Typography>{message.content}</Typography>
            </Card>
          ))}
      </Card>
      <Container
        sx={{
          display: "flex",
          alignItems: "center",
          marginTop: "20px",
        }}
      >
        <TextField
          label="Skriv meddelande"
          variant="outlined"
          value={content}
          type="text"
          onChange={(e) => setContent(e.target.value)}
          sx={{ marginRight: "10px" }}
        />
        <Button variant="contained" onClick={handleSendMessage}>
          Skicka
        </Button>
      </Container>
    </Container>
  );
}
