import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import InputForm from "./component/user.Formsubmit.jsx";
import LoginPage from "./component/LoginPage.jsx";
import TaskDisplay from "./component/dashboard.jsx";
import { AppProvider } from "./appContex";
import UpdateForm from "./component/UpdateForm.jsx";
import UpdatedevForm from "./component/UpdatedevForm.jsx";
import ProjectdevlopForm from "./component/add.devstatus.jsx";

const ProtectedRoute = ({ children }) => {
  return !!sessionStorage.getItem("token") ? (
    children
  ) : (
    <Navigate to="/login" />
  );
};

function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<InputForm />} />
          <Route
            path="/page"
            element={
              <ProtectedRoute>
                <TaskDisplay />
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<LoginPage />} />
          <Route path="*" element={<Navigate to="/" />} />
          <Route path="/update/:id" element={<ProtectedRoute><UpdateForm /></ProtectedRoute>} />
          <Route path="/develop/:jobnumber" element={<ProtectedRoute><ProjectdevlopForm /></ProtectedRoute>} />
          <Route path="/develop/update/:id" element={<ProtectedRoute><UpdatedevForm /></ProtectedRoute>} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;
