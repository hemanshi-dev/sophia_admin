import React, { useState } from "react";
import { Airplay, Layers, Users, Instagram, MessageSquare, AlertCircle, ToggleRight } from "react-feather";
import { NavLink, useLocation } from "react-router-dom";
import ShuchiLogo from "../../assets/images/logo.png"
import Babysnap from "../../assets/images/AppIconmarketing.png"
import ProductSnap from "../../assets/images/psapp_fav_icon.jpg"
import aiCompanion from "../../assets/images/sophia_logo.png"
import wallpaper from "../../assets/images/wallpaper.png"

const Sidebar = ({ toggleMobileSidebar }) => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const closeMobileSidebar = () => {
    if (window.innerWidth < 1024 && toggleMobileSidebar) {
      toggleMobileSidebar();
    }
  };

  const dashboards = [
    {
      name: 'ShuchiAI',
      url: 'http://localhost:3000/admin_di/dashboard',
      url_prod: 'https://shuchiai.com/admin_di/dashboard',
      icon: ShuchiLogo,
    },
    {
      name: 'BabySnap',
      url: 'http://localhost:3002/babysnap/admin/dashboard',
      url_prod: 'https://shuchiai.com/babysnap/admin/dashboard',
      icon: Babysnap,
    },
    {
      name: 'ProductSnap',
      url: 'http://localhost:3001/psapp/admin/dashboard',
      url_prod: 'https://shuchiai.com/psapp/admin/dashboard',
      icon: ProductSnap,
    },
     {
      name: 'Wallpaper',
      url: 'http://localhost:5173/wallpaper_admin/home',
      url_prod: 'https://shuchiai.com/wallpaper_admin/home',
      icon: wallpaper,
    }
  ];

  const handleSwitchAdmin = (dashboard) => {
    const date = new Date();
    date.setTime(date.getTime() + (7 * 24 * 60 * 60 * 1000));
    const expires = "expires=" + date.toUTCString();

    const hostname = window.location.hostname;
    let domain = '';
    if (hostname !== 'localhost' && hostname !== '127.0.0.1') {
      const parts = hostname.split('.');
      if (parts.length > 2) {
        domain = `;Domain=.${parts.slice(-2).join('.')}`;
      }
    }

    document.cookie = `selectedPanel=${dashboard.name};${expires};path=/${domain}`;
    localStorage.setItem('selectedPanel', dashboard.name);

    const isDev = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    window.location.href = isDev ? dashboard.url : dashboard.url_prod;
  };

  return (
    <nav className="nxl-navigation">
      <div className="navbar-wrapper">
        <div className="m-header d-block">
          {/* <div className="text-center text-black fw-bold fs-5"><img src={aiCompanion} /></div> */}
         <div className="d-flex align-items-center justify-content-center text-black fw-bold fs-6" style={{height:"60px"}}>
  Sophia : My Ai Girlfriend
</div>
        </div>
        <div className="navbar-content">

          <ul className="nxl-navbar">
               <li className="nxl-item">
              <NavLink
                to="/user-list"
                className={({ isActive }) =>
                  "nxl-link " + (isActive ? "active-menu" : "")
                }
                onClick={closeMobileSidebar}
              >
                <span className="nxl-micon"><Users size={18} /></span>
                <span className="nxl-mtext">User List</span>
              </NavLink>
            </li>
            <li className="nxl-item">
              <NavLink
                to="/companion"
                className={() =>
                  "nxl-link " + (location.pathname.startsWith("/companion") ? "active-menu" : "")
                }
                onClick={closeMobileSidebar}
              >
                <span className="nxl-micon"><Airplay size={18} /></span>
                <span className="nxl-mtext">Companions</span>
              </NavLink>
            </li>
            <li className="nxl-item">                 
              <NavLink
                to="/reels-list"
                className={() =>
                  "nxl-link " + (location.pathname.startsWith("/reels") ? "active-menu" : "")
                }
                onClick={closeMobileSidebar}
              >
                <span className="nxl-micon"><Instagram size={18} /></span>
                <span className="nxl-mtext">Reels List</span>
              </NavLink>
            </li>
            <li className="nxl-item">
              <NavLink
                to="/reel-report"
                className={({ isActive }) =>
                  "nxl-link " + (isActive ? "active-menu" : "")
                }
                onClick={closeMobileSidebar}
              >
                <span className="nxl-micon"><AlertCircle size={18} /></span>
                <span className="nxl-mtext">Reel Report</span>
              </NavLink>
            </li>
            <li className="nxl-item">
              <NavLink
                to="/feedback"
                className={({ isActive }) =>
                  "nxl-link " + (isActive ? "active-menu" : "")
                }
                onClick={closeMobileSidebar}
              >
                <span className="nxl-micon"><MessageSquare size={18} /></span>
                <span className="nxl-mtext">Feedback</span>
              </NavLink>
            </li>
            <li className="nxl-item">
              <NavLink
                to="/live-mode"
                className={({ isActive }) =>
                  "nxl-link " + (isActive ? "active-menu" : "")
                }
                onClick={closeMobileSidebar}
              >
                <span className="nxl-micon"><ToggleRight size={18} /></span>
                <span className="nxl-mtext">Live Mode</span>
              </NavLink>
            </li>
          </ul>

          <div className="nxl-admin-section">
            <div
              className={`nxl-admin-header ${isOpen ? "open" : ""}`}
              onClick={() => setIsOpen(!isOpen)}
            >
              <span className="nxl-micon"><Layers size={18} /></span>
              <span className="nxl-mtext">Admin</span>
              <span className="nxl-admin-arrow">▾</span>
            </div>

            {isOpen && (
              <ul className="nxl-admin-dropdown">
                {dashboards.map((dashboard, index) => (
                  <li key={index} className="nxl-admin-item">
                    <a
                      href="#"
                      className="nxl-admin-link"
                      onClick={(e) => {
                        e.preventDefault();
                        handleSwitchAdmin(dashboard);
                      }}
                    >
                      <span className="admin-left-icon">
                        <img src={dashboard.icon} alt={dashboard.name} />
                      </span>
                      <span className="admin-name">{dashboard.name}</span>
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Sidebar;
