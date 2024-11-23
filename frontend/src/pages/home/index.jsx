import React from "react";
import HeroSection from "../../components/home/heroSection";
import HeaderSection from "../../components/home/headerSection";
import ShopByCategory from "../../components/home/shopByCategory";
import SelectedBrands from "../../components/home/selectedBrands";
import ProductsSec from "../../components/home/productsSec";

const HomePage = () => {
  return (
    <div className="bg-black">
      <HeroSection />
      <ProductsSec />
      <HeaderSection />
      <ShopByCategory />
      <SelectedBrands />
    </div>
  );
};

export default HomePage;
