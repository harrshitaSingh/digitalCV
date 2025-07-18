/* eslint-disable no-unused-vars */
import React, { useContext, useEffect, useState } from "react";
import {
  Box,
  CssBaseline,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
} from "@mui/material";
import EducationForm from "./Components/EducationSection";
import CertificationForm from "./Components/CertificationSection";
import ContactForm from "./Components/ContactSection";
import ExperienceForm from "./Components/ExperienceSection";
import ProjectForm from "./Components/ProjectsSection";
import SocialUrls from "./Components/SocilaLinksSection";
import UserComponent from "./Components/UserComponent";
import Sidebar from "./Components/Sidebar";
import CustomButton from "../../Components/CustomButton";
import "./styled.css";
import TemplatePreview from "../../Components/TemplatePreview";
import { ResumeContext } from "../../Context/ResumeContext";
import { toast, ToastContainer } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import MenuIcon from "@mui/icons-material/Menu";

export default function DashboardPage({ resume: resumeFromProps }) {
  const [selectedSection, setSelectedSection] = useState("Contact");
  const [resumeData, setResumeData] = useState(resumeFromProps || null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [getSectionData, setGetSectionData] = useState(() => () => ({}));
  const { updateResume } = useContext(ResumeContext);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"))
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => setMobileOpen(prev => !prev);


  const sectionOrder = [
    "Contact",
    "Experience",
    "Education",
    "Certifications",
    "Projects",
    "Links",
    "Finalize",
  ];

  const sectionKeyMap = {
    Contact: "contact",
    Education: "education",
    Experience: "experience",
    Projects: "project",
    Certifications: "certificates",
    GitHub: "github",
    LinkedIn: "linkedin",
    YouTube: "youTube",
    Links: "links",
    Template: "template",
  };


  useEffect(() => {
    if (!resumeFromProps) {
      const savedResume = localStorage.getItem("resume");
      if (savedResume) {
        setResumeData(JSON.parse(savedResume));
      }
    }
  }, [resumeFromProps]);

  const handleSectionChange = (section) => {
    setSelectedSection(section);
    setSidebarOpen(true);
    setTimeout(() => setSidebarOpen(false), 1500);
  };

  const handleContinue = () => {
    const currentIndex = sectionOrder.indexOf(selectedSection);
    const nextSection = sectionOrder[currentIndex + 1];
    const sectionData = getSectionData?.();
    const normalizedKey = sectionKeyMap[selectedSection];

    const isValidYouTubeLink = (url) => {
      const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube|youtu|youtube-nocookie)\.(com|be)\/(watch\?v=|embed\/|v\/|.+\/videoseries\?v=)[a-zA-Z0-9_-]{11}$/;
      return youtubeRegex.test(url);
    };


    if (sectionData.youTube && !isValidYouTubeLink(sectionData.youTube)) {
      toast.error("Please provide a valid YouTube link.");
      return;
    }


    if (!normalizedKey) {
      toast.error("Invalid section name. Please try again.");
      return;
    }

    if (!sectionData || Object.keys(sectionData).length === 0) {
      toast.error("Please fill all fields correctly before submitting.", {
        position: "bottom-center",
      });
      return;
    }

    if (resumeData?.id && normalizedKey) {
      if (normalizedKey === "links") {
        if (sectionData.github) {
          updateResume(resumeData.id, "github", sectionData.github);
        }
        if (sectionData.linkedin) {
          updateResume(resumeData.id, "linkedin", sectionData.linkedin);
        }
        if (sectionData.youTube) {

          updateResume(resumeData.id, "youTube", sectionData.youTube)
        }
      } else {
        updateResume(resumeData.id, normalizedKey, sectionData);
      }
    }

    if (nextSection) {
      setSelectedSection(nextSection);
      setSidebarOpen(true);
      setTimeout(() => setSidebarOpen(false), 1500);
    }
  };

  const handleBack = () => {
    const currentIndexBack = sectionOrder.indexOf(selectedSection);
    const prevSection = sectionOrder[currentIndexBack - 1];

    if (prevSection) {
      setSelectedSection(prevSection);
      setSidebarOpen(true);
      setTimeout(() => setSidebarOpen(false), 1500);
    }
  }

  const sectionComponents = {
    Contact: (
      <ContactForm
        resumeId={resumeData?.id}
        onContinue={handleContinue}
        setGetData={setGetSectionData}
      />
    ),
    Experience: (
      <ExperienceForm
        resumeId={resumeData?.id}
        onContinue={handleContinue}
        setGetData={setGetSectionData}
      />
    ),
    Education: (
      <EducationForm
        resumeId={resumeData?.id}
        onContinue={handleContinue}
        setGetData={setGetSectionData}
      />
    ),
    Certifications: (
      <CertificationForm
        resumeId={resumeData?.id}
        onContinue={handleContinue}
        setGetData={setGetSectionData}
      />
    ),
    Projects: (
      <ProjectForm
        resumeId={resumeData?.id}
        onContinue={handleContinue}
        setGetData={setGetSectionData}
      />
    ),
    Links: (
      <SocialUrls
        resumeId={resumeData?.id}
        onContinue={handleContinue}
        setGetData={setGetSectionData}
      />
    ),
    Finalize: <TemplatePreview resumeData={resumeData} />,
  };

  return (
    <>
      <AppBar
        position="fixed"
        sx={{ backgroundImage: "linear-gradient(135deg, #FFDEE9, #B5FFFC)" }}
        className="dashboard-appbar"
      >
        <Toolbar className="dashboard-toolbar">
          {isMobile && (
            <IconButton edge="start" onClick={handleDrawerToggle}>
              <MenuIcon />
            </IconButton>
          )}
          <UserComponent />
        </Toolbar>
      </AppBar>


      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <ToastContainer />
        <Sidebar
          output={Object.keys(sectionComponents)}
          selectedSection={selectedSection}
          setSelectedSection={handleSectionChange}
          resumeData={resumeData}
          open={mobileOpen}
          handleDrawerToggle={handleDrawerToggle}
        />

        <Box className="dashboard-main">
          <Toolbar />
          <Box sx={{ minHeight: "calc(100vh - 64px - 80px)" }}>
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedSection}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3 }}
              >
                {sectionComponents[selectedSection] || <Typography></Typography>}
              </motion.div>
            </AnimatePresence>
          </Box>

          {selectedSection && selectedSection !== "Finalize" && (
            <>
              {selectedSection !== "Contact" && (
                <Box
                  sx={{
                    position: "fixed",
                    bottom: 30,
                    left: { xs: 20, sm: 40, md: 300 },
                    zIndex: 1300,
                  }}
                >
                  <CustomButton
                    btnText="Back"
                    btnStyles={{
                      backgroundColor: "white",
                      color: "#000",
                      padding: "8px 36px",
                      border: "2px solid black",
                      minWidth: "auto",
                      width: { xs: "100px", sm: "auto" },
                    }}
                    updateClick={handleBack}
                  />
                </Box>
              )}

              <Box
                sx={{
                  position: "fixed",
                  bottom: 30,
                  right: 30,
                  zIndex: 1300,
                }}
              >
                <CustomButton
                  btnText="Continue"
                  btnStyles={{
                    backgroundColor: "#4b2354",
                    color: "#fff",
                    padding: "8px 24px",
                    minWidth: "auto",
                    width: { xs: "100px", sm: "auto" },
                  }}
                  updateClick={handleContinue}
                />
              </Box>
            </>
          )}

        </Box>
      </Box>

    </>

  );
}

