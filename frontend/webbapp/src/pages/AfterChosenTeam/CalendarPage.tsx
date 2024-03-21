import React, { useState, useEffect } from "react";
import { Container, Button, Typography } from "@mui/material";
import CalendarTable from "../../components/CalendarTable";

export default function CalendarPage() {
  const [selectedDate, setSelectedDate] = useState(null);
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth());
  const [day, setDay] = useState(new Date().getDay());
  const [holidays, setHolidays] = useState([]);
  const [currentTime, setCurrentTime] = useState(new Date());

  const state = {
    selectedDate: null,
    year: new Date().getFullYear(),
    month: new Date().getMonth(),
    holidays: []
  };

  useEffect(() => {
    initCalendar();
    const timerID = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timerID);
  }, []);

  useEffect(() => {
    initCalendar();
  }, [month, year, day]); 

  async function initCalendar() {
    // Hantera knapptryck för att byta månad
    const prevMonthButton = document.querySelector("[data-cy='prev-month']");
    const nextMonthButton = document.querySelector("[data-cy='next-month']");
  
    prevMonthButton?.addEventListener('click', function () {
      changeMonth(-1);
    });
  
    nextMonthButton?.addEventListener('click', function () {
      changeMonth(1);
    });
  
    // Uppdatera kalendern med aktuellt år och månad
    updateCalendarCells(year, month);
  }
  
  // Initiera kalendern när sidan laddas
  window.addEventListener('load', initCalendar);

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
    updateCalendarCells(year, month);
  }

  async function getHolidays(year: number, month: number) {
    const apiUrl = `https://sholiday.faboul.se/dagar/v2.1/${year}/${month}`;
    try {
      const response = await fetch(apiUrl);
      const data = await response.json();

      const holidays = data.dagar
        .filter((d: { helgdag: unknown; }) => d.helgdag)
        .map((d: { helgdag: unknown; datum: unknown; }) => ({
          helgdag: d.helgdag,
          datum: d.datum,
        }));

      return holidays;
    } catch (error) {
      console.log(error);
    }
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

  function generateCalendarRows() {
    const firstDayOfMonth = new Date(year, month, 0);
    const lastDayOfMonth = new Date(year, month + 1, 0);
    const numDaysInMonth = lastDayOfMonth.getDate();
    const firstDayOfWeek = firstDayOfMonth.getDay();
  
    const calendarRows = [[]];
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
  


function updateCalendarCells(year, month) {
  const calendarBody = document.querySelector('[data-cy="calendar-body"]');
  if (!calendarBody) return;

  const currentDate = new Date();
  const currentDay = currentDate.getDate();
  const firstDayOfMonth = new Date(year, month, 1);
  const startingDay = firstDayOfMonth.getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  let dayCounter = 1;

  const table = document.createElement('table');
  const thead = document.createElement('thead');
  const tr = document.createElement('tr');

  const daysOfWeek = ['Måndag', 'Tisdag', 'Onsdag', 'Torsdag', 'Fredag', 'Lördag', 'Söndag'];

  // Skapar tabellen för veckodagarna
  for (let j = 0; j < 7; j++) {
    const th = document.createElement('th');
    th.textContent = daysOfWeek[j];
    tr.appendChild(th);
  }

  thead.appendChild(tr);
  table.appendChild(thead);
  calendarBody.appendChild(table);

  // Skapar rader för varje kalender
  for (let i = 0; i < 6; i++) {
    const row = document.createElement('tr');

    // Sätter celler per rad
    for (let j = 0; j < 7; j++) {
      const cell = document.createElement('td');
      cell.setAttribute('data-cy', 'calendar-cell');

      const dateElement = document.createElement('span');

      if (dayCounter > startingDay && dayCounter <= daysInMonth + startingDay) {
        dateElement.textContent = dayCounter - startingDay;
        dateElement.setAttribute('data-cy', 'calendar-cell-date');
        cell.appendChild(dateElement);

        // Lägger till klassen current-day om det är dagens datum
        if (dayCounter - startingDay === currentDay && month === currentDate.getMonth() && year === currentDate.getFullYear()) {
          cell.classList.add('current-day');
        }
      }

      // Lägger till sunday-cell klass om det är en söndag
      if (j === 6) {
        cell.classList.add('sunday-cell');
      }

      row.appendChild(cell);
      dayCounter++;
    }

    table.appendChild(row);
  }
}


  
  function handlePrevMonth() {
    changeMonth(-1);
  }

  function handleNextMonth() {
    changeMonth(1);
  }

  useEffect(() => {
    updateCalendarCells();
  }, [month, year, day]);
  useEffect(() => {
    document.addEventListener('DOMContentLoaded', function() {
      updateCalendarCells();
    });
  }, []); // Tom beroendelista för att köra en gång vid montering
  
 
  
  



  return (
    <Container style={{ height: '100vh', display: 'flex', flexDirection: 'row', backgroundColor: 'rgb(214, 196, 203)' }}>
    
    <aside style={{zIndex: 1, marginLeft: '20px', marginRight: '20px', backgroundColor: 'rgb(211, 145, 158)', opacity: 0.8, display: 'flex', flexDirection: 'column', position: 'relative', top: 0, left: 0, height: '100%', width: '350px' }}>
    
    <div className="today-aside">
          <Typography variant="h6">Dagens Datum</Typography>
          <Typography>{currentTime.toLocaleTimeString()}</Typography>
          <Typography>{currentTime.toLocaleDateString()}</Typography>
          <Typography>{weekDays[currentTime.getDay()]}</Typography>
        </div>
        <div className="todo-aside" style={{ backgroundColor: 'rgb(211, 145, 158)', marginTop: '140px', height: 'calc(100% - 228px)', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', overflowY: 'auto' }}>
          <div className="add-todo-div">
          <Button id="add-todo-btn" variant="outlined" style={{ backgroundColor: 'rgb(171, 92, 121)', padding: '4px', color: 'rgb(255, 255, 255)', border: 'none', borderRadius: '2px', height: '50px', width: '280px', letterSpacing: '2px', fontSize: '14px', fontFamily: '"Helvetica", Arial, sans-serif', display: 'flex', alignItems: 'center', justifyContent: 'space-around', position: 'relative', overflow: 'hidden', transition: 'width 0.3s ease' }}>
              Lägg till todo i kalender
              <i className="fas fa-plus" className="plus-icon"></i>
            </Button>
            <form id="add-todo-form" className="todo-form" action=""> 
             {/* <form id="add-todo-form" className="todo-form" action="" style={{ display: 'none' }}></form> */}
              <textarea
                id="title-input"
                placeholder="Walk the dog..."
                style={{ borderRadius: '4px', marginTop: '20px', marginLeft: '20px', height: '80px', width: '240px', resize: 'none', padding: '8px', fontSize: '14px' }}
              ></textarea>
                 <div className="date-submit-div" style={{ width: '260px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <input type="date" id="date-input" />
                <Button id="save-todo-button" type="submit" variant="contained" style={{ padding: '4px 12px', color: 'aliceblue', backgroundColor: 'rgb(11, 11, 11)', fontFamily: '"Helvetica", Arial, sans-serif', letterSpacing: '1px', border: 'none', borderRadius: '2px', height: '30px', fontSize: '12px', textTransform: 'uppercase' }}>
                  Add todo
                </Button>
              </div>
            </form>
          </div>
          <div id="todo-list-div" className="alltodos-div">
            <div className="my-todos-div">
            <Button id="show-todos-btn" variant="outlined" style={{ backgroundColor: 'rgb(19, 19, 19)', padding: '4px', color: 'rgb(255, 255, 255)', border: 'none', borderRadius: '2px', height: '50px', width: '280px', letterSpacing: '2px', fontSize: '14px', fontFamily: '"Helvetica", Arial, sans-serif', display: 'flex', alignItems: 'center', justifyContent: 'space-around', position: 'relative', overflow: 'hidden', transition: 'width 0.3s ease' }}>
                Teamets todos
                <i className="fas fa-tasks" className="todo-icon"></i>
              </Button>
              <Button id="read-todos-btn" aria-label="headphone icon">
                <i className="fa-solid fa-headphones" id="headphone-icon"></i>
              </Button>
            </div>
            <div className="todo-list" style={{ fontFamily: '"Helvetica", Arial, sans-serif', display: 'flex', flexDirection: 'row', flexWrap: 'wrap', maxWidth: '350px', overflowX: 'auto' }}>
              <ul id="todo-list" className="todo-reveal-list"></ul>
            </div>
          </div>
        </div>
      </aside>
      <main style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        
        <header>
        <div id="header-items" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', padding: '0 20px' }}>
        <Button variant="outlined" title="Föregående månad" onClick={handlePrevMonth}>
              <i className="fas fa-chevron-left"></i>
            </Button>
            <Typography variant="h6" id="month-year">
              {updateCalendarMonthLabel()}
            </Typography>
            <Button variant="outlined" title="Nästa månad" onClick={handleNextMonth}>
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
                 <td key={dayIndex} style={{ border: '1px solid black', padding: '2.8vw 2.8vw', gridColumn: 'span', cursor: 'pointer', position: 'relative' }}>{day}</td>

                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </main>
      {updateCalendarCells()}
    </Container>
  );
}
