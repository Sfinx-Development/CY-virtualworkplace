import AddIcon from "@mui/icons-material/Add";
import { Box, Button, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { isMobile } from "../../globalConstants";
import { Project, ProjectUpdate } from "../../types";
import {
  GetUpdatesByProjectAsync,
  setActiveProject,
} from "../slices/projectSlice";
import { useAppDispatch } from "../slices/store";

interface ProgressBarProps {
  project: Project;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ project }) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  // const projectUpdates = useAppSelector(
  //   (state) => state.projectSlice.activeProjectUpdates
  // );
  const [updates, setUpdates] = useState<ProjectUpdate[] | undefined>();
  const [updateDates, setUpdateDates] = useState<Date[]>();
  const [progress, setProgress] = useState<number>(0);
  const [daysSinceStart, setDaysSinceStart] = useState<number>(0);
  const [totalDays, setTotalDays] = useState<number>(0);
  const [fillerWidths, setFillerWidths] = useState<number[]>();

  useEffect(() => {
    (async () => {
      try {
        const updates = await GetUpdatesByProjectAsync(project.id);
        setUpdates(updates);
      } catch (error) {
        console.error("Error fetching updates:", error);
      }
    })();
  }, [project]);

  useEffect(() => {
    if (updates) {
      const dateCreatedDates = updates
        .filter((update) => update.dateCreated)
        .map((update) => update.dateCreated);
      setUpdateDates(dateCreatedDates);
    }
  }, [updates]);

  useEffect(() => {
    if (updates && project.endDate) {
      const totalDays = Math.floor(
        (new Date(project.endDate).getTime() -
          new Date(project.dateCreated).getTime()) /
          (1000 * 60 * 60 * 24)
      );
      setTotalDays(totalDays);
      const daysSinceStart = Math.floor(
        (new Date().getTime() - new Date(project.dateCreated).getTime()) /
          (1000 * 60 * 60 * 24)
      );
      setDaysSinceStart(daysSinceStart);

      const progress =
        new Date() >= new Date(project.endDate)
          ? 100
          : (daysSinceStart / totalDays) * 100;
      const progressResult = isNaN(progress) ? 0 : progress;

      setProgress(progressResult);
    }
  }, [updates, project]);

  useEffect(() => {
    if (updateDates && totalDays) {
      const totalUpdates = updateDates.length;
      const updateWidth = 100 / totalUpdates;
      const fillerWidths = updateDates.map(
        (_, index) => (index + 1) * updateWidth
      );
      setFillerWidths(fillerWidths);
    }
  }, [updateDates, totalDays]);

  const colors = [
    "#ABEBC6",
    "#82E0AA",
    "#58D68D",
    "#2ECC71",
    "#28B463",
    "#239B56",
    "#1D8348",
    "#186A3B",
    "#186A3B",
    "#186A3B",
    "#186A3B",
    "#186A3B",
  ];

  const handleCreateUpdate = () => {
    dispatch(setActiveProject(project.id));
    navigate("/createupdate");
  };

  return (
    <div style={{ width: "100%", marginTop: 10 }}>
      <Box display="flex" flexDirection="row" justifyContent={"space-between"}>
        <Typography variant="h6">{project.title}</Typography>
        <Button onClick={handleCreateUpdate}>
          <Box sx={{ display: "flex" }}>
            <AddIcon
              sx={{
                textAlign: "center",
                fontSize: isMobile ? "20" : "30",
              }}
            />
            <Typography>UPPDATERING</Typography>
          </Box>
        </Button>
      </Box>
      <div className="progress-bar">
        {updateDates?.map((date, index) => (
          <div
            key={index}
            className="filler"
            style={{
              width: `${fillerWidths?.[index]}%`,
              backgroundColor: colors[index],
            }}
          >
            <Typography variant="caption">
              {new Date(date).toLocaleDateString("sv-SE", {
                day: "2-digit",
                month: "2-digit",
              })}
            </Typography>
          </div>
        ))}
      </div>

      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Typography>{`${progress.toFixed(2)}% AVKLARAT`}</Typography>
        <Typography>
          {updateDates?.length ?? 0}{" "}
          {updateDates?.length == 1 ? "UPPDATERING" : "UPPDATERINGAR"}
        </Typography>
        <Typography>{`${daysSinceStart} / ${totalDays} DAGAR`}</Typography>
      </div>
    </div>
  );
};

export default ProgressBar;
