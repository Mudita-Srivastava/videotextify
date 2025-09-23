import express from "express";
import multer from "multer";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { spawn } from "child_process";

const app = express();
app.use(cors());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, "uploads")),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});

const upload = multer({ storage });

app.post("/upload", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  // Run Python Whisper script
  console.log(req.file.path);
  const pythonProcess = spawn("python", ["transcribe.py", req.file.path]);

  let transcript = "";
  pythonProcess.stdout.on("data", (data) => {
    transcript += data.toString();
  });

  pythonProcess.stderr.on("data", (data) => {
    console.error(`Python error: ${data}`);
  });

  pythonProcess.on("close", (code) => {
    if (code === 0) {
      res.json({
        message: "✅ File uploaded and transcribed",
        transcript: transcript.trim(),
      });
    } else {
      res.status(500).json({ error: "Transcription failed" });
    }
  });
});

app.listen(5000, () => {
  console.log("🚀 Server running at http://localhost:5000");
});
