import sys
import io
import whisper
import tempfile
import subprocess
from pydub import AudioSegment, effects
import noisereduce as nr
import numpy as np
import soundfile as sf

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
filename = sys.argv[1]
model = whisper.load_model("small")

# Step 1: Extract audio from input (video/audio -> wav)
with tempfile.NamedTemporaryFile(suffix=".wav", delete=False) as tmp_wav:
    audio_path = tmp_wav.name
    subprocess.run(
        ["ffmpeg", "-i", filename, "-ar", "16000", "-ac", "1", "-y", audio_path],
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL,
        check=True,
    )

  # Step 2: Normalize using pydub
audio = AudioSegment.from_wav(audio_path)
audio = effects.normalize(audio)  
audio.export(audio_path, format="wav")

# Step 3: Noise reduction
y, sr = sf.read(audio_path)  # read normalized audio
y_denoised = nr.reduce_noise(y=y, sr=sr)
denoised_path = audio_path.replace(".wav", "_denoised.wav")
sf.write(denoised_path, y_denoised, sr)

# Step 4: Optional Equalization (high-pass + low-pass filters)
cleaned_audio = AudioSegment.from_wav(denoised_path)
cleaned_audio = cleaned_audio.high_pass_filter(100).low_pass_filter(3000)  
final_path = denoised_path.replace(".wav", "_clean.wav")
cleaned_audio.export(final_path, format="wav")


result = model.transcribe(final_path)
print(result["text"])
