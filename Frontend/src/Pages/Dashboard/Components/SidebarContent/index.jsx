import React, { useState } from "react";
import {
  Stepper,
  Step,
  StepButton,
  Box,
  StepLabel,
} from "@mui/material";
import "./styled.css";
import TemplatePreview from "../../../../Components/TemplatePreview";

const CustomStepIcon = ({ active, className }) => (
  <Box
    className={`custom-step-icon ${active ? "active" : ""} ${className || ""}`}
  />
);

const SidebarContent = ({
  selectedSection,
  setSelectedSection,
  output,
  resumeData,
}) => {
  const steps = [...output];

  const [completedSteps, setCompletedSteps] = useState([]);

  const isStepCompleted = (section) => completedSteps.includes(section);

  const handleStepClick = (section, index) => {
    // const currentIndex = steps.indexOf(selectedSection);

    if (section === "Finalize") {
      if (completedSteps.length >= output.length) {
        <TemplatePreview resumeData={resumeData} />
      } else {
        alert("Please complete all previous sections first.");
      }
      return;
    }

    if (index <= completedSteps.length) {
      setSelectedSection(section);
    } else {
      alert("Please fill the current section before moving on.");
    }
  };

  React.useEffect(() => {
    if (
      selectedSection &&
      !completedSteps.includes(selectedSection) &&
      resumeData?.[selectedSection.toLowerCase()] &&
      resumeData[selectedSection.toLowerCase()]?.length > 0
    ) {
      setCompletedSteps((prev) => [...prev, selectedSection]);
    }
  }, [selectedSection, resumeData, completedSteps]);

  return (
    <Box>
      <Stepper
        orientation="vertical"
        nonLinear
        activeStep={steps.indexOf(selectedSection)}
        sx={{
          "& .MuiStepLabel-label": {
            color: "#4b2354",
            fontWeight: "bold",
            fontSize: "18px",
          },
          "& .MuiStep-root": {
            mb: 2,
          },
        }}
      >
        {steps.map((section, index) => (
          <Step key={section} completed={isStepCompleted(section)}>
            <StepButton
              onClick={() => handleStepClick(section, index)}
              icon={null}
              disabled={index > completedSteps.length}
            >
              <StepLabel StepIconComponent={CustomStepIcon}>
                {section}
              </StepLabel>
            </StepButton>
          </Step>
        ))}
      </Stepper>
    </Box>
  );
};

export default SidebarContent;
