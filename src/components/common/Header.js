import React from "react";
import { AlignLeft, ArrowRight, User, LogOut } from "react-feather";
import { useNavigate } from "react-router-dom";

const Header = ({ toggleSidebar, isMini, onLogout, toggleMobileSidebar }) => {
  const navigate = useNavigate();

  const handleLogout = (e) => {
    e.preventDefault();
    if (onLogout) {
      onLogout();
    }
  };

  return (
    <header className="nxl-header">
      <div className="header-wrapper">
        <div className="header-left d-flex align-items-center gap-4">
          <a
            href="#"
            className="nxl-head-mobile-toggler"
            id="mobile-collapse"
            onClick={(e) => {
              e.preventDefault();
              toggleMobileSidebar();
            }}
          >
            <div className="hamburger hamburger--arrowturn">
              <div className="hamburger-box">
                <div className="hamburger-inner"></div>
              </div>
            </div>
          </a>
          <div className="nxl-navigation-toggle">
            <a
              href="#"
              id="menu-mini-button"
              onClick={(e) => {
                e.preventDefault();
                toggleSidebar();
              }}
              style={{ display: isMini ? "none" : "flex" }}
            >
              <AlignLeft size={18} />
            </a>
            <a
              href="#"
              id="menu-expend-button"
              onClick={(e) => {
                e.preventDefault();
                toggleSidebar();
              }}
              style={{ display: isMini ? "flex" : "none" }}
            >
              <ArrowRight size={18} />
            </a>
          </div>
        </div>

        <div className="header-right ms-auto">
          <div className="d-flex align-items-center">
            <div className="dropdown nxl-h-item">
              <a
                href="#"
                className="avatar-text avatar-md"
                data-bs-toggle="dropdown"
                data-bs-auto-close="outside"
                onClick={(e) => e.preventDefault()}
              >
                <User size={18} />
              </a>
              <div className="dropdown-menu dropdown-menu-end nxl-h-dropdown nxl-user-dropdown">
                <div className="dropdown-header">
                  <div className="d-flex align-items-center">
                    <div className="avatar-text avatar-md me-3">A</div>
                    <div>
                      <h6 className="text-dark mb-0">
                        Admin{" "}
                        <span className="badge bg-soft-success text-success ms-1">
                          Pro
                        </span>
                      </h6>
                      <p className="fs-12 fw-medium text-muted mb-0">
                        admin@shuchiai.com
                      </p>
                    </div>
                  </div>
                </div>
                <div className="dropdown-divider"></div>
                <a href="#" className="dropdown-item" onClick={handleLogout}>
                  <LogOut size={16} className="me-2" />
                  <span>Logout</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
