import React from 'react';
import { Box, Paper, Typography } from '@mui/material';
import './styled.css';

const Section = ({ title, children }) => (
    <Box mb={3}>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
            {title}
        </Typography>
        {children}
    </Box>
);

const ClassicResumeTemplate = ({ resumeData, preview }) => {
    if (!resumeData) return null;

    const { github, linkedin, youTube, contact, education, experience, project, certificates, skills } = resumeData;

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
            }}>
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
            >
                {contact && (
                    <Box mb={3}>
                        <Typography variant="h4" className="name" gutterBottom >
                            {contact.firstName} {contact.lastName}
                        </Typography>
                        <Typography variant="body1" className="contact" sx={{
                            fontSize: preview ? "1.2rem" : "0.65rem", // Example scaling
                        }}>
                            {contact.city}, {contact.country} - {contact.pincode}
                            <br />
                            {contact.phnNumber}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{
                            fontSize: preview ? "1.2rem" : "0.65rem", // Example scaling
                        }}>
                            {github} |
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{
                            fontSize: preview ? "1.2rem" : "0.65rem", // Example scaling
                        }}>
                            {linkedin}
                        </Typography>
                    </Box>
                )}


                {youTube && (
                    <Box mb={3} textAlign="center">
                        <iframe
                            width={preview ? "350" : "560"}
                            height={preview ? "200" : "315"}
                            src={youTube.replace("watch?v=", "embed/")}
                            title="YouTube video"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            style={{ borderRadius: "8px" }}
                        ></iframe>
                    </Box>
                )}


                {education?.length > 0 && (
                    <Section title="Education">
                        {education.map((edu, index) => (
                            <Box key={index} mb={1}>
                                <Typography variant="subtitle1" fontWeight={600} sx={{
                                    fontSize: preview ? "1.5rem" : "0.65rem", // Example scaling
                                }}>
                                    {edu.degree} - {edu.instituteName}
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{
                                    fontSize: preview ? "1.2rem" : "0.65rem", // Example scaling
                                }}>
                                    {edu.startEducationDate} - {edu.endEducationDate}
                                </Typography>
                            </Box>
                        ))}
                    </Section>
                )}

                {experience?.length > 0 && (
                    <Section title="Experience">
                        {experience.map((exp, index) => (
                            <Box key={index} mb={2}>
                                <Typography variant="subtitle1" fontWeight={600} sx={{
                                    fontSize: preview ? "1.5rem" : "0.65rem", // Example scaling
                                }}>
                                    {exp.jobTitle} - {exp.company}
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{
                                    fontSize: preview ? "1.2rem" : "0.65rem", // Example scaling
                                }}>
                                    {exp.startDate} - {exp.endDate}
                                </Typography>
                                <ul>
                                    {exp.description?.split('\n').map((item, i) => (
                                        <li key={i}>
                                            <Typography variant="body2" sx={{
                                                fontSize: preview ? "1rem" : "0.65rem", // Example scaling
                                            }}>{item}</Typography>
                                        </li>
                                    ))}
                                </ul>
                            </Box>
                        ))}
                    </Section>
                )}

                {project?.length > 0 && (
                    <Section title="Projects">
                        {project.map((proj, index) => (
                            <Box key={index} mb={1}>
                                <Typography variant="subtitle1" fontWeight={600} sx={{
                                    fontSize: preview ? "1.5rem" : "0.65rem", // Example scaling
                                }}>
                                    {proj.title}
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{
                                    fontSize: preview ? "1rem" : "0.65rem", // Example scaling
                                }}>
                                    {proj.description}
                                </Typography>
                            </Box>
                        ))}
                    </Section>
                )}

                {certificates?.length > 0 && (
                    <Section title="Certifications">
                        {certificates.map((cert, index) => (
                            <Box key={index} mb={1}>
                                <Typography variant="subtitle1" fontWeight={600} sx={{
                                    fontSize: preview ? "1.5rem" : "0.65rem",
                                }}>
                                    {cert.title}
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{
                                    fontSize: preview ? "1.2rem" : "0.65rem", // Example scaling
                                }}>
                                    {cert.startDate} - {cert.endDate}
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{
                                    fontSize: preview ? "1rem" : "0.65rem", // Example scaling
                                }}>
                                    {cert.link}
                                </Typography>
                            </Box>
                        ))}
                    </Section>
                )}

                {skills?.length > 0 && (
                    <Section title="Skills">
                        <ul>
                            {skills.map((skill, index) => (
                                <li key={index}>
                                    <Typography variant="body2">{typeof skill === 'object' ? skill.skill : skill}</Typography>
                                </li>
                            ))}
                        </ul>
                    </Section>
                )}
            </Paper>
        </Box>
    );
};

export default ClassicResumeTemplate;
