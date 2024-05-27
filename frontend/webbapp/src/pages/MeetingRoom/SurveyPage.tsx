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
  FormControl,
  IconButton,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import Skeleton from "@mui/material/Skeleton";
import { PieChart, pieArcLabelClasses } from "@mui/x-charts/PieChart";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { isMobile } from "../../../globalConstants";
import { Survey } from "../../../types";
import { getActiveProfile } from "../../slices/profileSlice";
import { useAppDispatch, useAppSelector } from "../../slices/store";
import {
  DeleteSurveyAsync,
  GetProfileSurveysAsync,
  GetTeamSurveysAsync,
} from "../../slices/survey";
import { theme1 } from "../../theme";

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

export default function SurveyPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [openTodoPopup, setOpenTodoPopup] = useState(false);
  const [idToDelete, setIdToDelete] = useState("");

  const handleDeleteSurvey = () => {
    if (idToDelete) {
      dispatch(DeleteSurveyAsync(idToDelete));
      setOpenTodoPopup(false);
    }
  };

  const activeProfile = useAppSelector(
    (state) => state.profileSlice.activeProfile
  );
  const surveys = useAppSelector((state) => state.surveySlice.surveys);
  const profileSurveys = useAppSelector(
    (state) => state.surveySlice.profileSurveys
  );
  const [chartData, setChartData] = useState<ChartData>({ data: [] });
  const [currentSurvey, setCurrentSurvey] = useState<Survey | null>();

  useEffect(() => {
    dispatch(getActiveProfile());
  }, []);

  useEffect(() => {
    if (activeProfile) {
      dispatch(GetTeamSurveysAsync(activeProfile.id));
    }
  }, [activeProfile]);

  useEffect(() => {
    if (profileSurveys) {
      const ratingsCount: RatingsCount = {};
      profileSurveys.forEach((check) => {
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
  }, [profileSurveys]);

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

  const [menuChoices, setMenuChoices] = useState<
    [string, string][] | undefined
  >();

  useEffect(() => {
    if (surveys) {
      const newMenuChoices: [string, string][] = surveys.map((p) => [
        p.question,
        p.id,
      ]);
      setMenuChoices(newMenuChoices);
    }
  }, [surveys]);

  const [activeMenuChoice, setActiveMenuChoice] = useState("Alla frågor");

  const handleSetPopopOpen = (id: string) => {
    setIdToDelete(id);
    setOpenTodoPopup(true);
  };

  const loadStatistic = async (check: Survey) => {
    setCurrentSurvey(check);
    await dispatch(GetProfileSurveysAsync(check.id));
  };

  const handleChooseFromMenu = (surveyQuestion: string) => {
    setActiveMenuChoice(surveyQuestion);
    const selectedQuestion = surveys?.find((h) => h.question == surveyQuestion);
    if (selectedQuestion) {
      loadStatistic(selectedQuestion);
    }
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
            color: "white",
          }}
        >
          <Box
            sx={{
              flex: 1,
              display: "flex",
              justifyContent: "center",
              color: "white",
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

                <IconButton onClick={() => handleDeleteSurvey()}>
                  <Typography>Ta bort</Typography>
                </IconButton>
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setOpenTodoPopup(false)}>Stäng</Button>
              </DialogActions>
            </Dialog>
            {chartData.data.length > 0 ? (
              <Container>
                {currentSurvey != null ? (
                  <Box
                    display={"flex"}
                    flexDirection={"column"}
                    alignItems={"center"}
                    padding={isMobile ? 0 : 2}
                    color={"white"}
                  >
                    <Typography>
                      {new Date(currentSurvey.startTime).toLocaleDateString(
                        "sv-SE"
                      )}{" "}
                      -{" "}
                      {new Date(currentSurvey.endTime).toLocaleDateString(
                        "sv-SE"
                      )}
                    </Typography>
                    <Typography>{currentSurvey.question}</Typography>
                  </Box>
                ) : null}
                <PieChart
                  series={[{ type: "pie", data: chartData.data }]}
                  width={isMobile ? 300 : 500}
                  height={isMobile ? 250 : 300}
                  sx={{
                    [`& .${pieArcLabelClasses.root}`]: {
                      fill: "white",
                      color: "white",
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
          <Box
            sx={{
              maxWidth: isMobile ? "100%" : 300,
              textAlign: "center",
              color: "white",
            }}
          >
            <Button
              variant="contained"
              onClick={() => navigate("/createsurvey")}
              sx={{
                marginTop: 2,
                marginBottom: 2,
                fontWeight: "600",
              }}
            >
              <AddIcon /> Ny fråga
            </Button>
            <Typography variant="h6">Se statistik</Typography>
            {isMobile ? (
              <FormControl fullWidth>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  fullWidth
                  value={activeMenuChoice}
                  onChange={(event) => handleChooseFromMenu(event.target.value)}
                >
                  {menuChoices?.map((m, index) => (
                    <MenuItem key={index} value={m[0]}>
                      {m[0]}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            ) : (
              <>
                {Array.isArray(surveys) &&
                  surveys.map((check) => (
                    <Button
                      key={check.id}
                      variant="contained"
                      onClick={() => loadStatistic(check)}
                      sx={{
                        marginTop: 2,
                        backgroundColor:
                          currentSurvey?.id == check.id
                            ? theme1.palette.primary.main
                            : "lightgrey",
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
              </>
            )}
          </Box>
        </Container>
      </div>
    </Container>
  );
}
