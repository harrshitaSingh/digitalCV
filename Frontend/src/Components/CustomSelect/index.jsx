// import { Select, MenuItem, FormControl, InputLabel } from "@mui/material";
// import React from "react";

// const CustomSelect = ({
//   currentValue,
//   updateValue,
//   selectStyle,
//   options,
//   select,
// }) => {
//   const handleValue = (e) => {
//     const inputValue = e.target.value;
//     updateValue(inputValue);
//   };

//   return (
//     <FormControl fullWidth style={selectStyle}>
//       <InputLabel
//         sx={{
//           // color: "#4b2354",
//           "&.Mui-focused": {
//             // color: "#4b2354",
//           },
//         }}
//       >
//         {select}
//       </InputLabel>
//       <Select
//         value={currentValue}
//         label={select}
//         onChange={handleValue}
//         sx={{
//           ".MuiOutlinedInput-notchedOutline": {
//             borderWidth: "2px",
//           },
//           "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
//             borderWidth: "2px",
//           },
//           "&:hover .MuiOutlinedInput-notchedOutline": {
//             borderWidth: "2px",
//           },
//           "& .MuiSelect-select": {
//             color: "black",
//           },
//         }}
//         MenuProps={{
//           PaperProps: {
//             style: {
//               maxHeight: 300,
//               overflow: 'auto',
//               marginTop: 8,
//             },
//           },
//           anchorOrigin: {
//             vertical: 'bottom',
//             horizontal: 'left',
//           },
//           transformOrigin: {
//             vertical: 'top',
//             horizontal: 'left',
//           },
//           getContentAnchorEl: null,
//         }}

//       >
//         {options.map((option, index) => (
//           <MenuItem key={option.value} value={option.value}>
//             {option.label}
//           </MenuItem>
//         ))}
//       </Select>
//     </FormControl>
//   );
// };

// export default CustomSelect;

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

