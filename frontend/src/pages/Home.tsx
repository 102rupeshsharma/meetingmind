import React from "react";
import UploadAudio from "../components/UploadAudio";
import heroImage from "../assets/images/meetingmind_sidephoto.png";
import testFile from "../assets/images/question-mark.png";

const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-white px-6 py-10">
      <header className="bg-gray-100 rounded-4xl text-center p-5 px-20 flex justify-between">
        {/* Logo */}
        <p className="font-ArchivoBlack text-5xl text-blue-900 flex items-center gap-2">
          <img src="/favicon.ico" alt="logo" className="w-10 h-10" />
          MeetingMind
        </p>

        {/* Tooltip + Download Icon */}
        <div className="relative group flex items-center">
          {/* Tooltip Message */}
          <div
            className="flex items-center bg-gradient-to-l from-[#00BBD6] to-[#005DAB] text-white font-bold pl-4 pr-2 py-2 rounded-full whitespace-nowrap
              scale-x-0 group-hover:scale-x-100 origin-right transition-transform duration-300 ease-in-out"
          >
            <span className="mr-3">Click here to download testing audio file</span>

            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
              <img
                src={testFile}
                alt="Help Icon"
                className="w-5 h-5"
              />
            </div>
          </div>

          {/* Download Icon */}
          <div className="absolute right-0">
            <a href="/testingAudio.mp3" download>
              <img
                src={testFile}
                alt="Help Icon"
                className="w-10 h-10 cursor-pointer z-10"
              />
            </a>
          </div>
        </div>
      </header>

      {/* Main Body */}
      <main className="mx-auto flex flex-col-reverse md:flex-row justify-between">
        {/* Left Section */}
        <div className="w-full md:w-1/2 mt-20 ml-20">
          <p className="font-ArchivoBlack text-blue-900 text-4xl mt-2 mb-20">
            AI-powered meeting summaries and emotion insights
          </p>
          <UploadAudio />
        </div>

        {/* Right Section */}
        <div className="mr-20">
          <img
            src={heroImage}
            alt="AI Meeting Illustration"
            className="w-180 h-180 object-contain"
          />
        </div>
      </main>
    </div>
  );
};

export default HomePage;
