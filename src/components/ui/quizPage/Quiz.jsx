// File: ./src/pages/teoria/[type]/[quizNumber]/index.jsx
import React, { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/router";
import { Box, Button, CircularProgress, Typography } from "@mui/material";
import { motion } from "framer-motion";

import SectionHero from "@/components/layout/SectionHero";
import ProgressBar from "@/components/ui/quizPage/ProgressBar";
import TimeUpModal from "@/components/ui/quizPage/TimeUpModal";
import Score from "@/components/ui/quizPage/Score";
import QuestionComponent from "@/components/ui/quizPage/Question";
import QuestionNavigation from "@/components/ui/quizPage/QuestionNavigation";
import SkeletonQuestionComponent from "@/components/skeleton/SkeletonQuestion";
import SkeletonQuestionNavigation from "@/components/skeleton/SkeletonQuestionNavigation";
import { Skeleton } from "@mui/material";
import quizData from "@/pages/data.json";
import {
  recordWrongAnswerTypeLevel,
  recordLastScore,
} from "@/components/util/quizStorage";

// Memoized components
const MemoizedQuestion = React.memo(QuestionComponent);
const MemoizedNavigation = React.memo(QuestionNavigation);

const Quiz = () => {
  const router = useRouter();
  const { type, quizNumber } = router.query;
  const questionTitleRef = useRef(null);
  const headerHeight = 100;

  // States
  // Add this state hook
  const [isQuestionTransitioning, setIsQuestionTransitioning] = useState(false);
  const [autoNext, setAutoNext] = useState(false);
  const [questions, setQuestions] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState([]);
  const [visited, setVisited] = useState([]);
  const [timeLeft, setTimeLeft] = useState(40 * 60);
  const [scoreModalOpen, setScoreModalOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [showAnswers, setShowAnswers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [wrongRecordedQuestions, setWrongRecordedQuestions] = useState(
    new Set()
  );

  // Data loading
  useEffect(() => {
    if (!type || !quizNumber) {
      router.push("/");
      return;
    }

    const loadData = () => {
      try {
        const quizDataByType = quizData.n?.[type];
        if (!quizDataByType) throw new Error("Invalid quiz type");

        const quiz = quizDataByType[quizNumber];
        if (!quiz?.length) throw new Error("Quiz not found");

        setQuestions(quiz);
        setUserAnswers(Array(quiz.length).fill(null));
        setShowAnswers(Array(quiz.length).fill(false));
        setError(null);
      } catch (err) {
        console.error("Data load error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [type, quizNumber, router]);

  // Visited questions tracking
  useEffect(() => {
    if (questions) {
      setIsQuestionTransitioning(true);
      const timer = setTimeout(() => setIsQuestionTransitioning(false), 300);
      return () => clearTimeout(timer);
    }
  }, [currentIndex, questions]);

  // Timer logic
  useEffect(() => {
    if (!questions) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 0) {
          clearInterval(timer);
          setModalOpen(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [questions]);

  // Answer handling
  const handleSelect = useCallback(
    (option) => {
      setUserAnswers((prev) => {
        const newAnswers = [...prev];
        const isCorrect = option === questions[currentIndex].answer;
        newAnswers[currentIndex] = { answer: option, isCorrect };
        return newAnswers;
      });

      if (autoNext && currentIndex < questions.length - 1) {
        setTimeout(() => handleNext(), 250);
      }
    },
    [autoNext, currentIndex, questions]
  );

  // Navigation
  const scrollToQuestion = useCallback(() => {
    if (questionTitleRef.current) {
      const elementPosition = questionTitleRef.current.offsetTop - headerHeight;
      window.scrollTo({ top: elementPosition, behavior: "smooth" });
    }
  }, [headerHeight]);

  const handleNavigate = useCallback(
    (index) => {
      setCurrentIndex(index);
      scrollToQuestion();
    },
    [scrollToQuestion]
  );

  const handleNext = useCallback(() => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      scrollToQuestion();
    } else {
      handleFinish();
    }
  }, [currentIndex, questions?.length, scrollToQuestion]);

  const handlePrev = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
      scrollToQuestion();
    }
  }, [currentIndex, scrollToQuestion]);

  // Answer verification - UPDATED WRONG ANSWER HANDLING
  const handleShowAnswer = useCallback(async () => {
    setShowAnswers((prev) => {
      const newShow = [...prev];
      newShow[currentIndex] = true;
      return newShow;
    });

    const answer = userAnswers[currentIndex];
    if (!answer) return;

    const key = `${quizNumber}-${currentIndex}`;
    if (!answer.isCorrect && !wrongRecordedQuestions.has(key)) {
      try {
        await recordWrongAnswerTypeLevel(type, quizNumber, currentIndex);
        setWrongRecordedQuestions((prev) => new Set([...prev, key]));
      } catch (err) {
        console.error("Error recording wrong answer:", err);
      }
    }

    if (autoNext && currentIndex < questions.length - 1) {
      setTimeout(handleNext, 250);
    }
  }, [
    currentIndex,
    userAnswers,
    wrongRecordedQuestions,
    autoNext,
    questions?.length,
    handleNext,
    type,
    quizNumber,
  ]);

  // Finish handler - UPDATED WRONG ANSWER HANDLING
  // Update the handleFinish function in your existing code
  const handleFinish = useCallback(async () => {
    // Create evaluated answers with correct validation
    const evaluatedAnswers = questions.map((q, index) => {
      const userAnswer = userAnswers[index];
      return {
        answer: userAnswer?.answer || null,
        isCorrect: userAnswer?.answer === q.answer,
      };
    });

    setUserAnswers(evaluatedAnswers);

    // Process wrong answers sequentially
    const newWrongKeys = [];

    for (const [index, answer] of evaluatedAnswers.entries()) {
      const key = `${quizNumber}-${index}`;
      if (!answer.isCorrect && !wrongRecordedQuestions.has(key)) {
        try {
          await recordWrongAnswerTypeLevel(type, quizNumber, index);
          newWrongKeys.push(key);
        } catch (err) {
          console.error("Error recording wrong answer:", err);
        }
      }
    }

    // Update recorded questions state
    setWrongRecordedQuestions((prev) => new Set([...prev, ...newWrongKeys]));

    // Record score
    const score = evaluatedAnswers.filter((a) => a.isCorrect).length;
    await recordLastScore(type, quizNumber, score, questions.length);

    // Update UI
    setShowAnswers(Array(questions.length).fill(true));
    setScoreModalOpen(true);
  }, [questions, userAnswers, wrongRecordedQuestions, quizNumber, type]);
  // Restart handler
  const handleRestart = useCallback(() => {
    setUserAnswers(Array(questions.length).fill(null));
    setVisited([]);
    setTimeLeft(40 * 60);
    setScoreModalOpen(false);
    setCurrentIndex(0);
    setModalOpen(false);
    setShowAnswers(Array(questions.length).fill(false));
    setWrongRecordedQuestions(new Set());
  }, [questions]);

  // Render states
  if (loading) {
    return (
      <>
        <SectionHero title={`أسئلة تؤوريا (تحميل...)`} />

        <Box sx={{ maxWidth: 1000, mx: "auto", mt: 4, p: 2 }}>
          {/* Skeleton Progress Bar */}
          <Box sx={{ mb: 3 }}>
            <Skeleton variant="rounded" width="100%" height={40} />
          </Box>

          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              gap: 2,
            }}
          >
            {/* Question Area Skeleton */}
            <Box sx={{ flex: 2 }}>
              <SkeletonQuestionComponent />

              {/* Navigation Controls Skeleton */}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 1,
                  mt: 2,
                }}
              >
                <Skeleton variant="rounded" width={100} height={40} />
                <Skeleton variant="rounded" width={150} height={40} />
                <Skeleton variant="rounded" width={100} height={40} />
              </Box>
            </Box>

            {/* Navigation Skeleton */}
            <Box sx={{ flex: 1 }}>
              <SkeletonQuestionNavigation />
            </Box>
          </Box>
        </Box>
      </>
    );
  }

  if (error) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
        <Typography variant="h6" color="error">
          {error}
        </Typography>
      </Box>
    );
  }

  const mapTypes = {
    private: "خصوصي",
    light: "شحن خفيف",
    heavy: "شحن ثقيل",
    taxi: "عمومي",
    motorcycle: "دراجة نارية",
    tractor: "تراكتور",
  };

  return (
    <>
      <SectionHero title={`أسئلة تؤوريا ${mapTypes[type]} (${quizNumber})`} />
      {/* Here put a horizntail scrool numberis brom 1 t0 30  */}
      <Box sx={{ maxWidth: 1000, mx: "auto", mt: 4, p: 2 }}>
        <ProgressBar
          questionTitleRef={questionTitleRef}
          answeredQuestions={userAnswers.filter(Boolean).length}
          total={questions.length}
          timeLeft={timeLeft}
          autoNext={autoNext}
          setAutoNext={setAutoNext}
        />

        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            gap: 2,
            mt: 2,
          }}
        >
          {/* Question Area */}
          <Box sx={{ flex: 2 }}>
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              {isQuestionTransitioning ? (
                <SkeletonQuestionComponent />
              ) : (
                <MemoizedQuestion
                  question={questions[currentIndex].question}
                  options={{
                    a: questions[currentIndex].a,
                    b: questions[currentIndex].b,
                    c: questions[currentIndex].c,
                    d: questions[currentIndex].d,
                  }}
                  correctAnswer={questions[currentIndex].answer}
                  userAnswer={userAnswers[currentIndex]?.answer}
                  showAnswer={showAnswers[currentIndex]}
                  questionNumber={currentIndex + 1}
                  type={type}
                  quizNumber={quizNumber}
                  questionIndex={currentIndex}
                  onSelect={handleSelect}
                />
              )}
            </motion.div>

            {/* Navigation Controls */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                gap: 1,
                mt: 2,
              }}
            >
              <Button
                variant="contained"
                onClick={handlePrev}
                disabled={currentIndex === 0}
                sx={{
                  fontWeight: 800,
                  color: "white",
                  bgcolor: "#737373",
                  "&:hover": { backgroundColor: "#5c5c5c" },
                }}
              >
                السابق
              </Button>

              <Button
                variant="contained"
                color="secondary"
                sx={{
                  fontWeight: "700",
                  bgcolor: "#87CEEB",
                  color: "white",
                  "&:hover": { bgcolor: "#5ebbe0" },
                }}
                onClick={handleShowAnswer}
                disabled={showAnswers[currentIndex]}
              >
                التحقق من الإجابة
              </Button>

              <Button
                variant="contained"
                color={
                  currentIndex === questions.length - 1 ? "success" : "primary"
                }
                sx={{
                  fontWeight: 800,
                  color: "white",
                  p: "10px 20px",
                  "&:hover": { backgroundColor: "#a37729" },
                }}
                onClick={handleNext}
              >
                {currentIndex < questions.length - 1 ? "التالي" : "إنهاء"}
              </Button>
            </Box>
          </Box>

          {/* Side Navigation */}
          <Box sx={{ flex: 1 }}>
            <MemoizedNavigation
              totalQuestions={questions.length}
              currentIndex={currentIndex}
              userAnswers={userAnswers}
              visited={visited}
              showAnswers={showAnswers}
              onNavigate={handleNavigate}
            />
          </Box>
        </Box>

        {/* Modals */}
        <TimeUpModal
          open={modalOpen}
          onContinue={() => setModalOpen(false)}
          onFinish={handleFinish}
        />

        <Score
          open={scoreModalOpen}
          score={userAnswers.filter((a) => a?.isCorrect).length}
          total={questions.length}
          onRestart={handleRestart}
          onClose={() => setScoreModalOpen(false)}
        />
      </Box>
    </>
  );
};

export default Quiz;
