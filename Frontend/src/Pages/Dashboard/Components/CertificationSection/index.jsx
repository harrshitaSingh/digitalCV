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
      link: '',
      currentlyWorking: false,
    },
  ]);
  const { resumes } = useContext(ResumeContext);

  const isValidFieldCertificates = (key, value) => {
    if (key === "link") return true; 
    return typeof value === "string" && value.trim().length > 0;
  };

  const getter = useCallback(() => {
    const isAllValidCertificates = certificateName.every((cert) => {
      return Object.entries(cert).every(([key, val]) => {
        if (key === "endDate" && cert.currentlyWorking) return true;
        if (key === "currentlyWorking") return true;
        return isAllValidCertificates(key, val);
      });
    });

    if (!isAllValidCertificates) {
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
            link: certi.link || "",
            currentlyWorking: certi.currentlyWorking || false,
          }))
        );
      }
    }
  }, [resumes, resumeId]);


  const handleCertificate = (index, field, value) => {
    const updateCertiForms = certificateName.map((form, i) =>
      i === index ? { ...form, [field]: value } : form
    );
    if (field === "currentlyWorking" && value === true) {
      updateCertiForms[index]["endDate"] = "";
    }
    setCertificateName(updateCertiForms);
  };

  const handleFormBtn = () => {
    const newCertificate = {
      title: '',
      startDate: '',
      endDate: '',
      link: '',
      currentlyWorking: false
    };

    const updatedCertificate = [...certificateName, newCertificate];
    setCertificateName(updatedCertificate);
  };

  return (
    <Box
      sx={{
        width: { xs: '90%', sm: '80%', md: '70%', lg: '60%' },
        margin: '0 auto',
        padding: { xs: '1rem', sm: '1.5rem', md: '2rem' },
        boxShadow: 3,
        borderRadius: 2,
        bgcolor: '#f9f9f9',
      }}
    >
      <Box sx={{ display: "flex", justifyContent: "space-between", p: 3 }}>
        <Box sx={{ marginBottom: 3, width: { xs: '100%', sm: '70%' } }}>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 'bold',
              fontSize: { xs: '1.2rem', sm: '1.5rem' },
              color: '#1e1e1e',
            }}
          >
            Let’s highlight your key certifications
          </Typography>
          <Typography
            variant="body1"
            sx={{
              fontSize: { xs: '0.9rem', sm: '1rem' },
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
              {isValidFieldCertificates('title',certificate.title) && (
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
                currentValue={certificate.startDate}
                updateValue={(value) =>
                  handleCertificate(index, "startDate", value)
                }
                date={{ shrink: true }}
                required
                inputType="date"
              />
              {isValidFieldCertificates("startDate",certificate.startDate) && (
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
                currentValue={certificate.endDate}
                updateValue={(value) =>
                  handleCertificate(index, "endDate", value)
                }
                date={{ shrink: true }}
                required
                inputType="date"
                disabled={certificate.currentlyWorking}
              />
              {!certificate.currentlyWorking && isValidFieldCertificates("endDate",certificate.endDate) && (
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
                  checked={certificate.currentlyWorking}
                  onChange={(e) =>
                    handleCertificate(index, "currentlyWorking", e.target.checked)
                  }
                />
                <Typography>In Progress</Typography>
              </Box>
            </Grid>
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
            </Box>
          </Grid>
        </Grid>
      ))}
    </Box>
  );

}

export default CertificationForm;
