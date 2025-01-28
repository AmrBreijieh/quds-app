import React from "react";
import { Modal, Box, Typography, Button } from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

const ScoreModal = ({ open, score, total, onRestart, onClose }) => {
  // Calculate the number of mistakes
  const mistakes = total - score;

  // Determine success or failure message and icon
  const isPassed = mistakes < 5;
  const resultMessage = isPassed ? "لقد نجحت" : "لقد رسبت";
  const resultIcon = isPassed ? (
    <CheckCircleOutlineIcon color="success" sx={{ fontSize: 60 }} />
  ) : (
    <ErrorOutlineIcon color="error" sx={{ fontSize: 60 }} />
  );

  // Motivational messages based on the score
  const motivationalMessage = isPassed
    ? "أحسنت! لقد قمت بعمل رائع. استمر في التقدم فأنت على الطريق الصحيح."
    : "لا تقلق! يمكنك المحاولة مرة أخرى والتحسن. النجاح يأتي بالمثابرة والتعلم من الأخطاء.";

  return (
    <Modal open={open} onClose={onClose} aria-labelledby="score-modal-title">
      <Box
        sx={{
          outline: "none", // Removes the default outline
          border: "none",
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: { xs: 320, sm: 400 },
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
          textAlign: "center",
          fontFamily: "cairo",
        }}
      >
        {resultIcon}
        <Typography id="score-modal-title" variant="h4" gutterBottom>
          {resultMessage}
        </Typography>
        <Typography variant="h5" gutterBottom>
          {score} / {total}
        </Typography>
        <Typography
          variant="body1"
          color={isPassed ? "success.main" : "error.main"}
          gutterBottom
        >
          {motivationalMessage}
        </Typography>
        <Box sx={{ display: "flex", justifyContent: "center", gap: 1, mt: 2 }}>
          <Button
            variant="outlined"
            color="secondary"
            sx={{ fontWeight: "700" }}
            onClick={onClose}
          >
            اغلاق
          </Button>
          <Button
            variant="contained"
            color="primary"
            sx={{ fontWeight: "700", color: "white" }}
            onClick={onRestart}
          >
            إعادة الاختبار
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default ScoreModal;
