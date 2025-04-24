import React, { useState, useEffect } from "react";
import {
  Box,
  CssBaseline,
  Toolbar,
  AppBar,
  Typography,
  InputAdornment,
  Grid,
  Container,
  Paper,
  CircularProgress,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import CustomButton from "../../Components/CustomButton";
import CustomInput from "../../Components/CustomInput";
import CustomAvatar from "../../Components/CustomAvatar";
import UserComponent from "../Dashboard/Components/UserComponent";
import CustomModal from "../../Components/CustomModal";
import "./styled.css";

function SettingsPage() {
  const baseUrl = process.env.REACT_APP_API_BASE_URL;

  const [userData, setUserData] = useState({
    name: "",
    email: "",
    profilePhoto: "",
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [editMode, setEditMode] = useState({
    name: false,
    email: false,
    oldPassword: false,
  });

  const [passwordEditMode, setPasswordEditMode] = useState(false);
  const [passwordVisibility, setPasswordVisibility] = useState({
    oldPassword: false,
    newPassword: false,
    confirmPassword: false,
  });

  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [fieldToUpdate, setFieldToUpdate] = useState("");


  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${baseUrl}/auth/user`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        const data = await response.json();
        if (response.ok && data.user) {
          let imageSrc = "";
          if (data.user.profilePhoto) {
            const byteArray = Object.values(data.user.profilePhoto);
            const uint8Array = new Uint8Array(byteArray);
            const blob = new Blob([uint8Array], { type: "image/png" });
            imageSrc = URL.createObjectURL(blob);
          }

          console.log(imageSrc, "lol")

          setUserData((prevState) => ({
            ...prevState,
            name: data.user.name,
            email: data.user.email,
            oldPassword: data.user.password || "",
            profilePhoto: imageSrc
          }));
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
      finally {
        setLoading(false);
      }
    };

    fetchUserData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  const handleEditClick = (field) => {
    setEditMode((prevState) => ({
      ...prevState,
      [field]: true,
    }));
  };

  const handleOldPasswordEditClick = () => {
    setPasswordEditMode(true);
    handleEditClick("oldPassword");
  };

  const handlePasswordVisibilityToggle = (field) => {
    setPasswordVisibility((prevState) => ({
      ...prevState,
      [field]: !prevState[field],
    }));
  };

  const handleUpdateClick = (field) => {

    setFieldToUpdate(field);
    setOpenModal(true);
  };

  const handleModalClose = async (confirm) => {
    if (confirm) {
      setLoading(true);

      try {
        let payload = {};
        let endpoint = "";
        let method = "POST";

        if (fieldToUpdate === "Profile") {
          payload = {
            name: userData.name,
            email: userData.email,
          };
          endpoint = `${baseUrl}/auth/user`;
        } else if (fieldToUpdate === "Password") {
          payload = {
            oldPassword: userData.oldPassword,
            newPassword: userData.newPassword,
            confirmPassword: userData.confirmPassword,
          };
          endpoint = `${baseUrl}/auth/user/password`;
        }

        const response = await fetch(endpoint, {
          method,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(payload),
        });

        const result = await response.json();

        if (response.ok) {
          setEditMode({
            name: false,
            email: false,
            oldPassword: false,
          });
          setPasswordEditMode(false);
          setUserData((prev) => ({
            ...prev,
            oldPassword: "",
            newPassword: "",
            confirmPassword: "",
          }));
        } else {
          console.error("Update failed:", result.message || "Unknown error");
        }
      } catch (error) {
        console.error("Error during update:", error);
      }

      setLoading(false);
      setOpenModal(false);
    } else {
      setOpenModal(false);
    }
  };


  return (
    <Box className="settings-container">
      <CssBaseline />
      <AppBar position="fixed" className="settings-appbar">
        <Toolbar className="settings-toolbar">
          <Typography variant="h3" className="settings-title">
            Settings
          </Typography>
          <div className="user-details">
            <UserComponent />
          </div>
        </Toolbar>
      </AppBar>

      <Box component="main" className="settings-main">
        <Toolbar />
        <Container maxWidth="md" className="settings-box">
          <CustomAvatar
            showUpload={true}
            avatarStyles={{ width: "120px", height: "120px" }}
            image={userData.profilePhoto}
          />

          <Paper elevation={12} className="settings-paper">
            <Box className="section-header">
              <Typography variant="h5" className="section-title">
                User Profile
              </Typography>
            </Box>

            <Grid container spacing={3} className="settings-form" justifyContent="center">
              {["name", "email"].map((field) => (
                <Grid item xs={12} sm={6} key={field}>
                  <Typography variant="subtitle1" className="form-label">
                    {field === "name" ? "Name" : "Email"}
                  </Typography>
                  <CustomInput
                    fullWidth
                    id={field}
                    label={field === "name" ? "Name" : "Email"}
                    currentValue={userData[field]}
                    updateValue={(value) => setUserData({ ...userData, [field]: value })}
                    Adornment={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <EditIcon
                            onClick={() => handleEditClick(field)}
                            style={{ cursor: "pointer" }}
                          />
                        </InputAdornment>
                      ),
                    }}
                    readOnly={!editMode.name} />
                </Grid>
              ))}
            </Grid>

            {editMode.name || editMode.email ? (
              <Box className="button-group">
                <CustomButton
                  btnStyles={{
                    width: "50%",
                    backgroundColor: "#4b2354",
                    color: "white",
                    padding: "12px 0",
                    boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.2)",
                  }}
                  btnText={loading ? <CircularProgress size={24} color="inherit" /> : "Update Profile"}
                  updateClick={() => handleUpdateClick("Profile")}
                />
              </Box>
            ) : null}
          </Paper>

          {/* Password Section */}
          <Paper elevation={12} className="settings-paper">
            <Box className="section-header">
              <Typography variant="h5" className="section-title">
                Password Settings
              </Typography>
            </Box>

            <Grid container spacing={3} className="settings-form">
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle1" className="form-label">
                  Password
                </Typography>
                <CustomInput
                  fullWidth
                  id="oldPassword"
                  label="Password"
                  inputType={passwordVisibility.oldPassword ? "text" : "password"}
                  currentValue={userData.oldPassword}
                  updateValue={(value) => setUserData({ ...userData, oldPassword: value })}
                  Adornment={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <EditIcon
                          onClick={handleOldPasswordEditClick}
                          style={{ cursor: "pointer" }}
                        />
                        <span
                          style={{ cursor: "pointer", marginLeft: "8px" }}
                          onClick={() => handlePasswordVisibilityToggle("oldPassword")}
                        >
                          {passwordVisibility.oldPassword ? <VisibilityOff /> : <Visibility />}
                        </span>
                      </InputAdornment>
                    ),
                  }}
                  readOnly={!editMode.name} />
              </Grid>

              {passwordEditMode && (
                <>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle1" className="form-label">
                      New Password
                    </Typography>
                    <CustomInput
                      fullWidth
                      id="newPassword"
                      label="New Password"
                      inputType={passwordVisibility.newPassword ? "text" : "password"}
                      currentValue={userData.newPassword}
                      updateValue={(value) => setUserData({ ...userData, newPassword: value })}
                      Adornment={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <span
                              style={{ cursor: "pointer", marginLeft: "8px" }}
                              onClick={() => handlePasswordVisibilityToggle("newPassword")}
                            >
                              {passwordVisibility.newPassword ? <VisibilityOff /> : <Visibility />}
                            </span>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle1" className="form-label">
                      Confirm Password
                    </Typography>
                    <CustomInput
                      fullWidth
                      id="confirmPassword"
                      label="Confirm Password"
                      inputType={passwordVisibility.confirmPassword ? "text" : "password"}
                      currentValue={userData.confirmPassword}
                      updateValue={(value) => setUserData({ ...userData, confirmPassword: value })}
                      Adornment={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <span
                              style={{ cursor: "pointer", marginLeft: "8px" }}
                              onClick={() => handlePasswordVisibilityToggle("confirmPassword")}
                            >
                              {passwordVisibility.confirmPassword ? <VisibilityOff /> : <Visibility />}
                            </span>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                </>
              )}
            </Grid>

            {passwordEditMode ? (
              <Box className="button-group">
                <CustomButton
                  btnStyles={{
                    width: "50%",
                    backgroundColor: "#4b2354",
                    color: "white",
                    padding: "12px 0",
                    boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.2)",
                  }}
                  btnText={loading ? <CircularProgress size={24} color="inherit" /> : "Update Password"}
                  onClick={() => handleUpdateClick("Password")}
                />
              </Box>
            ) : null}
          </Paper>
        </Container>
      </Box>

      {/* Modal for Update Confirmation */}
      <CustomModal isOpen={openModal} closeModal={() => setOpenModal(false)}>
        <Typography variant="h6">Are you sure you want to update {fieldToUpdate}?</Typography>
        <Box sx={{ mt: 2, display: "flex", justifyContent: "space-between" }}>
          <CustomButton
            btnText="Yes"
            updateClick={() => handleModalClose(true)}
            btnStyles={{ backgroundColor: "#4b2354", color: "white" }}
          />
          <CustomButton
            btnText="No"
            updateClick={() => handleModalClose(false)}
            btnStyles={{ backgroundColor: "gray", color: "white" }}
          />
        </Box>
      </CustomModal>
      {loading && (
        <Box
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backdropFilter: "blur(4px)",
            backgroundColor: "rgba(255,255,255,0.3)",
            zIndex: 9999,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <CircularProgress size={60} thickness={5} />
        </Box>
      )}
    </Box>
  );
}

export default SettingsPage;
