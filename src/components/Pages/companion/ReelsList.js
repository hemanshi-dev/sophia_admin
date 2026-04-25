import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { connect } from "react-redux";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Loader from "../../common/Loader";
import { GetAllReels, DeleteReelAction, UpdateReelOrder, ReelEyeShowAction, SetReelsPagination } from "../../../store/action/useAction";
import { Edit, Trash2, Volume2, VolumeX, Play, ArrowUp, ArrowDown, Eye, EyeOff } from "react-feather";
import DeleteModal from "../../common/DelereReels";

const ReelsList = ({ dispatch, reels_list }) => {
    const [loading, setLoading] = useState(false);
    const [deletingId, setDeletingId] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [previewImage, setPreviewImage] = useState(null);
    const [showPreview, setShowPreview] = useState(false);
    const [previewVideo, setPreviewVideo] = useState(null);
    const [showVideoPreview, setShowVideoPreview] = useState(false);
    const [currentPage, setCurrentPage] = useState(reels_list?.page || 1);
    const [rowsPerPage, setRowsPerPage] = useState(reels_list?.rowsPerPage || 10);
    const [eyeLoadingId, setEyeLoadingId] = useState(null);
    const [orderLoadingId, setOrderLoadingId] = useState(null);
    const navigate = useNavigate();

    const fetchReels = React.useCallback(() => {
        dispatch(GetAllReels(setLoading)).catch(() => {
            toast.error("Failed to load reels");
        });
    }, [dispatch]);

    useEffect(() => {
        if (!reels_list?.isLoaded) {
            fetchReels();
        }
    }, [fetchReels, reels_list?.isLoaded]);

    // const handleDelete = async (row) => {
    //     const reelId = row.id || row._id;
    //     if (!window.confirm("Are you sure you want to delete this reel? This action cannot be undone.")) return;
    //     setDeletingId(reelId);
    //     try {
    //         await dispatch(DeleteReelAction(reelId, () => { }));
    //         toast.success("Reel deleted successfully!");
    //         fetchReels();
    //     } catch (err) {
    //         console.error(err);
    //         toast.error("Failed to delete reel");
    //     } finally {
    //         setDeletingId(null);
    //     }
    // };

    const handleDeleteClick = (id) => {
        setDeletingId(id);
        setShowDeleteModal(true);
    };

    const openPreview = (img) => {
        setPreviewImage(img);
        setShowPreview(true);
    };

    const openVideoPreview = (url) => {
        setPreviewVideo(url);
        setShowVideoPreview(true);
    };

    const handleOrderDirection = async (id, direction) => {
        setOrderLoadingId(`${id}_${direction}`);
        try {
            const result = await dispatch(UpdateReelOrder(id, direction, () => { }));
            if (result && result.success !== false) {
                toast.success(result.message || "Order updated successfully");
                // Handled in Redux or refetch without the main table loader
                dispatch(GetAllReels(() => { })); 
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

    const handleEyeShow = async (id, currentStatus) => {
        const nextStatus = !currentStatus;
        setEyeLoadingId(id);
        try {
            const result = await dispatch(ReelEyeShowAction(id, nextStatus, () => { }));
            if (result && result.success !== false) {
                toast.success(`Reel ${nextStatus ? "visible" : "hidden"} successfully`);
            } else {
                toast.error(result?.message || "Failed to update visibility");
            }
        } catch (error) {
            console.error("Visibility update error:", error);
            toast.error("An error occurred while updating visibility");
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
        },
        {
            name: "Companion ID",
            selector: (row) => row.gfid || "N/A",
            sortable: true,
            center: true,
            wrap: true,
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
                            maxWidth: "260px",
                        }}
                    >
                        {videoUrls.map((url, i) => (
                            <div
                                key={i}
                                style={{
                                    position: "relative",
                                    flexShrink: 0,
                                    cursor: "pointer",
                                    width: "56px",
                                    height: "56px"
                                }}
                                onClick={() => openVideoPreview(url)}
                            >
                                <video
                                    src={url}
                                    width="56"
                                    height="56"
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
                                    <Play size={14} fill="currentColor" color="white" />
                                </div>
                                <span
                                    style={{
                                        position: "absolute", bottom: "2px", right: "2px",
                                        background: "rgba(0,0,0,0.65)", color: "#fff",
                                        fontSize: "8px", padding: "1px 3px", borderRadius: "3px", lineHeight: 1,
                                        zIndex: 5
                                    }}
                                >
                                    {i + 1}
                                </span>
                            </div>
                        ))}
                        {videoUrls.length > 1 && (
                            <span
                                style={{
                                    background: "#0d6efd", color: "#fff",
                                    borderRadius: "12px", padding: "2px 8px",
                                    fontSize: "11px", fontWeight: 600, flexShrink: 0,
                                }}
                            >
                                {videoUrls.length} clips
                            </span>
                        )}
                        {videoUrls.length === 0 && (
                            <span className="text-muted" style={{ fontSize: "12px" }}>No videos</span>
                        )}
                    </div>
                );
            },
            center: true,
            width: "300px",
        },
        {
            name: "Sound",
            cell: (row) => {
                const hasSound = row.sound === true || row.sound === "true" || row.sound === 1;
                return hasSound
                    ? <Volume2 size={18} color="#198754" />
                    : <VolumeX size={18} color="#aaa" />;
            },
            center: true,
            width: "90px",
        },
        {
            name: "Description",
            selector: (row) => row.description || "N/A",
            sortable: true,
            center: true,
            width: "200px",
            cell: (row) => {
                const text = row.description || "N/A";
                return (
                    <div
                        title={text}
                        style={{
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                            width: "180px",
                            cursor: "default",
                        }}
                    >
                        {text}
                    </div>
                );
            },
        },
        {
            name: "Actions",
            button: true,
            center: true,
            cell: (row) => {
                const reelId = row.id || row._id;
                return (
                    <div className="d-flex gap-2 justify-content-center flex-wrap">
                        <button
                            type="button"
                            className="btn btn-outline-info p-2"
                            title="Move Up"
                            disabled={!!orderLoadingId}
                            onClick={() => handleOrderDirection(reelId, "up")}
                        >
                            {orderLoadingId === `${reelId}_up` ? <span className="spinner-border spinner-border-sm" /> : <ArrowUp size={15} />}
                        </button>
                        <button
                            type="button"
                            className="btn btn-outline-info p-2"
                            title="Move Down"
                            disabled={!!orderLoadingId}
                            onClick={() => handleOrderDirection(reelId, "down")}
                        >
                            {orderLoadingId === `${reelId}_down` ? <span className="spinner-border spinner-border-sm" /> : <ArrowDown size={15} />}
                        </button>
                        <button
                            type="button"
                            className="btn p-2"
                            title={row.eyeshow ? "Hide Reel" : "Show Reel"}
                            style={{
                                border: "1.5px solid rgb(111, 66, 193)",
                                color: "rgb(111, 66, 193)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center"
                            }}
                            disabled={eyeLoadingId === reelId}
                            onClick={() => handleEyeShow(reelId, row.eyeshow)}
                        >
                            {eyeLoadingId === reelId ? <span className="spinner-border spinner-border-sm" /> : (row.eyeshow ? <Eye size={15} /> : <EyeOff size={15} />)}
                        </button>
                        <button
                            type="button"
                            className="btn btn-outline-primary p-2"
                            title="Edit"
                            onClick={() => navigate(`/reels-edit/${reelId}`)}
                        >
                            <Edit size={15} />
                        </button>
                        <button
                            type="button"
                            className="btn btn-outline-danger p-2"
                            title="Delete"
                            disabled={deletingId === reelId}
                            onClick={() => handleDeleteClick(reelId)}
                        >
                            {deletingId === reelId
                                ? <span className="spinner-border spinner-border-sm" />
                                : <Trash2 size={15} />
                            }
                        </button>
                    </div>
                );
            },
            width: "260px",
        },
    ];

    // reels_list.data is now a plain normalised array
    const reels = Array.isArray(reels_list?.data) 
        ? [...reels_list.data].sort((a, b) => (b.epoch || 0) - (a.epoch || 0))
        : [];

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
                {/* <h3 className="mb-0">Reels List</h3> */}
                {/* <button className="btn btn-primary" onClick={() => navigate("/reels-add")}>
                    Add Reel
                </button> */}
            </div>
            <div className="card">
                <div className="card-body p-0">
                    <div style={{ overflowX: "auto", width: "100%" }}>
                        <div style={{ minWidth: "900px" }}>
                        <DataTable
                            title="Reels"
                            columns={columns}
                            data={reels}
                            progressPending={loading}
                            progressComponent={<Loader />}
                            pagination
                            paginationDefaultPage={currentPage}
                            paginationPerPage={rowsPerPage}
                            paginationRowsPerPageOptions={[10, 30, 50, 100]}
                            onChangePage={(page) => {
                                setCurrentPage(page);
                                dispatch(SetReelsPagination(page, rowsPerPage));
                            }}
                            onChangeRowsPerPage={(newRowsPerPage, page) => {
                                setRowsPerPage(newRowsPerPage);
                                setCurrentPage(page);
                                dispatch(SetReelsPagination(page, newRowsPerPage));
                            }}
                            customStyles={customStyles}
                            noDataComponent={
                                <div className="py-5 text-center text-muted">No reels found. Click "Add Reel" to create one.</div>
                            }
                        />
                        </div>
                    </div>
                </div>
            </div>
            <DeleteModal
                show={showDeleteModal}
                onHide={() => {
                    setShowDeleteModal(false);
                    setDeletingId(null);
                }}
                id={deletingId}
            />

            {/* Image Preview Modal */}
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
                                <div style={{ position: "relative", display: "inline-block" }}>
                                    <button
                                        onClick={() => setShowPreview(false)}
                                        style={{
                                            position: "absolute",
                                            top: "5px",
                                            right: "5px",
                                            zIndex: 20,
                                            background: "rgba(0,0,0,0.5)",
                                            border: "none",
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
                                            textShadow: "0 0 6px rgba(0,0,0,0.9)",
                                        }}
                                    >
                                        &times;
                                    </button>
                                    <img
                                        src={previewImage}
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
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}
            {/* Video Preview Modal */}
            {showVideoPreview && (
                <>
                    <div
                        className="modal-backdrop fade show"
                        onClick={() => setShowVideoPreview(false)}
                        style={{ zIndex: 1050 }}
                    />
                    <div
                        className="modal fade show d-block"
                        onClick={() => setShowVideoPreview(false)}
                        style={{ zIndex: 1060 }}
                    >
                        <div
                            className="modal-dialog modal-dialog-centered modal-lg"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="modal-content border-0 bg-transparent shadow-none position-relative d-flex flex-column align-items-center">
                                <div style={{ position: "relative", display: "inline-block" }}>
                                    <button
                                        onClick={() => setShowVideoPreview(false)}
                                        style={{
                                            position: "absolute",
                                            top: "-15px",
                                            right: "-15px",
                                            zIndex: 20,
                                            background: "white",
                                            border: "none",
                                            color: "black",
                                            fontSize: "24px",
                                            borderRadius: "50%",
                                            width: "32px",
                                            height: "32px",
                                            cursor: "pointer",
                                            lineHeight: "1",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            boxShadow: "0 2px 8px rgba(0,0,0,0.5)",
                                        }}
                                    >
                                        &times;
                                    </button>
                                    <video
                                        src={previewVideo}
                                        controls
                                        autoPlay
                                        style={{
                                            maxWidth: "70vw",
                                            maxHeight: "75vh",
                                            borderRadius: "12px",
                                            display: "block",
                                            boxShadow: "0 10px 40px rgba(0,0,0,0.6)",
                                            backgroundColor: "#000"
                                        }}
                                    />
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
    reels_list: state?.reels_list,
});

export default connect(mapStateToProps)(ReelsList);
