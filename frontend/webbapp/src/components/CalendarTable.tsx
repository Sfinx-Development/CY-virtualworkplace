// import React, { useState, useEffect } from "react";
// import { Container, Button, Typography } from "@mui/material";

// export default function CalendarTable({ year, month, holidays }) {
//   const [currentDate, setCurrentDate] = useState(new Date());

//   useEffect(() => {
//     setCurrentDate(new Date());
//   }, []);

//   const daysOfWeek = ["Måndag", "Tisdag", "Onsdag", "Torsdag", "Fredag", "Lördag", "Söndag"];

//   const updateCalendarCells = () => {
//     const firstDayOfMonth = new Date(year, month, 1);
//     const startingDay = (firstDayOfMonth.getDay() + 6) % 7;
//     const daysInMonth = new Date(year, month + 1, 0).getDate();

//     const calendarRows = [];
//     let dayCounter = 1;

//     for (let i = 0; i < 6; i++) {
//       const row = [];
//       let isEmptyRow = true;

//       for (let j = 0; j < 7; j++) {
//         if (i === 0 && j < startingDay) {
//           row.push(null);
//         } else if (dayCounter > daysInMonth) {
//           row.push(null);
//         } else {
//           isEmptyRow = false;
//           const currentDate = new Date(year, month, dayCounter);
//           const isCurrentDay = dayCounter === currentDate.getDate() && month === currentDate.getMonth() && year === currentDate.getFullYear();
//           const isSunday = j === 6;

//           const holiday = holidays.find(holiday => {
//             return holiday.datum === `${year}-${(month + 1).toString().padStart(2, "0")}-${dayCounter.toString().padStart(2, "0")}`;
//           });

//           row.push({
//             day: dayCounter,
//             isCurrentDay,
//             isSunday,
//             holiday: holiday ? holiday.helgdag : null
//           });

//           dayCounter++;
//         }
//       }

//       if (!isEmptyRow) {
//         calendarRows.push(row);
//       }
//     }

//     return calendarRows.map((row, rowIndex) => (
//       <tr key={rowIndex}>
//         {row.map((cell, cellIndex) => (
//           <td
//             key={cellIndex}
//             style={{
//               border: "1px solid black",
//               padding: "2.8vw 2.8vw",
//               gridColumn: "span",
//               cursor: "pointer",
//               position: "relative",
//               backgroundColor: cell.isCurrentDay ? "lightblue" : cell.isSunday ? "lightyellow" : "white"
//             }}
//           >
//             {cell && (
//               <>
//                 <span>{cell.day}</span>
//                 {cell.holiday && <p>{cell.holiday}</p>}
//               </>
//             )}
//           </td>
//         ))}
//       </tr>
//     ));
//   };

//   return (
//     <table>
//       <thead>
//         <tr>
//           {daysOfWeek.map((day, index) => (
//             <th key={index}>{day}</th>
//           ))}
//         </tr>
//       </thead>
//       <tbody>{updateCalendarCells()}</tbody>
//     </table>
//   );
// }
