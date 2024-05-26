/* eslint-disable @typescript-eslint/no-unused-vars */
import { Box, Button, Container, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { Todo } from "../../../types";
import CalendarCellDialog from "../../components/calendarComponents/calendarCellDialog";
import MainComponent from "../../components/calendarComponents/mainComponent";
import TodayAside from "../../components/calendarComponents/todayAside";
import TodoAside from "../../components/calendarComponents/todoAside";
import TodoDialogAside from "../../components/calendarComponents/todoDialogAside";
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
  const [titlecalender, SetTitleCalender] = useState("");
  const [description, setDescription] = useState("");
  const [descriptionCalendar, setDescriptionCalendar] = useState("");
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

  const [isMobile, setIsMobile] = useState(false);
  const [isAsideVisible, setIsAsideVisible] = useState(false);

  const dispatch = useAppDispatch();
  const activeTeam = useAppSelector((state) => state.teamSlice.activeTeam);

  const profilesInTeam = useAppSelector((state) => state.profileSlice.profiles);

  const activeProfile = useAppSelector(
    (state) => state.profileSlice.activeProfile
  );

  const todosInTeam = useAppSelector((state) => state.todoSlice.todos);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 768px)");
    const isMobileDevice = mediaQuery.matches;

    // Funktion som körs när medieförfrågan ändras
    const handleMediaQueryChange = (e) => {
      setIsMobile(e.matches);
    };

    // Lägger till en lyssnare för medieförfrågan
    mediaQuery.addEventListener("change", handleMediaQueryChange);

    // Uppdaterar state med initialt värde för mobilenhet
    setIsMobile(isMobileDevice);

    // Återställer lyssnaren när komponenten avmonteras
    return () => {
      mediaQuery.removeEventListener("change", handleMediaQueryChange);
    };
  }, []);

  const toggleAsideVisibility = () => {
    setIsAsideVisible(!isAsideVisible);
  };

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

        const selectedDate = new Date(year, month, parseInt(day) + 1);

        setTodoDate(selectedDate.toISOString().slice(0, 10)); // Spara datumet i formatet YYYY-MM-DD

        // Öppna den nya pop-upen
        // setOpenTodoPopup(true);
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
      id: "",
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

  function handleCloseTodoDialog(): void {
    throw new Error("Function not implemented.");
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        minHeight: "100vh",
        width: "100%",
        backgroundImage:
          "linear-gradient(315deg, rgba(0, 0, 0, 0.5) 0%, rgba(0, 0, 0, 0.9) 74%)",
        color: "#FFF",
      }}
    >
      <Container
        sx={{
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          alignItems: "center",
          justifyContent: "center",
          padding: isMobile ? "20px" : "40px",
          margin: 0,
          width: "100%",
          flexGrow: 1,
        }}
      >
        {isMobile ? (
          <div>
            <Button onClick={toggleAsideVisibility}>
              Lägg till uppgift/påminnelse
            </Button>
            {isAsideVisible && (
              <aside
                style={{
                  zIndex: 1,
                  backgroundColor: "rgb(211, 145, 158)",
                  opacity: 0.8,
                  justifyContent: "center",
                  display: "flex",
                  flexDirection: "column",
                  position: "relative",
                  top: 0,
                  left: 0,
                  height: "100%",
                  width: "100%",
                }}
              >
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
                    Lägg till uppgifter eller påminnelser här nedan
                  </Button>

                  <TodoAside
                    title={title}
                    setTitle={SetTitle}
                    description={description}
                    setDescription={setDescription}
                    todoDate={todoDate}
                    setTodoDate={setTodoDate}
                    handleCreateTodo={handleCreateTodo}
                    fieldError={fieldError}
                  />
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
                    <CalendarCellDialog
                      open={openTodoPopup}
                      onClose={() => setOpenTodoPopup(false)}
                      todoDate={todoDate}
                      title={title}
                      SetTitle={SetTitle}
                      description={description}
                      setDescription={setDescription}
                      handleCreateTodo={handleCreateTodo}
                      selectedDayTodos={selectedDayTodos}
                      isEditMode={isEditMode}
                      todoIdToEdit={todoIdToEdit}
                      editedTitle={editedTitle}
                      setEditedTitle={setEditedTitle}
                      editedDate={editedDate}
                      setEditedDate={setEditedDate}
                      editedDescription={editedDescription}
                      setEditedDescription={setEditedDescription}
                      handleDeleteTodo={handleDeleteTodo}
                      handleSetEditMode={handleSetEditMode}
                      handleEditTodo={handleEditTodo}
                      handleKeyPress={handleKeyPress}
                    />

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
                      Se alla uppgifter
                    </Button>

                    <TodoDialogAside
                      open={openDialog}
                      onClose={handleCloseTodoDialog}
                      todos={todosen}
                      handleDeleteTodo={handleDeleteTodo}
                      handleSetEditMode={handleSetEditMode}
                      isEditMode={isEditMode}
                      todoIdToEdit={todoIdToEdit}
                      editedTitle={editedTitle}
                      setEditedTitle={setEditedTitle}
                      editedDate={editedDate}
                      setEditedDate={setEditedDate}
                      editedDescription={editedDescription}
                      setEditedDescription={setEditedDescription}
                      handleKeyPress={handleKeyPress}
                      handleEditTodo={handleEditTodo}
                      openDialog={false}
                      setOpenDialog={setOpenDialog}
                    />

                    <Button id="read-todos-btn" aria-label="headphone icon">
                      <i
                        className="fa-solid fa-headphones"
                        id="headphone-icon"
                      ></i>
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
            <Typography
              variant="h5"
              style={{
                textAlign: "center",
                display: isAsideVisible ? "none" : "flex",
                marginTop: "40px",
                justifyContent: "center",
                fontFamily: "Arial, sans-serif",
                fontWeight: "bold",
                letterSpacing: "2px",
              }}
            >
              {activeTeam?.name} Kalender
            </Typography>

            <TodayAside currentTime={currentTime} />
          </div>
        ) : (
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

            <TodayAside currentTime={currentTime} />

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
                Lägg till uppgifter eller påminnelser här nedan
              </Button>
              <TodoAside
                title={title}
                setTitle={SetTitle}
                description={description}
                setDescription={setDescription}
                todoDate={todoDate}
                setTodoDate={setTodoDate}
                handleCreateTodo={handleCreateTodo}
                fieldError={fieldError}
              />
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
                <CalendarCellDialog
                  open={openTodoPopup}
                  onClose={() => setOpenTodoPopup(false)}
                  todoDate={todoDate}
                  title={title}
                  SetTitle={SetTitle}
                  description={description}
                  setDescription={setDescription}
                  handleCreateTodo={handleCreateTodo}
                  selectedDayTodos={selectedDayTodos}
                  isEditMode={isEditMode}
                  todoIdToEdit={todoIdToEdit}
                  editedTitle={editedTitle}
                  setEditedTitle={setEditedTitle}
                  editedDate={editedDate}
                  setEditedDate={setEditedDate}
                  editedDescription={editedDescription}
                  setEditedDescription={setEditedDescription}
                  handleDeleteTodo={handleDeleteTodo}
                  handleSetEditMode={handleSetEditMode}
                  handleEditTodo={handleEditTodo}
                  handleKeyPress={handleKeyPress}
                />

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
                  Se alla uppgifter
                </Button>

                <TodoDialogAside
                  open={openDialog}
                  onClose={handleCloseTodoDialog}
                  todos={todosen}
                  handleDeleteTodo={handleDeleteTodo}
                  handleSetEditMode={handleSetEditMode}
                  isEditMode={isEditMode}
                  todoIdToEdit={todoIdToEdit}
                  editedTitle={editedTitle}
                  setEditedTitle={setEditedTitle}
                  editedDate={editedDate}
                  setEditedDate={setEditedDate}
                  editedDescription={editedDescription}
                  setEditedDescription={setEditedDescription}
                  handleKeyPress={handleKeyPress}
                  handleEditTodo={handleEditTodo}
                  openDialog={false}
                  setOpenDialog={setOpenDialog}
                />

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

        <MainComponent
          weekDays={weekDays}
          generateCalendarRows={generateCalendarRows}
          handleDayClick={handleDayClick}
          holidays={holidays}
          year={year}
          month={month}
          todosInTeam={todosInTeam}
          handlePrevMonth={handlePrevMonth}
          handleNextMonth={handleNextMonth}
          updateCalendarMonthLabel={updateCalendarMonthLabel}
          isToday={isToday}
          isAsideVisible={false}
        />
      </Container>
    </Box>
  );
}
