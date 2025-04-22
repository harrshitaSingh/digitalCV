import React, { useCallback, useContext, useEffect, useState } from "react";
import { Box, Typography, Grid } from "@mui/material";
import CustomInput from "../../../../Components/CustomInput";
import { ResumeContext } from "../../../../Context/ResumeContext";

function SocialUrls({ resumeId, setGetData }) {
  const { resumes } = useContext(ResumeContext);
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [linkErrors, setLinkErrors] = useState({ linkedin: false, github: false });

  const getter = useCallback(() => {
    return {
      linkedin: linkedinUrl,
      github: githubUrl,
    };
  }, [linkedinUrl, githubUrl]);



  const isValidSocialUrl = (field, url) => {
    const regex = {
      linkedin: /^https?:\/\/(www\.)?linkedin\.com\/.*$/,
      github: /^https?:\/\/(www\.)?github\.com\/.*$/,
    };

    return regex[field]?.test(url.trim());
  };


  useEffect(() => {
    if (setGetData) {

      setGetData(() => getter);
    }
  }, [setGetData, getter]);

  useEffect(() => {
    if (resumes?.length > 0) {
      const selectedResume = resumes.find((resume) => resume.id === resumeId);

      if (selectedResume) {
        setLinkedinUrl(selectedResume.linkedin || "");
        setGithubUrl(selectedResume.github || "");
      }
    }
  }, [resumes, resumeId]);

  const handleLinksChange = (field, value) => {
    if (field === "linkedin") {
      setLinkedinUrl(value);
      setLinkErrors((prev) => ({
        ...prev,
        linkedin: !isValidSocialUrl("linkedin", value),
      }));
    } else if (field === "github") {
      setGithubUrl(value);
      setLinkErrors((prev) => ({
        ...prev,
        github: !isValidSocialUrl("github", value),
      }));
    }
  };

  return (
    <Box
      sx={{
        width: "60%",
        margin: "0 auto",
        padding: "2rem",
        boxShadow: 3,
        borderRadius: 2,
        bgcolor: "#f9f9f9",
      }}
    >
      <Box sx={{ display: "flex", justifyContent: "flex-start" }}>
        <Typography
          variant="h5"
          sx={{ marginBottom: 2, textAlign: "center", color: "#4b2354" }}
        >
          Add Links
        </Typography>
      </Box>

      <Grid container spacing={2}>
        <Grid item xs={6}>
          <CustomInput
            label="LinkedIn URL"
            inputType="text"
            currentValue={linkedinUrl}
            updateValue={(value) => handleLinksChange("linkedin", value)}
            required
            error={linkErrors.linkedin}
          />

        </Grid>
        <Grid item xs={6}>
          <CustomInput
            label="GitHub URL"
            inputType="text"
            currentValue={githubUrl}
            updateValue={(value) => handleLinksChange("github", value)}
            required
            error={linkErrors.github}
          />
        </Grid>

      </Grid>
    </Box>
  );
}

export default SocialUrls;
