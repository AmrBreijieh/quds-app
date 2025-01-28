import React from "react";
import { Box, Typography } from "@mui/material";
export default function SectionTitle({ title, subTitle }) {
  return (
    <Box
      sx={{
        textAlign: "center",
        mb: 4,
      }}
    >
      <Typography
        variant="h4"
        sx={{
          mb: 1,
        }}
        data-aos="fade-in"
      >
        {title}
      </Typography>
      <Typography variant="subtitle1" data-aos="fade-in" fontSize={18}>
        {subTitle}
      </Typography>
    </Box>
  );
}
