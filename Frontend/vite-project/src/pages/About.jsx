function About() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6">
      <div className="bg-white shadow-xl rounded-2xl p-10 max-w-xl text-center">
        <h1 className="text-2xl font-bold mb-4 text-gray-800">About VideoTextify</h1>
        <p className="text-gray-600 text-sm">
          VideoTextify is a simple tool to convert your videos into text. Upload a video or paste a YouTube link and get the transcript instantly. Our aim is to make video content more accessible and easy to use.
        </p>
      </div>
    </div>
  );
}

export default About;
