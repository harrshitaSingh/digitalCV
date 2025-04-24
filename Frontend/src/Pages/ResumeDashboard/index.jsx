import React, { useContext, useEffect, useState } from "react";
import {
  Box,
  CssBaseline,
  Toolbar,
  AppBar,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  IconButton,
  Tooltip,
  CircularProgress,
} from "@mui/material";
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import CustomButton from "../../Components/CustomButton";
import CustomModal from "../../Components/CustomModal";
import { useNavigate } from "react-router-dom";
import CustomInput from "../../Components/CustomInput";
import { ResumeContext } from "../../Context/ResumeContext/index";
import UserComponent from "../Dashboard/Components/UserComponent";
import { toast, ToastContainer } from "react-toastify";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ShareIcon from "@mui/icons-material/Share";
import DownloadIcon from "@mui/icons-material/Download";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import "./styled.css";
import CustomShareButton from "../../Components/CustomShareButton";
import Grow from '@mui/material/Grow';
import CommonShareTemplate from "../../Components/ResumeTemplates/CommonShareTemplate";
import FolderOpenIcon from '@mui/icons-material/FolderOpen';


const Loader = () => (
  <Box className="loader-container">
    <Box className="loader" />
  </Box>
);

function ResumeDashboard() {

  const { resumes, setResumes, deleteResume } = useContext(ResumeContext);
  const [loading, setLoading] = useState(false)
  const [shareResumeId, setShareResumeId] = useState(null);
  const [deleteModal, setDeleteModal] = useState(false);
  const [resumeToDelete, setResumeToDelete] = useState(null);
  const [resumeToDownload, setResumeToDownload] = useState(null);
  const [newResume, setNewResume] = useState({ name: "" });
  const [hoveredCard, setHoveredCard] = useState(null);
  const [addModal, setAddModal] = useState(false);
  const navigate = useNavigate();
  const downloadRef = React.useRef(null);

  const baseUrl = process.env.REACT_APP_API_BASE_URL;

  useEffect(() => {
    localStorage.removeItem("resume");
  }, []);


  const handleAdd = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        toast.warn("Unauthorized! Please log in.");
        return;
      }

      if (!newResume.name.trim()) {
        toast.warn("Kindly enter a valid resume name.");
        return;
      }

      const response = await fetch(`${baseUrl}/resume/home`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: newResume.name,
          experience: [],
          education: [],
          certificates: [],
          contact: [],
          project: [],
          github: "",
          linkedin: "",
          template: "",
        }),
      });

      const text = await response.text();
      try {
        const data = JSON.parse(text);
        if (!response.ok) {
          throw new Error(data.message || "Something went wrong");
        }

        setResumes((prevResumes) => [...prevResumes, data.data]);
        setAddModal(false);
        setNewResume({ name: "" });
        localStorage.setItem("resume", JSON.stringify(data.data));
        navigate("/addDetails", { state: { resumeData: data.data } });
      } catch (parseError) {
        console.warn("Invalid JSON from server:", text);
        toast.warn("Server response is not valid JSON. Check console for details.");
      }
    } catch (error) {
      console.error("Error adding resume:", error);
      toast.warn("Failed to add resume");
    }
  };

  const handleDeleteClick = (id) => {
    setResumeToDelete(id);
    setDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    try {
      const result = await deleteResume(resumeToDelete);
      console.log(resumeToDelete)

      if (result) {
        setResumes((prev) => prev.filter((resume) => resume.id !== resumeToDelete));
        toast.success("Resume deleted successfully");
      }
    } catch (error) {
      toast.error("Something went wrong while deleting");
    } finally {
      setDeleteModal(false);
    }
  };

  const handleCloseDeleteModal = () => {
    setDeleteModal(false);
  };

  const handleCardData = async (resumeID) => {
    if (!resumeID) {
      toast.warn("Resume ID is missing");
      return;
    }
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.warn("Unauthorized! Please log in.");
        return;
      }

      const response = await fetch(`${baseUrl}/resume/${resumeID}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("resume", JSON.stringify(data.data));
        navigate("/addDetails", { state: { resumeData: data.data } });
      } else {
        toast.warn(data.message || "Resume not found");
      }
    } catch (error) {
      toast.warn("Resume data does not exist");
    } finally {
      setLoading(false);
    }
  };

  const handleShareClick = (resumeId) => {
    const shareURL = `https://digitcv.netlify.app/resume/${resumeId}`;
    navigator.clipboard.writeText(shareURL)
      .then(() => {
        toast.success("Share link copied to clipboard!");
        // Update the modal display after the clipboard copy operation
        setTimeout(() => setShareResumeId(resumeId), 500);
      })
      .catch(() => {
        toast.error("Failed to copy link.");
      });
  };

  const handleDownloadClick = (resume) => {
    setResumeToDownload(resume);

    setTimeout(() => {
      const input = document.getElementById('resume-to-download');
      console.log(input)
      if (!input) {
        return;
      }
      html2canvas(input, {
        backgroundColor: null,
        useCORS: true,
        logging: false,
      }).then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save(`${resume.contact.firstName}-resume.pdf`);

        setResumeToDownload(null);
      });
    }, 100);
  };


  return (
    <Box className="resume-dashboard">
      <CssBaseline />
      <ToastContainer />
      <AppBar position="fixed" className="app-bar">
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography variant="h4" className="app-title">
            Resumes
          </Typography>
          <div className="userDetails">
            <UserComponent />
          </div>
        </Toolbar>
      </AppBar>

      <Box component="main" sx={{ flexGrow: 1, p: 3, mt: "80px" }}>
        {loading && <Loader />}

        <Grid container spacing={3}>
          {resumes.length === 0 ? (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                height: "50vh",
                textAlign: "center",
                width: "100%",
              }}
            >
              <ErrorOutlineIcon sx={{ fontSize: 80, color: "#4b2354", mb: 2 }} />
              <Typography variant="h5" sx={{ color: "#4b2354", mb: 2 }}>
                No resumes found
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Click "Add Resume" to start creating your first resume.
              </Typography>

              <Box sx={{ mt: 3 }}>
                <CustomButton
                  btnText="Add Resume"
                  className="add-button"
                  updateClick={() => setAddModal(true)}
                />
              </Box>
            </Box>
          ) : (
            <>
              <Box
                sx={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "flex-start",
                  mb: 2,
                }}
              >
                <CustomButton
                  btnText="Add Resume"
                  updateClick={() => setAddModal(true)}
                  className="add-button"
                />
              </Box>

              {resumes.map((resume) => (
                <Grid item xs={12} sm={6} md={4} key={resume.id}>
                  <Grow in timeout={500}>
                    <Card
                      className="animated-card"
                      sx={{
                        width: "90%",
                        minHeight: 420,
                        mx: "auto",
                        borderRadius: "20px",
                        background: hoveredCard === resume.id
                          ? "linear-gradient(135deg, #f1f5f8, #e3ecf0)"
                          : "linear-gradient(135deg, #f8f9fa, #e8f0f7)",
                        boxShadow: hoveredCard === resume.id
                          ? "0px 12px 24px rgba(0, 0, 0, 0.15)"
                          : "0px 6px 12px rgba(0,0,0,0.05)",
                        transition: "transform 0.3s ease, box-shadow 0.3s ease",
                        transform: hoveredCard === resume.id ? "scale(1.03)" : "scale(1)",
                        position: "relative",
                        overflow: "hidden",
                        cursor: "pointer",
                        "&:hover .card-actions": {
                          opacity: 1,
                        },
                      }}


                      onMouseEnter={() => setHoveredCard(resume.id)}
                      onMouseLeave={() => setHoveredCard(null)}
                    >
                      <Box onClick={() => handleCardData(resume.id)} sx={{ cursor: "pointer" }} className="card-content">
                        <CardContent sx={{ textAlign: "center", pt: 6 }}>
                          <FolderOpenIcon sx={{ fontSize: 60, color: "#c5c5c5", mb: 1 }} />

                          <Typography
                            variant="h5"
                            sx={{ color: "#4b2354", textAlign: "center", fontWeight: "bold" }}
                          >
                            {resume.title}
                          </Typography>
                          <Typography
                            sx={{
                              fontSize: "0.9rem",
                              color: "#888",
                              fontStyle: "italic",
                              mt: 2,
                            }}
                          >
                            Click to edit this resume
                          </Typography>
                        </CardContent>
                      </Box>
                      {loading && (
                        <Box
                          sx={{
                            position: "absolute",
                            top: "50%",
                            left: "50%",
                            transform: "translate(-50%, -50%)",
                            zIndex: 10,
                          }}
                        >
                          <CircularProgress sx={{ color: "#4b2354" }} />
                        </Box>
                      )}

                      <CardActions
                        className="card-actions"
                        sx={{
                          position: "absolute",
                          bottom: 16,
                          left: 0,
                          right: 0,
                          display: "flex",
                          justifyContent: "center",
                          gap: 4,
                          opacity: hoveredCard === resume.id ? 1 : 0.4,
                          transition: "opacity 0.3s ease",
                          zIndex: 2,
                        }}
                      >
                        <Tooltip title="Edit">
                          <IconButton onClick={() => handleCardData(resume.id)}>
                            <EditIcon sx={{ color: "#4b2354" }} />
                          </IconButton>
                        </Tooltip>

                        <Tooltip title="Delete">
                          <IconButton onClick={() => handleDeleteClick(resume.id)}>
                            <DeleteIcon sx={{ color: "#4b2354" }} />
                          </IconButton>
                        </Tooltip>


                        <Tooltip title="Share">
                          <IconButton onClick={() => handleShareClick(resume.id)}>
                            <ShareIcon sx={{ color: "#4b2354" }} />
                          </IconButton>
                        </Tooltip>


                        <Tooltip title="Download">
                          <IconButton onClick={() => {
                            handleDownloadClick(resume)
                          }}>
                            <DownloadIcon sx={{ color: "#4b2354" }} />
                          </IconButton>
                        </Tooltip>
                      </CardActions>
                    </Card>
                  </Grow>
                </Grid>

              ))}
            </>
          )}
        </Grid>

        {addModal && (
          <CustomModal isOpen={addModal} closeModal={() => setAddModal(false)}>
            <Box className="modal-box">
              <Typography variant="h6" sx={{ color: "#4b2354", fontWeight: "bold" }}>
                Add a New Resume
              </Typography>
              <CustomInput
                label="Resume Name"
                currentValue={newResume.name}
                updateValue={(value) => setNewResume({ name: value })}
                required
                inputType="text"
              />
              <CustomButton btnText={loading ? "Creating..." : "ADD"}
                btnClass="add-button" updateClick={handleAdd} />
            </Box>
          </CustomModal>
        )}

        {shareResumeId && (
          <CustomModal isOpen={true} closeModal={() => setShareResumeId(null)}>
            <CustomShareButton
              url={`https://digitcv.netlify.app/resume/${shareResumeId}`}
              resume={resumes.find((resume) => resume.id === shareResumeId)} 
              onClose={() => setShareResumeId(null)}
            />
          </CustomModal>
        )}

        {resumeToDownload && (
          <Box
            ref={downloadRef}
            sx={{
              position: "absolute",
              top: "-9999px",
              left: "-9999px",
              // opacity: 0,
              pointerEvents: "none",
              backgroundColor:"transparent"
            }}
          >
            <CommonShareTemplate resumeData={resumeToDownload} />
          </Box>
        )}


        {deleteModal && (
          <CustomModal isOpen={deleteModal} closeModal={handleCloseDeleteModal}>
            <Box className="modal-box">
              <Typography variant="h6" sx={{ color: "#4b2354", fontWeight: "bold" }}>
                Are you sure you want to delete this resume?
              </Typography>
              <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
                <CustomButton
                  btnText="Cancel"
                  btnClass="cancel-button"
                  updateClick={handleCloseDeleteModal}
                />
                <CustomButton
                  btnText="Delete"
                  btnClass="delete-button"
                  updateClick={handleConfirmDelete}
                />
              </Box>
            </Box>
          </CustomModal>
        )}

      </Box>
    </Box>
  );
}

export default ResumeDashboard;

