import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Typography } from "@mui/material";
import { toast, ToastContainer } from "react-toastify";
import CustomInput from "../../Components/CustomInput";
import CustomButton from "../../Components/CustomButton";
import "./styled.css";
// import signUpIllustration from "../../assets/login-illustration.png"; 

function SignUpPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

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
      const response = await fetch("http://localhost:5000/auth/signUp", {
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

  return (
    <div className="signup-container">
      <ToastContainer />
      <Typography className="signup-title" sx={{ fontSize: "3rem", fontFamily: "Helvetica Neue" }}>
        DigitalCV
      </Typography>

      <div className="signup-content">

        <div className="signup-box">
          <Typography className="signup-heading"  sx={{ fontSize: "2rem", marginBottom: "20px" }}>Create your account</Typography>

          <form className="signup-form" onSubmit={handleSignUp}>
            <div className="input-group">
              <CustomInput inputType="text" label="Enter your name" currentValue={name} updateValue={setName} />
            </div>
            <div className="input-group">
              <CustomInput inputType="email" label="Enter your email" currentValue={email} updateValue={setEmail} />
            </div>
            <div className="input-group">
              <CustomInput inputType="password" label="New password" currentValue={password} updateValue={setPassword} />
            </div>
            <div className="input-group">
              <CustomInput inputType="password" label="Confirm password" currentValue={confirmPassword} updateValue={setConfirmPassword} />
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
