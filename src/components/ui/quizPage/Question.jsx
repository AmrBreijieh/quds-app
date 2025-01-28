import React, { useState, useEffect } from "react";
import { Box, Button, Typography, IconButton, Snackbar } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import parseText from "@/components/ui/quizPage/parseText";

// Import your storage helpers
import {
  loadTypeBookmarks,
  bookmarkQuestionTypeLevel,
  unbookmarkQuestionTypeLevel,
} from "@/components/util/quizStorage";

/**
 * QuestionComponent:
 * Renders a single question, plus a bookmark icon.
 * We add an `onBookmarkToggle` prop for the parent to update local state instantly.
 */
const QuestionComponent = ({
  question,
  options, // e.g. { a: ..., b: ..., c: ..., d: ... }
  correctAnswer, // e.g. "1"
  userAnswer, // e.g. "1"
  showAnswer,
  onSelect,
  questionNumber,
  type, // e.g. "private"
  quizNumber, // e.g. "1"
  questionIndex, // e.g. 0
  // NEW PROP to notify parent when bookmark state changes
  onBookmarkToggle = () => {},
}) => {
  const [bookmarked, setBookmarked] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);

  // Check if bookmarked on mount
  useEffect(() => {
    const checkBookmarked = async () => {
      const bookmarksObj = await loadTypeBookmarks(type);
      const quizBookmarks = bookmarksObj[quizNumber] || [];
      if (quizBookmarks.includes(questionIndex)) {
        setBookmarked(true);
      }
    };
    checkBookmarked();
  }, [type, quizNumber, questionIndex]);

  // Toggle bookmark
  const handleToggleBookmark = async () => {
    try {
      setOpenSnackbar(true);

      if (bookmarked) {
        // unbookmark
        await unbookmarkQuestionTypeLevel(type, quizNumber, questionIndex);
        setBookmarked(false);

        // 1) notify parent that this item is now unbookmarked
        onBookmarkToggle(quizNumber, questionIndex, false);
      } else {
        // bookmark
        await bookmarkQuestionTypeLevel(type, quizNumber, questionIndex);
        setBookmarked(true);

        // 2) notify parent that this item is now bookmarked
        onBookmarkToggle(quizNumber, questionIndex, true);
      }
    } catch (error) {
      console.error("Bookmark toggle error:", error);
    }
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") return;
    setOpenSnackbar(false);
  };

  // Helper: map "1"/"2"/"3"/"4" => 'a','b','c','d'
  const getOptionKey = (num) => {
    switch (num) {
      case "1":
        return "a";
      case "2":
        return "b";
      case "3":
        return "c";
      case "4":
        return "d";
      default:
        return "";
    }
  };

  return (
    <Box
      sx={{
        position: "relative",
        border: "1px solid #ddd",
        borderRadius: 2,
        p: 2,
        mb: 1,
        bgcolor: "#fdfdfd",
        boxShadow: 1,
      }}
      key={questionNumber}
    >
      {/* Bookmark Icon */}
      <IconButton
        onClick={handleToggleBookmark}
        sx={{ position: "absolute", top: 0, left: 0 }}
        aria-label="Bookmark this question"
      >
        {bookmarked ? <BookmarkIcon color="primary" /> : <BookmarkBorderIcon />}
      </IconButton>

      {/* Snackbar feedback */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={2000}
        onClose={handleCloseSnackbar}
        message={bookmarked ? "تم حفظ السؤال بنجاح" : "تم إلغاء حفظ السؤال"}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      />

      <Typography
        variant="h6"
        gutterBottom
        fontSize="16px"
        fontWeight={800}
        mb={4}
        pl="10px"
      >
        {questionNumber}- {parseText(question)}
      </Typography>

      {/* Render Options */}
      <Box>
        {["1", "2", "3", "4"].map((num) => {
          const optionKey = getOptionKey(num);
          const optionText = options[optionKey] || "";

          let bgColor = "grey.100";
          let textColor = "text.primary";

          if (showAnswer) {
            if (num === correctAnswer) {
              bgColor = "success.light";
              textColor = "success.dark";
            } else if (num === userAnswer && num !== correctAnswer) {
              bgColor = "error.main";
              textColor = "error.dark";
            } else {
              textColor = "text.disabled";
            }
          } else if (num === userAnswer) {
            bgColor = "warning.light";
            textColor = "white";
          }

          const isSelected = userAnswer === num;
          const isCorrect = num === correctAnswer;
          const isIncorrect = isSelected && !isCorrect;

          return (
            <Button
              fullWidth
              key={num}
              onClick={() => onSelect(num)}
              disabled={showAnswer}
              sx={{
                mt: 1.1,
                textAlign: "left",
                bgcolor: bgColor,
                color: textColor,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: 1.7,
                borderRadius: 1,
                boxShadow: isSelected ? 3 : 1,
                transition: "all 0.3s ease",
                "&:hover": {
                  bgcolor: showAnswer
                    ? bgColor
                    : isSelected
                    ? "warning.main"
                    : "#e0e0e0",
                  color: isSelected
                    ? "white"
                    : showAnswer
                    ? textColor
                    : "text.primary",
                  boxShadow: showAnswer ? (isSelected ? 3 : 1) : 4,
                },
                "&:disabled": {
                  bgcolor: bgColor,
                  color: textColor,
                  boxShadow: "none",
                },
              }}
              aria-label={
                showAnswer
                  ? isCorrect
                    ? `الخيار ${num}: الإجابة الصحيحة`
                    : isIncorrect
                    ? `الخيار ${num}: إجابتك الخاطئة`
                    : `الخيار ${num}`
                  : `اختر الخيار ${num}: ${optionText}`
              }
            >
              <Typography
                variant="body1"
                fontWeight={600}
                fontSize="15px"
                textAlign="right"
                sx={{ flexGrow: 1 }}
              >
                {parseText(optionText)}
              </Typography>

              {/* Show icons only if "showAnswer" is true */}
              {showAnswer &&
                (isCorrect ? (
                  <CheckCircleIcon color="success" />
                ) : isIncorrect ? (
                  <CancelIcon />
                ) : null)}
            </Button>
          );
        })}
      </Box>
    </Box>
  );
};

export default QuestionComponent;
