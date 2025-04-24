import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Typography } from "@mui/material";
import { toast, ToastContainer } from "react-toastify";
import CustomInput from "../../Components/CustomInput";
import CustomButton from "../../Components/CustomButton";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { InputAdornment } from "@mui/material";
import "./styled.css";

function SignUpPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordVisibility, setPasswordVisibility] = useState({
    password: false,
    confirmPassword: false,
  });
  const navigate = useNavigate();

  const baseUrl = process.env.REACT_APP_API_BASE_URL;

  const handleSignUp = async (e) => {
    if (e && e.preventDefault) {
      e.preventDefault();
    }
    if (!name || !email || !password || !confirmPassword) {
      toast.warn("All fields must be filled out");
      return;
    }

    if (password !== confirmPassword) {
      toast.warn("Passwords do not match");
      return;
    }

    try {
      const response = await fetch(`${baseUrl}/auth/signUp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Account created successfully!");
        navigate("/");
      } else {
        toast.error(data.error);
      }
    } catch (error) {
      toast.error("Failed to create an account. Please try again.");
    }
  };

  const handlePasswordVisibilityToggle = (field) => {
    setPasswordVisibility((prevState) => ({
      ...prevState,
      [field]: !prevState[field],
    }));
  };

  return (
    <div className="signup-container">
      <ToastContainer />
      <Typography className="signup-title" sx={{ fontSize: "3rem", fontFamily: "Helvetica Neue" }}>
        DigitalCV
      </Typography>

      <div className="signup-content">
        <div className="signup-box">
          <Typography className="signup-heading" sx={{ fontSize: "2rem", marginBottom: "20px" }}>
            Create your account
          </Typography>

          <form className="signup-form" onSubmit={handleSignUp}>
            <div className="input-group">
              <CustomInput inputType="text" label="Enter your name" currentValue={name} updateValue={setName} />
            </div>
            <div className="input-group">
              <CustomInput inputType="email" label="Enter your email" currentValue={email} updateValue={setEmail} />
            </div>
            <div className="input-group">
              <CustomInput
                inputType={passwordVisibility.password ? "text" : "password"}
                label="New password"
                currentValue={password}
                updateValue={setPassword}
                Adornment={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <span
                        style={{ cursor: "pointer", marginLeft: "8px" }}
                        onClick={() => handlePasswordVisibilityToggle("password")}
                      >
                        {passwordVisibility.password ? <VisibilityOff /> : <Visibility />}
                      </span>
                    </InputAdornment>
                  ),
                }}
              />
            </div>
            <div className="input-group">
              <CustomInput
                inputType={passwordVisibility.confirmPassword ? "text" : "password"}
                label="Confirm password"
                currentValue={confirmPassword}
                updateValue={setConfirmPassword}
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
            </div>

            <div className="button-group">
              <CustomButton btnText="Create Account" updateClick={handleSignUp} />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default SignUpPage;
