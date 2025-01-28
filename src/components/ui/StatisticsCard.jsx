import * as React from "react";
import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import CardActionArea from "@mui/material/CardActionArea";
import Link from "next/link";

export default function StatisticsCard({
  title,
  description = "",
  image,
  path,
}) {
  const theme = useTheme();

  return (
    <Card
      sx={{
        maxWidth: { xs: 250, sm: 500 },
        transition: "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
        "&:hover": {
          transform: "scale(1.05)",
          boxShadow: theme.shadows[10],
        },
      }}
    >
      <Link href={path} passHref>
        <CardActionArea
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Box sx={{ display: "flex", flexDirection: "column", flex: 1 }}>
            <CardContent>
              <Typography
                component="div"
                variant="h6"
                sx={{
                  fontSize: { xs: "1rem", sm: "1.25rem" },
                  fontWeight: "600",
                }}
              >
                {title}
              </Typography>
              <Typography
                variant="subtitle1"
                component="div"
                sx={{
                  color: "text.secondary",
                  fontSize: { xs: "0.875rem", sm: "1rem" },
                }}
              >
                {description}
              </Typography>
            </CardContent>
          </Box>
          <Box
            display={"flex"}
            justifyContent={"center"}
            alignItems={"center"}
            sx={{
              backgroundColor: "var(--primary1)",
              padding: "1.5rem",
              width: { xs: "100%", sm: "50%" },

              textAlign: "center",
            }}
          >
            <CardMedia
              component="img"
              image={image}
              loading="lazy"
              sx={{
                width: { xs: "80px", sm: "100px" },
                height: { xs: "80px", sm: "100px" },
                objectFit: "contain",
              }}
              alt={title}
            />
          </Box>
        </CardActionArea>
      </Link>
    </Card>
  );
}
