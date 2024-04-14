import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  Box,
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
} from "@mui/material";
import Skeleton from "@mui/material/Skeleton";
import { PieChart, pieArcLabelClasses } from "@mui/x-charts/PieChart";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { isMobile } from "../../../globalConstants";
import { HealthCheck } from "../../../types";
import {
  DeleteHealthCheckAsync,
  GetProfileHealthChecksAsync,
  GetTeamHealthChecksAsync,
} from "../../slices/healthcheck";
import { getActiveProfile } from "../../slices/profileSlice";
import { useAppDispatch, useAppSelector } from "../../slices/store";

interface PieValueType {
  id: string;
  value: number;
  label: string;
}

type ChartData = {
  data: PieValueType[];
};

type RatingsCount = {
  [rating: string]: number;
};

export default function HealthCheckPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [openTodoPopup, setOpenTodoPopup] = useState(false);
  const [idToDelete, setIdToDelete] = useState("");

  const handleDeleteHealthCheck = () => {
    if (idToDelete) {
      dispatch(DeleteHealthCheckAsync(idToDelete));
      setOpenTodoPopup(false);
    }
  };

  const activeProfile = useAppSelector(
    (state) => state.profileSlice.activeProfile
  );
  const healthchecks = useAppSelector(
    (state) => state.healthcheckSlice.healthchecks
  );
  const profileHealthChecks = useAppSelector(
    (state) => state.healthcheckSlice.profileHealthChecks
  );
  const [chartData, setChartData] = useState<ChartData>({ data: [] });
  const [currentHealthCheck, setCurrentHealthCheck] =
    useState<HealthCheck | null>();

  useEffect(() => {
    dispatch(getActiveProfile());
  }, []);

  useEffect(() => {
    if (activeProfile) {
      dispatch(GetTeamHealthChecksAsync(activeProfile.id));
    }
  }, [activeProfile]);

  useEffect(() => {
    if (profileHealthChecks) {
      const ratingsCount: RatingsCount = {};
      profileHealthChecks.forEach((check) => {
        ratingsCount[check.rating] = (ratingsCount[check.rating] || 0) + 1;
      });

      const seriesData: PieValueType[] = Object.entries(ratingsCount).map(
        ([rating, count]) => ({
          id: rating,
          value: count,
          label: getLabel(Number(rating)),
        })
      );

      setChartData({ data: seriesData });
    }
  }, [profileHealthChecks]);

  const getLabel = (rating: number) => {
    if (rating == 1) {
      return "Mycket dåligt";
    } else if (rating == 2) {
      return "Dåligt";
    } else if (rating == 3) {
      return "Neutralt";
    } else if (rating == 4) {
      return "Bra";
    } else if (rating == 5) {
      return "Mycket bra";
    }
    return "";
  };

  const handleSetPopopOpen = (id: string) => {
    setIdToDelete(id);
    setOpenTodoPopup(true);
  };

  const loadStatistic = async (check: HealthCheck) => {
    setCurrentHealthCheck(check);
    await dispatch(GetProfileHealthChecksAsync(check.id));
  };

  return (
    <Container sx={{ paddingX: "20px", paddingY: 1 }}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "100%",
        }}
      >
        <Container
          sx={{
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
            alignItems: isMobile ? "center" : "flex-start",
            width: "90%",
          }}
        >
          <Box
            sx={{
              flex: 1,
              display: "flex",
              justifyContent: "center",
            }}
          >
            {" "}
            <Dialog
              open={openTodoPopup}
              onClose={() => setOpenTodoPopup(false)}
            >
              <DialogTitle>Ta bort</DialogTitle>
              <DialogContent dividers>
                <Typography>
                  Är du säker på att du vill radera frågan och dess svar
                  permanent?
                </Typography>

                <IconButton onClick={() => handleDeleteHealthCheck()}>
                  <Typography>Ta bort</Typography>
                </IconButton>
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setOpenTodoPopup(false)}>Stäng</Button>
              </DialogActions>
            </Dialog>
            {chartData.data.length > 0 ? (
              <Container>
                {currentHealthCheck != null ? (
                  <Box
                    display={"flex"}
                    flexDirection={"column"}
                    alignItems={"center"}
                    padding={isMobile ? 0 : 2}
                  >
                    <Typography>
                      {new Date(
                        currentHealthCheck.startTime
                      ).toLocaleDateString("sv-SE")}{" "}
                      -{" "}
                      {new Date(currentHealthCheck.endTime).toLocaleDateString(
                        "sv-SE"
                      )}
                    </Typography>
                    <Typography>{currentHealthCheck.question}</Typography>
                  </Box>
                ) : null}
                <PieChart
                  series={[{ type: "pie", data: chartData.data }]}
                  width={isMobile ? 300 : 550}
                  height={isMobile ? 250 : 350}
                  sx={{
                    [`& .${pieArcLabelClasses.root}`]: {
                      fill: "white",
                      fontWeight: "bold",
                    },
                  }}
                />
              </Container>
            ) : (
              <Container sx={{ paddingY: 4 }}>
                <Skeleton
                  variant="circular"
                  width={isMobile ? 250 : 350}
                  height={isMobile ? 250 : 350}
                />
              </Container>
            )}
          </Box>
          <Box sx={{ maxWidth: isMobile ? "100%" : 300, textAlign: "center" }}>
            <Button
              variant="contained"
              onClick={() => navigate("/createhealthcheck")}
              sx={{
                marginTop: 2,
                marginBottom: 2,
                fontWeight: "600",
              }}
            >
              <AddIcon /> Ny fråga
            </Button>
            <Typography variant="h6">Se statistik</Typography>
            {Array.isArray(healthchecks) &&
              healthchecks?.map((check) => (
                <Button
                  key={check.id}
                  variant="contained"
                  onClick={() => loadStatistic(check)}
                  sx={{
                    marginTop: 2,
                    backgroundColor: "lightgrey",
                    minWidth: isMobile ? "100%" : 200,
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  {check.question}
                  <IconButton onClick={() => handleSetPopopOpen(check.id)}>
                    <DeleteIcon />
                  </IconButton>
                </Button>
              ))}
          </Box>
        </Container>
      </div>
    </Container>
  );
}
