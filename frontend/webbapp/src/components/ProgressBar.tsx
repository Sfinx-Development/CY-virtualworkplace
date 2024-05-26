import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { isMobile } from "../../globalConstants";
import { Project, ProjectNoDate, ProjectUpdateNoDate } from "../../types";
import {
  DeleteProjectAsync,
  EditProjectAsync,
  GetProjectUpdatesAsync,
  setActiveProject,
  setActiveUpdate,
} from "../slices/projectSlice";
import { useAppDispatch } from "../slices/store";
import { theme1 } from "../theme";

interface ProgressBarProps {
  project: ProjectNoDate;
}

interface UpdateDatesWithId {
  id: string;
  date: Date;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ project }) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [updates, setUpdates] = useState<ProjectUpdateNoDate[] | undefined>(
    undefined
  );
  const [updateDates, setUpdateDates] = useState<
    UpdateDatesWithId[] | undefined
  >(undefined);
  const [progress, setProgress] = useState<number>(0);
  const [daysSinceStart, setDaysSinceStart] = useState<number>(0);
  const [totalDays, setTotalDays] = useState<number>(0);
  const [fillerWidths, setFillerWidths] = useState<number[]>();
  const [openDeletePopUp, setOpenDeletePopUp] = useState(false);
  const [openEditPopUp, setOpenEditPopUp] = useState(false);
  const [editedTitle, setEditedTitle] = useState("");
  const [editedEndDate, setEditedEndDate] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const actionResult = await dispatch(GetProjectUpdatesAsync(project.id));
        const projectUpdates = actionResult.payload;
        if (Array.isArray(projectUpdates)) {
          setUpdates(projectUpdates);
        } else {
          console.error(
            "Invalid project updates data received:",
            projectUpdates
          );
        }
      } catch (error) {
        console.error("Error fetching updates:", error);
      }
    };

    fetchData();

    return () => {};
  }, []);

  const handleSetEditMode = () => {
    setEditedTitle(project.title);
    setEditedEndDate(project.endDate.toString());
    setOpenEditPopUp(true);
  };

  useEffect(() => {
    if (updates) {
      const updatedDatesWithId = updates
        .filter((update) => update.dateCreated)
        .map((update) => ({
          date: new Date(update.dateCreated),
          id: update.id,
        }));
      setUpdateDates(updatedDatesWithId);
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
  const handleDeleteProject = (id: string) => {
    dispatch(DeleteProjectAsync(id));
  };
  const handleEditProject = async () => {
    const editedProject: Project = {
      ...project,
      dateCreated: new Date(project.dateCreated),
      title: editedTitle,
      endDate: new Date(editedEndDate),
    };
    console.log("projektet : ", editedProject);
    await dispatch(EditProjectAsync(editedProject));
    setOpenEditPopUp(false);
  };

  const handleNavigateToUpdateEvents = (projectUpdateId: string) => {
    const update = updates?.find((p) => p.id == projectUpdateId);
    if (update) {
      dispatch(setActiveUpdate(update));
      navigate("/updateevents");
    }
  };

  return (
    <div style={{ width: "100%", marginTop: isMobile ? 2 : 10 }}>
      <Dialog open={openDeletePopUp} onClose={() => setOpenDeletePopUp(false)}>
        <DialogTitle>Ta bort</DialogTitle>
        <DialogContent dividers>
          <Typography>
            Är du säker på att du vill radera projektet permanent?
          </Typography>
          <IconButton onClick={() => handleDeleteProject(project.id)}>
            <Typography>Ta bort {project.title}</Typography>
          </IconButton>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeletePopUp(false)}>Stäng</Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={openEditPopUp}
        onClose={() => setOpenEditPopUp(false)}
        sx={{ display: "flex", flexDirection: "column" }}
      >
        <DialogTitle>Redigera</DialogTitle>
        <DialogContent dividers>
          <Typography>
            Flytta fram projektets mål-datum eller uppdatera titel
          </Typography>
          <TextField
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
            type="text"
            fullWidth
            variant="outlined"
          />
          <TextField
            label="Date"
            type="datetime-local"
            value={editedEndDate}
            onChange={(e) => setEditedEndDate(e.target.value)}
            variant="outlined"
            sx={{ width: "250px", marginTop: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <IconButton onClick={() => handleEditProject()}>
            <Typography>Spara</Typography>
          </IconButton>
          <Button onClick={() => setOpenEditPopUp(false)}>Stäng</Button>
        </DialogActions>
      </Dialog>
      <Box display="flex" flexDirection="row" justifyContent={"space-between"}>
        <div style={{ display: "flex", flexDirection: "row" }}>
          <IconButton
            onClick={() => handleSetEditMode()}
            sx={{ paddingX: 0, color: theme1.palette.primary.main }}
          >
            <EditIcon />
          </IconButton>
          <IconButton
            sx={{ color: theme1.palette.primary.main }}
            onClick={() => setOpenDeletePopUp(true)}
          >
            <DeleteIcon />
          </IconButton>
          <Typography variant="h6" color={"white"}>
            {project.title}
          </Typography>
        </div>
        <Button onClick={handleCreateUpdate}>
          <Box sx={{ display: "flex" }}>
            <AddIcon
              sx={{
                textAlign: "center",
                fontSize: isMobile ? "20" : "30",
              }}
            />
            {isMobile ? null : (
              <Typography color={"white"}>UPPDATERING</Typography>
            )}
          </Box>
        </Button>
      </Box>
      <div className="progress-bar">
        {updateDates?.map((update, index) => (
          <div
            key={index}
            className="filler"
            onClick={() => {
              handleNavigateToUpdateEvents(update.id);
            }}
            style={{
              width: `${fillerWidths?.[index]}%`,
              backgroundColor: colors[index],
            }}
          >
            <Typography variant="caption" fontWeight={600} color={"black"}>
              {new Date(update.date).toLocaleDateString("sv-SE", {
                day: "2-digit",
                month: "2-digit",
              })}
            </Typography>
          </div>
        ))}
      </div>

      {isMobile ? null : (
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <Typography color={"white"}>{`${progress.toFixed(
            2
          )}% AVKLARAT`}</Typography>
          <Typography color={"white"}>
            {updateDates?.length ?? 0}{" "}
            {updateDates?.length == 1 ? "UPPDATERING" : "UPPDATERINGAR"}
          </Typography>
          <Typography
            color={"white"}
          >{`${daysSinceStart} / ${totalDays} DAGAR`}</Typography>
        </div>
      )}
    </div>
  );
};

export default ProgressBar;
