import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { InputAdornment, Typography } from "@mui/material";
import CustomInput from "../../Components/CustomInput";
import CustomButton from "../../Components/CustomButton";
import { UserContext } from "../../Context/UserContext";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import "./styled.css";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { setUserState } = useContext(UserContext);
  const navigate = useNavigate();
  const [passwordVisibility, setPasswordVisibility] = useState(false)

  const baseUrl = process.env.REACT_APP_API_BASE_URL;


  const handleLogin = async (e) => {
    if (e && e.preventDefault) {
      e.preventDefault();
    } if (!email || !password) {
      toast.warn("Please enter both email and password", { position: "top-right" });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${baseUrl}/auth`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setUserState(data.user);
        localStorage.setItem("token", data.user.token);

        navigate("/home");
      } else {
        toast.error(data.error, { position: "top-right" });
      }
    } catch (error) {
      toast.error("Login failed. Try again later.", { position: "top-right" });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordVisibilityToggle = (field) => {
    setPasswordVisibility((prevState) => ({
      ...prevState,
      password: !prevState.password,
    }));
  };

  return (
    <div className={`login-container ${loading ? "blurred" : ""}`}>
      <ToastContainer />
      <Typography className="login-title" sx={{ fontSize: "3rem", fontFamily: "Helvetica Neue" }}>
        DigitalCV
      </Typography>

      <div className="login-content">
        <div className="login-box">
          <Typography className="login-heading" sx={{ fontSize: "2rem", marginBottom: "20px" }}>
            Sign in to your account
          </Typography>

          <form className="login-form" onSubmit={handleLogin}>
            <div className="input-group">
              <CustomInput inputType="email" currentValue={email} updateValue={setEmail} label="Enter your Email" />
            </div>
            <div className="input-group">
              <CustomInput
                inputType={passwordVisibility.password ? "text" : "password"} 
                currentValue={password}
                updateValue={setPassword}
                label="Enter your Password"
                Adornment={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <span
                        style={{ cursor: "pointer", marginLeft: "8px" }}
                        onClick={handlePasswordVisibilityToggle} // Simplified toggle function
                      >
                        {passwordVisibility.password ? <VisibilityOff /> : <Visibility />}
                      </span>
                    </InputAdornment>
                  ),
                }}
              />

            </div>

            <div className="button-group">
              <CustomButton btnText="Submit" updateClick={handleLogin} />
              <Link to="/signUp" className="signup-link">Create an Account?</Link>
            </div>
          </form>
        </div>
      </div>

      {loading && (
        <div className="loader-overlay">
          <div className="loader"></div>
        </div>
      )}
    </div>
  );
}

export default LoginPage;
