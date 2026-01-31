import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./component/LoginPage";
import TaskDisplay from "./component/dashboard";
import { AppProvider, useAppContext } from "./appContext";
import { UserCall } from "./utils/apiCall";
import TestingDevelopmentExecution from "./component/EngineerTesting";
import ScadaDevelopmentExecution from "./component/EngineerScada";
import LogicDevelopmentExecution from "./component/EngineerLogic";

const ProtectedRoute = ({ children }) => {
  const { user, userLoading } = useAppContext();
  if (!userLoading) {
    return user?.email ? children : <Navigate to="/login" />;
  }
};

const AppRoutes = () => {
  const { setUser, setUserLoading } = useAppContext();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await UserCall();
        setUser(data?.user || null);
      } catch (err) {
        console.error(err);
        setUser(null);
      } finally {
        setUserLoading(false);
      }
    };

    fetchUser();
  }, []);

  return (
    <Routes>
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <TaskDisplay />
          </ProtectedRoute>
        }
      />
      <Route
        path="/plan/LOGIC/:id"
        element={
          <ProtectedRoute>
            <LogicDevelopmentExecution />
          </ProtectedRoute>
        }
      />

      <Route
        path="/plan/SCADA/:id"
        element={
          <ProtectedRoute>
            <ScadaDevelopmentExecution />
          </ProtectedRoute>
        }
      />

      <Route
        path="/plan/TESTING/:id"
        element={
          <ProtectedRoute>
            <TestingDevelopmentExecution />
          </ProtectedRoute>
        }
      />

      <Route path="/login" element={<LoginPage />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

const App = () => {
  return (
    <AppProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AppProvider>
  );
};

export default App;
