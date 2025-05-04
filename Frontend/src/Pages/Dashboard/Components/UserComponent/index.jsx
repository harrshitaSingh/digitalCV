import React, { useEffect, useState } from "react";
import CustomAvatar from "../../../../Components/CustomAvatar";
import { useNavigate } from "react-router-dom";
import { Select, MenuItem, IconButton, CircularProgress } from "@mui/material";
import PowerSettingsNew from "@mui/icons-material/PowerSettingsNew";
import "./styled.css"

const UserComponent = () => {
  const baseUrl = process.env.REACT_APP_API_BASE_URL;
  const [userData, setUserData] = useState({
    profilePhoto: "",
  });
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectOption, setSelectOption] = useState("");
  const [loading, setLoading] = useState(false);

  const dropDown = [
    { label: "Resumes", value: "/home" },
    { label: "Settings", value: "/settings" },
    { label: "Help", value: "/help" },
  ];

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const getCookie = (name) => {
          const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
          return match ? match[2] : null;
        };
        const response = await fetch(`${baseUrl}/auth/user`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${getCookie("token")}`,
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
            profilePhoto: imageSrc
          }));
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAvatarClick = () => {
    setShowDropdown((prev) => !prev);
  };

  const handleDropdownChange = (event) => {
    const newValue = event.target.value;
    setSelectOption(newValue);
    navigate(newValue);
    setShowDropdown(false);
  };

  const handleLogout = () => {
    setLoading(true);
    setTimeout(() => {
      navigate("/");
    }, 1500);
  };

  return (
    <>
      {loading && (
        <div className="loaderOverlay">
          <CircularProgress style={{ color: "#fff" }} />
        </div>
      )}

      <div className={`userDetails ${loading ? "blur" : ""}`}>
        <CustomAvatar size={50} fontSize={20} onClick={handleAvatarClick} image={userData.profilePhoto} />

        {showDropdown && (
          <Select
            value={selectOption}
            onChange={handleDropdownChange}
            open={showDropdown}
            onClose={() => setShowDropdown(false)}
            disableUnderline
            style={{
              display: "block",
              position: "absolute",
              top: "15px",
              right: "50px",
              border: "none",
              padding: 0,
            }}
            MenuProps={{
              PaperProps: {
                style: {
                  maxHeight: 200,
                  width: 120,
                },
              },
            }}
            sx={{
              ".MuiOutlinedInput-notchedOutline": {
                border: "none",
              },
              ".MuiSelect-icon": {
                display: "none",
              },
            }}
          >
            {dropDown.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        )}

        <IconButton
          onClick={handleLogout}
          className="icon-btn"
          sx={{ color: " #4b2354" }}
        >
          <PowerSettingsNew />
        </IconButton>
      </div >
    </>
  );
};

export default UserComponent;
