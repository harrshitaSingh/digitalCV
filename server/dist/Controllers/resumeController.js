var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import * as jwt from "jsonwebtoken";
import prisma from "../Config/db";
export const createResume = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const token = (_a = req.header("Authorization")) === null || _a === void 0 ? void 0 : _a.split(" ")[1];
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized, token missing",
            });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded || !decoded.id) {
            return res.status(401).json({ success: false, message: "Invalid token" });
        }
        const authorId = decoded.id;
        const { title, experience, education, certificates, contact, project, github, linkedin, template, } = req.body;
        if (!title || !experience || !education || !contact || !project) {
            return res.status(400).json({ success: false, message: "Missing required fields while creating" });
        }
        const newResume = yield prisma.resume.create({
            data: {
                title,
                experience,
                education,
                certificates,
                contact,
                project,
                github,
                linkedin,
                template,
                authorId,
            },
        });
        res.status(201).json({ success: true, data: newResume });
    }
    catch (error) {
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});
export const getResumes = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const token = (_a = req.header("Authorization")) === null || _a === void 0 ? void 0 : _a.split(" ")[1];
        if (!token) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded || !decoded.id) {
            return res.status(401).json({ success: false, message: "Invalid token" });
        }
        const authorId = decoded.id;
        const resumes = yield prisma.resume.findMany({ where: { authorId } });
        res.json(resumes);
    }
    catch (error) {
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});
export const updateResumes = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { resumeID, section, data } = req.body;
        console.log(resumeID, "id", section, "section", data, "data");
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
            "template",
            "links"
        ];
        console.log("Section received:", section);
        if (!validSections.includes(section)) {
            return res.status(400).json({ message: "Invalid section name" });
        }
        const updatedResume = yield prisma.resume.update({
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
    }
    catch (error) {
        console.error("Update error232323:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});
export const deleteResume = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const token = (_a = req.header("Authorization")) === null || _a === void 0 ? void 0 : _a.split(" ")[1];
        if (!token) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }
        const resumeID = parseInt(req.params.resumeID, 10);
        if (isNaN(resumeID)) {
            return res.status(400).json({ message: "Invalid resume ID" });
        }
        const deleted = yield prisma.resume.delete({
            where: { id: resumeID },
        });
        return res.status(200).json({
            message: "Resume deleted successfully",
            resume: deleted,
        });
    }
    catch (error) {
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});
export const getResumeDataById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const token = (_a = req.header("Authorization")) === null || _a === void 0 ? void 0 : _a.split(" ")[1];
        if (!token) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded || !decoded.id) {
            return res.status(401).json({ success: false, message: "Invalid token" });
        }
        const resumeID = req.params.resumeID;
        if (!resumeID) {
            return res.status(400).json({ success: false, message: "Resume ID is required" });
        }
        const resume = yield prisma.resume.findUnique({
            where: { id: Number(resumeID) },
        });
        if (!resume) {
            return res.status(404).json({ success: false, message: "Resume not found" });
        }
        res.status(200).json({ success: true, data: resume });
    }
    catch (error) {
        res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
    }
});
