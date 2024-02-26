import React from "react";
import { Avatar, Card, IconButton, Typography } from "@mui/material";
import { format } from "date-fns";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditIcon from "@mui/icons-material/Edit";
import { Message, ConversationParticipant } from "../../types";

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
        // backgroundColor:
        //   message.conversationParticipantId === activeParticipant.id
        //     ? "#e6f2ff"
        //     : "#f2f2f2",
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
              sx={{ marginRight: 1 }}
            />
          )}
          <Typography variant="body1" sx={{ fontWeight: 600 }}>
            {props.message.fullName}
          </Typography>
          <Typography
            variant="body2"
            sx={{ marginLeft: 1, color: "text.secondary" }}
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
      <Typography variant="body1" sx={{ marginLeft: 25 }}>
        {props.isEditMode ? (
          <textarea
            value={props.message.content}
            style={{
              width: "100%",
              border: "none",
              background: "inherit",
              resize: "none",
            }}
            readOnly
          />
        ) : (
          props.message.content
        )}
      </Typography>
    </Card>
  );
}
