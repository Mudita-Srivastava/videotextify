import sys
import io
import whisper
import tempfile
import subprocess
import os
from pydub import AudioSegment, effects
import noisereduce as nr
import soundfile as sf
from dotenv import load_dotenv
load_dotenv()

model_name= os.getenv("WHISPER_MODEL","small")
sample_rate= int(os.getenv("SAMPLE_RATE", 16000))
hp_filter= int(os.getenv("HIGH_PASS_FILTER",100))
lp_filter= int(os.getenv("LOW_PASS_FILTER",3000))
ffmpeg_path = os.getenv("FFMPEG_PATH","ffmpeg")

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
filename = sys.argv[1]
model = whisper.load_model(model_name)

# Use a list to track all temp files for deletion
temp_files = []

try:
    # Step 1: Extract audio from input (video/audio -> wav)
    with tempfile.NamedTemporaryFile(suffix=".wav", delete=False) as tmp_wav:
        audio_path = tmp_wav.name
        temp_files.append(audio_path)
        subprocess.run(
            [ffmpeg_path, "-i", filename, "-ar", str(sample_rate), "-ac", "1", "-y", audio_path],
            stdout=subprocess.DEVNULL,
            stderr=subprocess.DEVNULL,
            check=True,
        )

    # Step 2: Normalize using pydub
    audio = AudioSegment.from_wav(audio_path)
    audio = effects.normalize(audio)  
    audio.export(audio_path, format="wav")

    # Step 3: Noise reduction
    y, sr = sf.read(audio_path)
    y_denoised = nr.reduce_noise(y=y, sr=sr)
    denoised_path = audio_path.replace(".wav", "_denoised.wav")
    temp_files.append(denoised_path)
    sf.write(denoised_path, y_denoised, sr)

    # Step 4: Optional Equalization (high-pass + low-pass filters)
    cleaned_audio = AudioSegment.from_wav(denoised_path)
    cleaned_audio = cleaned_audio.high_pass_filter(hp_filter).low_pass_filter(lp_filter)  
    final_path = denoised_path.replace(".wav", "_clean.wav")
    temp_files.append(final_path)
    cleaned_audio.export(final_path, format="wav")

    # Step 5: Transcribe with Whisper
    result = model.transcribe(final_path)
    print(result["text"])

finally:
    # 🗑️ Delete all temporary files after transcription
    for f in temp_files:
        if os.path.exists(f):
            os.remove(f)

    # Optionally, delete the original uploaded file
    if os.path.exists(filename):
        os.remove(filename)
