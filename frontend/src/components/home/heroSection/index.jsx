import React from "react";
import hero from "../../../assets/images/hero-image.webp";
import { Link } from "react-router-dom";

const HeroSection = () => {
  return (
    <div
      className="relative h-screen bg-cover bg-center"
      style={{ backgroundImage: `url(${hero})` }}
    >
      <div className="flex flex-col sm:px-2 md:px-6 lg:px-6">
        <p
          className="
        absolute z-30 sm:bottom-[15%] md:bottom-[17%] lg:bottom-[16%] text-white font-azeret text-[17px] leading-7 text-left animate-fade-in-left
        "
        >
          Quality applications and gadgets
        </p>
        <p className="absolute z-30 sm:bottom-[8%] md:bottom-[14%] lg:bottom-[14%] text-white font-azeret text-[17px] leading-7 text-left animate-fade-in-left">
          Smart solutions for everyday convenience
        </p>
        <Link
          to={"/shop"}
          className="absolute flex justify-start font-azeret z-30 sm:bottom-[3%] md:bottom-[10%] lg:bottom-[10%] md:[12%] text-white tracking-widest hover:tracking-[4px] transition-all duration-300 ease-in-out animate-fade-in-left"
        >
          [ SHOP NOW ]
        </Link>
        <div
          className="absolute w-full h-[150px] bottom-0 left-0 right-0 z-20 bg-black"
          style={{
            boxShadow: "0 -30px 30px rgba(0, 0, 0, 0.9)",
          }}
        ></div>
      </div>
    </div>
  );
};

export default HeroSection;
