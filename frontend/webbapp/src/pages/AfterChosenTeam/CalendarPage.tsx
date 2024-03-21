import React, { useState, useEffect } from "react";
import { Container, Button, Typography } from "@mui/material";

export default function CalendarPage() {
  const [selectedDate, setSelectedDate] = useState(null);
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth());
  const [holidays, setHolidays] = useState([]);

  useEffect(() => {
    initCalendar();
  }, []);

  async function initCalendar() {
    await changeMonth(0);
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

  async function changeMonth(change) {
    const newDate = new Date(year, month + change, 1);
    const newMonth = newDate.getMonth();
    const newYear = newDate.getFullYear();
    setMonth(newMonth);
    setYear(newYear);

    const newHolidays = await getHolidays(newYear, newMonth + 1);
    setHolidays(newHolidays);
  }

  async function getHolidays(year, month) {
    const apiUrl = `https://sholiday.faboul.se/dagar/v2.1/${year}/${month}`;
    try {
      const response = await fetch(apiUrl);
      const data = await response.json();

      const holidays = data.dagar
        .filter((d) => d.helgdag)
        .map((d) => ({
          helgdag: d.helgdag,
          datum: d.datum,
        }));

      return holidays;
    } catch (error) {
      console.log(error);
    }
  }

  function updateCalendarMonthLabel() {
    const date = new Date(year, month, 1);
    const monthString = date.toLocaleString("default", { month: "long" });
    return capitalizeFirstLetter(monthString) + " " + year;
  }

  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  function generateCalendarRows() {
    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);
    const numDaysInMonth = lastDayOfMonth.getDate();
    const firstDayOfWeek = firstDayOfMonth.getDay();

    let calendarRows = [[]];
    let currentRow = 0;

    for (let i = 1; i <= numDaysInMonth; i++) {
      const day = i;
      if (calendarRows[currentRow].length === 7) {
        currentRow++;
        calendarRows.push([]);
      }
      if (i <= firstDayOfWeek) {
        calendarRows[currentRow].push(null); // Placeholder for empty cells
      } else {
        calendarRows[currentRow].push(day);
      }
    }

    return calendarRows;
  }

  return (
    <Container>
      <aside>
        <div className="today-aside">
          <Typography variant="h6">Dagens Datum</Typography>
          <Typography id="time"></Typography>
          <Typography id="day"></Typography>
          <Typography id="date"></Typography>
        </div>
        <div className="todo-aside">
          <div className="add-todo-div">
            <Button id="add-todo-btn" variant="outlined">
              Lägg till todo i kalender
              <i className="fas fa-plus" className="plus-icon"></i>
            </Button>
            <form id="add-todo-form" className="todo-form" action="">
              <textarea
                id="title-input"
                placeholder="Walk the dog..."
              ></textarea>
              <div className="date-submit-div">
                <input type="date" id="date-input" />
                <Button id="save-todo-button" type="submit" variant="contained">
                  Add todo
                </Button>
              </div>
            </form>
          </div>
          <div id="todo-list-div" className="alltodos-div">
            <div className="my-todos-div">
              <Button id="show-todos-btn" variant="outlined">
                Mina todos
                <i className="fas fa-tasks" className="todo-icon"></i>
              </Button>
              <Button id="read-todos-btn" aria-label="headphone icon">
                <i className="fa-solid fa-headphones" id="headphone-icon"></i>
              </Button>
            </div>
            <div className="todo-list">
              <ul id="todo-list" className="todo-reveal-list"></ul>
            </div>
          </div>
        </div>
      </aside>
      <main>
        <header>
          <div id="header-items">
            <Button variant="outlined" title="Föregående månad">
              <i className="fas fa-chevron-left"></i>
            </Button>
            <Typography variant="h6" id="month-year">
              {updateCalendarMonthLabel()}
            </Typography>
            <Button variant="outlined" title="Nästa månad">
              <i className="fas fa-chevron-right"></i>
            </Button>
          </div>
        </header>
        <table id="calendar-table">
          <thead>
            <tr>
              {weekDays.map((day, index) => (
                <th key={index}>{day}</th>
              ))}
            </tr>
          </thead>
          <tbody id="calendar-body-id">
            {generateCalendarRows().map((row, rowIndex) => (
              <tr key={rowIndex}>
                {row.map((day, dayIndex) => (
                  <td key={dayIndex}>{day}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </main>
    </Container>
  );
}
