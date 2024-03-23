// // TodayComponent.tsx

// import React from 'react';


// function TodayComponent() {
//   const { time, day, date } = getDateAndTime();

//   return (
//     <div className="today">
//       <p id="time">{time}</p>
//       <p id="day">{day}</p>
//       <p id="date">{date}</p>
//     </div>
//   );
// }

// function getDateAndTime(): { time: string; day: string; date: string } {
//   const newDate = new Date();

//   const options: Intl.DateTimeFormatOptions = {
//     hour: 'numeric',
//     minute: 'numeric',
//     second: 'numeric',
//     hour12: false
//   };

//   const dateTimeFormatter = new Intl.DateTimeFormat(undefined, options);
//   const dateTime = dateTimeFormatter.format(newDate);
//   const day = newDate.toLocaleDateString(undefined, { weekday: 'long' });
//   const capitalizedDay = day.charAt(0).toUpperCase() + day.slice(1);
//   const date = newDate.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });

//   return {
//     time: dateTime,
//     day: capitalizedDay,
//     date: date
//   };
// }

// export default TodayComponent;

