import React from "react";
import {
    Avatar,
    Box,
    Grid,
    Typography,
    Paper,
    Divider,
    Link,
} from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import GitHubIcon from "@mui/icons-material/GitHub";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import SchoolIcon from "@mui/icons-material/School";
import WorkIcon from "@mui/icons-material/Work";
import CodeIcon from "@mui/icons-material/Code";
import CertificateIcon from "@mui/icons-material/WorkspacePremium";

const CommonShareTemplate = ({ resumeData }) => {
    console.log(resumeData)
    const { contact, education = [], experience = [], project = [], certificates = [], linkedin, github } = resumeData;

    return (
        <Box id="resume-to-download">
            <Paper
                elevation={3}
                sx={{
                    p: 3,
                    borderRadius: 3,
                    m: 2,
                    backgroundColor: "#f5f5f5",
                    maxWidth: "1200px",
                    margin: "auto",
                }}
            >
                <Grid container spacing={3}>
                    {/* Left Section */}
                    <Grid item xs={12} md={4}>
                        <Box
                            sx={{
                                backgroundColor: "#2c3e50",
                                color: "white",
                                p: 3,
                                borderRadius: 3,
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                minHeight: "85vh",
                                boxSizing: "border-box",
                                overflow: "auto",
                                overflowX: "hidden"
                            }}
                        >
                            <Avatar sx={{ width: 100, height: 100, mb: 3, bgcolor: "#ffffff55" }} />
                            <Typography variant="h5" sx={{ fontWeight: "bold", color: "#fff", mb: 3 }}>
                                {`${contact.firstName} ${contact.lastName}`}
                            </Typography>
                            <Typography variant="body2" sx={{ fontStyle: "italic", mb: 3, color: "#ecf0f1" }}>
                                I want to work full time
                            </Typography>

                            <Box sx={{ textAlign: "left", width: "100%" }}>
                                <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                                    <EmailIcon fontSize="large" sx={{ mr: 1 }} />
                                    <Link href={`mailto:${contact.email}`} target="_blank" rel="noopener" underline="hover" sx={{ color: "#fff" }}>
                                        {contact.email}
                                    </Link>

                                    
                                </Box>
                                <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                                    <PhoneIcon fontSize="large" sx={{ mr: 1 }} /> {contact.phnNumber}
                                </Box>
                                <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                                    <LinkedInIcon fontSize="large" sx={{ mr: 1 }} />
                                    <Link href={linkedin} target="_blank" rel="noopener" underline="hover" sx={{ color: "#fff" }}>
                                        {linkedin}
                                    </Link>
                                </Box>
                                <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                                    <GitHubIcon fontSize="large" sx={{ mr: 1 }} />
                                    <Link href={github} target="_blank" rel="noopener" underline="hover" sx={{ color: "#fff" }}>
                                        {github}
                                    </Link>
                                </Box>
                            </Box>
                        </Box>
                    </Grid>

                    {/* Right Section */}
                    <Grid item xs={12} md={8}>
                        {/* Education */}
                        <Box sx={{ mb: 4 }}>
                            <Typography variant="h4" sx={{ display: "flex", alignItems: "center", mb: 1, color: "#2c3e50" }}>
                                <SchoolIcon sx={{ mr: 1, fontSize: "2rem" }} /> Education
                            </Typography>
                            <Divider sx={{ mb: 1 }} />
                            {education.map((edu, i) => (
                                <Box key={i} sx={{ mb: 1 }}>
                                    <Typography variant="subtitle1" fontWeight="bold">
                                        {edu.degree}, {edu.instituteName}
                                    </Typography>
                                    <Typography variant="body2">
                                        {edu.city}, {edu.country} — {edu.startEducationDate || "--"} to {edu.endEducationDate || "--"}
                                    </Typography>
                                </Box>
                            ))}
                        </Box>

                        {/* Experience */}
                        <Box sx={{ mb: 4 }}>
                            <Typography variant="h4" sx={{ display: "flex", alignItems: "center", mb: 1, color: "#2c3e50" }}>
                                <WorkIcon sx={{ mr: 1, fontSize: "2rem" }} /> Experience
                            </Typography>
                            <Divider sx={{ mb: 1 }} />
                            {experience.map((exp, i) => (
                                <Box key={i} sx={{ mb: 1 }}>
                                    <Typography variant="subtitle1" fontWeight="bold">
                                        {exp.jobTitle} @ {exp.company}
                                    </Typography>
                                    <Typography variant="body2">
                                        {exp.city}, {exp.country} — {exp.startDate || "--"} to {exp.endDate || "--"}
                                    </Typography>
                                    <Typography variant="body2">{exp.description}</Typography>
                                </Box>
                            ))}
                        </Box>

                        {/* Projects */}
                        <Box sx={{ mb: 4 }}>
                            <Typography variant="h4" sx={{ display: "flex", alignItems: "center", mb: 1, color: "#2c3e50" }}>
                                <CodeIcon sx={{ mr: 1, fontSize: "2rem" }} /> Projects
                            </Typography>
                            <Divider sx={{ mb: 1 }} />
                            {project.map((proj, i) => (
                                <Box key={i} sx={{ mb: 1 }}>
                                    <Typography variant="subtitle1" fontWeight="bold">
                                        {proj.title}
                                    </Typography>
                                    <Typography variant="body2">
                                        {proj.startDate || "--"} to {proj.endDate || "--"}
                                    </Typography>
                                    <Typography variant="body2">{proj.description}</Typography>
                                    {proj.link && (
                                        <Box sx={{ mt: 1 }}>
                                            <Link href={proj.link} target="_blank" rel="noopener" underline="hover">
                                                Project Link
                                            </Link>
                                        </Box>
                                    )}
                                </Box>
                            ))}
                        </Box>

                        {/* Certificates */}
                        <Box sx={{ mb: 4 }}>
                            <Typography variant="h4" sx={{ display: "flex", alignItems: "center", mb: 1, color: "#2c3e50" }}>
                                <CertificateIcon sx={{ mr: 1, fontSize: "2rem" }} /> Certificates
                            </Typography>
                            <Divider sx={{ mb: 1 }} />
                            {certificates.length > 0 ? (
                                certificates.map((cert, i) => (
                                    <Box key={i} sx={{ mb: 1 }}>
                                        <Typography variant="subtitle1" fontWeight="bold">
                                            {cert.title}
                                        </Typography>
                                        <Typography variant="body2">
                                            {cert.startDate || "--"} to {cert.endDate || "--"}
                                        </Typography>
                                        <Typography variant="body2">{cert.description}</Typography>
                                        {cert.link && (
                                            <Box sx={{ mt: 1 }}>
                                                <Link href={cert.link} target="_blank" rel="noopener" underline="hover">
                                                    Certificate Link
                                                </Link>
                                            </Box>
                                        )}
                                    </Box>
                                ))
                            ) : (
                                <Typography variant="body2">—</Typography>
                            )}
                        </Box>
                    </Grid>
                </Grid>
            </Paper>
        </Box>
    );
};

export default CommonShareTemplate;
