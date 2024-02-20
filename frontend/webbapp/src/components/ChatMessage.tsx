import { Avatar, Card, IconButton, TextField, Typography } from "@mui/material";
import { format } from "date-fns";
import { ConversationParticipant, Message } from "../../types";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditIcon from "@mui/icons-material/Edit";

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
        padding: 1.5,
        marginTop: 1,
        backgroundColor:
          props.message.conversationParticipantId === props.activeParticipant.id
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
          {props.message.fullName && (
            <Typography
              style={{
                display: "flex",
                flexDirection: "row",
                fontWeight: "bold",
                fontSize: 14,
              }}
            >
              <Avatar
                src={props.getProfilesAvatar(props.message.profileId)}
                sx={{ height: 20, width: 20, marginRight: 1 }}
              />

              {props.message.fullName}
            </Typography>
          )}
          <Typography style={{ marginLeft: "8px", fontSize: 12 }}>
            {formatDate(props.message.dateCreated)}
          </Typography>
        </div>

        {props.message.conversationParticipantId ===
        props.activeParticipant.id ? (
          <div
            style={{
              display: "flex",
              flexDirection: "row",
            }}
          >
            <IconButton
              sx={{ color: "black", padding: 0, marginRight: 0.5 }}
              onClick={() => {
                props.handleDeleteMessage(props.message.id);
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
                props.handleSetEditMode(props.message);
              }}
            >
              <EditIcon sx={{ padding: 0, fontSize: 20 }} />
            </IconButton>
          </div>
        ) : null}
      </div>
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
        <Typography style={{ fontSize: 14, marginLeft: 25 }}>
          {props.message.content}
        </Typography>
      )}
    </Card>
  );
}
