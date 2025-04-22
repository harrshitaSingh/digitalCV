import React from "react";
import { Button } from "@mui/material";

const CustomButton = ({ updateClick, btnStyles, btnText, className, variant }) => {

    const handleClick = () => {
        updateClick();
    }

    return (
        <Button onClick={handleClick} style={btnStyles} className={className} variant={variant} >
            {btnText}
        </Button>
    )
}

export default CustomButton;
