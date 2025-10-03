import { spawn } from "child_process";
import path from "path";
import fs from "fs";
import multer from "multer";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 🔹 Configure Multer storage
const uploadPath = "/tmp";
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadPath),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});

export const upload = multer({ storage });

// 🔹 Controller function (clean and similar to youtubeController)
export const uploadController = (req, res) => {
  if (!req.file) {
    console.log("No file received");
    return res.status(400).json({ error: "No file uploaded" });
  }

  const filePath = req.file.path;

  // ✅ Ensure file exists before running Python
  if (!fs.existsSync(filePath)) {
    console.log("File missing:", filePath);
    return res.status(500).json({ error: "Uploaded file missing on server" });
  }

  console.log("File uploaded successfully:", filePath);

  const scriptPath = path.join(__dirname, "../python/transcribe.py");

  // 🔹 Run Python Whisper transcription script
  const pythonProcess = spawn(process.env.PYTHON_PATH, [scriptPath, filePath]);

  let transcript = "";

  pythonProcess.stdout.on("data", (data) => {
    const text = data.toString();
    transcript += text;
    console.log("Transcript chunk:", text);
  });

  pythonProcess.stderr.on("data", (data) => {
    console.error("Python error:", data.toString());
  });

  pythonProcess.on("close", (code) => {
    if (code === 0) {
      console.log("✅ Transcription completed successfully");
      res.json({
        message: "✅ File uploaded and transcribed successfully",
        transcript: transcript.trim(),
      });
    } else {
      console.error("❌ Transcription failed with code:", code);
      res.status(500).json({ error: "Transcription failed" });
    }
  });
};
