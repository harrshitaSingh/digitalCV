import React, { useCallback, useContext, useEffect, useState } from 'react';
import { Box, Typography, Grid } from '@mui/material';
import CustomInput from '../../../../Components/CustomInput';
import CustomButton from '../../../../Components/CustomButton';
import Add from '@mui/icons-material/Add';
import { ResumeContext } from '../../../../Context/ResumeContext';
import CheckCircleIcon from "@mui/icons-material/CheckCircle";


function CertificationForm({ resumeId, setGetData }) {
  const [certificateName, setCertificateName] = useState([
    {
      title: '',
      startDate: '',
      endDate: '',
      description: '',
      link:''
    },
  ]);
  const { resumes } = useContext(ResumeContext);

    const isValidFieldCertificates = (value) => {
      const valid = typeof value === "string" && value.trim().length > 0;
      return valid;
    };
  
  const getter = useCallback(() => {
    for (let i = 0; i < certificateName.length; i++) {
      const cert = certificateName[i];
      for (const key in cert) {
        if (!isValidFieldCertificates(cert[key])) {
        }
      }
    }

    const isAllValidCertificate = certificateName.every((edu) => {
      return Object.values(edu).every((val) => isValidFieldCertificates(val));
    });

    if (!isAllValidCertificate) {
      return null;
    }

    return certificateName;
  }, [certificateName]);

  

  useEffect(() => {
    if (setGetData) {

      setGetData(() => getter);
    }
  }, [setGetData, getter]);


  useEffect(() => {
    if (resumes && resumes.length > 0) {
      const selectedResumeCertificate = resumes.find((resume) => resume.id === resumeId);

      if (
        selectedResumeCertificate &&
        Array.isArray(selectedResumeCertificate.certificates) &&
        selectedResumeCertificate.certificates.length > 0
      ) {
        setCertificateName(
          selectedResumeCertificate.certificates.map((certi) => ({
            title: certi.title || '',
            startDate: certi.startDate || '',
            endDate: certi.endDate || '',
            description: certi.description || '',
            link: certi.link || "",
          }))
        );
      }
    }
  }, [resumes, resumeId]);


  const handleCertificate = (index, field, value) => {
    const updateCertiForms = certificateName.map((form, i) =>
      i === index ? { ...form, [field]: value } : form
    );
    setCertificateName(updateCertiForms);
  };

  const handleFormBtn = () => {
    const newCertificate = {
      title: '',
      startDate: '',
      endDate: '',
      description: '',
      link: ''
    };

    const updatedCertificate = [...certificateName, newCertificate];
    setCertificateName(updatedCertificate);
  };

  return (
    <Box
      sx={{
        width: '60%',
        margin: '0 auto',
        padding: '2rem',
        boxShadow: 3,
        borderRadius: 2,
        bgcolor: '#f9f9f9',
      }}
    >
      <Box sx={{ display: "flex", justifyContent: "space-between", p: 3 }}>
        <Box sx={{ marginBottom: 3 }}>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 'bold',
              fontSize: '1.5rem',
              color: '#1e1e1e',
            }}
          >
            Let’s highlight your key certifications
          </Typography>
          <Typography
            variant="body1"
            sx={{
              fontSize: '1rem',
              color: '#1e1e1e',
              marginTop: 0.5,
            }}
          >
            Showcase your expertise and dedication to professional growth, proving to employers you're committed to staying ahead in your field.
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
          updateClick={handleFormBtn}
        />
      </Box>
      {certificateName.map((certificate, index) => (
        <Grid container spacing={2} sx={{ mb: 10 }} key={index}>
          <Grid item xs={12}>
            <Box sx={{ position: "relative" }}>
              <CustomInput
                inputType="text"
                label="Certificate Name"
                currentValue={certificate.title}
                updateValue={(value) => handleCertificate(index, 'title', value)}
                textInputStyles={{ width: '100%' }}
                required
              />
              {isValidFieldCertificates(certificate.title) && (
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

          <Grid item xs={6}>
            <Box sx={{ position: "relative" }}>
              <CustomInput
                label="Start Date"
                currentValue={certificate.startDate}
                updateValue={(value) =>
                  handleCertificate(index, "startDate", value)
                }
                date={{ shrink: true }}
                required
                inputType="date"
              />
              {isValidFieldCertificates(certificate.startDate) && (
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

          <Grid item xs={6}>
            <Box sx={{ position: "relative" }}>
              <CustomInput
                label="End Date"
                currentValue={certificate.endDate}
                updateValue={(value) =>
                  handleCertificate(index, "endDate", value)
                }
                date={{ shrink: true }}
                required
                inputType="date"
              />
              {isValidFieldCertificates(certificate.endDate) && (
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
                currentValue={certificate.description}
                updateValue={(value) =>
                  handleCertificate(index, 'description', value)
                }
                multiline
                maxRows={4}
                maxLength={200}
              />
              {isValidFieldCertificates(certificate.description) && (
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
                label="Add Link"
                variant="outlined"
                required
                currentValue={certificate.link}
                updateValue={(value) => handleCertificate(index, 'link', value)}
              />
              {isValidFieldCertificates(certificate.link) && (
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
        </Grid>
      ))}

    </Box>
  );
}

export default CertificationForm;
