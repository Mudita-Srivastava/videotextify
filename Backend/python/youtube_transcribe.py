import sys
import whisper
import yt_dlp
import os

def download_audio_from_youtube(url, output_file="temp_audio.mp3"):
    """
    Download the best-quality audio from a YouTube video.
    Uses cookies.txt to bypass 'Sign in to confirm you’re not a bot' errors.
    """
    ydl_opts = {
        'format': 'bestaudio/best',
        'outtmpl': 'temp_audio.%(ext)s',

        # --- FIX for Sign in / Bot Detection ---
        'cookiefile': './cookies.txt',   # 👈 Make sure cookies.txt is in the same folder
        # --- END FIX ---

        # Set to False to see yt-dlp output for debugging 
        'quiet': False,

        'postprocessors': [{
            'key': 'FFmpegExtractAudio',
            'preferredcodec': 'mp3',
            'preferredquality': '192',
        }],
    }

    try:
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            ydl.download([url])
    except yt_dlp.utils.DownloadError as e:
        print(f"yt-dlp Download Error: {e}", file=sys.stderr)
        raise e

    # Ensure the downloaded file matches expected format
    if os.path.exists("temp_audio.mp3"):
        return "temp_audio.mp3"
    elif os.path.exists("temp_audio.m4a"):
        os.rename("temp_audio.m4a", "temp_audio.mp3")
        return "temp_audio.mp3"
    else:
        for ext in ['webm', 'ogg']:
            if os.path.exists(f"temp_audio.{ext}"):
                raise FileNotFoundError(
                    f"Audio downloaded as temp_audio.{ext}, but could not convert to MP3. Ensure FFmpeg is installed."
                )
        raise FileNotFoundError("Audio download failed – no file created.")

def transcribe_audio(file_path):
    """Transcribe the given audio file using OpenAI Whisper"""
    model = whisper.load_model("base")
    result = model.transcribe(file_path)
    return result["text"]

if __name__ == "__main__":
    audio_file = None
    try:
        if len(sys.argv) < 2:
            raise ValueError("Usage: python utube_transcribe.py <youtube_url>")

        url = sys.argv[1]

        # Step 1: Download
        print(f"Starting audio download for: {url}")
        audio_file = download_audio_from_youtube(url)
        print("Download complete. Starting transcription...")

        # Step 2: Transcribe
        transcript = transcribe_audio(audio_file)

        # Print transcript to standard output for further processing
        print("--- TRANSCRIPT ---")
        print(transcript.encode("utf-8", errors="ignore").decode("utf-8"))
        print("--- END TRANSCRIPT ---")

    except Exception as e:
        print(f"Python error: {type(e).__name__}: {e}", file=sys.stderr)

    finally:
        # Step 3: Cleanup temporary audio file
        if audio_file and os.path.exists(audio_file):
            print(f"Cleaning up temporary file: {audio_file}", file=sys.stderr)
            os.remove(audio_file)
