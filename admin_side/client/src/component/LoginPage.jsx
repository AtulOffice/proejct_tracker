import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../apiCall/authApicall";
import axios from "axios";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";

const LoginPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loginData, setLoginData] = useState({
    username: "",
    password: "",
  });
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
      username: loginData.username.trim().toLowerCase(),
      password: loginData.password,
      navigate,
      dispatch,
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
    <div className="min-h-screen bg-blue-200  flex items-center justify-center p-4 sm:p-6 md:p-8">
      <div className="w-full max-w-md mx-auto overflow-hidden bg-white   rounded-2xl shadow-xl transition-all duration-300 hover:shadow-2xl border border-gray-100 ">
        <div className="bg-linear-to-r from-blue-400 to-indigo-400 p-6 text-white text-center">
          <h2 className="text-2xl font-bold tracking-tight italic">
            {change ? "LOGIN" : "PASSWORD GENERATION"}
          </h2>
        </div>
        {change ? (
          <div className="p-6 sm:p-8">
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <label
                  htmlFor="username"
                  className="text-sm font-medium text-gray-600  flex items-center gap-2"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Username
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="username"
                    value={loginData.username}
                    onChange={handleChange}
                    className="block w-full px-4 py-3 rounded-xl text-gray-200  bg-gray-200 border border-transparent focus:border-blue-400 focus:ring-2 focus:ring-blue-400/30 focus:outline-none transition-all duration-200 placeholder-gray-400"
                    placeholder="Enter your username"
                    required
                    autoComplete="username"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label
                  htmlFor="password"
                  className="text-sm font-medium text-gray-200  flex items-center gap-2"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
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
                <div className="relative">
                  <input
                    type="password"
                    id="password"
                    value={loginData.password}
                    onChange={handleChange}
                    className="block w-full px-4 py-3 rounded-xl text-gray-800  bg-gray-200  border border-transparent focus:border-blue-400 focus:ring-2 focus:ring-blue-400/30 focus:outline-none transition-all duration-200 placeholder-gray-400"
                    placeholder="Enter your password"
                    required
                    autoComplete="current-password"
                  />
                </div>
              </div>
              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full relative overflow-hidden group bg-linear-to-r from-blue-400 to-indigo-400 text-white font-medium py-3 px-4 rounded-xl hover:shadow-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-400/40"
                >
                  <span className="absolute top-0 left-0 w-0 h-full bg-white opacity-20 transition-all duration-300 group-hover:w-full"></span>
                  <span className="relative flex items-center justify-center gap-2">
                    Sign in
                  </span>
                </button>
              </div>
            </form>
            <div className="flex justify-between text-sm pt-4">
              <button
                type="button"
                disabled={true}
                onClick={() => navigate("/")}
                className="text-gray-500 hover:text-blue-500 transition-colors cursor-not-allowed"
              >
                Create an account
              </button>

              <button
                type="button"
                onClick={() => setChange(false)}
                className="text-gray-500  hover:text-blue-500 cursor-pointer transition-colors"
              >
                forgot password
              </button>
            </div>
          </div>
        ) : (
          <div className="p-6 sm:p-8">
            <form
              onSubmit={isFun ? handleGeneratePassword : handleGenerateOtp}
              className="space-y-6"
            >
              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="text-sm font-medium text-gray-600  flex items-center gap-2"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
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
                <div className="relative">
                  <input
                    type="email"
                    id="email"
                    value={generatePassword.email}
                    onChange={handlechangeGeneratePassword}
                    className="block w-full px-4 py-3 rounded-xl text-gray-200  bg-gray-200 border border-transparent focus:border-blue-400 focus:ring-2 focus:ring-blue-400/30 focus:outline-none transition-all duration-200 placeholder-gray-400"
                    placeholder="Enter your email"
                    required
                    autoComplete="email"
                  />
                </div>
              </div>
              {isOpen && (
                <div className="space-y-2">
                  <label
                    htmlFor="newPassword"
                    className="text-sm font-medium text-gray-200  flex items-center gap-2"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
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
                  <div className="relative">
                    <input
                      type="password"
                      id="newPassword"
                      value={generatePassword.newPassword}
                      onChange={handlechangeGeneratePassword}
                      className="block w-full px-4 py-3 rounded-xl text-gray-800  bg-gray-200  border border-transparent focus:border-blue-400 focus:ring-2 focus:ring-blue-400/30 focus:outline-none transition-all duration-200 placeholder-gray-400"
                      placeholder="Enter your new password"
                      required
                      autoComplete="current-password"
                    />
                  </div>
                </div>
              )}
              {isOpen && (
                <div className="ml-5 space-y-2">
                  <div className="flex gap-2">
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
                        className="w-12 h-12 text-center text-lg rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 outline-none"
                      />
                    ))}
                  </div>
                </div>
              )}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isOtpLoading}
                  className="w-full relative overflow-hidden group bg-linear-to-r from-blue-400 to-indigo-400 text-white font-medium py-3 px-4 rounded-xl hover:shadow-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-400/40"
                >
                  <span className="absolute top-0 left-0 w-0 h-full bg-white opacity-20 transition-all duration-300 group-hover:w-full"></span>
                  <span
                    className={`relative flex items-center justify-center gap-2 ${isOtpLoading ? "cursor-not-allowed" : ""
                      }`}
                  >
                    {isOtpLoading
                      ? "Processing"
                      : isFun
                        ? "save"
                        : "Request OTP"}
                  </span>
                </button>
              </div>
            </form>
            <div className="flex justify-between text-sm pt-4">
              <button
                type="button"
                disabled={true}
                onClick={() => navigate("/")}
                className="text-gray-500 hover:text-blue-500 transition-colors cursor-not-allowed"
              >
                Create an account
              </button>

              <button
                type="button"
                onClick={() => setChange(true)}
                className="text-gray-500  hover:text-blue-500 cursor-pointer transition-colors"
              >
                Login page
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginPage;
