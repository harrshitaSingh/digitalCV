import React, { useEffect, useState } from "react";
import Avatar from "@mui/material/Avatar";
import Stack from "@mui/material/Stack";
import { decodeToken } from "../../Utils/Token";
import { Typography, Box } from "@mui/material";
import CustomButton from "../CustomButton";
import CustomModal from "../CustomModal";
import CropModal from "../CustomCropModal";
import "./styled.css";

const CustomAvatar = ({
  margin = "20px auto",
  cursor="pointer",
  avatarStyles,
  onClick,
  showUpload,
  image: imageProp,
}) => {
  const baseUrl = process.env.REACT_APP_API_BASE_URL;

  const [name, setName] = useState("");
  const [image, setImage] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [cropImage, setCropImage] = useState(null);

  useEffect(() => {
    const getCookie = (name) => {
      const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
      return match ? match[2] : null;
    };

    const token = getCookie("token");
    const userData = token ? decodeToken(token) : null;

    if (userData?.name) {
      setName(userData.name);
    }
  }, []);


  useEffect(() => {
    if (imageProp) {
      setImage(imageProp);
    }
  }, [imageProp]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCropImage(reader.result);
        setOpenModal(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCropped = async (croppedImage) => {
    setImage(croppedImage);

    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`${baseUrl}/auth/user/profilePhoto`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ profilePhoto: croppedImage }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to upload");

      console.log("Profile photo updated");
    } catch (error) {
      console.error("Error uploading profile photo:", error.message);
    }
  };

  const handleDeleteImage = () => {
    setImage(null);
    setOpenModal(false);
  };

  const handleCameraClick = () => {
    setOpenModal(true);
  };

  const triggerFileInput = () => {
    document.getElementById("avatar-upload").click();
  };

  function stringAvatar(name) {
    const initials = name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .slice(0, 2);

    return {
      sx: {
        bgcolor: "#4b2354",
        margin: margin,
        ...avatarStyles,
        cursor: "pointer",
        color: "#fff",
      },
      children: initials || "?",
      onClick: onClick,
    };
  }

  return (
    <Stack>
      <div style={{ position: "relative", display: "inline-block" }}>
        {image ? (
          <Avatar
            sx={{ ...avatarStyles, margin: margin, cursor:cursor }}
            src={image}
            onClick={showUpload ? handleCameraClick : onClick}
          />
        ) : (
          <Avatar
            {...stringAvatar(name)}
            onClick={showUpload ? handleCameraClick : onClick}
          />
        )}
      </div>

      {showUpload && (
        <input
          type="file"
          accept="image/*"
          style={{ display: "none" }}
          id="avatar-upload"
          onChange={handleImageUpload}
        />
      )}

      {openModal && (
        <CustomModal isOpen={openModal} closeModal={() => setOpenModal(false)}>
          <Typography variant="h6">
            Would you like to upload or delete the avatar?
          </Typography>
          <Box sx={{ mt: 2, display: "flex", justifyContent: "space-between" }}>
            <CustomButton
              btnText="Upload"
              updateClick={triggerFileInput}
              btnStyles={{ backgroundColor: "#4b2354", color: "white" }}
            />
            <CustomButton
              btnText="Delete"
              updateClick={handleDeleteImage}
              btnStyles={{ backgroundColor: "gray", color: "white" }}
            />
          </Box>
        </CustomModal>
      )}

      <CropModal
        open={!!cropImage}
        imageSrc={cropImage}
        onClose={() => setCropImage(null)}
        onCropComplete={handleCropped}
      />
    </Stack>
  );
};

export default CustomAvatar;
