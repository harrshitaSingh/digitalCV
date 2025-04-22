import React, { useState } from "react";
import "./styled.css";
import CustomInput from "../../Components/CustomInput";
import CustomButton from "../../Components/CustomButton";

function EmailVerify() {
  const [code, setCode] = useState("");

  return (
    <div
      className="verify"
      style={{
        backgroundImage: `url(/emailVerify.jpg)`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="verifyBox">
        <h2>Verification code has been sent on your email. Please Verify!</h2>
        <CustomInput
          inputType="number"
          label="Enter the code"
          currentValue={code}
          updateValue={setCode}
        />
        <br></br>
        <CustomButton
          btnStyles={{
            backgroundColor: "#4b2354",
            border: "none",
            color: "white",
            cursor: "pointer",
          }}
          btnText="Verify"
        />
      </div>
    </div>
  );
}

export default EmailVerify;
