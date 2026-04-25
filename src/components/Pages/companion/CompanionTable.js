import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { connect } from "react-redux";
import { GetAllCompanions, EyeShowAction, SetCompanionsPagination } from "../../../store/action/useAction";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { Edit, Trash2, ArrowUp, ArrowDown, Eye, EyeOff } from "react-feather";
import Loader from "../../common/Loader";
import DeleteModal from "../../common/DeleteModal";
import { UpdateCompanionOrder } from "../../../store/action/useAction";

const ExpandableCell = ({ text, clamp = 3 }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="position-relative w-100 d-flex justify-content-center"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        style={{
          display: "-webkit-box",
          WebkitLineClamp: clamp,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "normal",
          cursor: "help",
          textAlign: "center",
        }}
      >
        {text || "N/A"}
      </div>
      {isHovered && text && text !== "N/A" && (
        <div
          className="shadow-lg border bg-white text-dark p-3 rounded"
          style={{
            position: "fixed",
            zIndex: 10000,
            width: "400px",
            maxHeight: "300px",
            overflowY: "auto",
            fontSize: "12px",
            lineHeight: "1.4",
            pointerEvents: "none",
            whiteSpace: "pre-wrap",
            transform: "translate(20px, 10px)",
            border: "1px solid #ddd",
            boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
          }}
        >
          <strong>Full Content:</strong>
          <hr className="my-1" />
          {text}
        </div>
      )}
    </div>
  );
};

const TruncatedCell = ({ text }) => (
  <div
    title={text || "N/A"}  // native browser tooltip
    style={{
      display: "-webkit-box",
      WebkitLineClamp: 3,
      WebkitBoxOrient: "vertical",
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "normal",
      textAlign: "center",
      cursor: "default",
      maxWidth: "100%",
    }}
  >
    {text || "N/A"}
  </div>
);

