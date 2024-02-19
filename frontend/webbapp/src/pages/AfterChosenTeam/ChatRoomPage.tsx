import { Button, Card, Container, TextField, Typography } from "@mui/material";
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

  const handleSetEditMode = (message: Message) => {
    setIsEditMode(true);
    setMessageIdToEdit(message.id);
    setEditedContent(message.content);
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
            <ChatMessage
              message={message}
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
          ))}
        <div ref={messagesEndRef} />
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
