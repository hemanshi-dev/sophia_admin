import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { connect } from "react-redux";
import { toast } from "react-toastify";
import Loader from "../../common/Loader";
import { GetAllReelReports } from "../../../store/action/useAction";
import { Play } from "react-feather";

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

const ReelReport = ({ dispatch, reel_report_all }) => {
    const [loading, setLoading] = useState(false);
    const [previewImage, setPreviewImage] = useState(null);
    const [showPreview, setShowPreview] = useState(false);
    const [previewVideo, setPreviewVideo] = useState(null);
    const [showVideoPreview, setShowVideoPreview] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const fetchReports = React.useCallback(() => {
        dispatch(GetAllReelReports(setLoading)).catch(() => {
            toast.error("Failed to load reel reports");
        });
    }, [dispatch]);

    useEffect(() => {
        fetchReports();
    }, [fetchReports]);

    const openPreview = (img) => {
        setPreviewImage(img);
        setShowPreview(true);
    };

    const openVideoPreview = (url) => {
        setPreviewVideo(url);
        setShowVideoPreview(true);
    };

    const columns = [
        {
            name: "Sr. No.",
            selector: (row, index) => {
                return (currentPage - 1) * rowsPerPage + index + 1;
            },
            width: "70px",
            center: true,
        },
        // {
        //     name: "ID",
        //     selector: (row) => row.id || "N/A",
        //     sortable: true,
        //     center: true,
        //     width: "220px",
        // },
        {
            name: "Reels ID",
            selector: (row) => row.reels_id || "N/A",
            sortable: true,
            center: true,
            width: "220px",
        },
        {
            name: "Companion ID",
            selector: (row) => row.gf_id || "N/A",
            sortable: true,
            center: true,
            width: "220px",
        },
        {
            name: "Cover Photo",
            cell: (row) =>
                row.photo ? (
                    <img
                        src={row.photo}
                        alt="cover"
                        onClick={() => openPreview(row.photo)}
                        style={{ width: "54px", height: "54px", objectFit: "cover", borderRadius: "6px", border: "1px solid #ddd", cursor: "pointer" }}
                    />
                ) : (
                    <span className="text-muted" style={{ fontSize: "12px" }}>No photo</span>
                ),
            center: true,
            width: "110px",
        },
        {
            name: "Videos",
            cell: (row) => {
                const videoUrls = Array.isArray(row.video)
                    ? row.video
                    : row.video ? [row.video] : [];
                return (
                    <div
                        style={{
                            display: "flex",
                            gap: "6px",
                            alignItems: "center",
                            flexWrap: "nowrap",
                            overflowX: "auto",
                            padding: "4px 0",
                            maxWidth: "180px",
                        }}
                    >
                        {videoUrls.map((url, i) => (
                            <div
                                key={i}
                                style={{
                                    position: "relative",
                                    flexShrink: 0,
                                    cursor: "pointer",
                                    width: "40px",
                                    height: "40px"
                                }}
                                onClick={() => openVideoPreview(url)}
                            >
                                <video
                                    src={url}
                                    width="40"
                                    height="40"
                                    style={{
                                        objectFit: "cover",
                                        borderRadius: "6px",
                                        border: "1px solid #ddd",
                                        display: "block"
                                    }}
                                />
                                <div
                                    className="position-absolute d-flex align-items-center justify-content-center"
                                    style={{
                                        top: 0, left: 0, right: 0, bottom: 0,
                                        backgroundColor: "rgba(0,0,0,0.2)",
                                        borderRadius: "6px",
                                    }}
                                >
                                    <Play size={10} fill="currentColor" color="white" />
                                </div>
                            </div>
                        ))}
                    </div>
                );
            },
            center: true,
            width: "200px",
        },
        {
            name: "Description",
            selector: (row) => row.description || "N/A",
            sortable: true,
            center: true,
            // wrap: false,
            grow: 2,
            cell: (row) => <TruncatedCell text={row.description} clamp={2} />,
        },
        {
            name: "IP Address",
            selector: (row) => row.ip || "N/A",
            sortable: true,
            center: true,
            width: "130px",
        },
        {
            name: "Date",
            selector: (row) => row.created_at ? new Date(row.created_at).toLocaleString() : "N/A",
            sortable: true,
            center: true,
            width: "180px",
        },
    ];

    const data = Array.isArray(reel_report_all?.data) ? reel_report_all.data : [];

    const customStyles = {
        table: { style: { border: "1px solid #e3e6f0", borderRadius: "8px" } },
        headRow: { style: { backgroundColor: "#f8f9fc", borderBottom: "1px solid #e3e6f0", minHeight: "56px" } },
        headCells: {
            style: {
                borderRight: "1px solid #e3e6f0",
                justifyContent: "center",
                fontSize: "14px", fontWeight: "700", color: "#333",
                paddingLeft: "16px", paddingRight: "16px",
                "&:last-child": { borderRight: "none" },
            },
        },
        cells: {
            style: {
                borderRight: "1px solid #e3e6f0",
                justifyContent: "center",
                paddingLeft: "16px", paddingRight: "16px",
                "&:last-child": { borderRight: "none" },
                wordBreak: "break-all",
            },
        },
        rows: {
            style: {
                minHeight: "72px",
                "&:not(:last-child)": { borderBottom: "1px solid #e3e6f0" },
            },
        },
    };

    return (
        <div className="main-content">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h3 className="mb-0">Reel Report</h3>
            </div>
            <div className="card">
                <div className="card-body p-0">
                    <div style={{ overflowX: "auto", width: "100%" }}>
                        <div style={{ minWidth: "1000px" }}>
                            <DataTable
                                title="Reel Reports"
                                columns={columns}
                                data={data}
                                progressPending={loading}
                                progressComponent={<Loader />}
                                pagination
                                paginationPerPage={10}
                                paginationRowsPerPageOptions={[10, 30, 50, 100]}
                                onChangePage={(page) => setCurrentPage(page)}
                                onChangeRowsPerPage={(newRowsPerPage, page) => {
                                    setRowsPerPage(newRowsPerPage);
                                    setCurrentPage(page);
                                }}
                                customStyles={customStyles}
                                noDataComponent={
                                    <div className="py-5 text-center text-muted">No reports found.</div>
                                }
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Image Preview Modal */}
            {showPreview && (
                <>
                    <div className="modal-backdrop fade show" onClick={() => setShowPreview(false)} style={{ zIndex: 1050 }} />
                    <div className="modal fade show d-block" onClick={() => setShowPreview(false)} style={{ zIndex: 1060 }}>
                        <div className="modal-dialog modal-dialog-centered modal-lg" onClick={(e) => e.stopPropagation()}>
                            <div className="modal-content border-0 bg-transparent shadow-none position-relative d-flex flex-column align-items-center">
                                <div style={{ position: "relative", display: "inline-block" }}>
                                    <button
                                        onClick={() => setShowPreview(false)}
                                        style={{
                                            position: "absolute", top: "5px", right: "5px", zIndex: 20,
                                            background: "rgba(0,0,0,0.5)", border: "none", color: "white",
                                            fontSize: "24px", borderRadius: "50%", width: "32px", height: "32px",
                                            cursor: "pointer", lineHeight: "1", display: "flex", alignItems: "center",
                                            justifyContent: "center", textShadow: "0 0 6px rgba(0,0,0,0.9)",
                                        }}
                                    >
                                        &times;
                                    </button>
                                    <img src={previewImage} alt="Preview" style={{ maxWidth: "70vw", maxHeight: "75vh", borderRadius: "8px", objectFit: "contain", display: "block", boxShadow: "0 10px 30px rgba(0,0,0,0.5)" }} />
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}

            {/* Video Preview Modal */}
            {showVideoPreview && (
                <>
                    <div className="modal-backdrop fade show" onClick={() => setShowVideoPreview(false)} style={{ zIndex: 1050 }} />
                    <div className="modal fade show d-block" onClick={() => setShowVideoPreview(false)} style={{ zIndex: 1060 }}>
                        <div className="modal-dialog modal-dialog-centered modal-lg" onClick={(e) => e.stopPropagation()}>
                            <div className="modal-content border-0 bg-transparent shadow-none position-relative d-flex flex-column align-items-center">
                                <div style={{ position: "relative", display: "inline-block" }}>
                                    <button
                                        onClick={() => setShowVideoPreview(false)}
                                        style={{
                                            position: "absolute", top: "-15px", right: "-15px", zIndex: 20,
                                            background: "white", border: "none", color: "black",
                                            fontSize: "24px", borderRadius: "50%", width: "32px", height: "32px",
                                            cursor: "pointer", lineHeight: "1", display: "flex", alignItems: "center",
                                            justifyContent: "center", boxShadow: "0 2px 8px rgba(0,0,0,0.5)",
                                        }}
                                    >
                                        &times;
                                    </button>
                                    <video src={previewVideo} controls autoPlay style={{ maxWidth: "70vw", maxHeight: "75vh", borderRadius: "12px", display: "block", boxShadow: "0 10px 40px rgba(0,0,0,0.6)", backgroundColor: "#000" }} />
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

const mapStateToProps = (state) => ({
    reel_report_all: state?.reel_report_all,
});

export default connect(mapStateToProps)(ReelReport);
