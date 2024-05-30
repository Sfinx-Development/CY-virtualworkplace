import { Button, TextField, Typography } from "@mui/material";
import React from "react";
import { theme1 } from "../../theme";

interface TodoFormProps {
  title: string;
  setTitle: React.Dispatch<React.SetStateAction<string>>;
  description: string;
  setDescription: React.Dispatch<React.SetStateAction<string>>;
  todoDate: string;
  setTodoDate: React.Dispatch<React.SetStateAction<string>>;
  handleCreateTodo: () => void;
  fieldError: boolean;
}

const TodoAside: React.FC<TodoFormProps> = ({
  title,
  setTitle,
  description,
  setDescription,
  todoDate,
  setTodoDate,
  handleCreateTodo,
  fieldError,
}) => {
  return (
    <div>
      <TextField
        label="Titel"
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        variant="outlined"
        sx={{
          backgroundColor: "white",
          borderRadius: "4px",
          marginTop: "10px",
        }}
      />

      <div>
        <TextField
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          variant="outlined"
          type="text"
          placeholder="Beskrivning"
          multiline
          maxRows={4}
          sx={{
            width: "250px",
            marginTop: 2,
            resize: "none",
            backgroundColor: "white",
            overflow: "hidden",
          }}
        />

        <div
          className="date-submit-div"
          style={{
            width: "260px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <TextField
            label="Slutdatum"
            type="datetime-local"
            value={todoDate}
            onChange={(e) => setTodoDate(e.target.value)}
            variant="outlined"
            sx={{
              width: "250px",
              backgroundColor: "white",
              marginTop: 2,
              "& label": {
                color: "transparent",
              },
              "&:focus label": {
                color: "initial",
              },
            }}
          />
          <Button
            onClick={handleCreateTodo}
            style={{
              display: "flex",
              alignItems: "center",
              padding: "10px 30px",
              backgroundColor: theme1.palette.success.main,
              color: "white",
              border: "none",
              borderRadius: "4px",
              textAlign: "center",
              textDecoration: "none",
              fontSize: "16px",
              cursor: "pointer",
              marginLeft: "30px",
              marginTop: "15px",
              transition: "background-color 0.3s",
            }}
          >
            Skapa
          </Button>
        </div>

        {fieldError && (
          <Typography color="error">Alla fält måste fyllas i</Typography>
        )}
      </div>
    </div>
  );
};

export default TodoAside;