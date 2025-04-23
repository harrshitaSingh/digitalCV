"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var authController_1 = require("../Controllers/authController");
var router = express.Router();
router.post("/signUp", authController_1.signUp);
router.post("/", authController_1.login);
exports.default = router;
