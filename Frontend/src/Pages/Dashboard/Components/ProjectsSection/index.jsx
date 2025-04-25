import React, { useCallback, useContext, useEffect, useState } from "react";
import { Box, Typography, Grid } from "@mui/material";
import CustomInput from "../../../../Components/CustomInput";
import { ResumeContext } from "../../../../Context/ResumeContext";
import CustomButton from "../../../../Components/CustomButton";
import Add from "@mui/icons-material/Add";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";


function ProjectForm({ resumeId, setGetData }) {
  const { resumes } = useContext(ResumeContext);
  const [projectName, setProjectName] = useState([
    {
      title: "",
      description: "",
      technologies: "",
      startDate: '',
      endDate: '',
      link: "",
      currentlyWorking: false,
    },
  ]);

  const isValidFieldProjects = (key,value) => {
    if (key === "link") return true; // allow empty string for link
    return typeof value === "string" && value.trim().length > 0;

  };

  const getter = useCallback(() => {
    const isAllValidProjects = projectName.every((proj) => {
      return Object.entries(proj).every(([key, val]) => {
        if (key === "endDate" && proj.currentlyWorking) return true;
        if (key === "currentlyWorking") return true;
        return isValidFieldProjects(key, val);
      });
    });

    if (!isAllValidProjects) {
      return null;
    }

    return projectName;
  }, [projectName]);


  useEffect(() => {
    if (setGetData) {

      setGetData(() => getter);
    }
  }, [setGetData, getter]);

  useEffect(() => {
    if (resumes && resumes.length > 0) {
      const selectedProj = resumes.find((resume) => resume.id === resumeId);

      if (
        selectedProj &&
        Array.isArray(selectedProj.project) &&
        selectedProj.project.length > 0
      ) {
        setProjectName(
          selectedProj.project.map((proj) => ({
            title: proj.title || "",
            description: proj.description || "",
            technologies: proj.technologies || "",
            startDate: proj.startDate || '',
            endDate: proj.endDate || '',
            link: proj.link || "",
            currentlyWorking: proj.currentlyWorking || false,
          }))
        );
      }
    }
  }, [resumes, resumeId]);



  const handleProj = (index, field, value) => {
    const updatedProjectName = projectName.map((proj, i) =>
      i === index ? { ...proj, [field]: value } : proj
    );

    if (field === "currentlyWorking" && value === true) {
      updatedProjectName[index]["endDate"] = "";
    }
    setProjectName(updatedProjectName);
  };


  const handleProjectAdd = () => {
    const newProject = {
      title: "",
      description: "",
      technologies: "",
      startDate: '',
      endDate: '',
      link: "",
      currentlyWorking: false
    };

    const updatedProject = [...projectName, newProject];
    setProjectName(updatedProject);
  };

  return (
    <Box
      sx={{
        width: { xs: '90%', sm: '80%', md: '70%', lg: '60%' },
        margin: '0 auto',
        padding: { xs: '0.5rem', sm: '0.5rem', md: '1rem' },
        boxShadow: 3,
        borderRadius: 2,
        bgcolor: '#f9f9f9',
      }}
    >
      <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, justifyContent: "space-between", p: 3 }}>
        <Box sx={{ marginBottom: 3, flex: 1 }}>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 'bold',
              fontSize: '1.5rem',
              color: '#1e1e1e',
            }}
          >
            Showcase the projects that define your journey
          </Typography>
          <Typography
            variant="body1"
            sx={{
              fontSize: '1rem',
              color: '#1e1e1e',
              marginTop: 0.5,
            }}
          >
            Highlight the real-world projects that reflect your initiative, innovation, and ability to drive results from concept to completion
          </Typography>
        </Box>

        <CustomButton
          btnText={<Add />}
          btnStyles={{
            backgroundColor: "#4b2354",
            color: "white",
            border: "none",
            borderRadius: "50%",
            width: "48px",
            height: "48px",
            minWidth: "unset",
            padding: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer"
          }}
          updateClick={handleProjectAdd}
        />
      </Box>

      {projectName.map((projects, index) => (
        <Grid container spacing={2} sx={{ mb: 10 }} key={index}>
          <Grid item xs={12}>
            <Box sx={{ position: "relative" }}>
              <CustomInput
                label="Project Name"
                inputType="text"
                currentValue={projects.title}
                updateValue={(value) => handleProj(index, "title", value)}
              />
              {isValidFieldProjects("title",projects.title) && (
                <CheckCircleIcon
                  sx={{
                    color: "green",
                    position: "absolute",
                    right: 10,
                    top: "50%",
                    transform: "translateY(-50%)",
                  }}
                />
              )}
            </Box>
          </Grid>

          <Grid item xs={12}>
            <Box sx={{ position: "relative" }}>
              <CustomInput
                label="Technologies"
                inputType="text"
                currentValue={projects.technologies}
                updateValue={(value) => handleProj(index, "technologies", value)}
              />
              {isValidFieldProjects("technologies",projects.technologies) && (
                <CheckCircleIcon
                  sx={{
                    color: "green",
                    position: "absolute",
                    right: 10,
                    top: "50%",
                    transform: "translateY(-50%)",
                  }}
                />
              )}
            </Box>
          </Grid>

          <Grid item xs={12}>
            <Box sx={{ position: "relative" }}>
              <CustomInput
                fullWidth
                label="Description"
                variant="outlined"
                currentValue={projects.description}
                updateValue={(value) => handleProj(index, "description", value)}
                multiline
                maxRows={4}
                maxLength={200}
              />
              {isValidFieldProjects("description",projects.description) && (
                <CheckCircleIcon
                  sx={{
                    color: "green",
                    position: "absolute",
                    right: 10,
                    top: "50%",
                    transform: "translateY(-50%)",
                  }}
                />
              )}
            </Box>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Box sx={{ position: "relative" }}>
              <CustomInput
                label="Start Date"
                currentValue={projects.startDate}
                updateValue={(value) =>
                  handleProj(index, "startDate", value)
                }
                date={{ shrink: true }}
                required
                inputType="date"
              />
              {isValidFieldProjects("startDate",projects.startDate) && (
                <CheckCircleIcon
                  sx={{
                    color: "green",
                    position: "absolute",
                    right: 10,
                    top: "50%",
                    transform: "translateY(-50%)",
                  }}
                />
              )}
            </Box>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Box sx={{ position: "relative" }}>
              <CustomInput
                label="End Date"
                currentValue={projects.endDate}
                updateValue={(value) =>
                  handleProj(index, "endDate", value)
                }
                date={{ shrink: true }}
                required
                inputType="date"
                disabled={projects.currentlyWorking}
              />
              {!projects.currentlyWorking && isValidFieldProjects("endDate",projects.endDate) && (
                <CheckCircleIcon
                  sx={{
                    color: "green",
                    position: "absolute",
                    right: 10,
                    top: "50%",
                    transform: "translateY(-50%)",
                  }}
                />
              )}
            </Box>
            <Grid item xs={12}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <input
                  type="checkbox"
                  checked={projects.currentlyWorking}
                  onChange={(e) =>
                    handleProj(index, "currentlyWorking", e.target.checked)
                  }
                />
                <Typography>In Progress</Typography>
              </Box>
            </Grid>
          </Grid>

          <Grid item xs={12}>
            <Box sx={{ position: "relative" }}>
              <CustomInput
                label="Project Link"
                inputType="text"
                currentValue={projects.link}
                updateValue={(value) => handleProj(index, "link", value)}
              />
            </Box>
          </Grid>
        </Grid>
      ))}
    </Box>
  );

}

export default ProjectForm;
