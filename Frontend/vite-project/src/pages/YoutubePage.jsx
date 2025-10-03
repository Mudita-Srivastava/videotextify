import { useState } from "react";

function YoutubePage() {
  const [url, setUrl] = useState("");
  const [message, setMessage] = useState("");
  const [transcript, setTranscript] = useState("");
  const [loading, setLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

  const handleSubmit = async () => {
    if (!url.trim()) {
      setMessage("❌ Please enter a YouTube URL");
      return;
    }

    try {
      setLoading(true);
      setMessage("");
      const res = await fetch(`${import.meta.env.VITE_APP_API_URL}/api/youtube`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });

      const data = await res.json();
      if (res.ok) {
        setTranscript(data.transcript);
        setMessage("✅ Transcription successful!");
      } else {
        setMessage("❌ Failed to transcribe.");
      }
    } catch (err) {
      console.error(err);
      setMessage("❌ Error while processing video.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-[400px] text-center">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">VideoTextify</h1>

        <input
          type="text"
          placeholder="Paste YouTube URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="w-full border-2 border-gray-300 rounded-lg p-2 mb-4"
        />

        <button
          onClick={handleSubmit}
          disabled={loading}
          className={`w-full py-2 rounded-lg transition ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-500 text-white hover:bg-blue-600"
          }`}
        >
          {loading ? "Processing..." : "Convert"}
        </button>

        {/* Status Message */}
        {message && <p className="mt-4 font-medium text-gray-700">{message}</p>}

        {/* Small Inline Loader (just like UploadPage) */}
        {loading && (
          <div className="mt-6 flex flex-col items-center">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-2 text-gray-600 text-sm">Transcribing your video...</p>
          </div>
        )}

        {/* Transcript Result */}
        {!loading && transcript && (
          <div className="mt-6 text-left">
            <h2 className="text-lg font-semibold text-gray-800 mb-2">Text:</h2>
            <div className="bg-gray-100 p-4 rounded-lg text-sm text-gray-700 whitespace-pre-wrap max-h-60 overflow-y-auto">
              {transcript}
            </div>

            {showAlert && (
              <div className="mt-2 bg-green-100 text-green-700 px-4 py-2 rounded">
                ✅ Text copied to clipboard!
              </div>
            )}

            <button
              onClick={() => {
                navigator.clipboard.writeText(transcript);
                setShowAlert(true);
                setTimeout(() => setShowAlert(false), 2000);
              }}
              className="mt-3 bg-green-500 text-white py-1 px-4 rounded-lg hover:bg-green-600 transition"
            >
              Copy
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default YoutubePage;
