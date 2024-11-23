import React, { useEffect, useRef, useState } from "react";
import headerImg from "../../../assets/images/header.webp";
import { Link } from "react-router-dom";
import useIsVisible from "../../../hooks/useVisible";

const HeaderSection = () => {
  const ref = useRef();
  const isVisible = useIsVisible(ref);
  const [shouldAnimate, setShouldAnimate] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setShouldAnimate(true);
    } else {
      setShouldAnimate(false);
    }
  }, [isVisible]);

  return (
    <div
      ref={ref}
      className={`sm:px-2 sm:py-14 md:px-6 md:py-16 lg:px-6 lg:py-20 
    transition-opacity ease-in duration-1000
    ${shouldAnimate ? "opacity-100" : "opacity-0"}`}
    >
      <div
        className="relative sm:h-[498px] md:h-[556px] lg:h-[847px] bg-cover rounded-lg"
        style={{
          backgroundImage: `url(${headerImg})`,
          backgroundPosition: "65% center",
        }}
      >
        <div className="flex flex-col">
          <p className="absolute z-30 sm:bottom-[14%] md:bottom-[16%] lg:bottom-[12%] text-white font-azeret text-[17px] text-left animate-fade-in-left">
            10% off all smart watches with every purchase
          </p>
          <p className="absolute z-30 sm:bottom-[10%] md:bottom-[12%] lg:bottom-[8%] text-white font-azeret text-[17px] text-left animate-fade-in-left">
            Explore limited time offers
          </p>
          <Link
            to={"/shop"}
            className="absolute flex justify-start font-azeret z-30 sm:bottom-[4%] md:bottom-[4%] lg:bottom-[4%] text-white tracking-widest hover:tracking-[4px] transition-all duration-300 ease-in-out animate-fade-in-left"
          >
            [ SHOP NOW ]
          </Link>
          <div
            className="absolute w-full h-[100px] bottom-0 left-0 right-0 z-20 bg-black"
            style={{
              boxShadow: "0 -30px 30px rgba(0, 0, 0, 1)",
            }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default HeaderSection;
