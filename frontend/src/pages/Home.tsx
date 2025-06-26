import React from "react";
import UploadAudio from "../components/UploadAudio";
import heroImage from "../assets/images/meetingmind_sidephoto.png";
import testFile from "../assets/icons/question-mark.png";
import brain from '../assets/icons/brain.png';
import mic from "../assets/icons/mic.png";
import notes from "../assets/icons/notes.png";

const HomePage: React.FC = () => {
  const steps = [
    {
      icon: mic,
      title: "Upload Audio",
      description: "Upload your recorded meeting audio file for analysis.",
    },
    {
      icon: brain,
      title: "AI Analyzes Emotions",
      description: "Our AI detects sentiments and emotional tone from the meeting.",
    },
    {
      icon: notes,
      title: "Get Summary & Insights",
      description: "Receive a concise summary with detailed emotional insights.",
    },
  ];

  return (
    <div className="min-h-screen bg-white px-6 py-10">
      {/* Header */}
      <header className="bg-gray-100 rounded-4xl text-center p-5 px-20 flex justify-between">
        {/* Logo */}
        <p className="font-ArchivoBlack text-3xl text-blue-900 flex items-center gap-2">
          <img src="/favicon.ico" alt="logo" className="w-10 h-10" />
          MeetingMind
        </p>

        {/* Tooltip + Download */}
        <div className="relative group flex items-center">
          <div className="flex items-center bg-gradient-to-l from-[#00BBD6] to-[#005DAB] text-white font-bold pl-4 pr-2 py-2 rounded-full whitespace-nowrap scale-x-0 group-hover:scale-x-100 origin-right transition-transform duration-300 ease-in-out">
            <span className="mr-3">Click here to download testing audio file</span>
            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
              <img src={testFile} alt="Help Icon" className="w-5 h-5" />
            </div>
          </div>

          <div className="absolute right-0">
            <a href="/testingAudio.mp3" download>
              <img src={testFile} alt="Help Icon" className="w-10 h-10 cursor-pointer z-10" />
            </a>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto flex flex-col-reverse md:flex-row justify-between">
        {/* Left Side */}
        <div className="w-full md:w-1/2 mt-15 ml-20">
          <p className="font-ArchivoBlack text-blue-900 text-4xl mt-2 mb-20">
            AI-powered meeting summaries and emotion insights
          </p>
          <UploadAudio />
        </div>

        {/* Right Side */}
        <div className="mr-20">
          <img src={heroImage} alt="AI Meeting Illustration" className="w-150 h-140 object-contain" />
        </div>
      </main>

      {/* Steps Section */}
      <section className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-">
          How It Works
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center px-4">
          {steps.map((step, index) => (
            <div
              key={index}
              className="p-6 rounded-2xl shadow-xl/20 hover:shadow-xl transition duration-300 bg-gradient-to-br from-gray-100 to-gray-100"
            >
              <div className="flex justify-center mb-4">
                <img src={step.icon} alt={`${step.title} icon`} className="w-12 h-12 object-contain" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
              <p className="text-gray-600">{step.description}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default HomePage;
