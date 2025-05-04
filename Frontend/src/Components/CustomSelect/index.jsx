
import React from "react";
import { Autocomplete, TextField } from "@mui/material";

const CustomSelect = ({
  currentValue,
  updateValue,
  selectStyle,
  options,
  select,
}) => {
  return (
    <Autocomplete
      options={options}
      value={options.find((opt) => opt.value === currentValue) || null}
      onChange={(e, newValue) => updateValue(newValue ? newValue.value : "")}
      getOptionLabel={(option) => option.label || ""}
      isOptionEqualToValue={(option, value) => option.value === value.value}
      sx={{ ...selectStyle }}
      renderInput={(params) => (
        <TextField
          {...params}
          label={select}
          variant="outlined"
          fullWidth
          InputLabelProps={{
            sx: {
              "&.Mui-focused": {},
            },
          }}
        />
      )}
    />
  );
};

export default CustomSelect;

