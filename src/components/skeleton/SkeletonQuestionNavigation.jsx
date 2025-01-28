import { Skeleton, Grid, Box } from "@mui/material";

const SkeletonQuestionNavigation = () => {
  return (
    <Box>
      {/* Navigation Buttons Skeleton */}
      <Grid container spacing={1} flex={1} justifyContent="center">
        {[1, 2, 3, 4, 5, 6].map((_, index) => (
          <Grid
            item
            key={index}
            sx={{
              display: "flex",
              justifyContent: "center",
            }}
          >
            <Skeleton
              variant="rounded"
              width={40}
              height={40}
              sx={{ borderRadius: 1 }}
            />
          </Grid>
        ))}
      </Grid>

      {/* Legend Skeleton */}
      <Box sx={{ mt: 3 }}>
        <Grid container spacing={2}>
          {[1, 2, 3, 4, 5, 6].map((_, idx) => (
            <Grid item key={idx} xs={4} sm={4} md={4}>
              <Box display="flex" alignItems="center">
                <Skeleton
                  variant="circular"
                  width={16}
                  height={16}
                  sx={{ mr: 0.1 }}
                />
                <Skeleton
                  variant="text"
                  width={60}
                  height={16}
                  sx={{ fontSize: "10px" }}
                />
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
};

export default SkeletonQuestionNavigation;
