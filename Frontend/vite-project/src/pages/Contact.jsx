function Contact() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6">
      <div className="bg-white shadow-xl rounded-2xl p-10 max-w-xl text-left">
        <h1 className="text-2xl font-bold mb-4 text-gray-800">Contact Us</h1>

        <p className="text-gray-600 text-sm mb-3">
          Have questions or feedback? We’d love to hear from you!
        </p>

        <p className="text-gray-600 text-sm mb-3">
          Email us at:{" "}
          <a
            href="mailto:videotextify@gmail.com"
            className="text-blue-600 hover:underline"
          >
            Aiotiq.official@gmail.com
          </a>
        </p>

        <p className="text-gray-600 text-sm">
          Or reach us through our social media handles (coming soon).
        </p>
      </div>
    </div>
  );
}

export default Contact;
