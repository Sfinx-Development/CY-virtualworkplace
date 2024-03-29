import React from "react";

interface ProgressBarProps {
  endDate: Date;
  updateDates?: Date[];
}

const ProgressBar: React.FC<ProgressBarProps> = ({ endDate, updateDates }) => {
  // Beräkna totala antalet dagar mellan idag och slutdatum
  const totalDays = Math.floor(
    (endDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
  );

  // Beräkna antalet uppdateringar avslutade fram till nu
  const completedUpdates = updateDates
    ? updateDates.filter((date) => new Date(date) <= new Date()).length
    : 0;

  // Beräkna procent av uppdateringar avslutade
  const progress = updateDates
    ? Math.min((completedUpdates / updateDates.length) * 100, 100)
    : 0;

  return (
    <div className="progress-bar-container">
      <div className="progress-bar">
        <div className="filler" style={{ width: `${progress}%` }} />
      </div>
      <div className="progress-text">{`${progress}% Complete. ${totalDays} days)`}</div>
    </div>
  );
};

export default ProgressBar;
