// CustomShareButton.js
import React from 'react';
import { Box, IconButton, Tooltip } from '@mui/material';
import {
    FacebookShareButton,
    TwitterShareButton,
    WhatsappShareButton,
    EmailShareButton,
    TelegramShareButton,
} from 'react-share';
import { FacebookIcon, TwitterIcon, WhatsappIcon, EmailIcon, TelegramIcon } from 'react-share';
import { toast } from 'react-toastify';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

const CustomShareButton = ({ url, onClose }) => {

    const handleCopyLink = () => {
        navigator.clipboard.writeText(url).then(() => {
            toast.success("Link copied to clipboard!");
            if (onClose) onClose();
        }).catch((error) => {
            toast.error("Failed to copy the link.");
            console.error("Clipboard error: ", error);
        });
    };

    return (
        <Box sx={{ display: 'flex', gap: 1, mt: 1, justifyContent: "space-around", flexWrap: "wrap" }}>
            <FacebookShareButton url={url}>
                <FacebookIcon size={32} round />
            </FacebookShareButton>
            <TwitterShareButton url={url}>
                <TwitterIcon size={32} round />
            </TwitterShareButton>
            <WhatsappShareButton url={url}>
                <WhatsappIcon size={32} round />
            </WhatsappShareButton>
            <EmailShareButton url={url}>
                <EmailIcon size={32} round />
            </EmailShareButton>
            <TelegramShareButton url={url}>
                <TelegramIcon size={32} round />
            </TelegramShareButton>

            <Tooltip title="Copy Link">
                <IconButton onClick={handleCopyLink} sx={{ backgroundColor: "#d3d3d3", borderRadius: "50%", padding: "8px" }}>
                    <ContentCopyIcon sx={{ color: "#4b2354", fontSize: 24 }} />
                </IconButton>
            </Tooltip>
        </Box>
    );
};

export default CustomShareButton;
