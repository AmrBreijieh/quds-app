// pages/_app.js
import { Cairo } from "next/font/google";
import { useEffect, useState } from "react";
import { App as CapacitorApp } from "@capacitor/app";
import { Capacitor } from "@capacitor/core";
import { useRouter } from "next/router";
import AOS from "aos";
import "aos/dist/aos.css";
import Providers from "../components/layout/Providers";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import "./globals.css";
import "../styles/hero.css";
import "../styles/Navigation.css";
import "../styles/signs.css";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/effect-fade";
import ConfirmExitDialog from "../components/layout/Exit";
import SplashScreen from "@/components/layout/SplashScreen"; // Import the splash screen

// Initialize the font
const cairo = Cairo({
  subsets: ["arabic", "latin"],
  variable: "--font-cairo",
  weight: ["200", "300", "400", "500", "600", "700", "800"],
});

function App({ Component, pageProps }) {
  const router = useRouter();
  const [exitDialogOpen, setExitDialogOpen] = useState(false);
  const [showSplash, setShowSplash] = useState(true); // Add splash screen state

  // AOS animations
  useEffect(() => {
    AOS.init({
      duration: 500,
      once: true,
      offset: 0,
      easing: "ease-in-out",
    });
  }, []);

  // Listen for Android hardware back button
  useEffect(() => {
    let backButtonListener;

    if (Capacitor.isNativePlatform()) {
      backButtonListener = CapacitorApp.addListener("backButton", () => {
        if (router.pathname === "/") {
          setExitDialogOpen(true);
        } else {
          router.back();
        }
      });
    }

    return () => {
      if (
        backButtonListener &&
        typeof backButtonListener.remove === "function"
      ) {
        backButtonListener.remove();
      }
    };
  }, [router]);

  const handleConfirmExit = () => {
    CapacitorApp.exitApp();
  };

  const handleCancelExit = () => {
    setExitDialogOpen(false);
  };

  return (
    <div className={cairo.variable}>
      <Providers>
        <>
          <SplashScreen>
            <Header />
            <div style={{ minHeight: "100vh" }}>
              <Component {...pageProps} />
            </div>
            <Footer />
          </SplashScreen>
        </>

        {/* MUI Dialog to confirm exit */}
        <ConfirmExitDialog
          open={exitDialogOpen}
          onConfirm={handleConfirmExit}
          onCancel={handleCancelExit}
        />
      </Providers>
    </div>
  );
}

export default App;