const CompanionTable = ({ dispatch, companions_list }) => {
  const [loading, setLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [companionToDelete, setCompanionToDelete] = useState(null);
  const [currentPage, setCurrentPage] = useState(companions_list?.page || 1);
  const [rowsPerPage, setRowsPerPage] = useState(companions_list?.rowsPerPage || 10);
  const navigate = useNavigate();
  const [previewImage, setPreviewImage] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [eyeLoadingId, setEyeLoadingId] = useState(null);
  const [orderLoadingId, setOrderLoadingId] = useState(null);
  const [previewImages, setPreviewImages] = useState([]); // ✅ all images for that row
  const [previewIndex, setPreviewIndex] = useState(0);

  const fetchCompanions = React.useCallback(() => {
    dispatch(GetAllCompanions(setLoading)).catch(() => {
      toast.error("Failed to load companions");
    });
  }, [dispatch]);

  useEffect(() => {
    if (!companions_list?.isLoaded) {
      fetchCompanions();
    }
  }, [fetchCompanions, companions_list?.isLoaded]);

  const handleDeleteClick = (id) => {
    setCompanionToDelete(id);
    setShowDeleteModal(true);
  };



  const goPrev = (e) => {
    e.stopPropagation();
    setPreviewIndex((prev) => (prev - 1 + previewImages.length) % previewImages.length);
  };

  const goNext = (e) => {
    e.stopPropagation();
    setPreviewIndex((prev) => (prev + 1) % previewImages.length);
  };

  const handleOrderDirection = async (id, direction) => {
    setOrderLoadingId(`${id}_${direction}`);
    try {
      const result = await dispatch(UpdateCompanionOrder(id, direction, () => { }));
      if (result && result.success !== false) {
        toast.success(result.message || "Order updated successfully");
        dispatch(GetAllCompanions(() => { }));
      } else {
        toast.error(result?.message || "Failed to update order");
      }
    } catch (error) {
      console.error("Order update error:", error);
      toast.error("An error occurred while updating order");
    } finally {
      setOrderLoadingId(null);
    }
  };

  const openPreview = (images, index) => {
    setPreviewImages(images);
    setPreviewIndex(index);
    setShowPreview(true);
  };

  const handleEyeShow = async (row) => {
    const rowId = row.id || row._id;
    const currentEyeShow =
      row.eyeshow === true || row.eyeshow === "true" || row.eyeshow === 1 ||
      row.fallback === true || row.fallback === "true" || row.fallback === 1;
    const newEyeShow = !currentEyeShow;
    setEyeLoadingId(rowId);
    try {
      await dispatch(EyeShowAction(rowId, newEyeShow, () => { }));
      toast.success(`Eye show set to ${newEyeShow ? "visible" : "hidden"}`);
      // Redux state handles the list update locally
    } catch (err) {
      console.error(err);
      toast.error("Failed to update eye show");
    } finally {
      setEyeLoadingId(null);
    }
  };

  const columns = [
    {
      name: "Sr. No.",
      selector: (row, index) => {
        return (currentPage - 1) * rowsPerPage + index + 1;
      },
      width: "80px",
      center: true,
      cell: (row, index) => (
        <span style={{ 
            fontWeight: "600", 
            color: "#6B7280",
            fontSize: "14px"
        }}>
          {(currentPage - 1) * rowsPerPage + index + 1}
        </span>
      )
    },
    {
      name: "Android",
      cell: (row) => {
        const images = Array.isArray(row.android_images)
          ? row.android_images
          : row.filename
            ? [row.filename]
            : [];

        return (
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
              gap: "8px",
              padding: "8px",
              overflowX: images.length > 2 ? "auto" : "visible",
              maxWidth: "120px",
              width: "100%",
              alignItems: "center",
              scrollbarWidth: "thin",
              scrollbarColor: "#ccc transparent",
            }}
            className="img-scroll-row"
          >
            {images.map((src, idx) => (
              <img
                key={idx}
                src={src}
                alt="android"
                width="45"
                height="45"
                onClick={() => openPreview(images, idx)}
                style={{
                  borderRadius: "8px",
                  objectFit: "cover",
                  border: "2px solid #E5E7EB",
                  cursor: "pointer",
                  flexShrink: 0,
                  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                  transition: "all 0.2s ease"
                }}
              />
            ))}
            {images.length === 0 && (
              <div style={{
                width: "45px", 
                height: "45px", 
                borderRadius: "8px",
                backgroundColor: "#F3F4F6", 
                color: "#9CA3AF",
                display: "flex", 
                alignItems: "center", 
                justifyContent: "center",
                fontSize: "16px", 
                fontWeight: "600",
                border: "2px solid #E5E7EB"
              }}>
                🤖
              </div>
            )}
          </div>
        );
      },
      width: "110px",
      center: true,
    },
    {
      name: "iOS",
      cell: (row) => {
        const images = Array.isArray(row.ios_images)
          ? row.ios_images
          : row.image
            ? [row.image]
            : [];

        return (
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
              gap: "8px",
              padding: "8px",
              overflowX: images.length > 2 ? "auto" : "visible",
              maxWidth: "120px",
              width: "100%",
              alignItems: "center",
              scrollbarWidth: "thin",
              scrollbarColor: "#ccc transparent",
            }}
            className="img-scroll-row"
          >
            {images.map((src, idx) => (
              <img
                key={idx}
                src={src}
                alt="ios"
                width="45"
                height="45"
                onClick={() => openPreview(images, idx)}
                style={{
                  borderRadius: "8px",
                  objectFit: "cover",
                  border: "2px solid #E5E7EB",
                  cursor: "pointer",
                  flexShrink: 0,
                  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                  transition: "all 0.2s ease"
                }}
              />
            ))}
            {images.length === 0 && (
              <div style={{
                width: "45px", 
                height: "45px", 
                borderRadius: "8px",
                backgroundColor: "#F3F4F6", 
                color: "#9CA3AF",
                display: "flex", 
                alignItems: "center", 
                justifyContent: "center",
                fontSize: "16px", 
                fontWeight: "600",
                border: "2px solid #E5E7EB"
              }}>
                🍎
              </div>
            )}
          </div>
        );
      },
      width: "110px",
      center: true,
    },
    {
      name: "Name",
      selector: (row) => row.name || "N/A",
      sortable: true,
      width: "150px",
      center: true,
    },
    {
      name: "Age",
      selector: (row) => row.age || "N/A",
      sortable: true,
      width: "80px",
      center: true,
    },
    // {
    //   name: "Description",
    //   selector: (row) => row.description || "N/A",
    //   cell: (row) => <ExpandableCell text={row.description} />,
    //   sortable: true,
    //   grow: 1,
    //   center: true,
    // },
    {
      name: "Prompt",
      selector: (row) => row.system_prompt || row.prompt,
      cell: (row) => <TruncatedCell text={row.system_prompt || row.prompt} />,
      sortable: true,
      grow: 2,
      center: true,
    },
    {
      name: "Action",
      button: true,
      center: true,
      cell: (row) => {
        const rowId = row.id || row._id;
        // support both field names: eyeshow / fallback
        const isEyeActive =
          row.eyeshow === true || row.eyeshow === "true" || row.eyeshow === 1 ||
          row.fallback === true || row.fallback === "true" || row.fallback === 1;
        const isEyeLoading = eyeLoadingId === rowId;
        return (
          <div className="d-flex gap-2 justify-content-center flex-wrap">
            <button
              type="button"
              className="btn btn-outline-info p-2"
              onClick={() => handleOrderDirection(rowId, "up")}
              disabled={!!orderLoadingId}
              title="Move Up"
            >
              {orderLoadingId === `${rowId}_up` ? <span className="spinner-border spinner-border-sm" /> : <ArrowUp size={16} />}
            </button>
            <button
              type="button"
              className="btn btn-outline-info p-2"
              onClick={() => handleOrderDirection(rowId, "down")}
              disabled={!!orderLoadingId}
              title="Move Down"
            >
              {orderLoadingId === `${rowId}_down` ? <span className="spinner-border spinner-border-sm" /> : <ArrowDown size={16} />}
            </button>
            {/* Eye Show Toggle */}
            <button
              type="button"
              className="btn p-2"
              style={{
                border: "1.5px solid #6f42c1",
                color: "#6f42c1",
                background: "transparent",
                borderRadius: "6px",
                transition: "all 0.2s ease",
              }}
              onClick={() => handleEyeShow(row)}
              disabled={isEyeLoading}
              title={isEyeActive ? "Click to hide (eyeshow: false)" : "Click to show (eyeshow: true)"}
              onMouseEnter={(e) => {
                if (!isEyeLoading) {
                  e.currentTarget.style.background = "#6f42c1";
                  e.currentTarget.style.color = "#fff";
                  const svg = e.currentTarget.querySelector("svg");
                  if (svg) svg.style.stroke = "#fff";
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.color = "#6f42c1";
                const svg = e.currentTarget.querySelector("svg");
                if (svg) svg.style.stroke = "#6f42c1";
              }}
            >
              {isEyeLoading
                ? <span className="spinner-border spinner-border-sm" style={{ width: "14px", height: "14px" }} />
                : isEyeActive
                  ? <Eye size={16} style={{ transition: "stroke 0.2s ease" }} />
                  : <EyeOff size={16} style={{ transition: "stroke 0.2s ease" }} />
              }
            </button>
            <button
              type="button"
              className="btn btn-outline-primary p-2"
              onClick={() => navigate(`/companion/edit/${rowId}`)}
              title="Edit"
            >
              <Edit size={16} />
            </button>
            <button
              type="button"
              className="btn btn-outline-danger p-2"
              onClick={() => handleDeleteClick(rowId)}
              title="Delete"
            >
              <Trash2 size={16} />
            </button>
          </div>
        );
      },
      width: "260px",
    },
  ];

  const data = Array.isArray(companions_list?.data)
    ? [...companions_list.data].sort((a, b) => {
      const epochA = a.epoch || 0;
      const epochB = b.epoch || 0;
      return epochB - epochA;
    })
    : [];

  const customStyles = {
    table: {
      style: {
        border: "1px solid #E5E7EB",
        borderRadius: "12px",
        overflow: "hidden",
        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
      },
    },
    headRow: {
      style: {
        backgroundColor: "#F9FAFB",
        borderBottom: "2px solid #E5E7EB",
        minHeight: "60px",
      },
    },
    headCells: {
      style: {
        borderRight: "1px solid #E5E7EB",
        justifyContent: "center",
        fontSize: "14px",
        fontWeight: "700",
        color: "#374151",
        paddingLeft: "16px",
        paddingRight: "16px",
        textTransform: "none",
        letterSpacing: "0.5px",
        backgroundColor: "#F9FAFB",
        "&:last-child": {
          borderRight: "none",
        },
      },
    },
    cells: {
      style: {
        borderRight: "1px solid #F3F4F6",
        justifyContent: "center",
        paddingLeft: "16px",
        paddingRight: "16px",
        minHeight: "70px",
        "&:last-child": {
          borderRight: "none",
        },
      },
    },
    rows: {
      style: {
        minHeight: "80px",
        "&:not(:last-child)": {
          borderBottom: "1px solid #e3e6f0",
        },
      },
    },
  };

  return (
    <div className="main-content">
      <div className="card">
        <div className="card-body p-0">
          <div style={{ overflowX: "auto", width: "100%" }}>
            <div style={{ minWidth: "850px" }}>
            <DataTable
              title="Companions List"
              columns={columns}
              data={data}
              progressPending={loading}
              progressComponent={<Loader />}
              pagination
              paginationDefaultPage={currentPage}
              paginationPerPage={rowsPerPage}
              paginationRowsPerPageOptions={[10, 30, 50, 100]}
              onChangePage={(page) => {
                setCurrentPage(page);
                dispatch(SetCompanionsPagination(page, rowsPerPage));
              }}
              onChangeRowsPerPage={(newRowsPerPage, page) => {
                setRowsPerPage(newRowsPerPage);
                setCurrentPage(page);
                dispatch(SetCompanionsPagination(page, newRowsPerPage));
              }}
              customStyles={customStyles}
            />
            </div>
          </div>
        </div>
      </div>

      <DeleteModal
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        id={companionToDelete}
      />

      {/* Image Preview Modal */}
      {/* {showPreview && (
        <>
          <div
            className="modal-backdrop fade show"
            onClick={() => setShowPreview(false)}
            style={{ zIndex: 1050 }}
          ></div>
          <div
            className="modal fade show d-block"
            tabIndex="-1"
            role="dialog"
            onClick={() => setShowPreview(false)}
            style={{ zIndex: 1060 }}
          >
            <div
              className="modal-dialog modal-dialog-centered modal-lg"
              role="document"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-content border-0 bg-transparent shadow-none">
                <div className="p-0 position-relative d-inline-block mx-auto">
                  <button
                    onClick={() => setShowPreview(false)}
                    style={{
                      position: 'absolute',
                      top: '10px',
                      right: '10px',
                      zIndex: 10,
                      backgroundColor: 'transparent',
                      border: 'none',
                      color: 'white',
                      fontSize: '32px',
                      lineHeight: '1',
                      cursor: 'pointer',
                      textShadow: '0 0 10px rgba(0,0,0,0.8)',
                      outline: 'none',
                      padding: '5px'
                    }}
                    title="Close"
                  >
                    &times;
                  </button>
                  <img
                    src={previewImage}
                    alt="Preview"
                    style={{
                      maxWidth: "100%",
                      maxHeight: "90vh",
                      borderRadius: "8px",
                      boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
                      objectFit: "contain",
                      display: "block"
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </>
      )} */}
      {showPreview && (
        <>
          <div
            className="modal-backdrop fade show"
            onClick={() => setShowPreview(false)}
            style={{ zIndex: 1050 }}
          />
          <div
            className="modal fade show d-block"
            onClick={() => setShowPreview(false)}
            style={{ zIndex: 1060 }}
          >
            <div
              className="modal-dialog modal-dialog-centered modal-lg"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-content border-0 bg-transparent shadow-none position-relative d-flex flex-column align-items-center">

                {/* Image wrapper — close button anchored to image corner */}
                <div style={{ position: "relative", display: "inline-block" }}>

                  {/* ✅ Close Button — top-right corner of image */}
                  <button
                    onClick={() => setShowPreview(false)}
                    style={{
                      position: "absolute",
                      top: "1px",
                      right: "1px",
                      zIndex: 20,
                      background: "transparent", // ✅ was rgba(0,0,0,0.7)
                      border: "none",            // ✅ remove border too
                      color: "white",
                      fontSize: "24px",
                      borderRadius: "50%",
                      width: "32px",
                      height: "32px",
                      cursor: "pointer",
                      lineHeight: "1",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      textShadow: "0 0 6px rgba(0,0,0,0.9)", // ✅ keeps X visible against any background
                    }}
                  >
                    &times;
                  </button>

                  {/* ✅ Prev Button */}
                  {previewImages.length > 1 && (
                    <button
                      onClick={goPrev}
                      style={{
                        position: "absolute",
                        left: "-20px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        zIndex: 10,
                        background: "rgba(0,0,0,0.5)",
                        border: "none",
                        color: "white",
                        fontSize: "24px",
                        borderRadius: "50%",
                        width: "40px",
                        height: "40px",
                        cursor: "pointer",
                      }}
                    >
                      &#8249;
                    </button>
                  )}

                  {/* ✅ Image */}
                  <img
                    src={previewImages[previewIndex]}
                    alt="Preview"
                    style={{
                      maxWidth: "70vw",
                      maxHeight: "75vh",
                      borderRadius: "8px",
                      objectFit: "contain",
                      display: "block",
                      boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
                    }}
                  />

                  {/* ✅ Next Button */}
                  {previewImages.length > 1 && (
                    <button
                      onClick={goNext}
                      style={{
                        position: "absolute",
                        right: "-20px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        zIndex: 10,
                        background: "rgba(0,0,0,0.5)",
                        border: "none",
                        color: "white",
                        fontSize: "24px",
                        borderRadius: "50%",
                        width: "40px",
                        height: "40px",
                        cursor: "pointer",
                      }}
                    >
                      &#8250;
                    </button>
                  )}
                </div>

                {/* ✅ Counter below image */}
                {previewImages.length > 1 && (
                  <div style={{
                    color: "white", marginTop: "12px",
                    fontSize: "14px", fontWeight: "600",
                    textShadow: "0 1px 4px rgba(0,0,0,0.8)",
                  }}>
                    {previewIndex + 1} / {previewImages.length}
                  </div>
                )}

              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

const mapStateToProps = (state) => ({
  companions_list: state?.companions_list,
});

export default connect(mapStateToProps)(CompanionTable);
