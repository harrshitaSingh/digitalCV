"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getResumeDataById = exports.deleteResume = exports.updateResumes = exports.getResumes = exports.createResume = void 0;
var jsonwebtoken_1 = require("jsonwebtoken");
var db_1 = require("../Config/db");
var createResume = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var token, decoded, authorId, _a, title, experience, education, certificates, contact, project, github, linkedin, template, newResume, error_1;
    var _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _c.trys.push([0, 2, , 3]);
                token = (_b = req.header("Authorization")) === null || _b === void 0 ? void 0 : _b.split(" ")[1];
                if (!token) {
                    return [2 /*return*/, res.status(401).json({
                            success: false,
                            message: "Unauthorized, token missing",
                        })];
                }
                decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
                if (!decoded || !decoded.id) {
                    return [2 /*return*/, res.status(401).json({ success: false, message: "Invalid token" })];
                }
                authorId = decoded.id;
                _a = req.body, title = _a.title, experience = _a.experience, education = _a.education, certificates = _a.certificates, contact = _a.contact, project = _a.project, github = _a.github, linkedin = _a.linkedin, template = _a.template;
                if (!title || !experience || !education || !contact || !project) {
                    return [2 /*return*/, res.status(400).json({ success: false, message: "Missing required fields while creating" })];
                }
                return [4 /*yield*/, db_1.default.resume.create({
                        data: {
                            title: title,
                            experience: experience,
                            education: education,
                            certificates: certificates,
                            contact: contact,
                            project: project,
                            github: github,
                            linkedin: linkedin,
                            template: template,
                            authorId: authorId,
                        },
                    })];
            case 1:
                newResume = _c.sent();
                res.status(201).json({ success: true, data: newResume });
                return [3 /*break*/, 3];
            case 2:
                error_1 = _c.sent();
                res.status(500).json({ success: false, message: "Internal Server Error" });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.createResume = createResume;
var getResumes = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var token, decoded, authorId, resumes, error_2;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                token = (_a = req.header("Authorization")) === null || _a === void 0 ? void 0 : _a.split(" ")[1];
                if (!token) {
                    return [2 /*return*/, res.status(401).json({ success: false, message: "Unauthorized" })];
                }
                decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
                if (!decoded || !decoded.id) {
                    return [2 /*return*/, res.status(401).json({ success: false, message: "Invalid token" })];
                }
                authorId = decoded.id;
                return [4 /*yield*/, db_1.default.resume.findMany({ where: { authorId: authorId } })];
            case 1:
                resumes = _b.sent();
                res.json(resumes);
                return [3 /*break*/, 3];
            case 2:
                error_2 = _b.sent();
                res.status(500).json({ success: false, message: "Internal Server Error" });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getResumes = getResumes;
var updateResumes = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, resumeID, section, data, validSections, updatedResume, error_3;
    var _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _c.trys.push([0, 2, , 3]);
                _a = req.body, resumeID = _a.resumeID, section = _a.section, data = _a.data;
                console.log(resumeID, "id", section, "section", data, "data");
                if (!resumeID || !section || !data) {
                    return [2 /*return*/, res.status(400).json({ message: "Missing required fields while updating" })];
                }
                validSections = [
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
                    return [2 /*return*/, res.status(400).json({ message: "Invalid section name" })];
                }
                return [4 /*yield*/, db_1.default.resume.update({
                        where: {
                            id: resumeID,
                        },
                        data: (_b = {},
                            _b[section] = data,
                            _b),
                    })];
            case 1:
                updatedResume = _c.sent();
                return [2 /*return*/, res.status(200).json({
                        message: "Resume updated successfully",
                        resume: updatedResume,
                    })];
            case 2:
                error_3 = _c.sent();
                console.error("Update error232323:", error_3);
                res.status(500).json({ success: false, message: "Internal Server Error" });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.updateResumes = updateResumes;
var deleteResume = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var token, resumeID, deleted, error_4;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                token = (_a = req.header("Authorization")) === null || _a === void 0 ? void 0 : _a.split(" ")[1];
                if (!token) {
                    return [2 /*return*/, res.status(401).json({ success: false, message: "Unauthorized" })];
                }
                resumeID = parseInt(req.params.resumeID, 10);
                if (isNaN(resumeID)) {
                    return [2 /*return*/, res.status(400).json({ message: "Invalid resume ID" })];
                }
                return [4 /*yield*/, db_1.default.resume.delete({
                        where: { id: resumeID },
                    })];
            case 1:
                deleted = _b.sent();
                return [2 /*return*/, res.status(200).json({
                        message: "Resume deleted successfully",
                        resume: deleted,
                    })];
            case 2:
                error_4 = _b.sent();
                res.status(500).json({ success: false, message: "Internal Server Error" });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.deleteResume = deleteResume;
var getResumeDataById = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var token, decoded, resumeID, resume, error_5;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                token = (_a = req.header("Authorization")) === null || _a === void 0 ? void 0 : _a.split(" ")[1];
                if (!token) {
                    return [2 /*return*/, res.status(401).json({ success: false, message: "Unauthorized" })];
                }
                decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
                if (!decoded || !decoded.id) {
                    return [2 /*return*/, res.status(401).json({ success: false, message: "Invalid token" })];
                }
                resumeID = req.params.resumeID;
                if (!resumeID) {
                    return [2 /*return*/, res.status(400).json({ success: false, message: "Resume ID is required" })];
                }
                return [4 /*yield*/, db_1.default.resume.findUnique({
                        where: { id: Number(resumeID) },
                    })];
            case 1:
                resume = _b.sent();
                if (!resume) {
                    return [2 /*return*/, res.status(404).json({ success: false, message: "Resume not found" })];
                }
                res.status(200).json({ success: true, data: resume });
                return [3 /*break*/, 3];
            case 2:
                error_5 = _b.sent();
                res.status(500).json({ success: false, message: "Internal Server Error", error: error_5.message });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getResumeDataById = getResumeDataById;
