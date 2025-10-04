import { spawn } from "child_process";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const youtubeController = (req, res) => {
  const { url } = req.body;

  const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/;

  if (!url || !youtubeRegex.test(url)) {
    return res
      .status(400)
      .json({ error: "Invalid URL. Please enter a valid YouTube link." });
  }

  console.log("Received YouTube URL:", url);

  const scriptPath = path.join(__dirname, "../python/youtube_transcribe.py");

  // Run youtube_transcribe.py
  const pythonProcess = spawn(process.env.PYTHON_PATH, [scriptPath, url]);

  let transcript = "";

  pythonProcess.stdout.on("data", (data) => {
    const text = data.toString();

    if (!text.includes("[download")) {
      transcript += text;
    }
    console.log("Transcript chunk:", data.toString());
  });

  pythonProcess.stderr.on("data", (data) => {
    console.error("Python error:", data.toString());
  });

  pythonProcess.on("close", (code) => {
    if (code === 0) {
      res.json({
        message: "✅ YouTube transcription successful",
        transcript: transcript.trim(),
      });
    } else {
      res.status(500).json({ error: "YouTube transcription failed" });
    }
  });
};
