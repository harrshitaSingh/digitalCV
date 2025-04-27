import React, { useCallback, useContext, useEffect, useState } from "react";
import { Box, Typography, Grid } from "@mui/material";
import CustomInput from "../../../../Components/CustomInput";
import { ResumeContext } from "../../../../Context/ResumeContext";
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import YouTubeIcon from '@mui/icons-material/YouTube';

function SocialUrls({ resumeId, setGetData }) {
  const { resumes } = useContext(ResumeContext);
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [youTubeLink, setYouTubeLink] = useState("");
  const [linkErrors, setLinkErrors] = useState({ linkedin: false, github: false, youTube: false });

  const getter = useCallback(() => {
    return {
      linkedin: linkedinUrl,
      github: githubUrl,
      youTube: youTubeLink,
    };
  }, [linkedinUrl, githubUrl, youTubeLink]);

  const isValidSocialUrl = (field, url) => {
    const regex = {
      linkedin: /^https?:\/\/(www\.)?linkedin\.com\/.*$/,
      github: /^https?:\/\/(www\.)?github\.com\/.*$/,
      youTube: /^https?:\/\/(www\.)?(youtube\.com|youtu\.be)\/.+$/,
    };
    return regex[field]?.test(url.trim());
  };

  const getYouTubeVideoId = (url) => {
    const regExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\\&v=)([^#\\&\\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
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
        setYouTubeLink(selectedResume.youTubeLink || "");
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
    } else if (field === "youTube") {
      setYouTubeLink(value);
      setLinkErrors((prev) => ({
        ...prev,
        youTube: !isValidSocialUrl("youTube", value),
      }));
    }
  };

  return (
    <Box
      sx={{
        width: { xs: "90%", sm: "60%" },
        margin: "0 auto",
        padding: "2rem",
        boxShadow: 3,
        borderRadius: 2,
        bgcolor: "#f9f9f9",
      }}
    >
      <Box sx={{ marginBottom: 3, flex: 1 }}>
        <Typography
          variant="h5"
          sx={{
            fontWeight: 'bold',
            fontSize: '1.5rem',
            color: '#1e1e1e',
          }}
        >
          Build your professional presence
        </Typography>
        <Typography
          variant="body1"
          sx={{
            fontSize: '1rem',
            color: '#1e1e1e',
            marginTop: 0.5,
          }}
        >
          Share your LinkedIn, GitHub, and video profile links to show your skills, achievements, and career journey.
        </Typography>
      </Box>

      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <CustomInput
            label="LinkedIn URL"
            inputType="text"
            currentValue={linkedinUrl}
            updateValue={(value) => handleLinksChange("linkedin", value)}
            required
            error={linkErrors.linkedin}
            icon={<LinkedInIcon />}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <CustomInput
            label="GitHub URL"
            inputType="text"
            currentValue={githubUrl}
            updateValue={(value) => handleLinksChange("github", value)}
            required
            error={linkErrors.github}
            icon={<GitHubIcon />}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <CustomInput
            label="YouTube URL"
            inputType="text"
            currentValue={youTubeLink}
            updateValue={(value) => handleLinksChange("youTube", value)}
            required
            error={linkErrors.youTube}
            icon={<YouTubeIcon />}
          />
        </Grid>

        {youTubeLink && isValidSocialUrl("youTube", youTubeLink) && getYouTubeVideoId(youTubeLink) && (
          <Grid item xs={12}>
            <Box sx={{ mt: 2, width: "100%" }}>
              <iframe
                width="100%"
                height="315"
                src={`https://www.youtube.com/embed/${getYouTubeVideoId(youTubeLink)}`}
                title="YouTube Video Preview"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                style={{ borderRadius: "12px", boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)" }}
              ></iframe>
            </Box>
          </Grid>
        )}
      </Grid>
    </Box>
  );
}

export default SocialUrls;
