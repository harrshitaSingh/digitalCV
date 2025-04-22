import React, { useContext, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Box,
    Typography,
    Grid,
    Paper,
    IconButton,
    CircularProgress,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

import BluesResumeTemplate from "../ResumeTemplates/BlueResumeTemplate";
import ClassicResumeTemplate from "../ResumeTemplates/ClassicResumeTemplate";
import ModernResumeTemplate from "../ResumeTemplates/ModernResumeTemplate";
import TraditionalTemplate from "../ResumeTemplates/TraditionalResumeTemplate";

import CustomButton from "../CustomButton";
import CustomModal from "../CustomModal";
import { ResumeContext } from "../../Context/ResumeContext";

const TemplatePreview = ({ resumeData }) => {
    const { updateResume, setResumeData, setTemplateName, setTemplateId } = useContext(ResumeContext);
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [previewOpen, setPreviewOpen] = useState(false);
    const [selectedTemplateName, setSelectedTemplateName] = useState("");
    const [ModalComponent, setModalComponent] = useState(null);

    const templates = useMemo(() => {
        if (!resumeData || Object.keys(resumeData).length === 0) return [];

        return [
            {
                id: 1,
                name: "Blues",
                CardComponent: () => <BluesResumeTemplate resumeData={resumeData} preview />,
                ModalComponent: () => <BluesResumeTemplate resumeData={resumeData} preview={false} />,
            },
            {
                id: 2,
                name: "Classic",
                CardComponent: () => <ClassicResumeTemplate resumeData={resumeData} preview />,
                ModalComponent: () => <ClassicResumeTemplate resumeData={resumeData} preview={false} />,
            },
            {
                id: 3,
                name: "Modern",
                CardComponent: () => <ModernResumeTemplate resumeData={resumeData} preview />,
                ModalComponent: () => <ModernResumeTemplate resumeData={resumeData} preview={false} />,
            },
            {
                id: 4,
                name: "Traditional",
                CardComponent: () => <TraditionalTemplate resumeData={resumeData} preview />,
                ModalComponent: () => <TraditionalTemplate resumeData={resumeData} preview={false} />,
            },
        ];
    }, [resumeData]);

    const handleSelectedTemplate = async (templateId) => {
        try {
            setLoading(true);
            const selected = templates.find((t) => t.id === templateId);
            if (selected) {
                setTimeout(() => {
                    handlePreview(selected.ModalComponent, selected.name);
                    setLoading(false);
                }, 500);
            }
        } catch (err) {
            console.error("Failed to update template:", err);
            setLoading(false);
        }
    };

    const handlePreview = (ComponentFunc, name) => {
        setModalComponent(<ComponentFunc />);
        setSelectedTemplateName(name);
        setPreviewOpen(true);
    };

    const handleCloseModal = () => {
        setPreviewOpen(false);
    };

    const handleSave = async () => {
        const resumeId = resumeData?.id;
        const selectedName = selectedTemplateName;

        if (!selectedName || !resumeId) {
            console.error("No template or resume ID.");
            return;
        }

        try {
            setLoading(true);
            await updateResume(resumeId, "template", selectedName);
            setResumeData({ ...resumeData, template: selectedName });
            setTemplateName(selectedName);
            setTemplateId(localStorage.getItem("templateId"));

            setTimeout(() => {
                setLoading(false);
                navigate("/home");
            }, 500);
        } catch (err) {
            console.error("Update error:", err);
            setLoading(false);
        }
    };

    return (
        <Box px={4} py={6}>
            <Box textAlign="center" mb={4}>
                <Typography variant="h4" fontWeight="bold" gutterBottom color="#4b2354">
                    Templates we recommend for you
                </Typography>
                <Typography variant="body1" color="grey">
                    You can always change your template later.
                </Typography>
            </Box>

            {resumeData && Object.keys(resumeData).length > 0 && (
                <Grid container spacing={4} justifyContent="center">
                    {templates.map(({ id, name, CardComponent, ModalComponent }) => (
                        <Grid item xs={12} sm={6} md={4} lg={3} key={id}>
                            <Paper
                                elevation={4}
                                sx={{
                                    borderRadius: 4,
                                    height: 500,
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "space-between",
                                    p: 2,
                                    alignItems: "center",
                                }}
                            >
                                <Box
                                    sx={{
                                        width: "70vmin",
                                        height: 380,
                                        overflow: "hidden",
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "flex-start",
                                        transform: "scale(1.1)",
                                        cursor: "pointer",
                                    }}
                                    onClick={() => handlePreview(ModalComponent, name)}
                                >
                                    <CardComponent />
                                </Box>

                                <Box textAlign="center">
                                    <Typography variant="subtitle1" fontWeight={600} gutterBottom color="#4b2354">
                                        {name}
                                    </Typography>

                                    <CustomButton
                                        btnStyles={{
                                            borderRadius: 2,
                                            textTransform: "none",
                                            color: "#fff",
                                            fontSize: "small",
                                            backgroundColor: "#4b2354",
                                        }}
                                        variant="contained"
                                        btnText="Choose Template"
                                        updateClick={() => handleSelectedTemplate(id)}
                                    />
                                </Box>
                            </Paper>
                        </Grid>
                    ))}
                </Grid>
            )}

            <CustomModal isOpen={previewOpen} closeModal={handleCloseModal}>
                <Box
                    sx={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        width: "90vw",
                        maxWidth: 1000,
                        maxHeight: "90vh",
                        overflow: "auto",
                        bgcolor: "background.paper",
                        boxShadow: 24,
                        borderRadius: 4,
                        p: 3,
                    }}
                >
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                        <Typography variant="h6" fontWeight="bold" color="#4b2354">
                            {selectedTemplateName} Template Preview
                        </Typography>
                        <IconButton onClick={handleCloseModal}>
                            <CloseIcon />
                        </IconButton>
                    </Box>

                    <Box
                        sx={{
                            width: "100%",
                            minWidth: "600px",
                            border: "1px solid #ccc",
                            boxShadow: 3,
                            p: 2,
                            backgroundColor: "#fff",
                        }}
                    >
                        {ModalComponent}

                        <Box display="flex" justifyContent="space-between" mt={3} gap={2}>
                            <CustomButton
                                btnText="Update"
                                variant="outlined"
                                updateClick={handleCloseModal}
                                btnStyles={{
                                    borderRadius: 2,
                                    textTransform: "none",
                                    color: "#4b2354",
                                    borderColor: "#4b2354",
                                }}
                            />
                            <CustomButton
                                btnText="Save"
                                variant="contained"
                                updateClick={handleSave}
                                btnStyles={{
                                    borderRadius: 2,
                                    textTransform: "none",
                                    backgroundColor: "#4b2354",
                                    color: "#fff",
                                }}
                            />
                        </Box>
                    </Box>
                </Box>
            </CustomModal>

            {loading && (
                <Box
                    sx={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        width: "100vw",
                        height: "100vh",
                        backdropFilter: "blur(4px)",
                        backgroundColor: "rgba(255,255,255,0.3)",
                        zIndex: 9999,
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    <CircularProgress size={60} thickness={5} />
                </Box>
            )}
        </Box>
    );
};

export default TemplatePreview;
