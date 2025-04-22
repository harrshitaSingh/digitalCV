import express from "express";
import {
  createResume,
  deleteResume,
  getResumeDataById,
  getResumes,
  updateResumes
} from "../Controllers/resumeController";

const router = express.Router();

router.post("/home", createResume);
router.get("/home", getResumes);
router.post("/update", updateResumes);
router.get("/:resumeID", getResumeDataById);
router.delete("/delete/:resumeID", deleteResume); // ✅ Correct

export default router;
