import { Container, TextField, Typography } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { useAppDispatch } from "../../slices/store";
import { createJoinAsync } from "../../slices/themeSlice";
import { theme1 } from "../../theme";

export default function JoinTeam() {
  const [letters, setLetters] = useState(["", "", "", "", "", ""]);
  const textFieldsRef = useRef<Array<HTMLInputElement | null>>([]);
  //                                            ^^^^^^^^^^^^^^^^^
  const [role, setRole] = useState("");
  const dispatch = useAppDispatch();

  const primaryColor = theme1.palette.primary.main;

  useEffect(() => {
    if (letters.every((letter) => letter !== "") && role !== "") {
      handleJoinTeam();
    }
  }, [letters]);

  const handleJoinTeam = async () => {
    console.log(letters.join(""));
    await dispatch(createJoinAsync({ code: letters.join(""), role: role }));
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
        <TextField
          variant="outlined"
          label="Din roll i teamet"
          style={{ borderColor: primaryColor, minWidth: "40%" }}
          onChange={(event) => setRole(event.target.value)}
        />
        <Typography variant="h6" sx={{ marginTop: 10 }}>
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
        >
          {letters.map((_, index) => (
            <TextField
              key={index}
              variant="outlined"
              sx={{ width: "10%", margin: "5px" }}
              value={letters[index]}
              onChange={(event) =>
                handleLetterChange(
                  index,
                  (event.target as HTMLInputElement).value
                )
              }
              onKeyDown={(event) => {
                // Gå till föregående textfält om användaren trycker på backspace i ett tomt fält
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
      </div>
    </Container>
  );
}
