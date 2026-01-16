import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import LoginPage from "./component/LoginPage.jsx";
import TaskDisplay from "./component/dashboard.jsx";
import UpdateForm from "./component/UpdateForm.jsx";
import ProjectdevlopForm from "./component/add.devstatus.jsx";
import OrderForm from "./component/OrderForm.jsx";
import UpdateOrderForm from "./component/updateOrder.jsx";
import ProjectTimelineForm from "./component/projctTimeLineForm.jsx";
import AddDocsSeperate from "./component/add.DocsSeperate.jsx";

import { UserCall } from "./apiCall/authApicall";

import { useDispatch, useSelector } from "react-redux";
import { setUser, setUserLoading } from "./redux/slices/authSlice";
import ProjectDetailsForm from "./component/testCompo.jsx";

const ProtectedRoute = ({ children }) => {
  const { user, userLoading } = useSelector((state) => state.auth);
  if (userLoading) return null;
  return user?.username ? children : <Navigate to="/login" />;
};

const AppRoutes = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await UserCall();
        dispatch(setUser(data?.user || null));
      } catch (err) {
        console.error(err);
        dispatch(setUser(null));
      } finally {
        dispatch(setUserLoading(false));
      }
    };

    fetchUser();
  }, [dispatch]);

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

      <Route
        path="/page1"
        element={
          <ProtectedRoute>
            <ProjectDetailsForm />
          </ProtectedRoute>
        }
      />

      <Route path="/newPage" element={<OrderForm />} />

      <Route path="/login" element={<LoginPage />} />

      <Route
        path="/update/:id"
        element={
          <ProtectedRoute>
            <UpdateForm />
          </ProtectedRoute>
        }
      />

      <Route
        path="/addDocs/:id"
        element={
          <ProtectedRoute>
            <AddDocsSeperate />
          </ProtectedRoute>
        }
      />

      <Route
        path="/timelineform/:id"
        element={
          <ProtectedRoute>
            <ProjectTimelineForm />
          </ProtectedRoute>
        }
      />

      <Route
        path="/updateOrder/:id"
        element={
          <ProtectedRoute>
            <UpdateOrderForm />
          </ProtectedRoute>
        }
      />

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
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
};

export default App;
