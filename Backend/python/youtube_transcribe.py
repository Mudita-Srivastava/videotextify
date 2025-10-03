import sys
import whisper
import yt_dlp
import os

def download_audio_from_youtube(url, output_file="temp_audio.mp3"):
    """Download the best-quality audio from a YouTube video"""
    ydl_opts = {
        'format': 'bestaudio/best',
        'outtmpl': 'temp_audio.%(ext)s',
        'postprocessors': [{
            'key': 'FFmpegExtractAudio',
            'preferredcodec': 'mp3',
            'preferredquality': '192',
        }],
        'quiet': True
    }

    with yt_dlp.YoutubeDL(ydl_opts) as ydl:
        ydl.download([url])

    # Ensure the downloaded file name matches
    if os.path.exists("temp_audio.mp3"):
        return "temp_audio.mp3"
    elif os.path.exists("temp_audio.m4a"):
        # Rename to .mp3 if extracted differently
        os.rename("temp_audio.m4a", "temp_audio.mp3")
        return "temp_audio.mp3"
    else:
        raise FileNotFoundError("Audio download failed – file not found.")


def transcribe_audio(file_path):
    """Transcribe the given audio file using OpenAI Whisper"""
    model = whisper.load_model("base")
    result = model.transcribe(file_path)
    return result["text"]


if __name__ == "__main__":
    try:
        # ✅ Get YouTube URL from Node.js
        url = sys.argv[1]

        # Step 1: Download
        audio_file = download_audio_from_youtube(url)

        # Step 2: Transcribe
        transcript = transcribe_audio(audio_file)
        print(transcript.encode("utf-8", errors="ignore").decode("utf-8"))

    except Exception as e:
        print(f"Error: {e}")

    finally:
        # Step 3: Cleanup temporary audio file
        if os.path.exists("temp_audio.mp3"):
            os.remove("temp_audio.mp3")
