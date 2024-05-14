
import React from "react";
import Typography from "@mui/material/Typography";

interface Props {
  currentTime: Date;
}

const TodayAside: React.FC<Props> = ({ currentTime }) => {
  return (
    
    <div className="today-aside" style={{ textAlign: "center" }}>
      <Typography variant="h6" style={{ fontWeight: "bold", marginTop: "10px" }}>
        Dagens Datum
      </Typography>
      <Typography style={{ marginBottom: "5px" }}>
        {currentTime.toLocaleTimeString()}
      </Typography>
      <Typography style={{ marginBottom: "5px" }}>
        {currentTime.toLocaleDateString()}
      </Typography>
      <Typography style={{ marginBottom: "25px" }}>
        {currentTime.toLocaleDateString("sv-SE", { weekday: "long" })}
      </Typography>
    </div>
  );
};

export default TodayAside;
