import { Card, TextField, Typography } from "@mui/material";
import React from "react";
import { isMobile } from "../../globalConstants";
import { ConversationParticipant, Message } from "../../types";
import { useAppSelector } from "../slices/store";

interface ChatMessageProps {
  message: Message;
  activeParticipant: ConversationParticipant;
  getProfilesAvatar: (profileId: string) => string | undefined;
  handleDeleteMessage: (messageId: string) => void;
  handleSetEditMode: (message: Message) => void;
  isEditMode: boolean;
  messageIdToEdit: string | undefined;
  handleKeyPress: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  editedContent: string;
  setEditedContent: React.Dispatch<React.SetStateAction<string>>;
}

export default function ChatMessage(props: ChatMessageProps) {
  const activeProfile = useAppSelector(
    (state) => state.profileSlice.activeProfile
  );
  return (
    <Card
      key={props.message.id}
      sx={{
        padding: 2,
        marginBottom: 2,
        display: "flex",
        flexDirection: "column",
        backgroundColor:
          props.message.profileId == activeProfile?.id ? "#F9F3FF" : "white",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between" }}></div>
      <Typography
        variant="body1"
        sx={{ marginLeft: isMobile ? 5 : 25, fontSize: isMobile ? 13 : 16 }}
      >
        {props.isEditMode && props.messageIdToEdit == props.message.id ? (
          <TextField
            value={props.editedContent}
            onChange={(e) => props.setEditedContent(e.target.value)}
            type="text"
            fullWidth
            variant="outlined"
            onKeyDown={props.handleKeyPress}
          />
        ) : (
          props.message.content
        )}
      </Typography>
    </Card>
  );
}
