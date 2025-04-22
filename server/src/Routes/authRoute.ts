import express from "express";
import { signUp, login } from "../Controllers/authController";

const router = express.Router();

router.post("/signUp", signUp);
router.post("/", login);

export default router;
