import React, { useState, useEffect } from "react";

const QuantitySelector = ({
  initialQuantity = 1,
  min = 1,
  max = 100,
  onChange,
}) => {
  const [quantity, setQuantity] = useState(initialQuantity);


  const handleInputChange = (e) => {
    const value = e.target.value;

    if (value === "" || /^[0-9]*$/.test(value)) {
      setQuantity(value === "" ? "" : parseInt(value, 10));
    }
  };

  const handleInputBlur = () => {
    if (quantity === "" || isNaN(quantity)) {
      setQuantity(min);
      onChange && onChange(min);
    } else if (quantity < min) {
      setQuantity(min);
      onChange && onChange(min);
    } else if (quantity > max) {
      setQuantity(max);
      onChange && onChange(max);
    } else {
      onChange && onChange(quantity);
    }
  };

  const handleInputFocus = () => {
    if (quantity === "") {
      setQuantity("");
    }
  };


  const handleDecrease = () => {
    const newQuantity = Math.max(min, quantity - 1);
    setQuantity(newQuantity);
    onChange && onChange(newQuantity);
  };


  const handleIncrease = () => {
    const newQuantity = Math.min(max, quantity + 1);
    setQuantity(newQuantity);
    onChange && onChange(newQuantity);
  };


  useEffect(() => {
    setQuantity(initialQuantity);
  }, [initialQuantity]);

  return (
    <div className="flex items-center border border-white overflow-hidden w-[120px] bg-[#111111] hover:bg-black">
      <button
        onClick={handleDecrease}
        className="text-white px-3 py-2"
        disabled={quantity <= min}
      >
        -
      </button>
      <input
        type="text"
        value={quantity === "" ? "" : quantity}
        onChange={handleInputChange}
        onBlur={handleInputBlur}
        onFocus={handleInputFocus}
        className="w-full text-center text-white bg-transparent outline-none"
        style={{
          appearance: "none",
          MozAppearance: "textfield",
          WebkitAppearance: "none",
        }}
      />
      <button
        onClick={handleIncrease}
        className="text-white px-3 py-2"
        disabled={quantity >= max}
      >
        +
      </button>
    </div>
  );
};

export default QuantitySelector;