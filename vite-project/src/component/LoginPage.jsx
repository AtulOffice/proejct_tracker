import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../appContex";
const LoginPage = () => {
  const { login } = useAppContext();
  const navigate = useNavigate();
  const [loginData, setLoginData] = useState({
    username: "",
    password: "",
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setLoginData({
      ...loginData,
      [id]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    login({
      username: loginData.username,
      password: loginData.password,
      navigate: navigate,
    });
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-600 flex items-center justify-center p-4 sm:p-6 md:p-8">
      <div className="w-full max-w-md mx-auto overflow-hidden bg-white dark:bg-gray-800 rounded-2xl shadow-xl transition-all duration-300 hover:shadow-2xl border border-gray-100 dark:border-gray-700">
        <div className="bg-gradient-to-r from-blue-400 to-indigo-400 p-6 text-white text-center">
          <h2 className="text-2xl font-bold tracking-tight italic">LOGIN</h2>
        </div>
        <div className="p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label
                htmlFor="username"
                className="text-sm font-medium text-gray-600 dark:text-gray-300 flex items-center gap-2"
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
                  className="block w-full px-4 py-3 rounded-xl text-gray-200 dark:text-white bg-gray-50 dark:bg-gray-700 border border-transparent focus:border-blue-400 focus:ring-2 focus:ring-blue-400/30 focus:outline-none transition-all duration-200 placeholder-gray-400"
                  placeholder="Enter your username"
                  required
                  autoComplete="username"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label
                htmlFor="password"
                className="text-sm font-medium text-gray-200 dark:text-gray-300 flex items-center gap-2"
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
                  className="block w-full px-4 py-3 rounded-xl text-gray-800 dark:text-white bg-gray-50 dark:bg-gray-700 border border-transparent focus:border-blue-400 focus:ring-2 focus:ring-blue-400/30 focus:outline-none transition-all duration-200 placeholder-gray-400"
                  placeholder="Enter your password"
                  required
                  autoComplete="current-password"
                />
              </div>
            </div>
            <div className="pt-2">
              <button
                type="submit"
                className="w-full relative overflow-hidden group bg-gradient-to-r from-blue-400 to-indigo-400 text-white font-medium py-3 px-4 rounded-xl hover:shadow-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-400/40"
              >
                <span className="absolute top-0 left-0 w-0 h-full bg-white opacity-20 transition-all duration-300 group-hover:w-full"></span>
                <span className="relative flex items-center justify-center gap-2">
                  Sign in
                </span>
              </button>
            </div>
            <div className="flex justify-between text-sm pt-4">
              <button
                type="button"
                disabled={true}
                onClick={() => navigate("/")}
                className="text-gray-500 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors cursor-not-allowed"
              >
                Create an account
              </button>

              <button
                type="button"
                onClick={() => navigate("/")}
                className="text-gray-500 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
              >
                Back to form
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
