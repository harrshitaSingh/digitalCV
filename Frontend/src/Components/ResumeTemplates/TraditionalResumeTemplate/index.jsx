import React from 'react';
import {
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';

const SectionTitle = ({ title }) => (
  <Typography variant="h5" fontWeight="bold" gutterBottom mt={4}>
    {title}
  </Typography>
);

const TraditionalTemplate = ({ resumeData, preview }) => {
  if (!resumeData) return null;

  const { github, linkedin, contact, education, experience, project, certificates, skills } = resumeData;

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
      >        <Box textAlign="center" mb={2}>
          <Typography variant="h4" fontWeight="bold">
            {contact?.firstName} {contact?.lastName}
          </Typography>
          <Typography variant="body1">
            {contact?.address}, {contact?.city}, {contact?.state} - {contact?.zip_code}
          </Typography>
          <Typography variant="body1">{contact?.phone_number}</Typography>
          <Typography variant="body2" color="text.secondary">{contact?.email}</Typography>
        </Box>

        {contact?.summary && (
          <>
            <SectionTitle title="Summary" />
            <Typography>{contact.summary}</Typography>
          </>
        )}

        {experience?.length > 0 && (
          <>
            <SectionTitle title="Experience as an Intern" />
            {experience.map((exp, idx) => (
              <Box key={idx} mb={2}>
                <Typography variant="h6">{exp.organisation}</Typography>
                <Typography variant="subtitle2">
                  {exp.start_month} {exp.start_year} - {exp.end_month ? `${exp.end_month} ${exp.end_year}` : 'Present'}
                </Typography>
                <Typography variant="subtitle2">{exp.city}, {exp.state}</Typography>
                <Typography>{exp.work}</Typography>
              </Box>
            ))}
          </>
        )}

        {resumeData.employment_history?.length > 0 && (
          <>
            <SectionTitle title="Work Experience" />
            {resumeData.employment_history.map((work, idx) => (
              <Box key={idx} mb={2}>
                <Typography variant="h6">{work.designation}</Typography>
                <Typography variant="subtitle2">{work.start_month} {work.start_year} - {work.end_month ? `${work.end_month} ${work.end_year}` : 'Present'}</Typography>
                <Typography variant="subtitle2">{work.employer}</Typography>
              </Box>
            ))}
          </>
        )}

        {education?.length > 0 && (
          <>
            <SectionTitle title="Education" />
            {education.map((edu, idx) => (
              <Box key={idx} mb={2}>
                <Typography variant="h6">{edu.degree} @ {edu.instituteName}</Typography>
                <Typography variant="subtitle2">{edu.startEducationDate} {edu.endEducationDate}</Typography>
                <Typography>{edu.city}, {edu.state} — {edu.field} ({edu.percentage})</Typography>
              </Box>
            ))}
          </>
        )}

        {skills?.length > 0 && (
          <>
            <SectionTitle title="Additional Skills" />
            <List dense>
              {resumeData.skills.map((s, i) => (
                <ListItem key={i}>
                  <ListItemText primary={s.skill} />
                </ListItem>
              ))}
            </List>
          </>
        )}

        {certificates?.length > 0 && (
          <>
            <SectionTitle title="Additional Skills" />
            <List dense>
              {certificates.map((s, i) => (
                <ListItem key={i}>
                  <ListItemText primary={s.skill} />
                </ListItem>
              ))}
            </List>
          </>
        )}

        {project?.length > 0 && (
          <>
            <SectionTitle title="Project Details" />
            {project.map((p, i) => (
              <Box key={i} mb={2}>
                <Typography variant="h6">{p.title}</Typography>
                <Typography>{p.description}</Typography>
                <Typography>Duration: {p.duration}</Typography>
                <Typography>Role: {p.role}</Typography>
              </Box>
            ))}
          </>
        )}


      </Paper>
    </Box>
  );
};

export default TraditionalTemplate;
