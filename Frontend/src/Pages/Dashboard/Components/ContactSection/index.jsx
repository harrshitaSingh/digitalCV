import React, {useCallback, useContext, useEffect, useState } from 'react';
import { Box, Typography, Grid } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CustomInput from '../../../../Components/CustomInput';
import { ResumeContext } from '../../../../Context/ResumeContext';
import CustomSelect from '../../../../Components/CustomSelect';
import { fetchCountries, callCountryApi } from "../../../../Utils/Api/countryAPi"
import { fetchCityByPincode } from '../../../../Utils/Api/pincodeApi';

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


function ContactForm({ resumeId, setGetData }) {
  const { resumes } = useContext(ResumeContext);
  const [contact, setContact] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phnNumber: '',
    city: '',
    country: '',
    pincode: '',
  });
  const [countries, setCountries] = useState([])

  const getter = useCallback(() => {
    const isAllValid = Object.entries(contact).every(([field, value]) =>
      validateField(field, value)
    );

    if (!isAllValid) {
      return null;
    }

    return contact;
  }, [contact]);

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
      if (selectedResume && selectedResume.contact) {
        setContact({
          firstName: selectedResume.contact.firstName || '',
          lastName: selectedResume.contact.lastName || '',
          email: selectedResume.contact.email || '',
          phnNumber: selectedResume.contact.phnNumber || '',
          city: selectedResume.contact.city || '',
          country: selectedResume.contact.country || '',
          pincode: selectedResume.contact.pincode || '',
        });
      }
    }
  }, [resumes, resumeId]);

  const handleContactChange = async (field, value) => {
    const trimmedValue = value.trimStart();

    if (field === 'pincode') {
      if (trimmedValue.length === 6) {
        const district = await fetchCityByPincode(trimmedValue);
        console.log(district, "loo");
        setContact((prev) => ({ ...prev, city: district, pincode: trimmedValue }));
      } else {
        setContact((prev) => ({ ...prev, pincode: trimmedValue, city: '' }));
      }
    }
 else {
      setContact((prev) => ({ ...prev, [field]: trimmedValue }));
    }
  };


  const validateField = (field, value) => {
    switch (field) {
      case 'email':
        return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value.trim());
      case 'phnNumber':
        return /^[0-9]{10}$/.test(value.trim());
      case 'pincode':
        return /^[0-9]{6}$/.test(value.trim());
      default:
        return value.trim() !== '';
    }
  };

  const renderInputWithCheck = (field, label, inputType, maxLength) => {
    const value = contact[field];
    const isValid = validateField(field, value);

    return (
      <Box sx={{ position: 'relative' }}>
        <CustomInput
          label={label}
          inputType={inputType}
          currentValue={value}
          updateValue={(value) => handleContactChange(field, value)}
          maxLength={maxLength}
          required
        />
        {isValid && (
         <StyleCheckIcon/>
        )}
      </Box>
    );
  };

  return (
    <Box
      sx={{
        width: { xs: '90%', sm: '80%', md: '70%', lg: '60%' },
        margin: '0 auto',
        padding: { xs: '0.5rem', sm: '0.5rem', md: '1rem' },
        boxShadow: 3,
        borderRadius: 2,
        bgcolor: '#f9f9f9',
      }}
    >
      <Box sx={{ marginBottom: 3 }}>
        <Typography
          variant="h5"
          sx={{
            fontWeight: 'bold',
            fontSize: '1.5rem',
            color: '#1e1e1e',
          }}
        >
          Let’s start with your header
        </Typography>
        <Typography
          variant="body1"
          sx={{
            fontSize: '1rem',
            color: '#1e1e1e',
            marginTop: 0.5,
          }}
        >
          Include your full name and multiple ways for employers to reach you.
        </Typography>
      </Box>

      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={6} lg={6}>{renderInputWithCheck('firstName', 'First Name')}</Grid>
        <Grid item xs={12} sm={6} md={6} lg={6}>{renderInputWithCheck('lastName', 'Surname')}</Grid>

        <Grid item xs={12} sm={6} md={6} lg={6}>{renderInputWithCheck('phnNumber', 'Phone', 'numberOnly', 10)}</Grid>
        <Grid item xs={12} sm={6} md={6} lg={6}>{renderInputWithCheck('email', 'Email', 'email')}</Grid>

        <Grid item xs={12} sm={6} md={6} lg={6}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={6} lg={6}>
              <Box sx={{ position: 'relative' }}>
                <CustomSelect
                  select="Country"
                  currentValue={contact.country}
                  updateValue={(value) => handleContactChange('country', value)}
                  options={countries}
                />
                {validateField('country', contact.country) && (
                  <StyleCheckIcon/>
                )}
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={6} lg={6}>
              <Box sx={{ position: 'relative' }}>
                <CustomInput
                  label="Pin Code"
                  variant="outlined"
                  fullWidth
                  currentValue={contact.pincode}
                  updateValue={(value) => handleContactChange("pincode", value)}
                  inputProps={{ maxLength: 6, inputMode: 'numeric', pattern: '[0-9]*' }}
                />
                {validateField('pincode', contact.pincode) && (
                  <StyleCheckIcon/>
                )}
              </Box>
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={12} sm={6} md={6} lg={6}>
          <Box sx={{ position: 'relative' }}>
            <CustomInput
              label="City"
              variant="outlined"
              fullWidth
              currentValue={contact.city}
              InputProps={{ readOnly: true }}
            />
            {validateField('city', contact.city) && (
              <CheckCircleIcon
                sx={{
                  color: 'green',
                  position: 'absolute',
                  right: 10,
                  top: '50%',
                  transform: 'translateY(-50%)',
                }}
              />
            )}
          </Box>
        </Grid>
      </Grid>
    </Box>
  );

}

export default ContactForm;
