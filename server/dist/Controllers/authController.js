var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import prisma from "../Config/db";
import * as jwt from "jsonwebtoken";
/**
 * @name signUp
 * @description Registers a new user, stores the token, and returns user details with token.
 */
export const signUp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        return res.status(400).json({ error: "All fields are required" });
    }
    try {
        const existingUser = yield prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ error: "User already exists" });
        }
        const newUser = yield prisma.user.create({
            data: { name, email, password }
        });
        const token = jwt.sign({ id: newUser.id, name: newUser.name, email: newUser.email }, process.env.JWT_SECRET, { expiresIn: "1h" });
        yield prisma.user.update({
            where: { id: newUser.id },
            data: { token }
        });
        return res.status(201).json({
            message: "User registered successfully",
            user: { id: newUser.id, name: newUser.name, email: newUser.email, token }
        });
    }
    catch (error) {
        console.error("Error during sign-up:", error);
        return res.status(500).json({ error: "Something went wrong, please try again." });
    }
});
/**
 * @name login
 * @description Logs in the user, retrieves their token, and returns user details with token.
 */
export const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ error: "All fields are required" });
    }
    try {
        const user = yield prisma.user.findUnique({ where: { email } });
        if (!user) {
            return res.status(401).json({ error: "User not found" });
        }
        if (user.password !== password) {
            return res.status(401).json({ error: "Invalid password" });
        }
        const token = jwt.sign({ id: user.id, name: user.name, email: user.email }, process.env.JWT_SECRET, { expiresIn: "1h" });
        yield prisma.user.update({
            where: { id: user.id },
            data: { token }
        });
        return res.status(200).json({
            message: "Login successful",
            user: { id: user.id, name: user.name, email: user.email, token }
        });
    }
    catch (error) {
        console.error("Error during login:", error);
        return res.status(500).json({ error: "Something went wrong, please try again." });
    }
});
