import React, { useState, useRef } from "react";
import Lottie from "lottie-react";
import sparkles from "../assets/others/loadingAnimation.json";
import headphoneIcon from "../assets/icons/headphones.png";

const UploadAudio: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [uploadMessage, setUploadMessage] = useState("");
  const [summary, setSummary] = useState("");
  const [emotion, setEmotion] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalState, setModalState] = useState<"idle" | "loading" | "result">("idle");

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];

      if (selectedFile.size > 30 * 1024 * 1024) {
        setUploadMessage("❌ File too large. Max allowed is 30MB.");
        return;
      }

      setFile(selectedFile);
      setUploadMessage("");
      setSummary("");
      setEmotion("");
      setIsModalOpen(true);
      setModalState("loading");

      const formData = new FormData();
      formData.append("file", selectedFile);

      try {
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/upload`, {
          method: "POST",
          body: formData,
        });

        if (res.ok) {
          const data = await res.json();
          setUploadMessage("✅ File uploaded successfully!");
          setSummary(data.summary);
          setEmotion(data.emotion);
          setModalState("result");
        } else {
          setUploadMessage("❌ Upload failed.");
          setIsModalOpen(false);
          setModalState("idle");
        }
      } catch (err) {
        setUploadMessage("❌ Error during upload.");
        setIsModalOpen(false);
        setModalState("idle");
      }
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setModalState("idle");
    setFile(null);
    setSummary("");
    setEmotion("");
    setUploadMessage("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="w-full flex flex-col items-start mb-10 relative">
      {/* Upload UI */}
      <div className="relative text-center pb-15">
        <h2 className="text-xl font-bold mb-4">Upload Meeting Audio</h2>

        <div className="flex justify-center">
          <label
            htmlFor="audio-upload"
            className="cursor-pointer bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold py-4 px-8 rounded-md shadow-lg hover:scale-105 transition-transform duration-300 flex items-center gap-2"
          >
            <img src={headphoneIcon} alt="headphone icon" className="w-6 h-6" />
            <span className="text-lg">Upload Meeting Audio</span>
            <input
              id="audio-upload"
              type="file"
              accept="audio/*"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
            />
          </label>
        </div>

        {file && (
          <p className="mt-3 text-sm text-gray-700">
            Selected File: <span className="font-medium">{file.name}</span>
          </p>
        )}

        {uploadMessage && (
          <p className="mt-2 text-sm text-gray-600">{uploadMessage}</p>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-100 bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white w-[90%] max-w-2xl rounded-2xl p-6 shadow-2xl relative transition-all duration-300">
            <button
              onClick={handleCloseModal}
              className="absolute top-2 right-4 text-xl font-bold text-gray-500 hover:text-blue-900"
            >
              ✕
            </button>

            {modalState === "loading" ? (
              <div className="flex flex-col items-center justify-center">
                <Lottie animationData={sparkles} loop style={{ width: 100, height: 100 }} />
                <p className="mt-3 text-gray-700 font-medium animate-pulse">
                  Processing your audio magically...
                </p>
                <p className="text-sm text-gray-600 mt-1">Please wait 1–2 minutes</p>
              </div>
            ) : (
              <div>
                <h3 className="text-2xl font-bold text-center text-blue-800 mb-4">📝 Analysis Result</h3>

                <div className="mb-4">
                  <h4 className="text-lg font-semibold mb-1">📋 Summary</h4>
                  <p className="font-Kanit text-base text-gray-800 pl-2 leading-relaxed">{summary}</p>
                </div>

                <div>
                  <h4 className="text-md font-semibold mb-1">😊 Emotion Insight</h4>
                  <p className="font-Kanit text-base text-gray-800 pl-2 leading-relaxed">{emotion}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default UploadAudio;
