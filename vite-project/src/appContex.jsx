import axios from "axios";
import React, { createContext, useContext, useState, useEffect } from "react";
import toast from "react-hot-toast";

const Context = createContext();

export const AppProvider = ({ children }) => {
  const [toggle, setToggle] = useState(false);
  const [user, setUser] = useState();

  return (
    <Context.Provider
      value={{
        setToggle,
        toggle,
        setUser,
        user,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export const useAppContext = () => useContext(Context);
