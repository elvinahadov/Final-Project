import React, { useEffect } from "react";
import useBrandStore from "../../../store/brandStore";

const SelectedBrands = () => {
  const { brands, loading, error, fetchBrands } = useBrandStore();

  useEffect(() => {
    fetchBrands();
  }, [fetchBrands]);

  // Handle loading and error states
  if (loading) return <p className="text-white">Loading brands...</p>;
  if (error) return <p className="text-white">Error: {error}</p>;

  // Duplicate the brands array to create an infinite scroll effect
  const brandsToDisplay = [...brands, ...brands]; // Double the array

  return (
    <section className="bg-black text-white pb-12">
      <div className="sm:mx-2 md:mx-6 overflow-hidden">
        {/* Container for infinite scroll */}
        <div className="inline-flex animate-scroll">
          {brandsToDisplay.length > 0 ? (
            brandsToDisplay.map((brand, index) => (
              <div key={index} className="px-1 w-[305px] h-[305px]">
                <img
                  src={brand.secure_url}
                  alt={brand.name}
                  className="opacity-60 hover:opacity-100"
                />
              </div>
            ))
          ) : (
            <p className="text-white">No brands available.</p>
          )}
        </div>
      </div>
    </section>
  );
};

export default SelectedBrands;