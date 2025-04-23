import React from "react";
import {
    Box,
    Typography,
    Grid,
    Paper,
    List,
    ListItem,
    ListItemText,
} from "@mui/material";
import "./styled.css";
import CustomAvatar from "../../CustomAvatar";

const ModernResumeTemplate = ({ resumeData, preview }) => {
    if (!resumeData) return null;

    const { id, github, linkedin, contact, education, experience, project, certificates, skills } = resumeData;

    return (
        <Box
            // id="resume-to-download"

            sx={{
                transform: preview ? 'scale(0.5)' : 'scale(1)',
                transformOrigin: 'top center',
                width: '100%', // Ensures container takes full width
                height: preview ? 'auto' : '100%',
                overflow: 'hidden',
                display: 'flex',
                justifyContent: 'center', // Centers Paper horizontally
                alignItems: 'flex-start',
                marginTop: preview ? '2rem' : '0', // Optional top margin for preview mode
                padding: '0', // Remove any padding from the Box
            }}
        >
            <Paper
                elevation={3}
                sx={{
                    width: '100%', // Ensures Paper takes the full width of its container
                    maxWidth: preview ? '100%' : '700px', // Restrict maxWidth for regular mode
                    p: preview ? 2 : 3, // Adjust padding based on preview mode
                    height: 'auto',
                    maxHeight: preview ? '750px' : 'auto',
                    overflowY: 'auto',
                    boxSizing: 'border-box',
                }}
            >                <Grid container spacing={3}>
                    {/* Left Section */}
                    <Grid item xs={12} md={4}>
                        <Box display="flex" flexDirection="column" alignItems="center">
                            <CustomAvatar
                                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSoOoSxVgEWMmcPVGqg8fkwzzP3WRmt7wP-Ew&usqp=CAU"
                                alt="Profile"
                                sx={{ width: 150, height: 150, mb: 2 }}
                            />
                            <Typography variant="h6" gutterBottom>Work Links</Typography>
                            <List dense>
                                <ListItem>
                                    <ListItemText primary="GitHub" secondary={github || "N/A"} />
                                </ListItem>
                                <ListItem>
                                    <ListItemText primary="LinkedIn" secondary={linkedin || "N/A"} />
                                </ListItem>
                            </List>

                            <Typography variant="h6" mt={3} gutterBottom>Skills</Typography>
                            <List dense>
                                {skills?.map((skill, index) => (
                                    <ListItem key={index}>
                                        <ListItemText primary={typeof skill === "object" ? skill.skill : skill} />
                                    </ListItem>
                                ))}
                            </List>
                        </Box>
                    </Grid>

                    {/* Right Section */}
                    <Grid item xs={12} md={8}>
                        <Box>
                            <Typography variant="h4" fontWeight="bold" gutterBottom>
                                {contact?.firstName} {contact?.lastName}
                            </Typography>

                            {/* About Section */}
                            <Grid container spacing={2} mb={3}>
                                <Grid item xs={6}><Typography fontWeight="bold" sx={{
                                    fontSize: preview ? "1.2rem" : "0.65rem", // Example scaling
                                }}>User ID</Typography></Grid>
                                <Grid item xs={6}><Typography sx={{
                                    fontSize: preview ? "1.2rem" : "0.65rem", // Example scaling
                                }}>{id}</Typography></Grid>

                                <Grid item xs={6} sx={{
                                    fontSize: preview ? "1.2rem" : "0.65rem", // Example scaling
                                }}><Typography fontWeight="bold">Email</Typography></Grid>
                                <Grid item xs={6} sx={{
                                    fontSize: preview ? "1.2rem" : "0.65rem", // Example scaling
                                }}><Typography>{contact?.email}</Typography></Grid>

                                <Grid item xs={6} sx={{
                                    fontSize: preview ? "1.2rem" : "0.65rem", // Example scaling
                                }}><Typography fontWeight="bold">Phone</Typography></Grid>
                                <Grid item xs={6} sx={{
                                    fontSize: preview ? "1.2rem" : "0.65rem", // Example scaling
                                }}><Typography>{contact?.phnNumber}</Typography></Grid>

                                <Grid item xs={6} sx={{
                                    fontSize: preview ? "1.2rem" : "0.65rem", // Example scaling
                                }}><Typography fontWeight="bold">Location</Typography></Grid>
                                <Grid item xs={6}>
                                    <Typography sx={{
                                        fontSize: preview ? "1.2rem" : "0.65rem", // Example scaling
                                    }}>{contact?.city}, {contact?.country} - {contact?.pincode}</Typography>
                                </Grid>

                                <Grid item xs={6} sx={{
                                    fontSize: preview ? "1.2rem" : "0.65rem", // Example scaling
                                }}><Typography fontWeight="bold">Profession</Typography></Grid>
                                <Grid item xs={6} sx={{
                                    fontSize: preview ? "1.2rem" : "0.65rem", // Example scaling
                                }}><Typography>Web Developer</Typography></Grid>
                            </Grid>

                            {/* Timeline Content */}
                            <Box>
                                {/* Education */}
                                {education?.length > 0 && (
                                    <>
                                        <Typography variant="h6" fontWeight="bold" gutterBottom>Education</Typography>
                                        <List dense>
                                            {education.map((edu, index) => (
                                                <ListItem key={index}>
                                                    <ListItemText
                                                        primary={`${edu.degree} - ${edu.instituteName}`}

                                                    />
                                                    <ListItemText
                                                        secondary={`${edu.startYear} - ${edu.endYear}`}
                                                    />
                                                </ListItem>
                                            ))}
                                        </List>
                                    </>
                                )}

                                {/* Experience */}
                                {experience?.length > 0 && (
                                    <>
                                        <Typography variant="h6" fontWeight="bold" gutterBottom>Experience</Typography>
                                        <List dense>
                                            {experience.map((exp, index) => (
                                                <ListItem key={index}>
                                                    <ListItemText
                                                        primary={`${exp.role} at ${exp.company}`}
                                                        secondary={`${exp.startDate} - ${exp.endDate} | ${exp.description}`}
                                                    />
                                                </ListItem>
                                            ))}
                                        </List>
                                    </>
                                )}

                                {/* Projects */}
                                {project?.length > 0 && (
                                    <>
                                        <Typography variant="h6" fontWeight="bold" gutterBottom>Projects</Typography>
                                        <List dense>
                                            {project.map((proj, index) => (
                                                <ListItem key={index}>
                                                    <ListItemText
                                                        primary={proj.title}
                                                        secondary={proj.description}
                                                    />
                                                </ListItem>
                                            ))}
                                        </List>
                                    </>
                                )}

                                {/* Certificates */}
                                {certificates?.length > 0 && (
                                    <>
                                        <Typography variant="h6" fontWeight="bold" gutterBottom>Certificates</Typography>
                                        <List dense>
                                            {certificates.map((cert, index) => (
                                                <ListItem key={index}>
                                                    <ListItemText
                                                        primary={cert.name}
                                                        secondary={cert.issuedBy}
                                                    />
                                                </ListItem>
                                            ))}
                                        </List>
                                    </>
                                )}
                            </Box>
                        </Box>
                    </Grid>
                </Grid>
            </Paper>
        </Box>
    );
};

export default ModernResumeTemplate;
