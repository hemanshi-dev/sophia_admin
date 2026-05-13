// import React from "react";
// import { useLocation, useNavigate } from "react-router-dom";

// const PageHeader = () => {
//   const location = useLocation();
//   const navigate = useNavigate();

//   const config = {
//     "/companion": {
//       title: "Companion",
//       breadcrumb: ["Companion"],
//       buttonText: "Add Companion",
//       buttonAction: () => navigate("/companion/add"),
//     },
//     "/companion/add": {
//       title: "Add Companion",
//       breadcrumb: ["Companion", "Add"],
//       buttonText: "Back",
//       buttonAction: () => navigate("/companion"),
//     },
//     "/user-list": {
//       title: "User List",
//       breadcrumb: ["User List"],
//       buttonText: "Refresh",
//       buttonAction: () => window.location.reload(),
//     },
//     // ── Reel routes ──
//     "/reels-list": {
//       title: "Reels",
//       breadcrumb: ["Reels"],
//       buttonText: "Add Reel",
//       buttonAction: () => navigate("/reels-add"),
//     },
//     "/reels": {
//       title: "Reels",
//       breadcrumb: ["Reels"],
//       buttonText: "Add Reel",
//       buttonAction: () => navigate("/reels-add"),
//     },
//     "/reels-add": {
//       title: "Add Reel",
//       breadcrumb: ["Reels", "Add"],
//       buttonText: "Back",
//       buttonAction: () => navigate("/reels-list"),
//     },
//   };

//   // edit route handling
//   const isEditPage = location.pathname.startsWith("/companion/edit");
//   const isReelEditPage = location.pathname.startsWith("/reels-edit");

//   const current =
//     config[location.pathname] ||
//     (isEditPage && {
//       title: "Edit Companion",
//       breadcrumb: ["Companion", "Edit"],
//       buttonText: "Back",
//       buttonAction: () => navigate("/companion"),
//     }) ||
//     (isReelEditPage && {
//       title: "Edit Reel",
//       breadcrumb: ["Reels", "Edit"],
//       buttonText: "Back",
//       buttonAction: () => navigate("/reels-list"),
//     });

//   if (!current) return null;

//   return (
//     <div className="page-header">
//       <div className="page-header-left d-flex align-items-center">
//         <div className="page-header-title">
//           <h5 className="m-b-10">{current.title}</h5>
//         </div>

//         <ul className="breadcrumb">
//           {current.breadcrumb.map((item, index) => (
//             <li key={index} className="breadcrumb-item">
//               {item}
//             </li>
//           ))}
//         </ul>
//       </div>

//       <div className="page-header-right ms-auto">
//         <button
//           type="button" // ✅ THIS IS THE FIX
//           className="btn btn-primary"
//           onClick={current.buttonAction}
//         >
//           <i className="feather-plus me-2"></i>
//           {current.buttonText}
//         </button>
//       </div>
//     </div>
//   );
// };

// export default PageHeader;

