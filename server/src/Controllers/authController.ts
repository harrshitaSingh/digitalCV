import prisma from "../Config/db";
import jwt from "jsonwebtoken";
import { signUpModel } from "../Models/signUp.model";
import { loginModel } from "../Models/logIn.model";
import { Request, Response } from "express";

/**
 * @name signUp
 * @description Registers a new user, stores the token, and returns user details with token.
 */
export const signUp = async (req: Request<{}, {}, signUpModel>, res: Response) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    const newUser = await prisma.user.create({
      data: { name, email, password }
    });


    const token = jwt.sign(
      { id: newUser.id, name: newUser.name, email: newUser.email },
      process.env.JWT_SECRET!,
      { expiresIn: "1h" }
    );


    await prisma.user.update({
      where: { id: newUser.id },
      data: { token }
    });

    return res.status(201).json({
      message: "User registered successfully",
      user: { id: newUser.id, name: newUser.name, email: newUser.email, token }
    });

  } catch (error) {
    console.error("Error during sign-up:", error);
    return res.status(500).json({ error: "Something went wrong, please try again." });
  }
};



/**
 * @name login
 * @description Logs in the user, retrieves their token, and returns user details with token.
 */
export const login = async (req: Request<{}, {}, loginModel>, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }

    if (user.password !== password) {
      return res.status(401).json({ error: "Invalid password" });
    }

    const token = jwt.sign(
      { id: user.id, name: user.name, email: user.email },
      process.env.JWT_SECRET!,
      { expiresIn: "1h" }
    );


    await prisma.user.update({
      where: { id: user.id },
      data: { token }
    });

    return res.status(200).json({
      message: "Login successful",
      user: { id: user.id, name: user.name, email: user.email, token }
    });

  } catch (error) {
    console.error("Error during login:", error);
    return res.status(500).json({ error: "Something went wrong, please try again." });
  }
};



/**
 * @name getUser
 * @description Fetches the authenticated user's details based on the token.
 */


export const getUser = async (req: Request, res: Response) => {
  const token = req.header("Authorization")?.split(" ")[1];


  if (!token) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: number };
    if (!decoded || !decoded.id) {
      return res.status(401).json({ success: false, message: "Invalid token" });
    }

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
    });


    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    return res.status(200).json({
      success: true,
      user: { id: user.id, name: user.name, email: user.email, password: user.password, profilePhoto: user.profilePhoto },
    });
  } catch (error) {
    console.error("Error verifying token:", error);
    return res.status(500).json({ success: false, message: "Something went wrong" });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  const token = req.header("Authorization")?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: number };
    const { name, email } = req.body;

    const updatedUser = await prisma.user.update({
      where: { id: decoded.id },
      data: {
        name,
        email
      },
    });


    return res.status(200).json({
      success: true,
      message: "User details updated successfully",
      user: { id: updatedUser.id, name: updatedUser.name, email: updatedUser.email }
    });


  } catch (error) {
    console.error("Error updating user:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const updatePassword = async (req: Request, res: Response) => {
  const token = req.header("Authorization")?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: number };
    const { oldPassword, newPassword, confirmPassword } = req.body;

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ success: false, message: "Passwords do not match" });
    }

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
    });

    if (!user || user.password !== oldPassword) {
      return res.status(401).json({ success: false, message: "Old password incorrect" });
    }

    const updatedUser = await prisma.user.update({
      where: { id: decoded.id },
      data: { password: newPassword },
    });

    return res.status(200).json({
      success: true,
      message: "Password updated successfully"
    });

  } catch (error) {
    console.error("Error updating password:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};


export const updateProfilePhoto = async (req: Request, res: Response) => {
  const token = req.header("Authorization")?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: number };
    const { profilePhoto } = req.body;

    if (!profilePhoto || typeof profilePhoto !== "string") {
      return res.status(400).json({ success: false, message: "Invalid profile photo" });
    }

    const base64String = profilePhoto.replace(/^data:image\/\w+;base64,/, "");

    const user = await prisma.user.update({
      where: { id: decoded.id },
      data: { profilePhoto: base64String },
    });

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Profile photo updated successfully",
    });

  } catch (error) {
    console.error("Error updating profile picture:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
