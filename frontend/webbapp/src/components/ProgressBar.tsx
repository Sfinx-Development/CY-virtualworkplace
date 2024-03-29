import React from "react";
import { Project } from "../../types";

interface ProgressBarProps {
  project: Project;
  updateDates?: Date[]; // Datum för varje uppdatering
}

const ProgressBar: React.FC<ProgressBarProps> = ({ project, updateDates }) => {
  // Beräkna totala antalet dagar mellan dateCreated och endDate
  const totalDays = Math.floor(
    (new Date(project.endDate).getTime() -
      new Date(project.dateCreated).getTime()) /
      (1000 * 60 * 60 * 24)
  );

  // Beräkna antalet uppdateringar avslutade fram till nu
  const completedUpdates = updateDates
    ? updateDates.filter((date) => date <= new Date()).length
    : 0;

  // Beräkna antalet dagar sedan processen startade
  const daysSinceStart = Math.floor(
    (new Date().getTime() - new Date(project.dateCreated).getTime()) /
      (1000 * 60 * 60 * 24)
  );

  // Beräkna procent av tid som har gått sedan processen startade
  const progress = (daysSinceStart / totalDays) * 100;

  // Skapa en array med färger för varje fyllare
  const colors = ["#007bff", "#28a745", "#dc3545", "#ffc107"]; // Lägg till fler färger vid behov

  // Tilldela en unik färg till varje fyllare baserat på dess index
  const fillerStyles = updateDates?.map((date, index) => ({
    width: `${
      ((date.getTime() - new Date(project.dateCreated).getTime()) /
        (new Date(project.endDate).getTime() -
          new Date(project.dateCreated).getTime())) *
      100
    }%`,
    backgroundColor: colors[index % colors.length], // Loopa genom färgarrayen med modulo för att återanvända färger
  }));

  return (
    <div className="progress-bar-container">
      <p>{project.title}</p>
      <div className="progress-bar">
        {updateDates?.map((date, index) => (
          <div key={index} className="filler" style={fillerStyles[index]} />
        ))}
      </div>
      <div className="progress-text">{`${progress.toFixed(
        2
      )}% Complete (${completedUpdates} / ${
        updateDates?.length ?? 0
      } updates, ${daysSinceStart} / ${totalDays} days)`}</div>
    </div>
  );
};

export default ProgressBar;
