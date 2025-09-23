import { useState } from "react";

function App() {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [transcript, setTranscript] = useState("");
  const [showAlert, setShowAlert] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setMessage("");
    setTranscript(""); 
  };

  const handleUpload = async () => {
    if (!file) {
      setMessage("❌ Please select a file first");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("http://localhost:5000/upload", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        setMessage("✅ File uploaded and transcribed!");
        console.log("Transcript:", data.transcript);
        setTranscript(data.transcript);
      } else {
        setMessage("❌ Upload failed.");
      }
    } catch (error) {
      console.error(error);
      setMessage("❌ Error uploading file.");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100 pt-200">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-[400px] text-center">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">Upload Audio/Video</h1>

        {/* File Input Box */}
        <input
          type="file"
          accept="audio/*,video/*"
          onChange={handleFileChange}
          className="w-full border-2 border-gray-300 rounded-lg p-2 mb-4 cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-600 hover:file:bg-blue-100" 
        />

        {/* Upload Button */}
        <button
          onClick={handleUpload}
          className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
        >
          Upload
        </button>

        {/* Status Message */}
        {message && <p className="mt-4 font-medium text-gray-700">{message}</p>}

        {/* Show selected file name */}
        {file && (
          <p className="mt-2 text-sm text-gray-500">Selected: {file.name}</p>
        )}


      {/* Transcript Result 👇 add here */}
      {transcript && (
        <div className="mt-6 text-left">
        <h2 className="text-lg font-semibold text-gray-800 mb-2"> Text:</h2>
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
             setTimeout(() => setShowAlert(false), 2000)
             // alert("✅ Text copied to clipboard!");
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

export default App;
