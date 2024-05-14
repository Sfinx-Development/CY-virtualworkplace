// TodoDialog.jsx
import React from "react";
import {
  Button,
  Card,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

interface TodoDialogProps {
    open: boolean;
    onClose: () => void;
    todoDate: string;
    title: string;
    SetTitle: (title: string) => void;
    description: string;
    setDescription: (description: string) => void;
    handleCreateTodo: () => void;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    selectedDayTodos: any[]; 
    isEditMode: boolean;
    todoIdToEdit: string;
    editedTitle: string;
    setEditedTitle: (title: string) => void;
    editedDate: string;
    setEditedDate: (date: string) => void; // specify the type of date
    editedDescription: string;
    setEditedDescription: (description: string) => void;
    handleDeleteTodo: (id: string) => void;
    handleSetEditMode: (id: string) => void;
    handleEditTodo: () => void;
    handleKeyPress: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  }
  
  const CalendarCellDialog: React.FC<TodoDialogProps> = ({
    open,
    onClose,
    todoDate,
    title,
    SetTitle,
    description,
    setDescription,
    handleCreateTodo,
    selectedDayTodos,
    isEditMode,
    todoIdToEdit,
    editedTitle,
    setEditedTitle,
    editedDate,
    setEditedDate,
    editedDescription,
    setEditedDescription,
    handleDeleteTodo,
    handleSetEditMode,
    handleEditTodo,
    handleKeyPress,
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
            onChange={(e) => SetTitle(e.target.value)}
            variant="outlined"
            fullWidth
          />
          <input
            type="text"
            placeholder="Beskrivning"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
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
        {selectedDayTodos.map((todo) => (
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

export default CalendarCellDialog;
