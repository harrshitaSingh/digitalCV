import React, { useState, useContext, useEffect, useCallback, useRef } from "react";
import { Box, Typography, Grid } from "@mui/material";
import CustomInput from "../../../../Components/CustomInput";
import { ResumeContext } from "../../../../Context/ResumeContext";
import CustomButton from "../../../../Components/CustomButton";
import Add from "@mui/icons-material/Add";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CustomSelect from "../../../../Components/CustomSelect";
import { callCountryApi, fetchCountries } from "../../../../Utils/Api/countryAPi";
import { fetchCityByPincode } from "../../../../Utils/Api/pincodeApi";

const StyleCheckIcon = () => (
    <CheckCircleIcon
        sx={{
            color: "green",
            position: "absolute",
            right: 10,
            top: "50%",
            transform: "translateY(-50%)",
        }}
    />
);


function ExperienceForm({ resumeId, setGetData }) {
    const [countries, setCountries] = useState([]);
    const { resumes, updateResume } = useContext(ResumeContext);
    const [isExperienceLoaded, setIsExperienceLoaded] = useState(false);
    const fetchedPincodesRef = useRef({});

    const [companyName, setCompanyName] = useState([
        {
            jobTitle: "",
            company: "",
            startDate: "",
            endDate: "",
            description: "",
            country: "",
            pincode: "",
            city: "",
            currentlyWorking: false,
        },
    ]);

    const isValidField = (value) => {
        const valid = typeof value === "string" && value.trim().length > 0;
        return valid;
    };


    const getter = useCallback(() => {
        const isAllValid = companyName.every((exp) =>
            Object.entries(exp).every(([key, val]) => {
                if (key === "endDate" && exp.currentlyWorking) return true; 
                if (key === "currentlyWorking") return true; 
                return isValidField(val);
            })
        );


        if (!isAllValid) {
            console.log("Not all fields are valid!");
            return null;
        }

        return companyName;
    }, [companyName]);

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
        if (!isExperienceLoaded && resumes && resumes.length > 0) {
            const selectedExp = resumes.find((resume) => resume.id === resumeId);
            if (
                selectedExp &&
                Array.isArray(selectedExp.experience) &&
                selectedExp.experience.length > 0
            ) {
                setCompanyName(
                    selectedExp.experience.map((exp) => ({
                        jobTitle: exp.jobTitle || "",
                        company: exp.company || "",
                        startDate: exp.startDate || "",
                        endDate: exp.endDate || "",
                        description: exp.description || "",
                        country: exp.country || "",
                        pincode: exp.pincode || "",
                        city: exp.city || "",
                        currentlyWorking: exp.currentlyWorking || false,

                    }))
                );
                setIsExperienceLoaded(true);
            }
        }
    }, [resumes, resumeId, isExperienceLoaded]);

    const handleExperience = async (index, field, value) => {
        const updatedExperience = [...companyName];

        updatedExperience[index][field] = value;

        if (field === "currentlyWorking" && value === true) {
            updatedExperience[index]["endDate"] = "";
        }

        if (field === "pincode" && value.length === 6) {
            const pincode = value;

            if (!fetchedPincodesRef.current[pincode]) {
                const city = await fetchCityByPincode(pincode);
                fetchedPincodesRef.current[pincode] = city;
                updatedExperience[index]["city"] = city;
            } else {
                updatedExperience[index]["city"] = fetchedPincodesRef.current[pincode];
            }
        }

        setCompanyName(updatedExperience);
    };
    ;


    const handleExperienceForm = () => {
        const newExperience = {
            jobTitle: "",
            company: "",
            startDate: "",
            endDate: "",
            description: "",
            country: "",
            pincode: "",
            city: "",
            currentlyWorking:false
        };
        const updatedExperience = [...companyName, newExperience];
        setCompanyName(updatedExperience);
        updateResume(resumeId, "experience", updatedExperience);
    };

    return (
        <Box
            sx={{
                width: '100%',
                maxWidth: 1000,
                margin: '0 auto',
                padding: { xs: '0.5rem', sm: '0.5rem', md: '1rem' },
                boxShadow: 3,
                borderRadius: 2,
                bgcolor: "#f9f9f9",
            }}
        >
            <Box sx={{ display: "flex", justifyContent: "space-between", p: { xs: 2, sm: 3 } }}>
                {/* Left side: Heading */}
                <Box sx={{ marginBottom: 3 }}>
                    <Typography
                        variant="h5"
                        sx={{
                            fontWeight: 'bold',
                            fontSize: { xs: '1.25rem', sm: '1.5rem' },
                            color: '#1e1e1e',
                        }}
                    >
                        Let’s work on your experience
                    </Typography>
                    <Typography
                        variant="body1"
                        sx={{
                            fontSize: { xs: '0.875rem', sm: '1rem' },
                            color: '#1e1e1e',
                            marginTop: 0.5,
                        }}
                    >
                        Start with your most recent job first.
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
                    updateClick={handleExperienceForm}
                />
            </Box>

            {companyName.map((experience, index) => (
                <Grid container spacing={2} sx={{ mb: 10 }} key={index}>
                    <Grid item xs={12}>
                        <Box sx={{ position: "relative" }}>
                            <CustomInput
                                label="Company Name"
                                inputType="text"
                                currentValue={experience.company}
                                updateValue={(value) => handleExperience(index, "company", value)}
                            />
                            {isValidField(experience.company) && (
                               <StyleCheckIcon/>
                            )}
                        </Box>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <Box sx={{ position: "relative" }}>
                            <CustomInput
                                label="Title"
                                inputType="text"
                                currentValue={experience.jobTitle}
                                updateValue={(value) => handleExperience(index, "jobTitle", value)}
                            />
                            {isValidField(experience.jobTitle) && (
                               <StyleCheckIcon/>
                            )}
                        </Box>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <Box sx={{ position: "relative" }}>
                                    <CustomSelect
                                        select="Country"
                                        currentValue={experience.country}
                                        updateValue={(value) => handleExperience(index, "country", value)}
                                        options={countries}
                                    />
                                    {isValidField(experience.country) && (
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
                                        currentValue={experience.pincode}
                                        updateValue={(value) => handleExperience(index, "pincode", value)}
                                        inputProps={{
                                            maxLength: 6,
                                            inputMode: "numeric",
                                            pattern: "[0-9]*",
                                        }}
                                    />
                                    {isValidField(experience.pincode) && (
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
                                currentValue={experience.city}
                                InputProps={{ readOnly: true }}
                            />
                            {isValidField(experience.city) && (
                               <StyleCheckIcon/>
                            )}
                        </Box>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <Box sx={{ position: "relative" }}>
                            <CustomInput
                                label="Start Date"
                                currentValue={experience.startDate}
                                updateValue={(value) => handleExperience(index, "startDate", value)}
                                inputType="date"
                            />
                            {isValidField(experience.startDate) && (
                               <StyleCheckIcon/>
                            )}
                        </Box>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <Box sx={{ position: "relative" }}>
                            <CustomInput
                                label="End Date"
                                currentValue={experience.endDate}
                                updateValue={(value) => handleExperience(index, "endDate", value)}
                                inputType="date"
                                disabled={experience.currentlyWorking}
                            />
                            {!experience.currentlyWorking && isValidField(experience.endDate) && (
                               <StyleCheckIcon/>
                            )}
                        </Box>
                        <Grid item xs={12}>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                                <input
                                    type="checkbox"
                                    checked={experience.currentlyWorking}
                                    onChange={(e) =>
                                        handleExperience(index, "currentlyWorking", e.target.checked)
                                    }
                                />
                                <Typography>Currently Working Here</Typography>
                            </Box>
                        </Grid>
                    </Grid>

                    <Grid item xs={12}>
                        <Box sx={{ position: "relative" }}>
                            <CustomInput
                                fullWidth
                                label="Description"
                                variant="outlined"
                                currentValue={experience.description}
                                updateValue={(value) => handleExperience(index, "description", value)}
                                multiline
                                maxRows={4}
                                maxLength={500}
                            />
                            {isValidField(experience.description) && (
                               <StyleCheckIcon/>
                            )}
                        </Box>
                    </Grid>
                </Grid>
            ))}
        </Box>
    );

}

export default ExperienceForm;
