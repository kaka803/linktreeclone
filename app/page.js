import Image from "next/image";
import Navbar from "./components/navbar";

export default function Home() {
  return (
    <div>
      <Navbar />
      <div className="flex flex-col lg:flex-row items-center justify-center min-h-screen bg-[#254f1a] px-6 lg:px-12 pt-40 absolute top-0 left-0 right-0=">
        
        {/* Left Section */}
        <div className="w-full lg:w-1/2 flex justify-center items-start gap-6 flex-col py-10">
          <h1 className="text-[#d2e823] text-4xl sm:text-5xl md:text-6xl lg:text-[4.7rem] font-black leading-tight lg:leading-none">
            Everything you <br /> are. In one, <br /> simple link in <br /> bio.
          </h1>
          <p className="font-semibold text-sm sm:text-base md:text-lg text-gray-100">
            Join 70M+ people using Linktree for their link in bio. One link to help you share everything you create, curate and sell from your Instagram, TikTok, Twitter, YouTube and other social media profiles.
          </p>
          <div className="flex flex-col items-start sm:flex-row sm:items-center gap-3 w-full sm:w-auto">
            <input
              className="bg-white outline-none px-3 py-3 sm:py-4 text-black placeholder:text-gray-400 rounded-xl w-full sm:w-auto"
              placeholder="linktr.ee/"
              type="text"
            />
            <button className="bg-pink-300 px-5 py-3 sm:py-4 text-black rounded-4xl font-medium text-sm sm:text-base">
              Claim Your Linktree
            </button>
          </div>
        </div>

        {/* Right Section */}
        <div className="w-full lg:w-1/2 flex justify-center overflow-hidden">
  <img
    src="/heropng.png"
    alt="Linktree Example"
    className="h-auto max-w-[150%]"
  />
</div>

      </div>
    </div>
  );
}
