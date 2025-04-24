import express from "express";
import cors from "cors";
import { PrismaClient } from "../node_modules/.prisma/client/default";
import authRoutes from "./Routes/authRoute";
import resumeRoutes from "./Routes/resumeRoute"; 

const prisma = new PrismaClient();
const app = express();

app.use(
  cors({
    origin: (origin, callback) => {
      if (
        origin === "https://digitcv.netlify.app" ||
        origin === "http://localhost:3000" ||
        origin === "http://localhost:3001"
      ) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.options("*", cors());

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

app.use("/auth", authRoutes);
app.use("/resume", resumeRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
