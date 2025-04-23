import express from "express";
import cors from "cors";
import { PrismaClient } from "../node_modules/.prisma/client/default";
import authRoutes from "./Routes/authRoute";
import resumeRoutes  from "./Routes/resumeRoute"; 

const prisma = new PrismaClient();
const app = express();
const allowedOrigins = ['https://digitcv.netlify.app', 'http://localhost:3000'];




app.use(express.json());
app.use(cors({
  origin: function(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

app.use("/auth", authRoutes);
app.use("/resume", resumeRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
