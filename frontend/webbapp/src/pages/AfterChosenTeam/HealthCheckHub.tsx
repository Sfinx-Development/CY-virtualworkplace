import AddIcon from "@mui/icons-material/Add";
import { Box, Button, Container, Typography } from "@mui/material";
import { PieChart, pieArcLabelClasses } from "@mui/x-charts/PieChart";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { isMobile } from "../../../globalConstants";
import { HealthCheck } from "../../../types";
import {
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

export default function HealthCheckHub() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

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

  const loadStatistic = async (check: HealthCheck) => {
    await dispatch(GetProfileHealthChecksAsync(check.id));
  };

  return (
    <Container sx={{ padding: "20px" }}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Container
          sx={{
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
            alignItems: isMobile ? "center" : "flex-start",
          }}
        >
          <Box
            sx={{
              flex: 1,
              marginTop: 10,
              display: "flex",
              justifyContent: "center",
              marginRight: isMobile ? 0 : 10,
            }}
          >
            {chartData.data.length > 0 ? (
              <PieChart
                series={[{ type: "pie", data: chartData.data }]}
                width={isMobile ? 300 : 600}
                height={isMobile ? 300 : 400}
                sx={{
                  [`& .${pieArcLabelClasses.root}`]: {
                    fill: "white",
                    fontWeight: "bold",
                  },
                }}
              />
            ) : null}
          </Box>
          <Box sx={{ maxWidth: isMobile ? "100%" : 300, textAlign: "center" }}>
            <Button
              variant="contained"
              onClick={() => navigate("/createhealthcheck")}
              sx={{
                marginTop: 2,
                marginBottom: 2,
                backgroundColor: "lightgrey",
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
                  }}
                >
                  {check.question}
                </Button>
              ))}
          </Box>
        </Container>
      </div>
    </Container>
  );
}
