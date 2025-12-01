import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../appContex";
import { login } from "../utils/apiCall";
import axios from "axios";
import toast from "react-hot-toast";
const LoginPage = () => {
  const { setUser } = useAppContext();
  const navigate = useNavigate();
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });
  const nevigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [otp, setOtp] = useState(new Array(6).fill(""));

  const [generatePassword, setGeneratePassword] = useState({
    email: "",
    newPassword: "",
  });
  const [change, setChange] = useState(true);
  const [isOtpLoading, setIsOtopLoading] = useState(false);
  const [isFun, setIsfun] = useState(false);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setLoginData({
      ...loginData,
      [id]: value,
    });
  };

  const handlechangeGeneratePassword = (e) => {
    const { name, id, value } = e.target;
    setGeneratePassword({
      ...generatePassword,
      [id]: value,
    });
  };

  const inputRefs = useRef([]);

  const handleChangeotp = (value, index) => {
    if (/^\d?$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      if (value && index < otp.length - 1) {
        inputRefs.current[index + 1].focus();
      }
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    login({
      email: loginData.email.trim(),
      password: loginData.password,
      navigate: navigate,
      setUser: setUser,
    });
  };

  const handleGenerateOtp = async (e) => {
    e.preventDefault();
    try {
      setIsOtopLoading(true);
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/forgetuser`,
        { email: generatePassword?.email },
        { withCredentials: true }
      );
      toast.success(response?.data?.message || "check mail for otp");
      setIsOpen(true);
      setIsfun(true);
    } catch (e) {
      if (e.response) {
        toast.error(e?.response?.data?.message || "Some error occurred");
      } else {
        toast.error("Network error or otp server not reachable");
      }
    } finally {
      setIsOtopLoading(false);
    }
  };

  const handleGeneratePassword = async (e) => {
    e.preventDefault();
    try {
      setIsOtopLoading(true);
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/resetuser`,
        {
          email: generatePassword?.email,
          otp: otp ? otp.join("") : "",
          newPassword: generatePassword?.newPassword,
        },
        { withCredentials: true }
      );
      toast.success(response?.data?.message || "check mail for otp");
      setChange(true);
      setIsOpen(true);
      setIsfun(true);
      setOtp(new Array(6).fill(""));
      setGeneratePassword((prev) => ({
        ...prev,
        newPassword: "",
        email: "",
      }));
    } catch (e) {
      if (e.response) {
        toast.error(e?.response?.data?.message || "Some error occurred");
      } else {
        toast.error("Network error or password generate server not reachable");
      }
    } finally {
      setIsOtopLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-100 via-blue-50 to-emerald-100 flex items-center justify-center p-4 sm:p-6 md:p-8">
      <div className="w-full max-w-md mx-auto overflow-hidden bg-white/90 backdrop-blur-md rounded-2xl shadow-lg border border-blue-200 transition-all duration-300 hover:shadow-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-sky-400 via-blue-400 to-teal-400 p-6 text-white text-center shadow-sm">
          <h2 className="text-2xl font-bold tracking-tight italic drop-shadow-sm">
            {change ? "ENGINEER LOGIN" : "RESET / GENERATE PASSWORD"}
          </h2>
        </div>

        {/* Login Section */}
        {change ? (
          <div className="p-6 sm:p-8 space-y-6">
            <form onSubmit={handleLogin} className="space-y-6">
              {/* email */}
              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="text-sm font-semibold text-gray-600 flex items-center gap-2"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-sky-500"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Email
                </label>
                <input
                  type="text"
                  id="email"
                  value={loginData.email}
                  onChange={handleChange}
                  className="block w-full px-4 py-3 rounded-xl text-gray-700 bg-blue-50 border border-blue-200 focus:border-sky-400 focus:ring-2 focus:ring-sky-300 outline-none transition-all duration-200 placeholder-gray-400"
                  placeholder="Enter your email"
                  required
                />
              </div>

              {/* Password */}
              <div className="space-y-2">
                <label
                  htmlFor="password"
                  className="text-sm font-semibold text-gray-600 flex items-center gap-2"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-sky-500"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  value={loginData.password}
                  onChange={handleChange}
                  className="block w-full px-4 py-3 rounded-xl text-gray-700 bg-blue-50 border border-blue-200 focus:border-sky-400 focus:ring-2 focus:ring-sky-300 outline-none transition-all duration-200 placeholder-gray-400"
                  placeholder="Enter your password"
                  required
                />
              </div>

              {/* Button */}
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-sky-400 to-teal-400 text-white font-semibold py-3 px-4 rounded-xl hover:opacity-90 hover:shadow-lg transition-all duration-300"
              >
                Sign In
              </button>
            </form>

            <div className="flex justify-center mt-6">
              <button
                type="button"
                className="px-5 py-2.5 text-sm font-medium text-white bg-blue-200 rounded-xl shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300"
                onClick={() => setChange(false)}
              >
                Generate Password
              </button>
            </div>
          </div>
        ) : (
          /* Password Generation Section */
          <div className="p-6 sm:p-8 space-y-6">
            <form
              onSubmit={isFun ? handleGeneratePassword : handleGenerateOtp}
              className="space-y-6"
            >
              {/* Email */}
              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="text-sm font-semibold text-gray-600 flex items-center gap-2"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-sky-500"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={generatePassword.email}
                  onChange={handlechangeGeneratePassword}
                  className="block w-full px-4 py-3 rounded-xl text-gray-700 bg-blue-50 border border-blue-200 focus:border-sky-400 focus:ring-2 focus:ring-sky-300 outline-none transition-all duration-200 placeholder-gray-400"
                  placeholder="Enter your email"
                  required
                />
              </div>

              {/* OTP & Password Fields */}
              {isOpen && (
                <>
                  <div className="space-y-2">
                    <label
                      htmlFor="newPassword"
                      className="text-sm font-semibold text-gray-600 flex items-center gap-2"
                    >
                      Password
                    </label>
                    <input
                      type="password"
                      id="newPassword"
                      value={generatePassword.newPassword}
                      onChange={handlechangeGeneratePassword}
                      className="block w-full px-4 py-3 rounded-xl text-gray-700 bg-blue-50 border border-blue-200 focus:border-sky-400 focus:ring-2 focus:ring-sky-300 outline-none transition-all duration-200 placeholder-gray-400"
                      placeholder="Enter your new password"
                      required
                    />
                  </div>

                  <div className="flex justify-center gap-2 mt-4">
                    {otp.map((digit, i) => (
                      <input
                        key={i}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleChangeotp(e.target.value, i)}
                        onKeyDown={(e) => handleKeyDown(e, i)}
                        ref={(el) => (inputRefs.current[i] = el)}
                        className="w-12 h-12 text-center text-lg rounded-lg border border-sky-300 bg-white/80 focus:ring-2 focus:ring-sky-400 outline-none"
                      />
                    ))}
                  </div>
                </>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={isOtpLoading}
                className="w-full bg-gradient-to-r from-sky-400 to-teal-400 text-white font-semibold py-3 px-4 rounded-xl hover:opacity-90 hover:shadow-lg transition-all duration-300"
              >
                {isOtpLoading
                  ? "Processing..."
                  : isFun
                    ? "Save"
                    : "Request OTP"}
              </button>
            </form>

            <div className="flex justify-center mt-6">
              <button
                type="button"
                className="px-5 py-2.5 text-sm font-medium text-white bg-blue-200 rounded-xl shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300"
                onClick={() => setChange(true)}
              >
                Back to Login
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginPage;
