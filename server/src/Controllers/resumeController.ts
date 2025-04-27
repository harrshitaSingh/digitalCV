import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import prisma from "../Config/db";
import { ResumeModel } from "../Models/resume.model";

export const createResume = async (req: Request, res: Response) => {
  try {
    const token = req.header("Authorization")?.split(" ")[1];
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized, token missing",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET) as { id: number };


    if (!decoded || !decoded.id) {
      return res.status(401).json({ success: false, message: "Invalid token" });
    }

    const authorId = decoded.id;

    const {
      title,
      experience,
      education,
      certificates,
      contact,
      project,
      github,
      linkedin,
      youTube,
      template,
    }: ResumeModel = req.body;

    if (!title || !experience || !education || !contact || !project) {
      return res.status(400).json({ success: false, message: "Missing required fields while creating" });
    }

    const newResume = await prisma.resume.create({
      data: {
        title,
        experience,
        education,
        certificates,
        contact,
        project,
        github,
        linkedin,
        youTube,
        template,
        authorId,
      },
    });

    res.status(201).json({ success: true, data: newResume });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const getResumes = async (req: Request, res: Response) => {
  try {
    const token = req.header("Authorization")?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET) as { id: number };
    if (!decoded || !decoded.id) {
      return res.status(401).json({ success: false, message: "Invalid token" });
    }

    const authorId = decoded.id;
    const resumes = await prisma.resume.findMany({ where: { authorId } });
    res.json(resumes);
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const updateResumes = async (req: Request, res: Response) => {
  try {
    const { resumeID, section, data } = req.body;
    if (!resumeID || !section || !data) {

      return res.status(400).json({ message: "Missing required fields while updating" });
    }

    const validSections = [
      "experience",
      "education",
      "certificates",
      "contact",
      "project",
      "github",
      "linkedin",
      "youTube",
      "template",
      "links"
    ];

if (!validSections.includes(section)) {
  return res.status(400).json({ message: "Invalid section name987897" });
}


    const updatedResume = await prisma.resume.update({
      where: {
        id: resumeID,
      },
      data: {
        [section]: data,
      },
    });

    return res.status(200).json({
      message: "Resume updated successfully",
      resume: updatedResume,
    });
  } catch (error) {
    console.error("Update error:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const deleteResume = async (req: Request, res: Response) => {
  try {
    const token = req.header("Authorization")?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const resumeID = parseInt(req.params.resumeID, 10);

    if (isNaN(resumeID)) {
      return res.status(400).json({ message: "Invalid resume ID" });
    }

    const deleted = await prisma.resume.delete({
      where: { id: resumeID },
    });

    return res.status(200).json({
      message: "Resume deleted successfully",
      resume: deleted,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};



export const getResumeDataById = async (req: Request, res: Response) => {
  try {
    const token = req.header("Authorization")?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET) as { id: number };
    if (!decoded || !decoded.id) {
      return res.status(401).json({ success: false, message: "Invalid token" });
    }

    const resumeID = req.params.resumeID;
    if (!resumeID) {
      return res.status(400).json({ success: false, message: "Resume ID is required" });
    }


    const resume = await prisma.resume.findUnique({
      where: { id: Number(resumeID) },
    });

    console.log(resume, "klo")

    if (!resume) {
      return res.status(404).json({ success: false, message: "Resume not found" });
    }

    res.status(200).json({ success: true, data: resume });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
  }
};

export const getShareResumeDataById = async (req: Request, res: Response) => {
  try {
    const resumeID = req.params.resumeID;
    if (!resumeID) {
      return res.status(400).json({ success: false, message: "Resume ID is required" });
    }

    const resume = await prisma.resume.findUnique({
      where: { id: Number(resumeID) },
    });

    if (!resume) {
      return res.status(404).json({ success: false, message: "Resume not found" });
    }

    res.status(200).json({ success: true, data: resume });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
  }
};
