import * as React from "react";
import PropTypes from "prop-types";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

function CircularProgressWithGrade({ grade, total }) {
  const mistakes = total - grade;
  const color = mistakes <= 5 ? "success" : "error";

  return (
    <Box
      sx={{
        position: "relative",
        display: "inline-flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      {/* Background CircularProgress (full circle) */}
      <CircularProgress
        variant="determinate"
        value={100}
        size={50}
        thickness={4}
        sx={{ color: "rgba(0, 0, 0, 0.1)" }} // Light grey background
      />

      {/* Foreground CircularProgress (actual progress) */}
      <CircularProgress
        variant="determinate"
        value={grade == 0 ? 0 : (grade / total) * 100}
        color={color}
        size={50}
        thickness={4}
        sx={{ position: "absolute", top: 0, left: 0 }}
      />

      <Box
        sx={{
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          position: "absolute",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
        }}
      >
        <Typography
          component="div"
          fontSize={13}
          sx={{ fontWeight: "bold", color: "text.primary" }}
        >
          {`${grade}/${total}`}
        </Typography>
      </Box>
    </Box>
  );
}

CircularProgressWithGrade.propTypes = {
  grade: PropTypes.number.isRequired,
  total: PropTypes.number.isRequired,
};

export default CircularProgressWithGrade;
