import React from "react";
import {
  Box,
  Container,
  Grid,
  Typography,
  Link,
  IconButton,
} from "@mui/material";
import FacebookIcon from "@mui/icons-material/Facebook";
import PhoneAndroidIcon from "@mui/icons-material/PhoneAndroid";
import LocalPhoneIcon from "@mui/icons-material/LocalPhone";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import { navigationData } from "../data/navigationData";
import Image from "next/image";

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        width: "100%",
        backgroundColor: "black",
        color: "white",
        py: 4,
        mt: 4,
        overflowX: "hidden",
      }}
      data-aos="fade-in"
      data-aos-easing="ease-in-back"
      data-aos-offset="-600"
    >
      <Container maxWidth="lg">
        <Grid container spacing={3} justifyContent="space-between">
          <Grid item xs={12} md={3}>
            <div className="logo" style={{ marginTop: "-4px" }}>
              <Link
                href="/"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "1rem",
                  textDecoration: "none",
                }}
              >
                <Image
                  src="/logo.png"
                  alt="Logo"
                  width={70}
                  height={70}
                  priority
                />
                <div style={{ textAlign: "center" }}>
                  <Typography
                    variant="subtitle1"
                    fontSize={16}
                    fontWeight={800}
                  >
                    مدرسة
                  </Typography>
                  <Typography
                    variant="h4"
                    component="h2"
                    fontWeight={800}
                    marginTop={-1.8}
                  >
                    القدس
                  </Typography>
                </div>
              </Link>
            </div>
            <Typography variant="body1" sx={{ opacity: 0.8 }}>
              أفضل مكان للتحضير لامتحان التؤوريا والحصول على رخصة السياقة
            </Typography>
            <Box mt={2}>
              <IconButton
                aria-label="Facebook"
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                sx={{ color: "white" }}
              >
                <FacebookIcon />
              </IconButton>
              <IconButton
                aria-label="WhatsApp"
                href="https://wa.me/+972568688633"
                target="_blank"
                rel="noopener noreferrer"
                sx={{ color: "white" }}
              >
                <WhatsAppIcon />
              </IconButton>
            </Box>
          </Grid>

          <Grid item xs={12} md={4}>
            <Typography
              variant="h6"
              gutterBottom
              color="var(--primary1)"
              fontWeight={700}
            >
              معلومات الاتصال
            </Typography>
            <Typography variant="body1">
              بيت لحم، شارع واد معالي - عمارة رقم 114
            </Typography>
            <Typography variant="body1">
              <LocalPhoneIcon />
              02-2764073
            </Typography>
            <Typography variant="body1">
              <PhoneAndroidIcon /> 0599-314190
            </Typography>
            <Typography variant="body1">
              <PhoneAndroidIcon />
              0569-314190
            </Typography>
            <Typography variant="body1" mt={2}>
              رائد:
            </Typography>
            <Typography variant="body1">
              <PhoneAndroidIcon />
              0592-748433
            </Typography>
            <Typography variant="body1">
              <PhoneAndroidIcon />
              0568-688633
            </Typography>
            <Typography variant="body1">
              صاحب المدرسة ومديرها: محمود مناصرة
            </Typography>
          </Grid>

          <Grid item xs={12} md={4}>
            <Grid container spacing={2}>
              {navigationData
                .filter((e) => e.subMenu.length > 0)
                .map((navItem, idx) => (
                  <Grid item xs={6} sm={4} md={6} key={idx}>
                    <Typography
                      variant="subtitle1"
                      gutterBottom
                      fontWeight={700}
                      color="var(--primary1)"
                    >
                      {navItem.title}
                    </Typography>
                    {navItem.subMenu && navItem.subMenu.length > 0 ? (
                      navItem.subMenu.map((subItem, subIdx) => (
                        <Box key={subIdx} mb={1}>
                          <Link
                            href={subItem.path}
                            underline="hover"
                            color="inherit"
                            sx={{ fontSize: "0.9rem", opacity: 0.8 }}
                          >
                            {subItem.title}
                          </Link>
                        </Box>
                      ))
                    ) : (
                      <></>
                    )}
                  </Grid>
                ))}
            </Grid>
          </Grid>
        </Grid>

        <Box mt={4} textAlign="center">
          <Typography variant="body1" color="white">
            {`© ${new Date().getFullYear()} | مدرسة القدس | جميع الحقوق محفوظة.`}
          </Typography>
          <Typography variant="body1" color="white">
            Made by
            <Link
              href="https://wa.me/+972595313953"
              color="#d8a336"
              target="_blank"
              fontSize={20}
              fontWeight={800}
              sx={{ textDecoration: "none" }}
              p={1}
            >
              Amr Breijieh
            </Link>
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}
