import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
// import "../App.css";
import ShuchiLogo from "../../../assets/images/footerlogo.svg"
import Babysnap from "../../../assets/images/babysnap.png"
import producsnap from "../../../assets/images/Productsnap_logo.png"
import Companion from "../../../assets/images/Companion.png"
import aiGirlfriend from "../../../assets/images/sophia.png"
import "../../../index.css"
const SelectAdmin = ({ onLogout }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const dashboards = [
    {
      icon: ShuchiLogo,
      name: 'ShuchiAI',
      url: 'http://localhost:3000/admin_di/dashboard',
      url_prod: 'https://shuchiai.com/admin_di/dashboard',
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
      icon: producsnap,
    },
    {
      name: 'Sophia Ai: Girlfriend',
      url: 'http://localhost:3000/aicompanion/admin/companion',
      url_prod: 'https://shuchiai.com/aicompanion/admin/companion',
      icon: aiGirlfriend,
    },
     {
      name: 'Wallpaper',
      url: 'http://localhost:5173/wallpaper_admin/home',
      url_prod: 'https://shuchiai.com/wallpaper_admin/home',
      icon: aiGirlfriend,
    }
  ];



  const handleDashboardClick = (dashboard) => {
    setLoading(true);

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

    if (dashboard.name === 'Companion') {
      navigate('/companion');
      setLoading(false);
    } else {
      const isDev = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
      const targetUrl = isDev ? dashboard.url : dashboard.url_prod;
      window.location.href = targetUrl;
    }
  };

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    } else {
      localStorage.clear();
      document.cookie = 'authToken=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/';
      document.cookie = 'authUser=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/';
      document.cookie = 'selectedPanel=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/';
      navigate('/login');
    }
  };
  const getCardColorClass = (name) => {
    switch (name) {
      case 'ShuchiAI':
        return 'card-purple';
      case 'BabySnap':
        return 'card-pink';
      case 'ProductSnap':
        return 'card-orange';
      case 'Sophia Ai: Girlfriend':
        return 'card-blue';
      case 'Wallpaper':
        return 'card-black';
      default:
        return '';
    }
  };

  return (
    <div className="select-admin-wrapper">
      <div className="select-admin-container">
        <div className="select-admin-header">
          <h1 className="select-admin-title">Select Dashboard</h1>
          {/* <p className="select-admin-subtitle">Choose which admin panel you want to access</p> */}
        </div>

        <div className="select-admin-grid">
          {dashboards.map((dashboard, index) => (
            <div
              key={index}
              onClick={() => handleDashboardClick(dashboard)}
              className={`admin-panel-card ${getCardColorClass(dashboard.name)}`}
              style={{ cursor: loading ? 'wait' : 'pointer' }}
            >
              <div className="admin-card-content">
                <div className="admin-logo-container">
                  {dashboard.icon ? (
                    <img
                      src={dashboard.icon}
                      alt={dashboard.name}
                      className="admin-logo-img"
                    />
                  ) : (
                    <span className="admin-logo-emoji">📸</span>
                  )}
                </div>

                <h3 className="admin-panel-title">{dashboard.name}</h3>
                {/* <p className="admin-panel-desc">Click to open admin panel</p> */}
                <button className="admin-dashboard-btn">
                  Open Dashboard
                </button>
              </div>

            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SelectAdmin;