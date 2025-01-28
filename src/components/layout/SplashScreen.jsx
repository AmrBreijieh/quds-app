import React, { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import { motion, AnimatePresence, useAnimation } from "framer-motion";

const SplashScreen = ({ children }) => {
  const [isVisible, setIsVisible] = useState(true);
  const controls = useAnimation();

  useEffect(() => {
    const sequence = async () => {
      // Initial appearance
      await controls.start({ opacity: 1 }, { duration: 0.5 });

      // Wait for 2 seconds
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Exit animation
      await controls.start({
        opacity: 0,
        transition: { duration: 0.5 },
      });

      // Hide component after animation
      setIsVisible(false);
    };

    sequence();
  }, [controls]);

  return (
    <>
      {/* Main Content with Conditional Blur */}
      <Box
        sx={{
          position: "relative",
          filter: isVisible ? "blur(4px)" : "none",
          transition: "filter 0.3s ease",
          minHeight: "100vh",
        }}
      >
        {children}
      </Box>

      {/* Splash Screen Overlay */}
      <AnimatePresence>
        {isVisible && (
          <Box
            component={motion.div}
            initial={{ opacity: 4 }}
            animate={controls}
            exit={{ opacity: 0 }}
            sx={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "rgba(27,30,36,0.9)",
              backdropFilter: "blur(4px)",
              WebkitBackdropFilter: "blur(4px)",
              zIndex: 9999,
              pointerEvents: "none",
            }}
          >
            {/* Title Animation */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.4 }}
            >
              <Typography
                variant="h3"
                sx={{
                  fontWeight: 700,
                  color: "#ffffff",
                  fontSize: "2.4rem",
                  mb: 1.5,
                  textShadow: "0 2px 4px rgba(0,0,0,0.3)",
                }}
              >
                مدرسة القدس
              </Typography>
            </motion.div>

            {/* Subtitle Animation */}
            <motion.div
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.4 }}
            >
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 500,
                  color: "#e0e0e0",
                  fontSize: "1.2rem",
                  mb: 4,
                  textShadow: "0 1px 2px rgba(0,0,0,0.2)",
                }}
              >
                بإدارة محمود مناصرة أبو ثائر
              </Typography>
            </motion.div>

            {/* Logo Animation */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{
                scale: 1,
                opacity: 1,
                transition: {
                  duration: 0.6,
                  ease: [0.17, 0.67, 0.83, 0.67],
                },
              }}
            >
              <Box
                component="img"
                src="/logo.png"
                alt="Logo"
                sx={{
                  width: 140,
                  height: 140,
                  mb: 3,
                  filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.3))",
                }}
              />
            </motion.div>

            {/* Made By Animation */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.7 }}
              transition={{ delay: 0.4 }}
            >
              <Typography
                variant="caption"
                sx={{
                  position: "absolute",
                  bottom: 60,
                  left: "50%",
                  transform: "translateX(-50%)",
                  color: "#ffffff",
                  fontSize: "1.1rem",
                  opacity: 1,
                }}
              >
                Made by{" "}
                <span style={{ fontWeight: 600, color: "white" }}>
                  Amr Breijieh
                </span>
              </Typography>
            </motion.div>
          </Box>
        )}
      </AnimatePresence>
    </>
  );
};

export default SplashScreen;
