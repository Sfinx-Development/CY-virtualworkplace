import React from "react";
import {
  Button,
  Card,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

const TodoDialog = ({
  open,
  onClose,
  title,
  description,
  todoDate,
  todos,
  handleCreateTodo,
  handleEditTodo,
  handleDeleteTodo,
  isEditMode,
  setEditedTitle,
  setEditedDescription,
  setEditedDate,
  editedTitle,
  editedDescription,
  editedDate,
  todoIdToEdit,
  handleKeyPress,
  handleSetEditMode,
}) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Dagens Uppgifter/Påminnelser</DialogTitle>
      <div style={{ display: "flex", alignItems: "center" }}>
        <DialogTitle style={{ fontSize: "14px", marginTop: "-30px" }}>
          Ny todo
        </DialogTitle>
        <Typography style={{ fontSize: "14px", marginTop: "-30px" }} variant="body1">
          {todoDate}
        </Typography>
      </div>

      <DialogContent style={{ height: "250px" }}>
        <div
          style={{
            border: "1px solid #ccc",
            padding: "10px",
            borderRadius: "4px",
            display: "flex",
            flexDirection: "column",
            gap: "10px",
          }}
        >
          <TextField
            label="Titel"
            type="text"
            value={title}
            onChange={(e) => setEditedTitle(e.target.value)}
            variant="outlined"
            fullWidth
          />
          <input
            type="text"
            placeholder="Beskrivning"
            value={description}
            onChange={(e) => setEditedDescription(e.target.value)}
            style={{
              borderRadius: "4px",
              height: "60px",
              resize: "none",
              padding: "8px",
              fontSize: "14px",
              border: "1px solid #ccc",
            }}
          />
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCreateTodo}>Skapa</Button>
      </DialogActions>

      <DialogContent dividers>
        {todos.map((todo) => (
          <Card
            key={todo.id}
            style={{
              marginBottom: "10px",
              padding: "10px",
              backgroundColor: "lightgrey",
            }}
          >
            {isEditMode && todoIdToEdit === todo.id ? (
              <TextField
                value={editedTitle}
                onChange={(e) => setEditedTitle(e.target.value)}
                type="text"
                fullWidth
                variant="outlined"
                onKeyDown={handleKeyPress}
              />
            ) : (
              <Typography variant="subtitle1">{todo.title}</Typography>
            )}
            {isEditMode && todo.id === todoIdToEdit ? (
              <TextField
                label="Date"
                type="datetime-local"
                value={editedDate}
                onChange={(e) => setEditedDate(e.target.value)}
                variant="outlined"
                sx={{ width: "250px", marginTop: 2 }}
                onKeyDown={handleKeyPress}
              />
            ) : (
              <Typography variant="body2">{todo.date.toString()}</Typography>
            )}
            {isEditMode && todoIdToEdit === todo.id ? (
              <TextField
                value={editedDescription}
                onChange={(e) => setEditedDescription(e.target.value)}
                type="text"
                fullWidth
                variant="outlined"
                onKeyDown={handleKeyPress}
              />
            ) : (
              <Typography variant="subtitle1">{todo.description}</Typography>
            )}

            <div>
              <IconButton onClick={() => handleDeleteTodo(todo.id)}>
                <DeleteIcon />
              </IconButton>
              <IconButton
                size="small"
                onClick={() => handleSetEditMode(todo.id)}
              >
                <EditIcon />
              </IconButton>
              {isEditMode && todo.id === todoIdToEdit && (
                <Button onClick={handleEditTodo}>Spara ändringar</Button>
              )}
            </div>
          </Card>
        ))}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Stäng</Button>
      </DialogActions>
    </Dialog>
  );
};

export default TodoAside;
