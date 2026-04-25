import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import Sidebar from "./common/Sidebar";
import Header from "./common/Header";
import PageHeader from "./common/PageHeader";

const ProtectedRoute = ({ isMini, toggleSidebar, isMobileOpen, toggleMobileSidebar, onLogout }) => {
  const token = localStorage.getItem("authorization");

  if (!token) {
    // If no token, send them to the login page
    return <Navigate to="/login" replace />;
  }

  return (
    <>
      <Sidebar onLogout={onLogout} isMobileOpen={isMobileOpen} toggleMobileSidebar={toggleMobileSidebar} />
      <Header
        toggleSidebar={toggleSidebar}
        isMini={isMini}
        onLogout={onLogout}
        toggleMobileSidebar={toggleMobileSidebar}
      />

      <main className="nxl-container">
        <div className="nxl-content">
          <PageHeader />
          <Outlet />
        </div>
      </main>

      {/* Backdrop for mobile */}
      {isMobileOpen && (
        <div
          className="nxl-sidebar-overlay"
          onClick={toggleMobileSidebar}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.5)',
            zIndex: 1025
          }}
        />
      )}
    </>
  );
};

export default ProtectedRoute;

