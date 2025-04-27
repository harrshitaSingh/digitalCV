import React from "react";
import './styled.css';
import { TextField, Box, InputAdornment } from "@mui/material";

const CustomInput = ({
    updateValue,
    inputType,
    currentValue,
    label,
    textInputStyles,
    containerStyles,
    maxLength,
    maxRows,
    multiline,
    date,
    Adornment,
    fullWidth,
    className,
    readOnly = false,
    icon
}) => {
    const handleChange = (e) => {
        let value = e.target.value;

        if (inputType === 'numberOnly') {
            value = value.replace(/\D/g, '');
        }

        updateValue(value);
    };

    return (
        <Box style={{ ...containerStyles }}>
            <TextField
                className={`input ${className}`}
                type={inputType === "numberOnly" ? "text" : inputType}
                value={currentValue}
                onChange={(e) => handleChange(e)}
                label={label}
                style={{ ...textInputStyles }}
                inputProps={{
                    maxLength,
                    readOnly,
                }}
                rows={maxRows}
                multiline={multiline}
                InputLabelProps={date}
                InputProps={{
                    startAdornment: icon ? (
                        <InputAdornment position="start">
                            {icon}
                        </InputAdornment>
                    ) : null,
                    ...Adornment, 
                }}
                fullWidth={fullWidth}

            />
        </Box>
    );
};

export default CustomInput;
