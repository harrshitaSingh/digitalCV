import express from "express";
import cors from "cors";
import { PrismaClient } from "../node_modules/.prisma/client/default";
import authRoutes from "./Routes/authRoute";
import resumeRoutes  from "./Routes/resumeRoute"; 

const prisma = new PrismaClient();
const app = express();

app.use(express.json());
app.use(cors({
  origin: "https://digitcv.netlify.app",
  credentials: true
}));

app.use("/auth", authRoutes);
app.use("/resume",  resumeRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
