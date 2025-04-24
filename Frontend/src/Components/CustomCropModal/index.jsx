// components/CropModal.js
import React, { useState, useCallback } from "react";
import Cropper from "react-easy-crop";
import { Dialog, DialogActions, DialogContent, Slider, Button } from "@mui/material";
import getCroppedImg from "../CustomCropImage"; 

const CropModal = ({ imageSrc, open, onClose, onCropComplete }) => {
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

    const handleCropComplete = useCallback((_, croppedPixels) => {
        setCroppedAreaPixels(croppedPixels);
    }, []);

    const handleDone = async () => {
        const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels);
        onCropComplete(croppedImage);
        onClose();
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogContent sx={{ position: "relative", height: 400 }}>
                <Cropper
                    image={imageSrc}
                    crop={crop}
                    zoom={zoom}
                    aspect={1}
                    onCropChange={setCrop}
                    onZoomChange={setZoom}
                    onCropComplete={handleCropComplete}
                />
            </DialogContent>
            <DialogActions>
                <Slider value={zoom} min={1} max={3} step={0.1} onChange={(e, val) => setZoom(val)} />
                <Button onClick={handleDone} variant="contained">Crop</Button>
            </DialogActions>
        </Dialog>
    );
};

export default CropModal;
