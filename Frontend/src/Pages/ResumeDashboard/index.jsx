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
  const [isSharing, setIsSharing] = useState(false);

  const baseUrl = process.env.REACT_APP_API_BASE_URL;

  useEffect(() => {
    localStorage.removeItem("resume");
  }, []);


  const handleAdd = async () => {
    setLoading(true);
    try {
      const getCookie = (name) => {
        const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
        return match ? match[2] : null;
      };

      const token = getCookie("token");

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
          youTube: "",
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
        toast.warn("Server response is not valid JSON. Check console for details.");
      }
    } catch (error) {
      console.error("Error adding resume:", error);
      toast.warn("Failed to add resume");
    }
    finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (id) => {
    setResumeToDelete(id);
    setDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    setLoading(true);


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
      setLoading(false)
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
    try {
      const getCookie = (name) => {
        const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
        return match ? match[2] : null;
      };

      const token = getCookie("token");
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
    }
  finally {
    }
  };

  const handleShareClick = (resumeId) => {
    const shareURL = `https://digitcv.netlify.app/resume/${resumeId}`;
    // const shareURL = `http://localhost:3000/resume/${resumeId}`;

    navigator.clipboard.writeText(shareURL)
      .then(() => {
        toast.success("Share link copied to clipboard!");
        setIsSharing(true)
        setTimeout(() => setShareResumeId(resumeId), 500);
      })
      .catch(() => {
        toast.error("Failed to copy link.");
      });
  };

  const handleDownloadClick = (resume) => {
    setResumeToDownload(resume);
    setIsSharing(false)
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
        <Toolbar sx={{ display: "flex", justifyContent: "space-between", px: { xs: 2, sm: 4 } }}>
          <Typography variant="h5" className="app-title" sx={{ fontSize: { xs: "1.4rem", sm: "2rem" } }}>
            Resumes
          </Typography>
          <Box className="userDetails">
            <UserComponent />
          </Box>
        </Toolbar>
      </AppBar>

      <Box component="main" sx={{ flexGrow: 1, px: { xs: 2, sm: 3 }, mt: "80px", mb: 4 }}>
        {loading && <Loader />}

        <Grid container spacing={3}>
          {resumes.length === 0 ? (
            <Grid item xs={12}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  height: "50vh",
                  textAlign: "center",
                  width: "100%",
                  px: 2,
                }}
              >
                <ErrorOutlineIcon sx={{ fontSize: 60, color: "#4b2354", mb: 2 }} />
                <Typography variant="h6" sx={{ color: "#4b2354", mb: 2 }}>
                  No resumes found
                </Typography>
                <Typography variant="body2" color="text.secondary">
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
            </Grid>
          ) : (
              <>
              <Grid item xs={12}>
                <Box sx={{ display: "flex", justifyContent: "flex-start", mb: 2 }}>
                  <CustomButton
                    btnText="Add Resume"
                    updateClick={() => setAddModal(true)}
                    className="add-button"
                  />
                </Box>
              </Grid>

              {resumes.map((resume) => (
                <Grid item xs={12} sm={6} md={4} key={resume.id}>
                  <Grow in timeout={500}>
                    <Card
                      className="animated-card"
                      sx={{
                        width: {
                          xs: "100%",
                          sm: "85%",
                          md: "80%",
                          lg: "75%",
                          xl: "70%"
                        },
                        minHeight: 420,
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
                      <Box onClick={() => handleCardData(resume.id)} className="card-content">
                        <CardContent sx={{ textAlign: "center", pt: 6, px: 2 }}>
                          <FolderOpenIcon sx={{ fontSize: 50, color: "#c5c5c5", mb: 1 }} />

                          <Typography
                            variant="h6"
                            sx={{ color: "#4b2354", fontWeight: "bold", fontSize: { xs: "1rem", sm: "1.2rem" } }}
                          >
                            {resume.title}
                          </Typography>
                          <Typography
                            sx={{
                              fontSize: "0.85rem",
                              color: "#888",
                              fontStyle: "italic",
                              mt: 2,
                            }}
                          >
                            Click to edit this resume
                          </Typography>
                        </CardContent>
                      </Box>

                      <CardActions
                        className="card-actions"
                        sx={{
                          position: "absolute",
                          bottom: 16,
                          left: 0,
                          right: 0,
                          display: "flex",
                          justifyContent: "center",
                          gap: 3,
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
                          <IconButton onClick={() => handleDownloadClick(resume)}>
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

        {/* Modals stay the same — just ensure modal-box styles are responsive */}
        {addModal && (
          <CustomModal isOpen={addModal} closeModal={() => setAddModal(false)}>
            <Box className="modal-box">
              <Typography variant="h6" sx={{ color: "#4b2354", fontWeight: "bold", mb: 2 }}>
                Add a New Resume
              </Typography>
              <CustomInput
                label="Resume Name"
                currentValue={newResume.name}
                updateValue={(value) => setNewResume({ name: value })}
                required
                inputType="text"
              />
              <CustomButton btnText={loading ? <CircularProgress sx={{ color: "#4b2354" }} />
                : "ADD"} btnClass="add-button" updateClick={handleAdd} />
            </Box>
          </CustomModal>
        )}

        {shareResumeId && (
          <CustomModal isOpen={true} closeModal={() => setShareResumeId(null)}>
            <CustomShareButton
              url={`https://digitcv.netlify.app/resume/${shareResumeId}`}
              // url={`http://localhost:3000/${shareResumeId}`}
              resume={resumes.find((resume) => resume.id === shareResumeId)}
              isSharing={isSharing}
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
              pointerEvents: "none",
              backgroundColor: "transparent"
            }}
          >
            <CommonShareTemplate resumeData={resumeToDownload} isSharing={isSharing} />
          </Box>
        )}

        {deleteModal && (
          <CustomModal isOpen={deleteModal} closeModal={handleCloseDeleteModal}>
            <Box className="modal-box">
              <Typography variant="h6" sx={{ color: "#4b2354", fontWeight: "bold" }}>
                Are you sure you want to delete this resume?
              </Typography>
              <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2, gap: 2 }}>
                <CustomButton
                  btnText="Cancel"
                  btnClass="cancel-button"
                  updateClick={handleCloseDeleteModal}
                />
                <CustomButton
                  btnText={loading ? <CircularProgress sx={{ color: "#4b2354" }} />
                    : "Delete"}
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

