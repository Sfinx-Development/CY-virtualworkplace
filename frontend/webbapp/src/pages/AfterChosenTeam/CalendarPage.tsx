/* eslint-disable @typescript-eslint/no-unused-vars */
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import React, { useEffect, useState } from "react";

import {
  Button,
  Card,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import { isMobile } from "../../../globalConstants";
import { Todo } from "../../../types";
import { GetMyProfileAsync, GetTeamProfiles } from "../../slices/profileSlice";
import { useAppDispatch, useAppSelector } from "../../slices/store";
import { getActiveTeam } from "../../slices/teamSlice";
import {
  DeleteTodoAsync,
  EditTodoAsync,
  createTeamTodoAsync,
  getTodoAsync,
} from "../../slices/todoSlice";

interface Holiday {
  helgdag: string;
  datum: string;
}

export default function CalendarPage() {
  // const [selectedDate, setSelectedDate] = useState(null);
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth());
  const [day] = useState(new Date().getDay());
  const [holidays, setHolidays] = useState<Holiday[]>([]);
  const [currentTime, setCurrentTime] = useState(new Date());

  const [title, SetTitle] = useState("");
  const [description, setDescription] = useState("");
  const [todoDate, setTodoDate] = useState("");
  const [fieldError, setFieldError] = useState(false);

  const [openDialog, setOpenDialog] = useState(false);

  const [openTodoPopup, setOpenTodoPopup] = useState(false);
  const [selectedDayTodos, setSelectedDayTodos] = useState<Todo[]>([]);

  const [isEditMode, setIsEditMode] = useState(false);
  const [todoIdToEdit, setTodoIdToEdit] = useState("");
  const [editedTitle, setEditedTitle] = useState("");
  const [editedDescription, setEditedDescription] = useState("");
  const [editedDate, setEditedDate] = useState("");

  const dispatch = useAppDispatch();
  const activeTeam = useAppSelector((state) => state.teamSlice.activeTeam);

  const profilesInTeam = useAppSelector((state) => state.profileSlice.profiles);

  const activeProfile = useAppSelector(
    (state) => state.profileSlice.activeProfile
  );

  const todosInTeam = useAppSelector((state) => state.todoSlice.todos);

  useEffect(() => {
    dispatch(getActiveTeam());
  }, []);

  useEffect(() => {
    if (activeTeam) {
      dispatch(GetMyProfileAsync(activeTeam?.id));
      dispatch(GetTeamProfiles(activeTeam?.id));
      dispatch(getTodoAsync(activeTeam.id));
    }
  }, [dispatch, activeTeam]);

  useEffect(() => {
    initCalendar();
    const timerID = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timerID);
  }, []);

  useEffect(() => {
    initCalendar();
  }, [month, year]);

  const handleEditTodo = () => {
    if (todoIdToEdit && isEditMode) {
      const todoToUpdate = todosInTeam?.find(
        (t: { id: string }) => t.id == todoIdToEdit
      );
      if (todoToUpdate) {
        // Använd Date.parse() för att tolka datumsträngen i lokala tidszonen
        const parsedDate = Date.parse(editedDate);

        if (!isNaN(parsedDate)) {
          const updatedTodo: Todo = {
            ...todoToUpdate,
            title: editedTitle,
            description: editedDescription,
            date: new Date(parsedDate),
          };
          dispatch(EditTodoAsync(updatedTodo));
          setIsEditMode(false);
        } else {
          console.error("Ogiltig datumsträng");
        }
      }
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleEditTodo();
      setIsEditMode(false);
    }
  };

  const handleSetEditMode = (todoId: string) => {
    if (todosInTeam) {
      const todoToEdit = todosInTeam.find(
        (t: { id: string }) => t.id == todoId
      );
      if (todoToEdit) {
        setIsEditMode(true);
        setEditedTitle(todoToEdit?.title);
        setEditedDescription(todoToEdit?.description);
        const localDate = new Date(todoToEdit.date).toLocaleString("sv-SE", {
          timeZone: "Europe/Stockholm",
        });
        setEditedDate(localDate);
        setTodoIdToEdit(todoToEdit.id);
      }
    }
  };

  const handleDeleteTodo = async (todoId: string) => {
    try {
      await dispatch(DeleteTodoAsync(todoId));

      if (todosInTeam) {
        const updatedTodosInTeam = todosInTeam.filter(
          (todo) => todo.id !== todoId
        );
        setTodos(updatedTodosInTeam);

        const updatedSelectedDayTodos = selectedDayTodos.filter(
          (todo) => todo.id !== todoId
        );
        setSelectedDayTodos(updatedSelectedDayTodos);
      }
    } catch (error) {
      console.error("Error deleting todo:", error);
    }
  };

  const handleDayClick = (day: string) => {
    if (todosInTeam) {
      const todosForDay = todosInTeam.filter((todo) => {
        const todoDate = new Date(todo.date);
        return (
          todoDate.getDate() === parseInt(day) &&
          todoDate.getMonth() === month &&
          todoDate.getFullYear() === year
        );
      });
      // Uppdatera state med de valda todos
      setSelectedDayTodos(todosForDay);
      // Öppna den nya pop-upen
      setOpenTodoPopup(true);
    }
  };

  const [todosen, setTodos] = useState<Todo[]>([]);

  const handleGetTodos = async () => {
    try {
      // const actionResult = await dispatch(getTodoAsync(activeTeam.id));
      // const todos = unwrapResult(actionResult); // Extract the actual data from the action result
      if (todosInTeam) {
        setTodos(todosInTeam);
        setOpenDialog(true);
      }
    } catch (error) {
      console.error("Error fetching todos:", error);
    }
  };

  const handleCreateTodo = async () => {
    if (!description || !todoDate) {
      setFieldError(true);
      return;
    }

    // const teamId = activeTeam ? activeTeam.payload. : "";
    const parsedStartDate = new Date(todoDate);

    const newTodo: Todo = {
      id: "", // Assign id when received from backend
      description: description,
      title: title,
      date: parsedStartDate,
      teamId: activeTeam?.id,
    };

    await dispatch(createTeamTodoAsync(newTodo));

    SetTitle("");
    setDescription("");
    setTodoDate("");
  };

  async function getHolidays(year: number, month: number): Promise<Holiday[]> {
    const apiUrl = `https://sholiday.faboul.se/dagar/v2.1/${year}/${month}`;
    try {
      const response = await fetch(apiUrl);
      const data = await response.json();

      const holidays = data.dagar
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .filter((d: any) => d.helgdag)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .map((d: any) => ({
          helgdag: d.helgdag,
          datum: d.datum,
        }));

      return holidays;
    } catch (error) {
      return [];
    }
  }

  async function initCalendar() {
    // Hantera knapptryck för att byta månad
    const prevMonthButton = document.querySelector("[data-cy='prev-month']");
    const nextMonthButton = document.querySelector("[data-cy='next-month']");

    prevMonthButton?.addEventListener("click", function () {
      changeMonth(-1);
    });

    nextMonthButton?.addEventListener("click", function () {
      changeMonth(1);
    });

    const newHolidays = await getHolidays(year, month + 1);
    setHolidays(newHolidays);
  }

  const weekDays = [
    "Måndag",
    "Tisdag",
    "Onsdag",
    "Torsdag",
    "Fredag",
    "Lördag",
    "Söndag",
  ];

  async function changeMonth(change: number) {
    const newDate = new Date(year, month + change, 1);
    const newMonth = newDate.getMonth();
    const newYear = newDate.getFullYear();
    setMonth(newMonth);
    setYear(newYear);

    const newHolidays = await getHolidays(newYear, newMonth + 1);
    setHolidays(newHolidays);
  }

  //uppdaterar kalender celler
  function generateCalendarRows(_holidays: unknown[]) {
    const firstDayOfMonth = new Date(year, month, 0);
    const lastDayOfMonth = new Date(year, month + 1, 0);
    const numDaysInMonth = lastDayOfMonth.getDate();
    const firstDayOfWeek = firstDayOfMonth.getDay();

    const calendarRows: Array<Array<string | null>> = [[]];
    let currentRow = 0;

    // Fyller i tomma celler för dagar innan månadens första dag
    for (let i = 0; i < firstDayOfWeek; i++) {
      calendarRows[currentRow].push(null);
    }

    // Lägger till dagarna i kalenderraderna
    for (let i = 1; i <= numDaysInMonth; i++) {
      if (calendarRows[currentRow].length === 7) {
        currentRow++;
        calendarRows.push([]);
      }
      calendarRows[currentRow].push(i.toString());
    }

    // Fyller på med tomma celler för resten av sista veckan
    while (calendarRows[currentRow].length < 6) {
      calendarRows[currentRow].push(null);
    }

    return calendarRows;
  }

  function updateCalendarMonthLabel() {
    const date = new Date(year, month, 1);
    const monthString = date.toLocaleString("default", { month: "long" });
    return capitalizeFirstLetter(monthString) + " " + year;
  }

  function capitalizeFirstLetter(string: string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  function handlePrevMonth() {
    changeMonth(-1);
  }

  function handleNextMonth() {
    changeMonth(1);
  }

  function isToday(year: number, month: number, day: number): boolean {
    const today = new Date();
    return (
      today.getFullYear() === year &&
      today.getMonth() === month &&
      today.getDate() === day
    );
  }

  return (
    <Container
      style={{
        height: "100vh",
        width: "100%",
        display: "flex",
        flexDirection: "row",
        backgroundColor: "rgb(214, 196, 203)",
      }}
    >
      {isMobile ? null : (
        <aside
          style={{
            zIndex: 1,
            marginLeft: "20px",
            marginRight: "20px",
            backgroundColor: "rgb(211, 145, 158)",
            opacity: 0.8,
            display: "flex",
            flexDirection: "column",
            position: "relative",
            top: 0,
            left: 0,
            height: "100%",
            width: "350px",
          }}
        >
          <Typography
            variant="h5"
            style={{
              textAlign: "center",
              marginTop: "40px",
              fontFamily: "Arial, sans-serif",
              fontWeight: "bold",
              letterSpacing: "2px",
            }}
          >
            {activeTeam?.name} Kalender
          </Typography>
          <div className="today-aside" style={{ textAlign: "center" }}>
            <Typography
              variant="h6"
              style={{ fontWeight: "bold", marginTop: "10px" }}
            >
              Dagens Datum
            </Typography>
            <Typography style={{ marginBottom: "5px" }}>
              {currentTime.toLocaleTimeString()}
            </Typography>
            <Typography style={{ marginBottom: "5px" }}>
              {currentTime.toLocaleDateString()}
            </Typography>
            <Typography style={{ marginBottom: "25px" }}>
              {currentTime.toLocaleDateString("sv-SE", { weekday: "long" })}
            </Typography>
          </div>
          <div
            className="todo-aside"
            style={{
              backgroundColor: "rgb(211, 145, 158)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Button
              id="add-todo-btn"
              variant="outlined"
              style={{
                backgroundColor: "rgb(171, 92, 121)",
                padding: "4px",
                color: "rgb(255, 255, 255)",
                border: "none",
                borderRadius: "2px",
                height: "50px",
                width: "280px",
                letterSpacing: "2px",
                fontSize: "14px",
                fontFamily: '"Helvetica", Arial, sans-serif',
                display: "flex",
                alignItems: "center",
                justifyContent: "space-around",
                position: "relative",
                overflow: "hidden",
                transition: "width 0.3s ease",
              }}
            >
              Lägg till todo i kalender
            </Button>
            <TextField
              label="Enter todo titel"
              type="text"
              value={title}
              onChange={(e) => SetTitle(e.target.value)}
              variant="outlined"
              sx={{
                backgroundColor: "white",
                borderRadius: "4px",
                marginTop: "10px",
              }}
            />

            <div>
              <input
                type="text"
                placeholder="Enter todo description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                style={{
                  borderRadius: "4px",
                  marginTop: "20px",
                  marginLeft: "20px",
                  height: "80px",
                  width: "240px",
                  resize: "none",
                  padding: "8px",
                  fontSize: "14px",
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
                    marginTop: 2,
                    "& label": {
                      color: "transparent",
                    },
                    "&:focus label": {
                      color: "initial",
                    },
                  }}
                />
                <Button onClick={handleCreateTodo}>Ny Todo</Button>
              </div>

              {fieldError && (
                <Typography color="error">Alla fält måste fyllas i</Typography>
              )}
            </div>
          </div>

          <div id="todo-list-div" className="alltodos-div">
            <div
              className="my-todos-div"
              style={{
                backgroundColor: "rgb(211, 145, 158)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Dialog
                open={openTodoPopup}
                onClose={() => setOpenTodoPopup(false)}
              >
                <DialogTitle>Dagens todo</DialogTitle>
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
                        <Typography variant="subtitle1">
                          {todo.title}
                        </Typography>
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
                        <Typography variant="body2">
                          {todo.date.toString()}
                        </Typography>
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
                        <Typography variant="subtitle1">
                          {todo.description}
                        </Typography>
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
                          <Button onClick={handleEditTodo}>
                            Spara ändringar
                          </Button>
                        )}
                      </div>
                    </Card>
                  ))}
                </DialogContent>
                <DialogActions>
                  <Button onClick={() => setOpenTodoPopup(false)}>Stäng</Button>
                </DialogActions>
              </Dialog>

              <Button
                id="show-todos-btn"
                variant="outlined"
                style={{
                  color: "white",
                  border: "none",
                  borderRadius: "2px",
                  backgroundColor: "rgb(171, 92, 121)",

                  top: "15px",
                  height: "50px",
                  width: "280px",
                  letterSpacing: "2px",
                  fontSize: "14px",
                  fontFamily: '"Helvetica", Arial, sans-serif',
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  position: "relative",
                  overflow: "hidden",
                  transition: "width 0.3s ease",
                }}
                onClick={handleGetTodos}
              >
                Teamets Todos
              </Button>

              <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
                <DialogTitle>Teamets Todos</DialogTitle>
                <DialogContent dividers>
                  {todosInTeam?.map((todo) => (
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
                        <Typography variant="subtitle1">
                          {todo.title}
                        </Typography>
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
                        <Typography variant="body2">
                          {todo.date.toString()}
                        </Typography>
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
                        <Typography variant="subtitle1">
                          {todo.description}
                        </Typography>
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
                          <Button onClick={handleEditTodo}>
                            Spara ändringar
                          </Button>
                        )}
                      </div>
                    </Card>
                  ))}
                </DialogContent>
                <DialogActions>
                  <Button onClick={() => setOpenDialog(false)}>Stäng</Button>
                </DialogActions>
              </Dialog>

              <Button id="read-todos-btn" aria-label="headphone icon">
                <i className="fa-solid fa-headphones" id="headphone-icon"></i>
              </Button>
            </div>
            <div
              className="todo-list"
              style={{
                fontFamily: '"Helvetica", Arial, sans-serif',
                display: "flex",
                flexDirection: "row",
                flexWrap: "wrap",
                maxWidth: "350px",
                overflowX: "auto",
              }}
            >
              <ul id="todo-list" className="todo-reveal-list"></ul>
            </div>
          </div>
        </aside>
      )}

      <main
        style={{
          flex: 1,
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <header>
          <div
            id="header-items"
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              width: "100%",
              marginTop: "10px",
            }}
          >
            <span
              title="Föregående månad"
              onClick={handlePrevMonth}
              style={{
                cursor: "pointer",
                fontSize: "32px",
                color: "black",
                marginRight: "20px",
              }}
            >
              &lt;
            </span>

            <Typography
              variant="h6"
              id="month-year"
              style={{
                margin: "10px",
                fontFamily: "Arial, sans-serif",
                fontWeight: "bold",
                color: "#000",
              }}
            >
              {updateCalendarMonthLabel()}
            </Typography>

            <span
              title="Nästa månad"
              onClick={handleNextMonth}
              style={{
                cursor: "pointer",
                fontSize: "32px",
                color: "black",
                marginLeft: "20px",
              }}
            >
              &gt;
            </span>
          </div>
        </header>
        <table id="calendar-table">
          <thead>
            <tr>
              {weekDays.map((day, index) => (
                <th
                  key={index}
                  style={{
                    color: index === 6 ? "rgb(182, 36, 36)" : "inherit",
                  }}
                >
                  {day}
                </th>
              ))}
            </tr>
          </thead>
          <tbody id="calendar-body-id">
            {generateCalendarRows(holidays).map((row, rowIndex) => (
              <tr key={rowIndex}>
                {row.map((day, dayIndex) => {
                  const holidayName = holidays.find(
                    (holiday) =>
                      parseInt(holiday.datum.split("-")[2]) === parseInt(day)
                  )?.helgdag;

                  const isSunday = dayIndex === 6;
                  const isTodayCell = isToday(year, month, parseInt(day));

                  const sundayCellStyle = {
                    color: isSunday ? "rgb(182, 36, 36)" : "black",
                  };

                  const cellHoverStyle = {
                    backgroundColor: "rgb(214, 196, 203)",
                  };

                  const todoCount = todosInTeam?.filter((todo) => {
                    const todoDate = new Date(todo.date);
                    const todoDay = todoDate.getDate();
                    const todoMonth = todoDate.getMonth();
                    const todoYear = todoDate.getFullYear();
                    return (
                      todoDay === parseInt(day) &&
                      todoMonth === month &&
                      todoYear === year
                    );
                  }).length;

                  return (
                    <td
                      key={dayIndex}
                      onClick={() => handleDayClick(day)}
                      style={{
                        border: "1px solid black",
                        padding: "2.8vw 2.8vw",
                        gridColumn: "span",
                        cursor: "pointer",
                        position: "relative",
                        color: isSunday ? "red" : holidayName ? "red" : "black",
                        whiteSpace: "nowrap",
                        backgroundColor: isTodayCell
                          ? "grey"
                          : "rgb(214, 196, 203)",
                        transition: "background-color 0.3s",
                      }}
                      onMouseEnter={(e) => {
                        if (!isTodayCell) {
                          e.currentTarget.style.backgroundColor = "white";
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isTodayCell) {
                          e.currentTarget.style.backgroundColor =
                            "rgb(214, 196, 203)";
                        }
                      }}
                    >
                      {day}
                      {holidayName && (
                        <div
                          style={{
                            fontSize: "9px",

                            whiteSpace: "nowrap",
                            backgroundColor: "white",
                            overflowWrap: "break-word",
                            position: "absolute",
                            bottom: 0,
                            left: 0,
                            right: 0,
                            textAlign: "center",
                            color: "rgb(215, 142, 142)",
                            opacity: 0.6,
                            padding: "2px",
                          }}
                        >
                          {holidayName}
                        </div>
                      )}
                      {todoCount > 0 && (
                        <div
                          style={{
                            position: "absolute",
                            top: 0,
                            right: 0,
                            fontSize: "12px",
                            fontWeight: "bold",
                            color: "black",
                            borderRadius: "50%",
                            width: "20px",
                            height: "20px",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",

                            fontStyle: "italic",
                          }}
                        >
                          {todoCount}
                        </div>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </main>
    </Container>
  );
}
