// components/ui/SkeletonQuizCard.js
import * as React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";

export default function SkeletonQuizCard() {
  return (
    <Card
      sx={{
        position: "relative",
        overflow: "visible",
        borderTop: "8px solid var(--primary1)",
        width: "100%",
        // Add slight animation to the card itself
        transition: "transform 0.3s ease, box-shadow 0.3s ease",
      }}
    >
      <Box>
        {/* Circle for quiz number skeleton */}
        <Skeleton
          variant="circular"
          width={45}
          height={45}
          sx={{
            position: "absolute",
            top: "-25px",
            left: "50%",
            transform: "translateX(-50%)",
            border: "5px solid var(--primary1)",
            bgcolor: "var(--primary1)",
            zIndex: 1,
          }}
        />

        <CardContent sx={{ padding: "3px", paddingTop: "27px" }}>
          {/* Quiz name skeleton */}
          <Skeleton
            variant="rounded"
            width="60%"
            height={28}
            sx={{ mx: "auto", mb: 2 }}
          />

          {/* Progress section skeleton */}
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            flexDirection="column"
            paddingBottom={1}
          >
            <Skeleton variant="text" width="40%" height={20} sx={{ mb: 1 }} />
            <Skeleton variant="rounded" width="80%" height={10} />
          </Box>
        </CardContent>
      </Box>
    </Card>
  );
}
