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
          props.message.profileId == activeProfile?.id ? "#f4f4f4" : "white",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between" }}></div>
      <Typography
        variant="body1"
        sx={{
          marginLeft: isMobile ? 15 : 25,
          fontSize: isMobile ? 13 : 16,
          pb: 2,
        }}
      >
        {props.isEditMode && props.messageIdToEdit == props.message.id ? (
          <TextField
            value={props.editedContent}
            onChange={(e) => props.setEditedContent(e.target.value)}
            type="text"
            fullWidth
            variant="outlined"
            onKeyDown={props.handleKeyPress}
            sx={{
              "& .MuiInputLabel-outlined": {
                color: "#666666",
              },
              "&.Mui-focused": {
                color: "#666666",
              },
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
            }}
          />
        ) : (
          props.message.content
        )}
      </Typography>
    </Card>
  );
}
