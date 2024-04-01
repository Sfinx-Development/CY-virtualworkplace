import { Button, Container, TextField, Typography } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../slices/store";
import { createJoinAsync } from "../../slices/teamSlice";
import { theme1 } from "../../theme";

export default function JoinTeam() {
  const [letters, setLetters] = useState(["", "", "", "", "", ""]);
  const textFieldsRef = useRef<Array<HTMLInputElement | null>>([]);
  const [fieldError, setFieldError] = useState(false);
  const [role, setRole] = useState("");
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const primaryColor = theme1.palette.primary.main;

  useEffect(() => {
    if (letters.every((letter) => letter !== "") && role !== "") {
      handleJoinTeam();
    }
  }, [letters]);

  const handleJoinTeam = async () => {
    if (letters.every((letter) => letter !== "") && role !== "") {
      setFieldError(false);
      await dispatch(createJoinAsync({ code: letters.join(""), role: role }));
      navigate("/chooseteam");
    } else {
      setFieldError(true);
    }
  };

  const handleLetterChange = (index: number, value: string) => {
    setLetters((prevLetters) => {
      const updatedLetters = [...prevLetters];
      updatedLetters[index] = value;
      return updatedLetters;
    });

    if (index < textFieldsRef.current.length - 1 && value !== "") {
      textFieldsRef.current[index + 1]?.focus();
    }
  };

  const handleRoleEnterPress = (
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleJoinTeam();
    }
  };

  const handlePaste = (event: React.ClipboardEvent<HTMLDivElement>) => {
    event.preventDefault();
    const pastedText = event.clipboardData.getData("text");
    const newLetters = pastedText.split("").slice(0, letters.length);
    setLetters(newLetters);
  };

  return (
    <Container sx={{ padding: "20px" }}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          marginTop: 20,
        }}
      >
        {fieldError ? (
          <Typography>Alla fält måste vara ifyllda</Typography>
        ) : null}
        <TextField
          variant="outlined"
          label="Din roll i teamet"
          style={{ borderColor: primaryColor, minWidth: "40%" }}
          onChange={(event) => setRole(event.target.value)}
          onKeyDown={handleRoleEnterPress}
        />
        <Typography variant="h6" sx={{ marginTop: 5, textAlign: "center" }}>
          Skriv in den kod som du får från ett befintligt team
        </Typography>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            marginTop: 10,
          }}
          onPaste={handlePaste}
        >
          {letters.map((_, index) => (
            <TextField
              key={index}
              variant="outlined"
              sx={{ width: "10%", margin: "5px", borderColor: "pink" }}
              value={letters[index]}
              onChange={(event) =>
                handleLetterChange(
                  index,
                  (event.target as HTMLInputElement).value
                )
              }
              onKeyDown={(event) => {
                if (
                  event.key === "Backspace" &&
                  (event.target as HTMLInputElement).value === "" &&
                  index > 0
                ) {
                  textFieldsRef.current[index - 1]?.focus();
                }
              }}
              inputRef={(el) => (textFieldsRef.current[index] = el)}
            />
          ))}
        </div>
        <Button
          variant="contained"
          sx={{
            marginTop: 4,
            marginBottom: 1,
            paddingRight: 5,
            paddingLeft: 5,
          }}
          onClick={handleJoinTeam}
        >
          Gå med i Team
        </Button>
      </div>
    </Container>
  );
}
