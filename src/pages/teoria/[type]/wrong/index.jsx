import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useRouter } from "next/router";
import {
  Box,
  Typography,
  IconButton,
  Tooltip,
  Button,
  Snackbar,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { motion, AnimatePresence } from "framer-motion";
import debounce from "lodash.debounce";
import { CircularProgress } from "@mui/material";
import SectionHero from "@/components/layout/SectionHero";
import {
  loadTypeWrongAnswers,
  removeWrongAnswerTypeLevel,
} from "@/components/util/quizStorage";
import quizData from "@/pages/data.json";
import QuestionComponent from "@/components/ui/quizPage/Question";

const mapTypes = {
  private: "خصوصي",
  light: "شحن خفيف",
  heavy: "شحن ثقيل",
  taxi: "عمومي",
  motorcycle: "دراجة نارية",
  tractor: "تراكتور",
};

const PAGE_SIZE = 5;
const SCROLL_DEBOUNCE = 100;
const LOAD_TRIGGER_OFFSET = 1300; // Load new items when 300px from bottom

export default function WrongAnswersPage() {
  const router = useRouter();
  const { type } = router.query;

  const [wrongAnswersArray, setWrongAnswersArray] = useState([]);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [loading, setLoading] = useState(true);
  const [showAnswersMap, setShowAnswersMap] = useState({});
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackMessage, setSnackMessage] = useState("");
  const [deleteDialogKey, setDeleteDialogKey] = useState(null);

  // Memoized sorted wrong answers
  const sortedWrongAnswers = useMemo(() => {
    return [...wrongAnswersArray].sort((a, b) => b[1] - a[1]);
  }, [wrongAnswersArray]);

  // Debounced scroll handler
  const handleScroll = useCallback(
    debounce(() => {
      const scrollPosition = window.innerHeight + window.scrollY;
      const scrollThreshold = document.body.offsetHeight - LOAD_TRIGGER_OFFSET;

      if (scrollPosition >= scrollThreshold) {
        setVisibleCount((prev) =>
          Math.min(prev + PAGE_SIZE, sortedWrongAnswers.length)
        );
      }
    }, SCROLL_DEBOUNCE),
    [sortedWrongAnswers.length]
  );
  // Add loading indicator at the bottom
  const loadingMore = visibleCount < sortedWrongAnswers.length;

  // Load initial data
  useEffect(() => {
    if (!type) return;

    let isMounted = true;
    const loadData = async () => {
      try {
        const wrongAnswersObj = await loadTypeWrongAnswers(type);
        if (isMounted) {
          setWrongAnswersArray(Object.entries(wrongAnswersObj));
        }
      } catch (error) {
        console.error("Error loading wrong answers:", error);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadData();
    return () => {
      isMounted = false;
    };
  }, [type]);

  // Scroll listener
  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  // Handlers with memoization
  const handleSelectOption = useCallback((key, option) => {
    setSelectedAnswers((prev) => ({ ...prev, [key]: option }));
  }, []);

  const handleShowAnswer = useCallback((key) => {
    setShowAnswersMap((prev) => ({ ...prev, [key]: true }));
  }, []);

  const handleOpenDeleteDialog = useCallback((key) => {
    setDeleteDialogKey(key);
  }, []);

  const handleConfirmDelete = useCallback(async () => {
    if (!deleteDialogKey) return;

    try {
      const [quizNumber, questionIndex] = deleteDialogKey.split("-");
      await removeWrongAnswerTypeLevel(
        type,
        quizNumber,
        parseInt(questionIndex, 10)
      );

      setWrongAnswersArray((prev) =>
        prev.filter(([k]) => k !== deleteDialogKey)
      );
      setSnackMessage("تم حذف السؤال من قائمة الأخطاء");
      setOpenSnackbar(true);
    } catch (error) {
      console.error("Error removing wrong answer:", error);
    } finally {
      setDeleteDialogKey(null);
    }
  }, [deleteDialogKey, type]);

  // Memoized question components
  const visibleQuestions = useMemo(
    () =>
      sortedWrongAnswers.slice(0, visibleCount).map(([key, count]) => {
        const [quizNumber, questionIndex] = key.split("-");
        const questionIdx = parseInt(questionIndex, 10);
        const questionData = quizData.n?.[type]?.[quizNumber]?.[questionIdx];

        if (!questionData) return null;

        return (
          <motion.div
            key={key}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <QuestionBlock
              key={key}
              questionKey={key}
              count={count}
              questionData={questionData}
              userAnswer={selectedAnswers[key]}
              showAnswer={showAnswersMap[key]}
              onSelect={handleSelectOption}
              onShowAnswer={handleShowAnswer}
              onDelete={handleOpenDeleteDialog}
            />
          </motion.div>
        );
      }),
    [
      sortedWrongAnswers,
      visibleCount,
      type,
      selectedAnswers,
      showAnswersMap,
      handleSelectOption,
      handleShowAnswer,
      handleOpenDeleteDialog,
    ]
  );

  if (loading) {
    return (
      <Box sx={{ textAlign: "center", mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!sortedWrongAnswers.length) {
    return (
      <>
        <SectionHero title={`الأسئلة الخاطئة - ${mapTypes[type]}`} />
        <Box sx={{ textAlign: "center", mt: 4 }}>
          <Typography variant="h6">لا توجد أسئلة خاطئة بعد.</Typography>
        </Box>
      </>
    );
  }

  return (
    <>
      <SectionHero title={`الأسئلة الخاطئة - ${mapTypes[type]}`} />

      <Box sx={{ maxWidth: 1000, mx: "auto", mt: 4, p: 2 }}>
        <AnimatePresence initial={false}>
          {visibleQuestions}

          {loadingMore && (
            <Box
              sx={{ display: "flex", justifyContent: "center", mt: 4, mb: 6 }}
            >
              <CircularProgress size={40} />
            </Box>
          )}
        </AnimatePresence>
      </Box>

      <DeleteConfirmationDialog
        open={Boolean(deleteDialogKey)}
        onClose={() => setDeleteDialogKey(null)}
        onConfirm={handleConfirmDelete}
      />

      <Snackbar
        open={openSnackbar}
        autoHideDuration={2000}
        onClose={() => setOpenSnackbar(false)}
        message={snackMessage}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      />
    </>
  );
}

// Memoized Question Block Component
const QuestionBlock = React.memo(
  ({
    questionKey,
    count,
    questionData,
    userAnswer,
    showAnswer,
    onSelect,
    onShowAnswer,
    onDelete,
  }) => (
    <Box
      sx={{
        mb: 6,
        p: 0,
        borderBottom: "2px solid #ddd",
        paddingBottom: 3,
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography variant="subtitle1" fontWeight="bold">
          عدد مرات الخطأ: {count}
        </Typography>
        <Tooltip title="حذف السؤال">
          <IconButton color="error" onClick={() => onDelete(questionKey)}>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      </Box>

      <QuestionComponent
        question={questionData.question}
        options={{
          a: questionData.a,
          b: questionData.b,
          c: questionData.c,
          d: questionData.d,
        }}
        correctAnswer={questionData.answer}
        userAnswer={userAnswer}
        showAnswer={showAnswer}
        onSelect={(option) => onSelect(questionKey, option)}
      />

      {!showAnswer && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
          <Button
            onClick={() => onShowAnswer(questionKey)}
            variant="contained"
            color="secondary"
            sx={{
              fontWeight: "700",
              bgcolor: "#87CEEB",
              color: "white",
              "&:hover": { bgcolor: "#5ebbe0" },
            }}
          >
            التحقق من الإجابة
          </Button>
        </Box>
      )}
    </Box>
  )
);

// Memoized Delete Dialog
const DeleteConfirmationDialog = React.memo(({ open, onClose, onConfirm }) => (
  <Dialog open={open} onClose={onClose} sx={{ fontFamily: "Cairo" }}>
    <DialogTitle>تأكيد الحذف</DialogTitle>
    <DialogContent>
      <DialogContentText>
        هل أنت متأكد أنك تريد حذف هذا السؤال من قائمة الأخطاء؟
      </DialogContentText>
    </DialogContent>
    <DialogActions>
      <Button onClick={onClose} color="inherit">
        إلغاء
      </Button>
      <Button onClick={onConfirm} color="error" variant="contained">
        حذف
      </Button>
    </DialogActions>
  </Dialog>
));
