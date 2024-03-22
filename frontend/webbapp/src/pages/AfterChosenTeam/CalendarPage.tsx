/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from "react";
import { Container, Button, Typography } from "@mui/material";

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

  useEffect(() => {
    initCalendar();
    const timerID = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timerID);
  }, []);

  useEffect(() => {
    initCalendar();
  }, [month, year]);

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
      console.log(error);
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

    // Uppdatera kalendern med aktuellt år och månad
    // updateCalendarCells(year, month, newHolidays);
  }

  // Initiera kalendern när sidan laddas
  window.addEventListener("load", initCalendar);

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

  function updateCalendarMonthLabel() {
    const date = new Date(year, month, 1);
    const monthString = date.toLocaleString("default", { month: "long" });
    return capitalizeFirstLetter(monthString) + " " + year;
  }

  function capitalizeFirstLetter(string: string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

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

  function handlePrevMonth() {
    changeMonth(-1);
  }

  function handleNextMonth() {
    changeMonth(1);
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
        <div className="today-aside">
          <Typography variant="h6">Dagens Datum</Typography>
          <Typography>{currentTime.toLocaleTimeString()}</Typography>
          <Typography>{currentTime.toLocaleDateString()}</Typography>
          <Typography>
            {currentTime.toLocaleDateString("sv-SE", { weekday: "long" })}
          </Typography>
        </div>
        <div
          className="todo-aside"
          style={{
            backgroundColor: "rgb(211, 145, 158)",
            marginTop: "140px",
            height: "calc(100% - 228px)",
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            overflowY: "auto",
          }}
        >
          <div className="add-todo-div">
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
            <form id="add-todo-form" className="todo-form" action="">
              {/* <form id="add-todo-form" className="todo-form" action="" style={{ display: 'none' }}></form> */}
              <textarea
                id="title-input"
                placeholder="Walk the dog..."
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
              ></textarea>
              <div
                className="date-submit-div"
                style={{
                  width: "260px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <input type="date" id="date-input" />
                <Button
                  id="save-todo-button"
                  type="submit"
                  variant="contained"
                  style={{
                    padding: "4px 12px",
                    color: "aliceblue",
                    backgroundColor: "rgb(11, 11, 11)",
                    fontFamily: '"Helvetica", Arial, sans-serif',
                    letterSpacing: "1px",
                    border: "none",
                    borderRadius: "2px",
                    height: "30px",
                    fontSize: "12px",
                    textTransform: "uppercase",
                  }}
                >
                  Add todo
                </Button>
              </div>
            </form>
          </div>
          <div id="todo-list-div" className="alltodos-div">
            <div className="my-todos-div">
              <Button
                id="show-todos-btn"
                variant="outlined"
                style={{
                  backgroundColor: "rgb(19, 19, 19)",
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
                Teamets todos
              </Button>
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
        </div>
      </aside>
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
              padding: "0 20px",
            }}
          >
            <Button
              variant="outlined"
              title="Föregående månad"
              onClick={handlePrevMonth}
            >
              <i className="fas fa-chevron-left"></i>
            </Button>
            <Typography variant="h6" id="month-year">
              {updateCalendarMonthLabel()}
            </Typography>
            <Button
              variant="outlined"
              title="Nästa månad"
              onClick={handleNextMonth}
            >
              <i className="fas fa-chevron-right"></i>
            </Button>
          </div>
        </header>
        <table id="calendar-table">
          <thead>
            <tr>
              {weekDays.map((day, index) => (
                   <th key={index} style={{ color: index === 6 ? "rgb(182, 36, 36)" : "inherit" }}>{day}</th>
              ))}
            </tr>
          </thead>
          <tbody id="calendar-body-id">
            {generateCalendarRows(holidays).map((row, rowIndex) => (
              <tr key={rowIndex}>
                {row.map((day, dayIndex) => {
                  // Kolla om dagen är en helgdag och hämta helgdagsnamnet
                  const holidayName = holidays.find(
                    (holiday) =>
                      parseInt(holiday.datum.split("-")[2]) === parseInt(day)
                  )?.helgdag;

                  const isSunday = dayIndex === 6;

                  // Stil för söndagar
                  const sundayCellStyle = {
                    color: isSunday ? "rgb(182, 36, 36)" : "black",
                  };

                  // Om det finns ett helgdagsnamn, visa det med röd färg
                  return (
                    <td
                      key={dayIndex}
                      style={{
                        border: "1px solid black",
                        padding: "2.8vw 2.8vw",
                        gridColumn: "span",
                        cursor: "pointer",
                        position: "relative",
                        color: isSunday ? "red" : (holidayName ? "red" : "black"),
                        whiteSpace: "nowrap",
                      }}
                    >
                       {day}
                      {holidayName && (
                         <div
                         style={{
                           fontSize: "15px",
                           padding: "2px",
                           backgroundColor: "white",
                           overflowWrap: "break-word",
                           position: "absolute",
                           bottom: 0,
                           left: 0,
                           right: 0,
                           textAlign: "center",
                           color: "rgb(215, 142, 142)",
                           opacity: 0.6,
                         }}
                       >
                         {holidayName}
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
