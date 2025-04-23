"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var resumeController_1 = require("../Controllers/resumeController");
var router = express_1.default.Router();
router.post("/home", resumeController_1.createResume);
router.get("/home", resumeController_1.getResumes);
router.post("/update", resumeController_1.updateResumes);
router.get("/:resumeID", resumeController_1.getResumeDataById);
router.delete("/delete/:resumeID", resumeController_1.deleteResume); // ✅ Correct
exports.default = router;
