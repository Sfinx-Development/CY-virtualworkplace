import React, { useState, useEffect } from "react";
import { Container, Button, Typography } from "@mui/material";

export default function CalendarPage() {
  const [selectedDate, setSelectedDate] = useState(null);
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth());
  const [holidays, setHolidays] = useState([]);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    initCalendar();
    const timerID = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timerID);
  }, []);

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

  //uppdaterar kalender celler


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

  function updateCalendarCells() {
    const calendarBody: HTMLElement | null = document.querySelector('[data-cy="calendar-body"]');
    if (!calendarBody) return;
  
    const currentDate: Date = new Date();
    const currentDay: number = currentDate.getDate();
    // Beräknar vilken veckodag första dagen i månaden är
    const firstDayOfMonth: Date = new Date(year, month, 1);
    const startingDay: number = (firstDayOfMonth.getDay() + 6) % 7;
    // Antal dagar i månaden
    const daysInMonth: number = new Date(year, month + 1, 0).getDate();
    let dayCounter: number = 1;
  
    const table: HTMLTableElement = document.createElement('table');
    const thead: HTMLTableSectionElement = document.createElement('thead');
    const tr: HTMLTableRowElement = document.createElement('tr');
  
    const daysOfWeek: string[] = ['Måndag', 'Tisdag', 'Onsdag', 'Torsdag', 'Fredag', 'Lördag', 'Söndag'];
    // Skapar tabellen för veckodagarna
    for (let j = 0; j < 7; j++) {
      const th: HTMLTableHeaderCellElement = document.createElement('th');
      th.textContent = daysOfWeek[j];
      tr.appendChild(th);
    }
  
    thead.appendChild(tr);
    table.appendChild(thead);
    calendarBody.appendChild(table);
  
    const holidays: Holiday[] = holidays;
  
    // Skapar rader för varje kalender
    for (let i = 0; i < 6; i++) {
      const row: HTMLTableRowElement = document.createElement('tr');
  
      let isEmptyRow: boolean = true;
      // Sätter celler per rad
      for (let j = 0; j < 7; j++) {
        const cell: HTMLTableDataCellElement = document.createElement('td');
        cell.setAttribute('calendar-cell', '');
  
        if (i === 0 && j < startingDay) {
          cell.textContent = '';
        } else if (dayCounter > daysInMonth) {
          cell.textContent = '';
        } else {
          isEmptyRow = false;
          const dateElement: HTMLSpanElement = document.createElement('span');
          dateElement.textContent = dayCounter.toString();
          dateElement.setAttribute('data-cy', 'calendar-cell-date');
          cell.appendChild(dateElement);
          // Lägger till klassen current-day om det är dagens datum
          if (dayCounter === currentDay && month === currentDate.getMonth() && year === currentDate.getFullYear()) {
            cell.classList.add('current-day');
          } else {
            cell.classList.remove('current-day');
          }
          // Lägger till sunday-cell klass om det är en söndag
          if (j === 6) {
            cell.classList.add('sunday-cell');
          }
          // Hitta och visa helgdagen om den finns för dagen
          const holiday: Holiday | undefined = holidays.find((holiday) => {
            return holiday.datum === `${year}-${(month + 1).toString().padStart(2, '0')}-${dayCounter.toString().padStart(2, '0')}`;
          });
  
          if (holiday) {
            const holidayElement: HTMLParagraphElement = document.createElement('p');
            holidayElement.textContent = holiday.helgdag;
            holidayElement.setAttribute('data-cy', 'calendar-cell-holiday');
            holidayElement.classList.add('holiday');
            cell.appendChild(holidayElement);
          }
          // Lägger till om det är en helgdag
          if (holiday) {
            cell.classList.add('holiday-cell');
          }
  
          dayCounter++;
        }
  
        row.appendChild(cell);
      }
      // Lägger bara till raden om det finns innehåll
      if (!isEmptyRow) {
        table.appendChild(row);
      }
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
  }, [year, month, holidays]);

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
                  <td key={dayIndex}>{day}</td>
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
