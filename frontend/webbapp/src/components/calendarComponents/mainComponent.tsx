import React from 'react';
import { Typography } from '@mui/material';

interface MainComponentProps {
  isAsideVisible: boolean;
  handlePrevMonth: () => void;
  handleNextMonth: () => void;
  updateCalendarMonthLabel: () => string;
  weekDays: string[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  generateCalendarRows: (holidays: any[]) => any[][];
  handleDayClick: (day: string) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  holidays: any[];
  year: number;
  month: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  todosInTeam?: any[];
  isToday: (year: number, month: number, day: number) => boolean;
}

const MainComponent: React.FC<MainComponentProps> = ({
  isAsideVisible,
  handlePrevMonth,
  handleNextMonth,
  updateCalendarMonthLabel,
  weekDays,
  generateCalendarRows,
  handleDayClick,
  holidays,
  year,
  month,
  todosInTeam,
  isToday,
}) => {
  return (
    <main
      style={{
        flex: 1,
        // overflowY: "auto",
        display: isAsideVisible ? "none" : "flex",
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
      <table
        id="calendar-table"
        style={{ width: "100%", borderCollapse: "collapse" }}
      >
        <thead>
          <tr>
            {weekDays.map((day, index) => (
              <th
                key={index}
                style={{
                  color: index === 6 ? "rgb(182, 36, 36)" : "inherit",
                  padding: "5px",
                  fontSize: "12px",
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
                      cursor: "pointer",
                      position: "relative",
                      color: isSunday ? "red" : holidayName ? "red" : "black",
                      whiteSpace: "nowrap",
                      backgroundColor: isTodayCell
                        ? "grey"
                        : "rgb(214, 196, 203)",
                      transition: "background-color 0.3s",
                      fontSize: "12px",
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
  );
};

export default MainComponent;
