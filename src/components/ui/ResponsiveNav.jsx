import * as React from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import Button from "@mui/material/Button";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import MenuIcon from "@mui/icons-material/Menu";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { iconMap } from "../data/iconMap"; // Import iconMap
import Collapse from "@mui/material/Collapse"; // Import Collapse for submenus
import { navigationData } from "../data/navigationData"; // Import the navigation data
import Link from "next/link";

export default function ResponsiveNav() {
  const [open, setOpen] = React.useState(false); // State to handle drawer visibility
  const [openSubMenu, setOpenSubMenu] = React.useState({}); // State for handling submenu visibility

  // Function to toggle the drawer open/close
  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };

  // Function to toggle submenu visibility
  const handleSubMenuToggle = (title) => {
    setOpenSubMenu((prevState) => ({
      ...prevState,
      [title]: !prevState[title],
    }));
  };

  // Get the icon dynamically from the iconMap
  const getIcon = (iconName) => {
    const IconComponent = iconMap[iconName];
    return IconComponent ? (
      <IconComponent style={{ color: "var(--primary1)" }} />
    ) : null; // Return null if no icon found
  };

  // Render the menu items and submenus
  const renderMenuItems = (menuItems, isSub = false) => {
    return menuItems.map((item) => (
      <div key={item.title}>
        {/* Use Next.js Link with passHref and MUI's component prop for seamless integration */}
        <Link href={item.path} passHref legacyBehavior>
          <ListItem sx={{ padding: isSub ? "0 20px 0 0" : "0" }} disablePadding>
            <ListItemButton
              component={Link}
              href={item.path}
              onClick={(e) => {
                setOpen(false);
              }}
            >
              <ListItemIcon>
                {getIcon(item.icon)} {/* Dynamically render the icon */}
              </ListItemIcon>
              <ListItemText
                primary={item.title}
                primaryTypographyProps={{
                  fontWeight: "800", // Make the text bold
                }}
                sx={{
                  textAlign: "right",
                  color: "var(--primary1)",
                }}
              />
              {item.subMenu && item.subMenu.length > 0 && (
                <ListItemIcon
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleSubMenuToggle(item.title);
                  }}
                  sx={{ minWidth: "auto", cursor: "pointer" }}
                >
                  {openSubMenu[item.title] ? (
                    <ExpandLessIcon
                      sx={{
                        backgroundColor: "var(--primary1)",
                        borderRadius: "50%",
                        color: "white",
                        padding: "4px",
                      }}
                    />
                  ) : (
                    <ExpandMoreIcon
                      sx={{
                        backgroundColor: "var(--primary1)",
                        borderRadius: "50%",
                        color: "white",
                        padding: "4px",
                      }}
                    />
                  )}
                </ListItemIcon>
              )}
            </ListItemButton>
          </ListItem>
        </Link>
        {/* Submenu */}
        {item.subMenu && item.subMenu.length > 0 && (
          <Collapse in={openSubMenu[item.title]} timeout="auto" unmountOnExit>
            <Box sx={{ pl: 4 }}>
              {renderMenuItems(item.subMenu, true)}{" "}
              {/* Recursively render submenus */}
            </Box>
          </Collapse>
        )}
      </div>
    ));
  };

  const DrawerList = (
    <Box
      sx={{ width: "100%" }} // Set width to 100%
      role="presentation"
      onClick={(e) => e.stopPropagation()} // Prevent closing drawer when clicking inside
    >
      <List>
        {renderMenuItems(navigationData)} {/* Render main menu */}
      </List>
    </Box>
  );

  return (
    <div className="resNav">
      <Button onClick={toggleDrawer(!open)} aria-label="Open navigation menu">
        <MenuIcon fontSize="large" className="menu-icon" />
      </Button>
      <Drawer
        open={open}
        onClose={toggleDrawer(false)} // Close the drawer when clicking outside
        anchor="top" // Use top anchor for the menu
        sx={{
          "& .MuiDrawer-paper": {
            width: "100%", // Ensure the drawer takes 100% of the width
            top: "90px", // Adjust the position of the drawer
            maxHeight: "calc(100vh - 90px)", // Prevent overflow and fit within viewport
            overflowY: "auto",
          },
          zIndex: 999,
        }}
      >
        {DrawerList}
      </Drawer>
    </div>
  );
}
