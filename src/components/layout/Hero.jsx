"use client";

import React from "react";
import Image from "next/image"; // Import Next.js Image component
import { heroSlides } from "../data/heroData.js";

// Swiper React wrapper and modules
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade } from "swiper/modules";

export default function HeroSlider() {
  return (
    <Swiper
      modules={[Autoplay, EffectFade]}
      spaceBetween={0}
      slidesPerView={1}
      allowTouchMove={false}
      loop={true}
      autoplay={{ delay: 3500, disableOnInteraction: true }}
      effect="fade"
      speed={1000}
      style={{ width: "100%", height: "calc(100vh - 92px)" }}
    >
      {heroSlides.map((slide) => (
        <SwiperSlide key={slide.id}>
          <div style={{ position: "relative", width: "100%", height: "100%" }}>
            <Image
              src={slide.imageUrl}
              alt={slide.altText}
              fill // New prop
              style={{ objectFit: "cover" }}
              placeholder="blur" // Enables blur effect
              blurDataURL={slide.blurDataUrl} // Base64-encoded placeholder
              priority={slide.id === 1} // Load first image eagerly
              loading={slide.id === 1 ? "eager" : "lazy"} // Load first image eagerly
              className="slide-image"
            />
            <div className="slide-text-overlay">
              <h1 className="slide-title">{slide.title}</h1>
              <p className="slide-subtitle">{slide.subtitle}</p>
            </div>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
