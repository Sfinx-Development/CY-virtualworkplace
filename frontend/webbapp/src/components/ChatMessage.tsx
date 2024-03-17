import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditIcon from "@mui/icons-material/Edit";
import { Avatar, Card, IconButton, TextField, Typography } from "@mui/material";
import { format } from "date-fns";
import React from "react";
import { ConversationParticipant, Message } from "../../types";

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
  function formatDate(dateString: Date) {
    const date = new Date(dateString);
    return format(date, "yyyy-MM-dd HH:mm");
  }

  return (
    <Card
      key={props.message.id}
      sx={{
        padding: 2,
        marginBottom: 2,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center" }}>
          {props.message.fullName && (
            <Avatar
              src={props.getProfilesAvatar(props.message.profileId)}
              alt={props.message.fullName}
              sx={{
                marginRight: 1,
                width: isMobile ? 20 : 25,
                height: isMobile ? 20 : 25,
              }}
            />
          )}
          <Typography sx={{ fontWeight: 600, fontSize: isMobile ? 15 : 18 }}>
            {props.message.fullName}
          </Typography>
          <Typography
            sx={{
              marginLeft: 1,
              color: "text.secondary",
              fontSize: isMobile ? 10 : 13,
            }}
          >
            {formatDate(props.message.dateCreated)}
          </Typography>
        </div>
        {props.message.conversationParticipantId ===
          props.activeParticipant.id && (
          <div>
            <IconButton
              size="small"
              onClick={() => props.handleDeleteMessage(props.message.id)}
            >
              <DeleteOutlineIcon />
            </IconButton>
            <IconButton
              size="small"
              onClick={() => props.handleSetEditMode(props.message)}
            >
              <EditIcon />
            </IconButton>
          </div>
        )}
      </div>
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
