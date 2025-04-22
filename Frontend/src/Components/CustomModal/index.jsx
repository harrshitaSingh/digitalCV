import React from "react";
import { Modal, Box } from "@mui/material";

const CustomModal = ({ isOpen, closeModal, children }) => {

    const handleClose = () => {
        closeModal(); // no need to pass `e.target.value` unless needed
    };

    return (
        <Modal open={isOpen} onClose={handleClose}>
            <Box
                sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    bgcolor: 'background.paper',
                    boxShadow: 24,
                    p: 4,
                    borderRadius: 2,
                    maxWidth: 400,
                    width: '90%',
                }}
            >
                {children}
            </Box>
        </Modal>
    );
};

export default CustomModal;
