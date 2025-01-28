// File: ./src/components/ProgressBar.jsx

import React from "react";
import {
  Box,
  LinearProgress,
  Typography,
  FormControlLabel,
  Switch,
} from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";

const ProgressBar = ({
  answeredQuestions,
  total,
  timeLeft,
  questionTitleRef,
  autoNext,
  setAutoNext,
}) => {
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  // Calculate progress percentages
  const progressPercentage = (answeredQuestions / total) * 100;
  const timePercentage = (timeLeft / 1800) * 100; // Assuming TOTAL_TIME is 1800 seconds

  return (
    <Box sx={{ width: "100%" }} ref={questionTitleRef}>
      {/* Progress Section */}
      <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
        <Typography variant="body1" sx={{ flexGrow: 1 }}>
          مستوى التقدم: {Math.round(progressPercentage)}%
        </Typography>
      </Box>
      <LinearProgress
        variant="determinate"
        value={progressPercentage}
        sx={{ height: 10, borderRadius: 5, mb: 1 }}
      />

      {/* Time Section */}
      <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
        <AccessTimeIcon sx={{ mr: 1, color: "text.secondary" }} />
        <Typography variant="body1" ml={3}>
          الوقت المتبقي: {minutes < 10 ? `0${minutes}` : minutes}:
          {seconds < 10 ? `0${seconds}` : seconds}
        </Typography>
        <FormControlLabel
          control={
            <Switch
              checked={autoNext}
              onChange={(e) => setAutoNext(e.target.checked)}
              color="primary"
            />
          }
          label="التنقل التلقائي"
          labelPlacement="start"
        />
      </Box>
    </Box>
  );
};

export default ProgressBar;
