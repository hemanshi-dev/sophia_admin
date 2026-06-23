import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { getCookie } from "./utils/cookieManager";

import CompanionList from "./components/Pages/companion/CompanionTable";
import AddCompanion from "./components/Pages/companion/AddCompanion";
import EditCompanion from "./components/Pages/companion/EditCompanion";
import ViewImages from "./components/Pages/companion/ViewImages";
import AddImages from "./components/Pages/companion/AddImages";
import SelectAdmin from "./components/Pages/auth-login/SelectAdmin";
import Login from "./components/Pages/auth-login/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import UserList from "./components/Pages/companion/UserList";
import ReelsList from "./components/Pages/companion/ReelsList";
import AddReels from "./components/Pages/companion/AddReels";
import EditReels from "./components/Pages/companion/EditReels";
import Feedback from "./components/Pages/companion/Feedback";
import ReelReport from "./components/Pages/companion/ReelReport";
import EditImages from "./components/Pages/companion/EditImages";
import LiveMode from "./components/Pages/companion/LiveMode";

function App() {
  const [isMini, setIsMini] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const [isAuthenticated, setIsAuthenticated] = useState(
    () => !!localStorage.getItem("authorization") || !!getCookie("authToken")
  );

  useEffect(() => {
    // Sync cookie → localStorage if needed
    const token = getCookie("authToken");
    if (token && !localStorage.getItem("authorization")) {
      localStorage.setItem("authorization", token);
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("minimenu", isMini);
  }, [isMini]);

  useEffect(() => {
    document.documentElement.classList.toggle("mobile-sidebar-active", isMobileOpen);
  }, [isMobileOpen]);

  const handleLogout = () => {
    localStorage.clear();
    document.cookie = "authToken=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/";
    document.cookie = "authUser=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/";
    document.cookie = "selectedPanel=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/";
    setIsAuthenticated(false);

    const base = window.location.hostname === "localhost"
      ? "/aicompanion/admin"
      : "https://shuchiai.com/aicompanion/admin";

    window.location.href = base;
  };

  if (loading) return <div>Loading...</div>;

  return (
    <BrowserRouter basename="/aicompanion/admin">
      <Routes>
        <Route
          path="/"
          element={
            isAuthenticated ? (
              <Navigate to="/select-admin" replace />
            ) : (
              <Login setAuth={setIsAuthenticated} />
            )
          }
        />
        <Route
          path="/login"
          element={
            isAuthenticated ? (
              <Navigate to="/select-admin" replace />
            ) : (
              <Login setAuth={setIsAuthenticated} />
            )
          }
        />

        <Route
          path="/select-admin"
          element={
            isAuthenticated ? (
              <SelectAdmin onLogout={handleLogout} />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        <Route
          element={
            <ProtectedRoute
              isMini={isMini}
              toggleSidebar={() => setIsMini(!isMini)}
              isMobileOpen={isMobileOpen}
              toggleMobileSidebar={() => setIsMobileOpen(!isMobileOpen)}
              onLogout={handleLogout}
            />
          }
        >
          <Route path="/companion" element={<CompanionList />} />
          <Route path="/companion/add" element={<AddCompanion />} />
          <Route path="/companion/edit/:id" element={<EditCompanion />} />
          <Route path="/companion/images/view/:id?" element={<ViewImages />} />
          <Route path="/companion/images/add/:id?" element={<AddImages />} />
          <Route path="/user-list" element={<UserList />} />
          <Route path="/reels-list" element={<ReelsList />} />
          <Route path="/reels-add" element={<AddReels />} />
          <Route path="/reels-edit/:id" element={<EditReels />} />
          <Route path="/images/edit/:id" element={<EditImages />} />
          <Route path="/feedback" element={<Feedback />} />
          <Route path="/reel-report" element={<ReelReport />} />
          <Route path="/live-mode" element={<LiveMode />} />
          <Route path="/reels" element={<Navigate to="/reels-list" replace />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
