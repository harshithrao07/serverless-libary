import "../index.css";
import React from "react";
const Background = () => {
  return (
    <>
      <div className="min-h-screen bg-image">
        <div className="absolute bottom-4 left-4">
          <div className="text-lg"></div>
          <div className="text-8xl font-bold text-white text-shadow-10xl drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,1)]">
            Library Portal
          </div>
          <div className="text-5xl font-bold text-white text-shadow-md drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,1)]">
            N.M.A.M Institute Of Technology, Nitte
          </div>
          <div className="text-3xl text-white drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,1)]">Top of the World Feeling</div>
        </div>
      </div>
    </>
  );
};
export default Background;
