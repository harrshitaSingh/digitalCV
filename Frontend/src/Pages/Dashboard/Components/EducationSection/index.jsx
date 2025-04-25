import React, { useState, useContext, useEffect, useRef, useCallback } from "react";
import { Box, Typography, Grid } from "@mui/material";
import CustomInput from "../../../../Components/CustomInput";
import CustomButton from "../../../../Components/CustomButton";
import Add from "@mui/icons-material/Add";
import { ResumeContext } from "../../../../Context/ResumeContext";
import { fetchCityByPincode } from "../../../../Utils/Api/pincodeApi";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CustomSelect from "../../../../Components/CustomSelect";
import { callCountryApi, fetchCountries } from "../../../../Utils/Api/countryAPi";


function EducationForm({ resumeId, setGetData }) {
  const [countries, setCountries] = useState([]);
  const { resumes } = useContext(ResumeContext);
  const [educationForms, setEducationForms] = useState([
    {
      degree: "",
      instituteName: "",
      percentage: "",
      country: "",
      pincode: "",
      city: "",
      startEducationDate: "",
      endEducationDate: "",
      currentlyWorking: false,
    },
  ]);
  const isInitialRenderEducation = useRef(true);
  const fetchedPincodesRef = useRef({})

  const isValidFieldEducation = (value) => {
    return typeof value === "string" && value.trim().length > 0;
  };

  const getter = useCallback(() => {
    const isAllValidEducation = educationForms.every((exp) =>
      Object.entries(exp).every(([key, val]) => {
        if (key === "endDate" && exp.currentlyWorking) return true;
        if (key === "currentlyWorking") return true; 
        return isValidFieldEducation(val);
      })
    );

    if (!isAllValidEducation) {
      console.log("Not all fields are valid!");
      return null;
    }

    return educationForms;
  }, [educationForms]);



  useEffect(() => {
    if (setGetData) {

      setGetData(() => getter);
    }
  }, [setGetData, getter]);

  useEffect(() => {
    const debouncedFetch = callCountryApi(async () => {
      const countryList = await fetchCountries();
      setCountries(countryList);
    }, 1000);

    debouncedFetch();
  }, []);


  useEffect(() => {
    if (resumes && resumes.length > 0) {
      const selectedResume = resumes.find((resume) => resume.id === resumeId);
      if (
        selectedResume &&
        Array.isArray(selectedResume.education) &&
        selectedResume.education.length > 0
      ) {
        if (isInitialRenderEducation.current) {
          setEducationForms(
            selectedResume.education.map((edu) => ({
              degree: edu.degree || "",
              instituteName: edu.instituteName || "",
              percentage: edu.percentage || "",
              country: edu.country || "",
              pincode: edu.pincode || "",
              city: edu.city || "",
              startEducationDate: edu.startEducationDate || "",
              endEducationDate: edu.startEducationDate || "",
              currentlyWorking: edu.currentlyWorking || false,
            }))
          );
          isInitialRenderEducation.current = false;
        }
      } else if (isInitialRenderEducation.current) {
        setEducationForms([
          {
            degree: "",
            instituteName: "",
            percentage: "",
            country: "",
            pincode: "",
            city: "",
            startEducationDate: "",
            endEducationDate: "",
            currentlyWorking: false
          },
        ]);
        isInitialRenderEducation.current = false;
      }
    }
  }, [resumes, resumeId]);

  const handleInputChange = async (index, field, value) => {
    const updatedForms = [...educationForms];
    updatedForms[index][field] = value;

    if (field === "currentlyWorking" && value === true) {
      updatedForms[index]["endDate"] = "";
    }


    if (field === "pincode" && value.length === 6) {
      const pincode = value;

      if (!fetchedPincodesRef.current[pincode]) {
        const city = await fetchCityByPincode(pincode);
        fetchedPincodesRef.current[pincode] = city;
        updatedForms[index]["city"] = city;
      } else {
        updatedForms[index]["city"] = fetchedPincodesRef.current[pincode];
      }
    }

    setEducationForms(updatedForms);
  };


  const handleAddForm = () => {
    const newEducation = {
      degree: "",
      instituteName: "",
      percentage: "",
      country: "",
      pincode: "",
      city: "",
      startEducationDate: "",
      endEducationDate: "",
      currentlyWorking: false
    };

    const updatedEducation = [...educationForms, newEducation];
    setEducationForms(updatedEducation);
  };


  if (!resumes) {
    return <div>Loading...</div>;
  }
  return (
    <Box
      sx={{
        width: { xs: "90%", sm: "80%", md: "70%" },
        margin: "0 auto",
        padding: { xs: '0.5rem', sm: '0.5rem', md: '1rem' },
        boxShadow: 3,
        borderRadius: 2,
        bgcolor: "#f9f9f9",
      }}
    >
      <Box sx={{ display: "flex", justifyContent: "space-between", p: 3 }}>
        {/* Left side: Heading */}
        <Box sx={{ marginBottom: 3 }}>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 'bold',
              fontSize: { xs: '1.2rem', sm: '1.5rem' },  // Adjust font size for smaller screens
              color: '#1e1e1e',
            }}
          >
            Let’s talk about your education
          </Typography>
          <Typography
            variant="body1"
            sx={{
              fontSize: { xs: '0.9rem', sm: '1rem' },  // Adjust font size for smaller screens
              color: '#1e1e1e',
              marginTop: 0.5,
            }}
          >
            Tell us about any colleges, vocational programs, or training courses you took. Even if you didn’t finish, it’s important to list them.
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
          updateClick={handleAddForm}
        />
      </Box>

      {educationForms.map((education, index) => (
        <Grid container spacing={2} sx={{ mb: 10 }} key={index}>
          <Grid item xs={12}>
            <Box sx={{ position: "relative" }}>
              <CustomInput
                label="Degree"
                currentValue={education.degree}
                updateValue={(value) =>
                  handleInputChange(index, "degree", value)
                }
                required
                inputType="text"
              />
              {isValidFieldEducation(education.degree) && (
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
                label="Institute Name"
                currentValue={education.instituteName}
                updateValue={(value) =>
                  handleInputChange(index, "instituteName", value)
                }
                required
                inputType="text"
              />
              {isValidFieldEducation(education.instituteName) && (
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
                label="Percentage"
                currentValue={education.percentage}
                updateValue={(value) =>
                  handleInputChange(index, "percentage", value)
                }
                inputProps={{
                  maxLength: 5,
                  inputMode: "numeric",
                  pattern: "[0-9]{1,3}%?",
                }}
                required
              />
              {isValidFieldEducation(education.percentage) && (
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
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Box sx={{ position: "relative" }}>
                  <CustomSelect
                    select="Country"
                    currentValue={education.country}
                    updateValue={(value) => handleInputChange(index, "country", value)}
                    options={countries}
                  />
                  {isValidFieldEducation(education.country) && (
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
                    label="Pin Code"
                    variant="outlined"
                    fullWidth
                    currentValue={education.pincode}
                    updateValue={(value) => handleInputChange(index, "pincode", value)}
                    inputProps={{
                      maxLength: 6,
                      inputMode: "numeric",
                      pattern: "[0-9]*",
                    }}
                  />
                  {isValidFieldEducation(education.pincode) && (
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
          </Grid>

          <Grid item xs={12} sm={6}>
            <Box sx={{ position: "relative" }}>
              <CustomInput
                label="City"
                variant="outlined"
                fullWidth
                currentValue={education.city}
                InputProps={{ readOnly: true }}
              />
              {isValidFieldEducation(education.city) && (
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
                currentValue={education.startEducationDate}
                updateValue={(value) =>
                  handleInputChange(index, "startEducationDate", value)
                }
                date={{ shrink: true }}
                required
                inputType="date"
              />
              {isValidFieldEducation(education.startEducationDate) && (
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
                currentValue={education.endDate}
                updateValue={(value) => handleInputChange(index, "endEducationDate", value)}
                inputType="date"
                disabled={education.currentlyWorking}
              />
              {!education.currentlyWorking && isValidFieldEducation(education.endDate) && (
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
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <input
                type="checkbox"
                checked={education.currentlyWorking}
                onChange={(e) =>
                  handleInputChange(index, "currentlyWorking", e.target.checked)
                }
              />
              <Typography>Current Education</Typography>
            </Box>
          </Grid>
        </Grid>
      ))}
    </Box>
  );

}

export default EducationForm;