import React, { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const PageHeader = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [ddOpen, setDdOpen] = useState(false);
  const [imageModule, setImageModule] = useState(null);
  const ddRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (ddRef.current && !ddRef.current.contains(e.target)) {
        setDdOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const config = {
    "/companion": {
      title: "Companion",
      breadcrumb: ["Companion"],
      buttonText: "Add Companion",
      buttonAction: () => navigate("/companion/add"),
      
    },
    "/companion/add": {
      title: "Add Companion",
      breadcrumb: ["Companion", "Add"],
      buttonText: "Back",
      buttonAction: () => navigate("/companion"),
    },
    "/companion/images/view": {
      title: "View Images",
      breadcrumb: ["Companion", "View Images"],
      buttonText: "Back",
      buttonAction: () => navigate("/companion"),
    },
    "/companion/images/add": {
      title: "Add Images",
      breadcrumb: ["Companion", "Add Images"],
      buttonText: "Back",
      buttonAction: () => navigate("/companion"),
    },
    "/user-list": {
      title: "User List",
      breadcrumb: ["User List"],
      buttonText: "Refresh",
      buttonAction: () => window.location.reload(),
    },
    "/reels-list": {
      title: "Reels",
      breadcrumb: ["Reels"],
      buttonText: "Add Reel",
      buttonAction: () => navigate("/reels-add"),
    },
    "/reels": {
      title: "Reels",
      breadcrumb: ["Reels"],
      buttonText: "Add Reel",
      buttonAction: () => navigate("/reels-add"),
    },
    "/reels-add": {
      title: "Add Reel",
      breadcrumb: ["Reels", "Add"],
      buttonText: "Back",
      buttonAction: () => navigate("/reels-list"),
    },
  };

  const isEditPage = location.pathname.startsWith("/companion/edit");
  const isReelEditPage = location.pathname.startsWith("/reels-edit");

  const current =
    config[location.pathname] ||
    (isEditPage && {
      title: "Edit Companion",
   breadcrumb: [
  { label: "Companion", path: "/companion" },
  { label: "Edit" }
],
      buttonText: "Back",
      buttonAction: () => navigate("/companion"),
      showImageModule: true, // ✅ Show dropdown on edit page too
    }) ||
    (isReelEditPage && {
      title: "Edit Reel",
    breadcrumb: [
  { label: "Reels", path: "/reels-list" },
  { label: "Edit" }
],
      buttonText: "Back",
      buttonAction: () => navigate("/reels-list"),
    });

  if (!current) return null;

  const handleModuleSelect = (type) => {
    setImageModule(type);
    setDdOpen(false);

    // Try to get companion ID from URL if we are on an edit page
    const pathnameParts = location.pathname.split("/");
    const compIdInUrl = pathnameParts.includes("edit") ? pathnameParts[pathnameParts.length - 1] : null;

    // Navigate to separate route based on selection
    if (type === "view") navigate(`/companion/images/view${compIdInUrl ? `/${compIdInUrl}` : ""}`);
    // if (type === "add") navigate(`/companion/images/add${compIdInUrl ? `/${compIdInUrl}` : ""}`);
  };

  const dropdownLabel = () => {
    if (imageModule === "view") return "View Images";
    // if (imageModule === "add") return "Add Images";
    return "Image Module";
  };

  return (
    <>
      <div className="page-header">
        <div className="page-header-left d-flex align-items-center">
          <div className="page-header-title">
            <h5 className="m-b-10">{current.title}</h5>
          </div>
          <ul className="breadcrumb">
          {current.breadcrumb.map((item, index) => (
  <li key={index} className="breadcrumb-item">
    {item.path ? (
      <span
        style={{ cursor: "pointer" }}
        onClick={() => navigate(item.path)}
      >
        {item.label}
      </span>
    ) : (
      item.label
    )}
  </li>
))}
          </ul>
        </div>

        <div className="page-header-right ms-auto d-flex align-items-center gap-2">

          {/* ✅ Image Module Dropdown - only on /companion route */}
          {current.showImageModule && (
            <div className="dropdown" ref={ddRef}>
          
<button
  type="button"
  className="btn btn-outline-secondary d-flex align-items-center gap-2"
  onClick={() => handleModuleSelect("view")}  // ← directly call handleModuleSelect
>
  <i className="feather-image" style={{ fontSize: 15 }}></i>
  <span>{dropdownLabel()}</span>
  <i className="feather-image" style={{ fontSize: 13 }}></i>
</button>

              {ddOpen && (
                <div
                  className="dropdown-menu show"
                  style={{
                    position: "absolute",
                    right: 0,
                    left: "auto",
                    top: "calc(100% + 6px)",
                    minWidth: 190,
                    zIndex: 999,
                    border: "0.5px solid #dee2e6",
                    borderRadius: 8,
                    padding: "4px 0",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                  }}
                >
                  {/* View Option */}
                  <button
                    type="button"
                    className="dropdown-item d-flex align-items-center gap-2"
                    onClick={() => handleModuleSelect("view")}
                    style={{ padding: "9px 14px", fontSize: 13 }}
                  >
                    <i className="feather-eye" style={{ fontSize: 15, color: "#378ADD" }}></i>
                    <span>View Images</span>
                   
                  </button>

                  <div style={{ borderTop: "0.5px solid #f0f0f0", margin: "2px 0" }} />

                  {/* Add Option */}
                  {/* <button
                    type="button"
                    className="dropdown-item d-flex align-items-center gap-2"
                    onClick={() => handleModuleSelect("add")}
                    style={{ padding: "9px 14px", fontSize: 13 }}
                  >
                    <i className="feather-plus-square" style={{ fontSize: 15, color: "#1D9E75" }}></i>
                    <span>Add Images</span>
                  
                  </button> */}
                </div>
              )}
            </div>
          )}

          {/* Main Action Button */}
          <button
            type="button"
            className="btn btn-primary"
            onClick={current.buttonAction}
          >
            <i className="feather-plus me-2"></i>
            {current.buttonText}
          </button>

        </div>
      </div>
    </>
  );
};

export default PageHeader;