import React from "react";
import { Link, useNavigate } from "react-router-dom";
import useProductStore from "../../../store/prodStore";

const Footer = () => {
  const navigate = useNavigate();
  const { setFilters, getAllProducts } = useProductStore();

  const handleFilterNavigation = (filterName, filterValue) => {
    setFilters((prevFilters) => {
      const newFilters = {
        ...prevFilters,
        [filterName]: filterValue === "true",
      };
      getAllProducts(newFilters);
      return newFilters;
    });
    navigate(`/shop?${filterName}=${filterValue}`, { replace: true });
  };

  return (
    <footer className="min-w-full flex flex-col bg-[#854DFF] text-white py-10 font-azeret gap-8">
      <div className="flex items-center flex-col md:grid md:grid-cols-3 lg:grid-cols-5 gap-8 px-6">

        {/* Shop Section */}
        <div className="flex flex-col gap-4">
          <h3 className="text-lg font-semibold mb-4">Shop</h3>
          <ul className="flex flex-col gap-4">
            <Link to={"/shop"} className="cursor-pointer hover:text-gray-300">
              All Products
            </Link>
            <p
              className="cursor-pointer hover:text-gray-300"
              onClick={() => handleFilterNavigation("bestsellers", "true")}
            >
              Best Sellers
            </p>
            <p
              className="cursor-pointer hover:text-gray-300"
              onClick={() => handleFilterNavigation("onSale", "true")}
            >
              Sale
            </p>
          </ul>
        </div>

        {/* Contact Section */}
        <div className="flex flex-col gap-4">
          <h3 className="text-lg font-semibold mb-4">Contact</h3>
          <a href="mailto:ahadov.elvin03@gmail.com">ahadov.elvin03@gmail.com</a>
          <div>
            <p>Nizami k. 203B, AF Business House, 2-ci mərtəbə</p>
          </div>
          <p>+994-050-993-31-68</p>
        </div>

        {/* Follow Section */}
        <div className="flex flex-col gap-4">
          <h3 className="text-lg font-semibold mb-4">Follow</h3>
          <ul className="flex flex-col gap-2">
            <li className="cursor-pointer hover:text-gray-300">
              <a href="https://www.instagram.com/alv1n.17/">Instagram</a>
            </li>
            <li className="cursor-pointer hover:text-gray-300">
              <a href="https://www.facebook.com/alv1n.17/">FACEBOOK</a>
            </li>
            <li className="cursor-pointer hover:text-gray-300">
              <a href="https://www.tiktok.com/@alv1n.17">TIKTOK</a>
            </li>
          </ul>
        </div>

        {/* Legal Section */}
        <div className="flex flex-col gap-4">
          <h3 className="text-lg font-semibold mb-4">LEGAL</h3>
          <ul className="flex flex-col gap-2">
            <li className="cursor-pointer hover:text-gray-300">
              <Link to={"/faqs"}>Terms & Conditions</Link>
            </li>
            <li className="cursor-pointer hover:text-gray-300">
              <Link to={"/faqs"}>Privacy Policy</Link>
            </li>
            <li className="cursor-pointer hover:text-gray-300">
              <Link to={"/faqs"}>Shipping Policy</Link>
            </li>
            <li className="cursor-pointer hover:text-gray-300">
              <Link to={"/faqs"}>Refund Policy</Link>
            </li>
            <li className="cursor-pointer hover:text-gray-300">
              <Link to={"/faqs"}>Accessibility Statement</Link>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="mt-8 text-left px-6 ">
        <p>
          © 2035 by SIINAX. Built on{" "}
          <a
            href="https://www.wix.com/studio"
            className="underline hover:text-gray-300"
          >
            Wix Studio
          </a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;