// components/NavigationMenu.js
"use client";
import React from "react";
import { navigationData } from "../data/navigationData"; // Adjust the import if necessary
import { iconMap } from "../data/iconMap"; // Import iconMap from the same file
import Link from "next/link";
const NavigationMenu = () => {
  return (
    <nav className="top-nav mega-menu nav">
      <ul id="mnu-eft" className="parent-menu">
        {navigationData.map((item, index) => (
          <li
            key={index}
            className={item.subMenu.length > 0 ? "hasChildren" : ""}
          >
            <Link href={item.path}>
              {/* Dynamically render the icon */}
              {item.icon && React.createElement(iconMap[item.icon])}
              <span>{item.title}</span>
            </Link>
            {/* Submenu */}
            {item.subMenu.length > 0 && (
              <ul style={{ maxWidth: "451px" }}>
                {item.subMenu.map((subItem, subIndex) => (
                  <li key={subIndex}>
                    <Link href={subItem.path}>{subItem.title}</Link>
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default NavigationMenu;
