import React from "react";
import {
  Box,
  CssBaseline,
  Toolbar,
  AppBar,
  Typography,
  InputAdornment,
  Grid,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import CustomButton from "../../Components/CustomButton";
import CustomInput from "../../Components/CustomInput";
import CustomAvatar from "../../Components/CustomAvatar";
import UserComponent from "../Dashboard/Components/UserComponent";
import "./styled.css";

function SettingsPage() {
  const updateProfileSection = [
    { label: "Name", id: "name" },
    { label: "Email", id: "email" },
  ];
  const updatePasswordSection = [
    { label: "Old Password", id: "old-password" },
    { label: "New Password", id: "new-password" },
    { label: "Confirm Password", id: "confirm-password" },
  ];

  return (
    <Box className="settings-container">
      <CssBaseline />
      <AppBar position="fixed" className="settings-appbar">
        <Toolbar className="settings-toolbar">
          <Typography variant="h4" className="settings-title">
            Settings
          </Typography>
          <div className="user-details">
            <UserComponent />
          </div>
        </Toolbar>
      </AppBar>

      <Box component="main" className="settings-main">
        <Toolbar />
        <Box className="settings-box">
          <CustomAvatar />

          <Box className="section-header">
            <Typography variant="h4" className="section-title">
              USER PROFILE
            </Typography>
          </Box>

          <Grid container spacing={2} className="settings-form">
            {updateProfileSection.map((profileSection) => (
              <Grid
                item
                xs={4}
                key={profileSection.id}
                className="form-field"
              >
                <Typography variant="subtitle1" className="form-label">
                  {profileSection.label}
                </Typography>
                <CustomInput
                  fullWidth
                  id={profileSection.id}
                  label={profileSection.label}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <EditIcon />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
            ))}
          </Grid>

          <Box className="button-group">
            <CustomButton
              btnStyles={{
                width: "10vw",
                backgroundColor: "#4b2354",
                color: "white",
              }}
              btnText="Update Profile"
            />
          </Box>

          <Box className="section-header">
            <Typography variant="h4" className="section-title">
              PASSWORD
            </Typography>
          </Box>

          <Grid container spacing={2} className="settings-form">
            {updatePasswordSection.map((passwordSection) => (
              <Grid
                item
                xs={4}
                key={passwordSection.id}
                className="form-field"
              >
                <Typography variant="subtitle1" className="form-label">
                  {passwordSection.label}
                </Typography>
                <CustomInput
                  fullWidth
                  id={passwordSection.id}
                  label={passwordSection.label}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <EditIcon />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
            ))}
          </Grid>

          <Box className="button-group">
            <CustomButton
              btnStyles={{
                width: "10vw",
                backgroundColor: "#4b2354",
                color: "white",
              }}
              btnText="Update Password"
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default SettingsPage;
