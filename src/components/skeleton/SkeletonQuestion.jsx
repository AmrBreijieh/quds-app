// components/ui/quizPage/SkeletonQuestionComponent.js
import { Skeleton, Box } from "@mui/material";

const SkeletonQuestionComponent = () => {
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
    >
      {/* Bookmark Skeleton */}
      <Skeleton
        variant="circular"
        width={20}
        height={20}
        sx={{ position: "absolute", top: 8, left: 8 }}
      />

      {/* Question Text Skeleton */}
      <Skeleton
        variant="text"
        width="80%"
        height={40}
        sx={{ mb: 4, ml: "10px" }}
      />

      {/* Options Skeletons */}
      <Box>
        {[1, 2, 3, 4].map((num) => (
          <Skeleton
            key={num}
            variant="rounded"
            width="100%"
            height={56}
            sx={{
              mt: 1.1,
              borderRadius: 1,
              bgcolor: "grey.100",
            }}
          />
        ))}
      </Box>

      {/* Answer Icons Skeleton (hidden behind options) */}
      <Box sx={{ display: "none" }}>
        <Skeleton variant="circular" width={24} height={24} />
        <Skeleton variant="circular" width={24} height={24} />
      </Box>
    </Box>
  );
};

export default SkeletonQuestionComponent;
