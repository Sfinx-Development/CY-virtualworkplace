// import React, { useState, useEffect } from 'react';




// interface Todo {
//   date: string;
//   // Add more properties if needed
// }

// interface Holiday {
//   helgdag: string;
//   datum: string;
// }

// const CalendarComponent: React.FC = () => {
//   const [selectedDate, setSelectedDate] = useState<number | null>(null);
//   const [year, setYear] = useState<number>(new Date().getFullYear());
//   const [month, setMonth] = useState<number>(new Date().getMonth());
//   const [holidays, setHolidays] = useState<Holiday[]>([]);
//   const [dayTodos, setDayTodos] = useState<Todo[]>([]);

//   const holidaysCache: { [key: string]: Holiday[] } = {};

//   useEffect(() => {
//     const fetchData = async () => {
//       await initCalendar();
//     };

//     fetchData();
//   }, []);

//   const initCalendar = async () => {
//     const prevMonthButton = document.querySelector<HTMLButtonElement>("[data-cy='prev-month']");
//     const nextMonthButton = document.querySelector<HTMLButtonElement>("[data-cy='next-month']");

//     if (prevMonthButton && nextMonthButton) {
//       prevMonthButton.addEventListener('click', () => changeMonth(-1));
//       nextMonthButton.addEventListener('click', () => changeMonth(1));
//     }

//     await updateCalendarCells();
//     addCalendarCellListeners();
//     updateCalendarMonthLabel();
//   };

//   const addCalendarCellListeners = () => {
//     const calendarBody = document.querySelector("[data-cy='calendar-body']");
//     if (calendarBody) {
//       calendarBody.addEventListener('click', handleCalendarCellClick);
//     }
//   };

//   const handleCalendarCellClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
//     const cell = event.target.closest<HTMLDivElement>("[data-cy='calendar-cell']");
//     if (cell) {
//       const dayElement = cell.querySelector<HTMLSpanElement>("[data-cy='calendar-cell-date']");
//       if (dayElement) {
//         const day = parseInt(dayElement.textContent || '0');
//         const clickedDate = parseInt(day.toString());
//         if (selectedDate === clickedDate) {
//           setSelectedDate(null);
//           location.reload();
//         } else {
//           setSelectedDate(clickedDate);
//         }
//         const filteredTodos = getTodosForDay(year, month, clickedDate);
//         setDayTodos(filteredTodos);
//       }
//     }
//   };

//   const changeMonth = async (change: number) => {
//     const newMonth = month + change;
//     const newDate = new Date(year, newMonth, 1);
//     setMonth(newDate.getMonth());
//     setYear(newDate.getFullYear());
//     const newHolidays = await getHolidays(year, newMonth + 1);
//     setHolidays(newHolidays);
//     updateCalendarMonthLabel();
//     await updateCalendarCells();
//   };

//   const updateCalendarMonthLabel = () => {
//     const date = new Date(year, month, 1);
//     const monthString = capitalizeFirstLetter(date.toLocaleString('default', { month: 'long' }));
//     const monthYearElement = document.getElementById('month-year');
//     if (monthYearElement) {
//       monthYearElement.textContent = monthString + ' ' + year;
//     }
//   };

//   const capitalizeFirstLetter = (string: string) => {
//     return string.charAt(0).toUpperCase() + string.slice(1);
//   };

//   const getTodosForDay = (year: number, month: number, day: number) => {
//     const todosForDay: Todo[] = [];
//     // Assuming todoList is defined somewhere
//     for (const todo of todoList) {
//       const todoDate = new Date(todo.date);
//       if (
//         todoDate.getFullYear() === year &&
//         todoDate.getMonth() === month &&
//         todoDate.getDate() === day
//       ) {
//         todosForDay.push(todo);
//       }
//     }
//     return todosForDay;
//   };



//   const getHolidays = async (year: number, month: number): Promise<Holiday[]> => {
//     const cacheKey = `${year}-${month}`;

//     if (holidaysCache[cacheKey]) {
//       return holidaysCache[cacheKey];
//     }

//     const apiUrl = `https://sholiday.faboul.se/dagar/v2.1/${year}/${month}`;
//     try {
//       const response = await fetch(apiUrl);
//       const data = await response.json();
//       const holidays: Holiday[] = data.dagar
//         .filter((d: any) => d.helgdag)
//         .map((d: any) => ({
//           helgdag: d.helgdag,
//           datum: d.datum,
//         }));

//       holidaysCache[cacheKey] = holidays;
//       return holidays;
//     } catch (error) {
//       console.log(error);
//       return [];
//     }
//   };

//   return (
//     <div>
//       <header>
//         <div id="header-items">
//           <button data-cy="prev-month" title="Förgående månad">
//             <i className="fas fa-chevron-left"></i>
//           </button>
//           <h2 id="month-year" data-cy="month-year">Juni 2023</h2>
//           <button data-cy="next-month" title="Nästa månad">
//             <i className="fas fa-chevron-right"></i>
//           </button>
//         </div>
//       </header>
//       <div className="calendar-body" data-cy="calendar-body"></div>
//     </div>
//   );
// };

// export default CalendarComponent;

