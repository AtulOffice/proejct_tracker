import React, { useEffect, useState } from "react";
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
import socket from "./socket/socket.js";
import { addNotification } from "./redux/slices/notificationSlice.js";
import toast from "react-hot-toast";
import { useRef } from "react";
import { fetchNotifications } from "./apiCall/notefication.Api.js";
import notificationMp3new from "../sounds/dragon.mp3";
import notificationMp3read from "../sounds/read.mp3";

const ProtectedRoute = ({ children }) => {
  const { user, userLoading } = useSelector((state) => state.auth);

  if (userLoading) return null;
  return user?.username ? children : <Navigate to="/login" />;
};


const PublicRoute = ({ children }) => {
  const { user, userLoading } = useSelector((state) => state.auth);

  if (userLoading) return null;

  return user?.username ? <Navigate to="/" /> : children;
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

      <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />

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
  const { user, userLoading } = useSelector((state) => state.auth);
  const newSoundRef = useRef(null);
  const readSoundRef = useRef(null);
  const hasJoined = useRef(false);
  const dispatch = useDispatch();

  const playSound = (soundRef) => {
    if (!soundRef.current) return;

    soundRef.current.currentTime = 0;
    soundRef.current.play().catch(() => { });
  };


  useEffect(() => {
    newSoundRef.current = new Audio(notificationMp3new);
    readSoundRef.current = new Audio(notificationMp3read);
  }, []);


  // useEffect(() => {
  //   socket.on("orderUpdated", (data) => {
  //     console.log("Order updated event:", data);
  //     console.log(data)
  //     toast.success(
  //       `🔔 ${data.message} - ${data.jobNumber}`
  //     );
  //   });
  //   return () => {
  //     socket.off("orderUpdated");
  //   };
  // }, []);


  useEffect(() => {
    if (!user?._id || hasJoined.current) return;

    socket.emit("join_user", {
      userId: user._id,
      role: user.role
    });

    hasJoined.current = true;

  }, [user?._id]);


  useEffect(() => {
    const handleNotification = (data) => {
      dispatch(addNotification(data));
      playSound(newSoundRef);
    };

    socket.on("notification", handleNotification);

    return () => {
      socket.off("notification", handleNotification);
    };

  }, [dispatch]);

  useEffect(() => {
    const handleNotificationRead = () => {
      playSound(readSoundRef);
    };
    socket.on("notification_read", handleNotificationRead);
    return () => {
      socket.off("notification_read", handleNotificationRead);
    };
  }, []);

  useEffect(() => {
    if (user?._id) {
      dispatch(fetchNotifications());
    }
  }, [user?._id, dispatch]);




  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
};

export default App;
