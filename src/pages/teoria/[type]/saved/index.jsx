import React, {
  useEffect,
  useState,
  useCallback,
  useMemo,
  useRef,
} from "react";
import { useRouter } from "next/router";
import {
  Box,
  Typography,
  CircularProgress,
  Button,
  Snackbar,
} from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";

import SectionHero from "@/components/layout/SectionHero";
import { loadTypeBookmarks } from "@/components/util/quizStorage";
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

export default function SavedQuestionsPage() {
  const router = useRouter();
  const { type } = router.query;
  const batchSize = 3;
  const loaderRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(batchSize);
  const [allBookmarks, setAllBookmarks] = useState([]);
  const [showAnswersMap, setShowAnswersMap] = useState({});
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  // Load and sort bookmarks
  useEffect(() => {
    if (!type) return;

    const fetchBookmarks = async () => {
      try {
        const bookmarksObj = await loadTypeBookmarks(type);
        const flattened = Object.entries(bookmarksObj)
          .flatMap(([quizNumber, indices]) =>
            indices.map((qIndex) => [quizNumber, parseInt(qIndex, 10)])
          )
          .sort((a, b) => {
            const quizA = parseInt(a[0], 10);
            const quizB = parseInt(b[0], 10);
            return quizA - quizB || a[1] - b[1];
          });

        setAllBookmarks(flattened);
      } catch (err) {
        console.error("Error loading bookmarks:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBookmarks();
  }, [type]);

  // Infinite scroll observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && visibleCount < allBookmarks.length) {
          setVisibleCount((prev) =>
            Math.min(prev + batchSize, allBookmarks.length)
          );
        }
      },
      { threshold: 0.1, rootMargin: "100px" }
    );

    if (loaderRef.current) observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [visibleCount, allBookmarks.length]);

  // Handlers
  const handleSelectOption = useCallback((key, option) => {
    setSelectedAnswers((prev) => ({ ...prev, [key]: option }));
  }, []);

  const handleShowAnswer = useCallback((key) => {
    setShowAnswersMap((prev) => ({ ...prev, [key]: true }));
  }, []);

  const handleBookmarkToggle = useCallback(
    (quizNumber, questionIndex, nowBookmarked) => {
      if (!nowBookmarked) {
        setAllBookmarks((prev) =>
          prev.filter(
            ([qNum, qIdx]) => !(qNum === quizNumber && qIdx === questionIndex)
          )
        );
        setSnackbarMessage("تم إزالة السؤال من القائمة المحفوظة");
        setSnackbarOpen(true);
      }
    },
    []
  );

  const handleCloseSnackbar = () => setSnackbarOpen(false);

  // Memoized bookmark item component
  const BookmarkItem = useMemo(
    () =>
      React.memo(({ quizNumber, questionIdx }) => {
        const itemKey = `${quizNumber}-${questionIdx}`;
        const questionData = quizData.n?.[type]?.[quizNumber]?.[questionIdx];

        if (!questionData) return null;

        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            layout
          >
            <Box sx={{ mb: 3, p: 0, borderBottom: "2px solid #ccc" }}>
              <QuestionComponent
                question={questionData.question}
                options={questionData}
                correctAnswer={questionData.answer}
                userAnswer={selectedAnswers[itemKey]}
                showAnswer={!!showAnswersMap[itemKey]}
                onSelect={(option) => handleSelectOption(itemKey, option)}
                onBookmarkToggle={handleBookmarkToggle}
                questionNumber={questionIdx + 1}
                type={type}
                quizNumber={quizNumber}
                questionIndex={questionIdx}
              />
              <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => handleShowAnswer(itemKey)}
                  disabled={!!showAnswersMap[itemKey]}
                  sx={buttonStyles}
                >
                  التحقق من الإجابة
                </Button>
              </Box>
            </Box>
          </motion.div>
        );
      }),
    [
      type,
      selectedAnswers,
      showAnswersMap,
      handleSelectOption,
      handleBookmarkToggle,
      handleShowAnswer,
    ]
  );

  // Visible bookmarks
  const visibleBookmarks = useMemo(
    () => allBookmarks.slice(0, visibleCount),
    [allBookmarks, visibleCount]
  );

  if (loading) {
    return (
      <Box sx={{ textAlign: "center", mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      <SectionHero title={`الأسئلة المحفوظة - ${mapTypes[type]}`} />

      <Box sx={{ maxWidth: 800, mx: "auto", mt: 4, p: 2 }}>
        <AnimatePresence mode="popLayout">
          {visibleBookmarks.map(([quizNumber, questionIdx]) => (
            <BookmarkItem
              key={`${quizNumber}-${questionIdx}`}
              quizNumber={quizNumber}
              questionIdx={questionIdx}
            />
          ))}
        </AnimatePresence>

        {visibleCount < allBookmarks.length && (
          <Box
            ref={loaderRef}
            sx={{ display: "flex", justifyContent: "center", py: 2 }}
          >
            <CircularProgress size={24} thickness={4} />
          </Box>
        )}

        {!loading && allBookmarks.length === 0 && (
          <Typography variant="h6" sx={{ textAlign: "center", mt: 4 }}>
            لا توجد أسئلة محفوظة بعد.
          </Typography>
        )}
      </Box>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={2000}
        onClose={handleCloseSnackbar}
        message={snackbarMessage}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        sx={{ "& .MuiSnackbarContent-root": { borderRadius: "8px" } }}
      />
    </>
  );
}

const buttonStyles = {
  fontWeight: "700",
  bgcolor: "#87CEEB",
  color: "white",
  mb: 1.3,
  minWidth: "200px",
  "&:hover": { bgcolor: "#5ebbe0" },
  "&:disabled": { bgcolor: "#e0e0e0", color: "#666" },
};
