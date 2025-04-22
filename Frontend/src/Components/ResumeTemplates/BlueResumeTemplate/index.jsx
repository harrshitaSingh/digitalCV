import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

const BluesResumeTemplate = ({ resumeData, preview }) => {
    if (!resumeData) return null;

    const { github, linkedin, contact, education, experience, project, certificates, skills } = resumeData;

    return (
        <Box
            id="resume-to-download"
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
            >
                {/* Header */}
                <Box textAlign="center" mb={2}>
                    <Typography variant="h4" color="primary" fontWeight="bold">
                        {contact?.firstName} {contact?.lastName}
                    </Typography>
                </Box>

                <Box mb={3} display="flex" flexWrap="wrap" justifyContent="center" gap={1}>
                    {[contact?.email, contact?.phnNumber, contact?.city, contact?.country, contact?.pincode, github, linkedin].map((item, idx) =>
                        item ? (
                            <Typography key={idx} variant="body2" color="text.secondary" sx={{ fontSize: preview ? "1rem" : "0.85rem" }}>
                                {item} |
                            </Typography>
                        ) : null
                    )}
                </Box>

                {/* Education */}
                {education?.length > 0 && (
                    <Section title="Education" preview={preview}>
                        {education.map((edu, index) => (
                            <Box key={index} mb={1}>
                                <Typography fontWeight={600} sx={{ fontSize: preview ? "1.2rem" : "0.9rem" }}>
                                    {edu.degree} - {edu.instituteName}
                                </Typography>
                                <Typography color="text.secondary" sx={{ fontSize: preview ? "1rem" : "0.8rem" }}>
                                    {edu.startEducationDate} - {edu.endEducationDate}
                                </Typography>
                            </Box>
                        ))}
                    </Section>
                )}

                {/* Experience */}
                {experience?.length > 0 && (
                    <Section title="Experience" preview={preview}>
                        {experience.map((exp, index) => (
                            <Box key={index} mb={2}>
                                <Typography fontWeight={600} sx={{ fontSize: preview ? "1.2rem" : "0.9rem" }}>
                                    {exp.jobTitle} - {exp.company}
                                </Typography>
                                <Typography color="text.secondary" sx={{ fontSize: preview ? "1rem" : "0.8rem" }}>
                                    {exp.startDate} - {exp.endDate}
                                </Typography>
                                <ul style={{ marginTop: 4 }}>
                                    {exp.description?.split('\n').map((item, i) => (
                                        <li key={i}>
                                            <Typography sx={{ fontSize: preview ? "0.95rem" : "0.75rem" }}>
                                                {item}
                                            </Typography>
                                        </li>
                                    ))}
                                </ul>
                            </Box>
                        ))}
                    </Section>
                )}

                {/* Projects */}
                {project?.length > 0 && (
                    <Section title="Projects" preview={preview}>
                        {project.map((proj, index) => (
                            <Box key={index} mb={1}>
                                <Typography fontWeight={600} sx={{ fontSize: preview ? "1.2rem" : "0.9rem" }}>
                                    {proj.title}
                                </Typography>
                                <Typography color="text.secondary" sx={{ fontSize: preview ? "0.95rem" : "0.75rem" }}>
                                    {proj.description}
                                </Typography>
                            </Box>
                        ))}
                    </Section>
                )}

                {/* Certifications */}
                {certificates?.length > 0 && (
                    <Section title="Certifications" preview={preview}>
                        {certificates.map((cert, index) => (
                            <Typography key={index} color="text.secondary" sx={{ fontSize: preview ? "1.2rem" : "0.85rem" }}>
                                {cert.name}
                            </Typography>
                        ))}
                    </Section>
                )}

                {/* Skills */}
                {skills?.length > 0 && (
                    <Section title="Skills" preview={preview}>
                        <ul>
                            {skills.map((skill, index) => (
                                <li key={index}>
                                    <Typography sx={{ fontSize: preview ? "1rem" : "0.8rem" }}>{skill}</Typography>
                                </li>
                            ))}
                        </ul>
                    </Section>
                )}
            </Paper>
        </Box>
    );
};

const Section = ({ title, children, preview }) => (
    <Box mb={3}>
        <Typography
            sx={{
                backgroundColor: '#3683cc',
                color: 'white',
                p: '0.4rem 0.8rem',
                borderLeft: '5px solid #2c6cb7',
                borderRadius: '3px',
                fontWeight: 'bold',
                mb: 1.5,
                fontSize: preview ? "1.3rem" : "1rem",
            }}
        >
            {title}
        </Typography>
        {children}
    </Box>
);

export default BluesResumeTemplate;
