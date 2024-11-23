import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useAuthStore from "../../../store/authStore";

const VerifyOtpPage = () => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);

  const handleChange = (e, index) => {
    const { value } = e.target;
    if (/^[0-9]$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      if (value && index < otp.length - 1) {
        document.getElementById(`otp-input-${index + 1}`).focus();
      }

      if (index === otp.length - 1 && newOtp.every((digit) => digit !== "")) {
        handleSubmit(newOtp.join(""));
      }
    }
  };

  const handlePaste = (e) => {
    const pastedData = e.clipboardData.getData("Text").slice(0, 6);
    if (/^\d{6}$/.test(pastedData)) {
      const newOtp = pastedData.split("");
      setOtp(newOtp);
      handleSubmit(pastedData);
    }
  };

  const handleSubmit = async (otpCode) => {
    try {
      const response = await fetch(
        "http://localhost:6262/api/users/verify-otp",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ otp: otpCode }),
          credentials: "include",
        }
      );

      const result = await response.json();
      if (response.ok) {
        login(result.user);
        toast.success("OTP verified successfully");
        setTimeout(() => navigate("/"), 3000);
      } else {
        toast.error(`${result.message}`);
      }
    } catch (error) {
      toast.error("Error verifying OTP");
      console.error("Error verifying OTP:", error);
    }
  };

  return (
    <div className="relative flex min-h-screen flex-col justify-center overflow-hidden bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="relative bg-white px-6 pt-10 pb-9 shadow-xl mx-auto w-full max-w-lg rounded-2xl">
        <div className="mx-auto flex w-full max-w-md flex-col space-y-16">
          <div className="flex flex-col items-center justify-center text-center space-y-2">
            <div className="font-semibold text-3xl">
              <p>Email Verification</p>
            </div>
            <div className="flex flex-row text-sm font-medium text-gray-400">
              <p>We have sent a code to your email</p>
            </div>
          </div>
          <div>
            <form onSubmit={(e) => e.preventDefault()} onPaste={handlePaste}>
              <div className="flex flex-col space-y-16">
                <div className="flex flex-row gap-2 items-center justify-center mx-auto w-full max-w-xs sm:max-w-md lg:max-w-lg">
                  {otp.map((_, index) => (
                    <input
                      key={index}
                      id={`otp-input-${index}`}
                      className="md:w-16 md:h-16 sm:w-10 sm:h-10 flex items-center justify-center text-center px-5 outline-none rounded-lg border border-black text-lg bg-white focus:bg-gray-50 focus:ring-2 focus:ring-black"
                      type="text"
                      maxLength="1"
                      value={otp[index]}
                      onChange={(e) => handleChange(e, index)}
                      onKeyDown={(e) => {
                        if (e.key === "Backspace") {
                          const newOtp = [...otp];
                          newOtp[index] = "";
                          setOtp(newOtp);

                          if (index > 0) {
                            document
                              .getElementById(`otp-input-${index - 1}`)
                              .focus();
                          }
                        }
                      }}
                    />
                  ))}
                </div>
                <div className="flex flex-col space-y-5">
                  <div>
                    <button
                      type="submit"
                      className="flex flex-row items-center justify-center text-center w-full py-5 border rounded-xl outline-none bg-blue-700 text-white text-lg shadow-sm"
                      onClick={() => handleSubmit(otp.join(""))}
                    >
                      Verify Account
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyOtpPage;