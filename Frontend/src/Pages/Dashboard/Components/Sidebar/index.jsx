import React from "react";
import { Drawer, Box, Typography, Divider, useMediaQuery } from "@mui/material";
import SidebarContent from "../SidebarContent";
import "./styled.css";

const drawerWidth = 240;

const Sidebar = ({ selectedSection, setSelectedSection, handleModal, output, resumeData, open, setOpen, handleDrawerToggle }) => {
  const isMobile = useMediaQuery('(max-width:600px)');

  return (
    <Drawer
      variant={isMobile ? "temporary" : "permanent"}
      open={open}
      onClose={handleDrawerToggle} // Handle closing of the sidebar
      ModalProps={{
        keepMounted: true, // Better open performance on mobile.
      }}
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: drawerWidth,
          boxSizing: "border-box",
          backgroundImage: "linear-gradient(135deg, #FFDEE9, #B5FFFC)",
          color: "#4b2354",
        },
      }}
    >
      <Box className="sidebar-header">
        <Typography variant="h5" sx={{ color: "#4b2354", fontFamily: 'Helvetica Neue', fontSize: "4vh", fontWeight: "bold" }}>
          {"DigitalCV"}
        </Typography>
      </Box>
      <Divider />
      <Box sx={{ mt: 3, px: 2 }}>
        <SidebarContent
          selectedSection={selectedSection}
          setSelectedSection={setSelectedSection}
          output={output}
          handleModal={handleModal}
        />
      </Box>
    </Drawer>
  );
};

export default Sidebar;
