import React, { createContext, useContext, useState } from "react";

const Context = createContext();

export const AppProvider = ({ children }) => {
  const [toggle, setToggle] = useState(false);
  const [toggleEng, setToggleEng] = useState(false);
  const [toggleDev, setToggleDev] = useState(false);
  const [user, setUser] = useState();
  const [userLoading, setUserLoading] = useState(true);
  const [accessToken, setAccessToken] = useState(() => {
    return localStorage.getItem("accessToken") || "";
  });
  return (
    <Context.Provider
      value={{
        setToggle,
        toggle,
        setUser,
        user,
        toggleDev,
        setToggleDev,
        userLoading,
        setUserLoading,
        toggleEng,
        setToggleEng,
        accessToken,
        setAccessToken
      }}
    >
      {children}
    </Context.Provider>
  );
};

export const useAppContext = () => useContext(Context);
