import express from "express";
import multer from "multer";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { spawn } from "child_process";
import dotenv from "dotenv";
import fs from "fs"; // ⬅️ add this

dotenv.config();

const app = express();
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    methods: ["GET", "POST","OPTIONS"],
  })
);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Ensure uploads directory exists BEFORE Multer tries to use it
//const uploadPath = path.join(__dirname, "uploads");
const uploadPath="/tmp";

if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadPath), // use uploadPath instead of re-joining
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});

const upload = multer({ storage });

app.post("/upload", upload.single("file"), (req, res) => {
  console.log("File uploaded:", req.file);
  if (!req.file) {
    console.log("No file received");
    return res.status(400).json({ error: "No file uploaded" });
  }

  //check file exists before spawing python
  if (!fs.existsSync(req.file.path)) {
    console.log("File missing:", req.file.path);
    return res.status(500).json({ error: "Uploaded file missing on server" });
  }

  // Run Python Whisper script
  console.log("File exists:", req.file.path);
  const pythonProcess = spawn(process.env.PYTHON_PATH, [
    "transcribe.py",
    req.file.path,
  ]);

  let transcript = "";
  pythonProcess.stdout.on("data", (data) => {
    transcript += data.toString();
    console.log("mudita logs: ", transcript);
  });

  pythonProcess.stderr.on("data", (data) => {
    console.error(`Python error: ${data}`);
  });

  pythonProcess.on("close", (code) => {
    console.log("before file transcribed");
    if (code === 0) {
      console.log("transcription send");
      res.json({
        message: "✅ File uploaded and transcribed",
        transcript: transcript.trim(),
      });
    } else {
      res.status(500).json({ error: "Transcription failed" });
    }
  });
});

app.listen(process.env.PORT, () => {
  console.log("🚀 Server running");
});
