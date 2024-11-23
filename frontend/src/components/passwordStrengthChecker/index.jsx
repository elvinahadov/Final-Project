import React, { useState } from "react";
import { useEffect } from "react";

const PasswordStrengthChecker = ({ password }) => {
  const [strength, setStrength] = useState({
    score: 0,
    message: "",
    color: "",
  });

  const evaluateStrength = (password) => {
    let score = 0;

    if (password.length >= 8) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/\d/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;

    let strengthInfo;
    if (score === 0) {
      strengthInfo = { message: "Too Weak", color: "red" };
    } else if (score === 1) {
      strengthInfo = { message: "Weak", color: "orange" };
    } else if (score === 2) {
      strengthInfo = { message: "Fair", color: "yellow" };
    } else if (score === 3) {
      strengthInfo = { message: "Good", color: "lightgreen" };
    } else if (score === 4) {
      strengthInfo = { message: "Strong", color: "green" };
    }

    setStrength({ score, ...strengthInfo });
  };

  useEffect(() => {
    evaluateStrength(password);
  }, [password]);

  return (
    <div>
      <p style={{ color: strength.color }}>Strength: {strength.message}</p>
      <div
        style={{
          height: "8px",
          backgroundColor: "#e0e0e0",
          borderRadius: "5px",
          marginTop: "5px",
        }}
      >
        <div
          style={{
            width: `${(strength.score / 4) * 100}%`,
            height: "100%",
            backgroundColor: strength.color,
            borderRadius: "5px",
            transition: "width 0.3s",
          }}
        ></div>
      </div>
    </div>
  );
};

export default PasswordStrengthChecker;
