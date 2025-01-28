import React from "react";
import Card from "@/components/ui/StatisticsCard";
import { Container, Grid } from "@mui/material";
import SectionTitle from "@/components/ui/SectionTitle";

export default function Statistics() {
  return (
    <Container className="section">
      <SectionTitle
        title=" إحصائيات الأسئلة"
        subTitle={
          "هنا ستجد الاسئلة التي قمت بحفظها بالإضافة الى الأسئلة ذات نسبة الخطأ العالية"
        }
      />
      <Grid container spacing={5} justifyContent="center">
        <Grid item xs={12} sm={6} md={5} data-aos="fade-up" data-aos-delay={50}>
          <Card
            title={"الأسئلة المحفوظة"}
            image={"/bookmark.png"}
            path={"/statistics/saved"}
          />
        </Grid>
        <Grid
          item
          xs={12}
          sm={6}
          md={5}
          data-aos="fade-up"
          data-aos-delay={150}
        >
          <Card
            title={"الأسئلة الأكثر خطأ"}
            image={"/incorrect.png"}
            path={"/statistics/wrong"}
          />
        </Grid>
      </Grid>
    </Container>
  );
}
