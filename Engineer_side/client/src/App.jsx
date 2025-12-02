import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./component/LoginPage.jsx";
import TaskDisplay from "./component/dashboard.jsx";
import { AppProvider, useAppContext } from "./appContex";
import ProjectdevlopForm from "./component/add.devstatus.jsx";
import { UserCall } from "./utils/apiCall.jsx";

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
        path="/page"
        element={
          <ProtectedRoute>
            <TaskDisplay />
          </ProtectedRoute>
        }
      />

      <Route path="/login" element={<LoginPage />} />

      <Route
        path="/develop/:jobnumber"
        element={
          <ProtectedRoute>
            <ProjectdevlopForm />
          </ProtectedRoute>
        }
      />
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
