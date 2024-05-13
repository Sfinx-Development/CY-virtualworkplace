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
import { Todo } from "../../../types";

interface TodoDialogAsideProps {
  open: boolean;
  onClose: () => void;
  todos: Todo[];
  handleDeleteTodo: (todoId: string) => void;
  handleSetEditMode: (todoId: string) => void;
  isEditMode: boolean;
  todoIdToEdit: string;
  editedTitle: string;
  setEditedTitle: (title: string) => void;
  editedDate: string;
  setEditedDate: (date: string) => void;
  editedDescription: string;
  setEditedDescription: (description: string) => void;
  handleKeyPress: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  handleEditTodo: () => void;
  openDialog: boolean; // Här inkluderar vi openDialog-propertien
  setOpenDialog: (open: boolean) => void; // Här inkluderar vi setOpenDialog-funktionen
}

const TodoDialogAside: React.FC<TodoDialogAsideProps> = ({
  open,
  onClose,
  todos,
  handleDeleteTodo,
  handleSetEditMode,
  isEditMode,
  todoIdToEdit,
  editedTitle,
  setEditedTitle,
  editedDate,
  setEditedDate,
  editedDescription,
  setEditedDescription,
  handleKeyPress,
  handleEditTodo,
  openDialog, // Här tar vi emot openDialog som en prop
  setOpenDialog, // Här tar vi emot setOpenDialog som en prop
}) => {
  return (
    <Dialog open={open || openDialog} onClose={onClose}>
      <DialogTitle>Uppgifter/Påminnelser</DialogTitle>
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
                label="Title"
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

            {isEditMode && todo.id === todoIdToEdit ? (
              <TextField
                label="Description"
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
        <Button onClick={() => setOpenDialog(false)}>Stäng</Button>
      </DialogActions>
    </Dialog>
  );
};

export default TodoDialogAside;
