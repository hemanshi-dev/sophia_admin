import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import {
    AddReelAction,
    resetAddReel,
    GetAllCompanions,
} from "../../../store/action/useAction";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { Play } from "react-feather";
import DropZone from "../../common/DropZone";

const AddReels = ({ dispatch, companions_list }) => {
    const [videos, setVideos] = useState([]);
    const [videoPreviews, setVideoPreviews] = useState([]);
    const [photo, setPhoto] = useState(null);
    const [photoPreview, setPhotoPreview] = useState(null);
    const [sound, setSound] = useState(false);
    const [description, setDescription] = useState("");
    const [gfid, setGfid] = useState("");
    const [eyeshow, setEyeshow] = useState(false);
    const [loading, setLoading] = useState(false);
    
    // Unified Modal states
    const [previewUrl, setPreviewUrl] = useState(null);
    const [previewType, setPreviewType] = useState(null); // 'image' or 'video'
    const [showPreview, setShowPreview] = useState(false);
    
    const navigate = useNavigate();

    // Load companions for selection
    useEffect(() => {
        dispatch(GetAllCompanions(() => { }));
    }, [dispatch]);

    // Reset state on unmount
    useEffect(() => {
        return () => {
            dispatch(resetAddReel());
            videoPreviews.forEach((url) => URL.revokeObjectURL(url));
            if (photoPreview) URL.revokeObjectURL(photoPreview);
        };
    }, [dispatch]); // eslint-disable-line react-hooks/exhaustive-deps

    // --- Video handlers ---
    const handleVideoChange = (e) => {
        if (e.target.files) {
            const selectedFiles = Array.from(e.target.files);
            setVideos((prev) => [...prev, ...selectedFiles]);
            const newPreviews = selectedFiles.map((f) => URL.createObjectURL(f));
            setVideoPreviews((prev) => [...prev, ...newPreviews]);
            e.target.value = "";
        }
    };

    const removeVideo = (index) => {
        URL.revokeObjectURL(videoPreviews[index]);
        setVideos((prev) => prev.filter((_, i) => i !== index));
        setVideoPreviews((prev) => prev.filter((_, i) => i !== index));
    };



    // --- Photo handlers ---
    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        if (photoPreview) URL.revokeObjectURL(photoPreview);
        setPhoto(file);
        setPhotoPreview(URL.createObjectURL(file));
        e.target.value = "";
    };

    const removePhoto = () => {
        if (photoPreview) URL.revokeObjectURL(photoPreview);
        setPhoto(null);
        setPhotoPreview(null);
    };

    const openPreview = (url, type) => {
        setPreviewUrl(url);
        setPreviewType(type);
        setShowPreview(true);
    };

    // --- Submit ---
    const handleSubmit = async () => {
        if (!gfid) {
            toast.error("Please select a companion");
            return;
        }
        if (videos.length === 0) {
            toast.error("Please select at least one video");
            return;
        }
        if (!photo) {
            toast.error("Please select a cover photo");
            return;
        }

        const formData = new FormData();
        formData.append("gfid", gfid);
        formData.append("description", description);
        formData.append("sound", String(sound));   // backend expects "true" / "false"
        formData.append("eyeshow", String(eyeshow));
        formData.append("photo", photo);

        videos.forEach((file) => {
            formData.append("video", file);
        });

        try {
            const result = await dispatch(AddReelAction(formData, setLoading));
            if (result) {
                toast.success("Reel added successfully!");
                resetForm();
                setTimeout(() => navigate("/reels-list"), 500);
            } else {
                toast.error("Failed to add reel");
            }
        } catch (error) {
            console.error("Error adding reel:", error);
            toast.error("An error occurred while adding reel");
        }
    };

    const resetForm = () => {
        videoPreviews.forEach((url) => URL.revokeObjectURL(url));
        if (photoPreview) URL.revokeObjectURL(photoPreview);
        setVideos([]);
        setVideoPreviews([]);
        setPhoto(null);
        setPhotoPreview(null);
        setSound(false);
        setEyeshow(true);
        setDescription("");
        setGfid("");
    };

    const handleCancel = () => {
        resetForm();
        navigate("/reels-list");
    };

    const isFormComplete = videos.length > 0 && gfid && photo;

    return (
        <div className="main-content">
            <div className="row">
                <div className="col-lg-12">
                    <div className="card stretch stretch-full">
                        <div className="card-header">
                            <h5 className="card-title">Add New Reel</h5>
                        </div>
                        <div className="card-body pt-4">

                            <div className="row">
                                {/* ── Companion (GFID) ── */}
                                <div className="col-md-4 mb-3 d-flex flex-column">
                                    <label className="form-label">Select Companion (GFID)</label>
                                    <div className="flex-grow-1 d-flex align-items-start">
                                        <select
                                            className="form-control"
                                            value={gfid}
                                            onChange={(e) => setGfid(e.target.value)}
                                            disabled={loading}
                                        >
                                            <option value="">Select GirlFriend</option>
                                            {Array.isArray(companions_list?.data) &&
                                                companions_list.data.map((companion) => (
                                                    <option
                                                        key={companion._id || companion.id}
                                                        value={companion._id || companion.id}
                                                    >
                                                        {companion.name || companion.id || companion._id}
                                                    </option>
                                                ))}
                                        </select>
                                    </div>
                                </div>

                                {/* ── Videos (multiple) ── */}
                                <div className="col-md-4 mb-3">
                                    <label className="form-label">
                                        Videos{" "}
                                        {videos.length > 0 && (
                                            <span className="badge bg-primary ms-1">{videos.length} selected</span>
                                        )}
                                    </label>
                                    <DropZone
                                        label="Upload Videos"
                                        accept="video/*"
                                        multiple
                                        onChange={handleVideoChange}
                                        disabled={loading}
                                        previewImages={videoPreviews}
                                        onRemoveImage={(idx) => removeVideo(idx)}
                                        previewWidth={100}
                                        previewHeight={100}
                                        isVideo={true}
                                    />
                                </div>

                                {/* ── Cover Photo (single) ── */}
                                <div className="col-md-4 mb-3">
                                    <label className="form-label">Cover Photo</label>
                                    <DropZone
                                        label="Upload Cover Photo"
                                        accept="image/*"
                                        multiple={false}
                                        onChange={handlePhotoChange}
                                        disabled={loading}
                                        previewImages={photoPreview ? [photoPreview] : []}
                                        onRemoveImage={() => removePhoto()}
                                        previewWidth={100}
                                        previewHeight={100}
                                    />
                                </div>
                            </div>

                            <div className="row mb-4 align-items-center">
                                {/* ── Sound toggle ── */}
                                <div className="col-auto d-flex align-items-center gap-3 me-5">
                                    <label className="form-label mb-0 fw-semibold" style={{ minWidth: '60px' }}>Sound</label>
                                    <div className="form-check form-switch p-0 m-0 d-flex align-items-center">
                                        <input
                                            className="form-check-input ms-0"
                                            type="checkbox"
                                            id="soundToggle"
                                            checked={sound}
                                            onChange={(e) => setSound(e.target.checked)}
                                            disabled={loading}
                                            style={{ cursor: "pointer", width: "40px", height: "20px" }}
                                        />
                                        <span className="ms-2 text-muted small" style={{ minWidth: '70px' }}>
                                            {sound ? "Sound ON" : "Sound OFF"}
                                        </span>
                                    </div>
                                </div>

                                {/* ── EyeShow toggle ── */}
                                <div className="col-auto d-flex align-items-center gap-3">
                                    <label className="form-label mb-0 fw-semibold" style={{ minWidth: '70px' }}>Eye Show</label>
                                    <div className="form-check form-switch p-0 m-0 d-flex align-items-center">
                                        <input
                                            className="form-check-input ms-0"
                                            type="checkbox"
                                            id="eyeToggle"
                                            checked={eyeshow}
                                            onChange={(e) => setEyeshow(e.target.checked)}
                                            disabled={loading}
                                            style={{ cursor: "pointer", width: "40px", height: "20px" }}
                                        />
                                        <span className="ms-2 text-muted small" style={{ minWidth: '60px' }}>
                                            {eyeshow ? "Visible" : "Hidden"}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="mb-4">
                                <label className="form-label">Description</label>
                                <textarea
                                    className="form-control"
                                    rows="8"
                                    placeholder="Enter Reel Description"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    disabled={loading}
                                />
                            </div>

                            {/* ── Actions ── */}
                            <div className="d-flex justify-content-end gap-2 mt-3">
                                <button
                                    className="btn btn-md bg-soft-danger text-danger"
                                    onClick={handleCancel}
                                    disabled={loading}
                                >
                                    Cancel
                                </button>
                                <button
                                    className="btn btn-md btn-primary"
                                    onClick={handleSubmit}
                                    disabled={!isFormComplete || loading}
                                >
                                    {loading ? (
                                        <>
                                            <span
                                                className="spinner-border spinner-border-sm me-2"
                                                role="status"
                                                aria-hidden="true"
                                            />
                                            Adding...
                                        </>
                                    ) : (
                                        "Add Reel"
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {showPreview && (
                <>
                    <div
                        className="modal-backdrop fade show"
                        onClick={() => setShowPreview(false)}
                        style={{ zIndex: 1050 }}
                    />
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
                                            top: '-7px',
                                            right: '0px',
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
                                    {previewType === 'video' ? (
                                        <video
                                            src={previewUrl}
                                            controls
                                            autoPlay
                                            style={{
                                                maxWidth: "100%",
                                                maxHeight: "90vh",
                                                borderRadius: "8px",
                                                boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
                                                display: "block",
                                                backgroundColor: '#000'
                                            }}
                                        />
                                    ) : (
                                        <img
                                            src={previewUrl}
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
                                    )}
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
    companions_list: state?.companions_list,
    reel: state?.reel,
});

export default connect(mapStateToProps)(AddReels);
