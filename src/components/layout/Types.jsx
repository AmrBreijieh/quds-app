"use client";
import * as React from "react";
import { Box, Container } from "@mui/material";
import ActionAreaCard from "../ui/Card";
import { typesData } from "../data/typesData";
import SectionTitle from "../ui/SectionTitle";
export default function Types() {
  return (
    <Container className="section">
      <SectionTitle
        title="أسئلة التؤوريا"
        subTitle={"   إختر نوع الرخصة لدراسة أسئلة التؤوريا الخاصة بها"}
      />

      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 3,
          // responsive widths
          "& > div": {
            flex: "1 1 100%",
          },
          "@media (min-width: 600px)": {
            "& > div": {
              flex: "1 1 calc(50% - 24px)",
            },
          },
          "@media (min-width: 900px)": {
            "& > div": {
              flex: "1 1 calc(33.333% - 24px)",
            },
          },
        }}
      >
        {typesData.map((type, index) => (
          <Box
            key={index}
            // Add AOS attributes here:
            data-aos="fade-up"
            data-aos-delay={index * 50} // optional delay for a stagger effect
          >
            <ActionAreaCard
              title={type.title}
              image={type.image}
              path={type.path}
            />
          </Box>
        ))}
      </Box>
    </Container>
  );
}
