import React from "react";
import Image from "next/image";
import { Container, Typography } from "@mui/material";
import Navigation from "../ui/Navigation";
import ResponsiveNav from "../ui/ResponsiveNav";
import Link from "next/link";
const Header = () => {
  return (
    <header className="top-head" data-sticky="true">
      <Container
        maxWidth="xl"
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "2rem",
        }}
      >
        {/* Logo Section */}
        <div className="logo" style={{ marginTop: "-4px" }}>
          <Link
            href="/"
            style={{ display: "flex", alignItems: "center", gap: "1rem" }}
          >
            <Image src="/logo.png" alt="Logo" width={70} height={70} priority />
            <div style={{ textAlign: "center" }}>
              <Typography variant="subtitle1" fontSize={16} fontWeight={800}>
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
        <Navigation />
        <ResponsiveNav />
      </Container>
    </header>
  );
};

export default Header;
