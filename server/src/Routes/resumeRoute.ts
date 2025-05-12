import express from "express";
import {
  createResume,
  deleteResume,
  getResumeDataById,
  getResumes,
  getShareResumeDataById,
  updateResumes
} from "../Controllers/resumeController";

const router = express.Router();

router.post("/home", createResume);
router.get("/home", getResumes);
router.post("/update", updateResumes);
router.get("/:resumeID", getResumeDataById);
router.get("/share/:resumeID", getShareResumeDataById)
router.delete("/delete/:resumeID", deleteResume); 

export default router;
