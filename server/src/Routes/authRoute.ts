import express from "express";
import { signUp, login, getUser, updateUser, updatePassword, updateProfilePhoto } from "../Controllers/authController";

const router = express.Router();

router.post("/signUp", signUp);
router.post("/", login);
router.get("/user", getUser);
router.post("/user", updateUser);
router.post("/user/password", updatePassword);
router.post("/user/profilePhoto", updateProfilePhoto)

export default router;
