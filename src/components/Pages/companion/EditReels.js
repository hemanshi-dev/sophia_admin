import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import {
    UpdateReelAction,
    resetUpdateReel,
    GetAllCompanions,
    GetAllReels
} from "../../../store/action/useAction";
import { toast } from "react-toastify";
import DropZone from "../../common/DropZone";

const EditReels = ({ dispatch, companions_list, reels_list }) => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [videos, setVideos] = useState([]); // { type: 'existing'|'new', url, file }
    const [photo, setPhoto] = useState(null);         // new File | null
    const [existingPhoto, setExistingPhoto] = useState(null); // existing URL string
    const [photoPreview, setPhotoPreview] = useState(null);   // preview URL
    const [sound, setSound] = useState(false);
    const [description, setDescription] = useState("");
    const [gfid, setGfid] = useState("");
    const [eyeshow, setEyeshow] = useState(true);
    const [loading, setLoading] = useState(false);
    const [isInitialLoaded, setIsInitialLoaded] = useState(false);
    
    // Modal states
    const [previewUrl, setPreviewUrl] = useState(null);
    const [previewType, setPreviewType] = useState(null); // 'image' or 'video'
    const [showPreview, setShowPreview] = useState(false);

    // Load data
    useEffect(() => {
        if (!companions_list?.isLoaded) {
            dispatch(GetAllCompanions(() => { }));
        }
        if (!reels_list?.isLoaded) {
            dispatch(GetAllReels(() => { }));
        }
    }, [dispatch, companions_list?.isLoaded, reels_list?.isLoaded]);

    // Populate form from existing reel
    useEffect(() => {
        const reelsData = Array.isArray(reels_list?.data) ? reels_list.data : [];
        if (!reelsData.length || isInitialLoaded) return;

        const reel = reelsData.find((item) => (item.id || item._id) === id);
        if (reel) {
            setGfid(reel.gfid || "");
            setDescription(reel.description || "");
            setSound(
                reel.sound === true ||
                reel.sound === "true" ||
                reel.sound === 1
            );
            setEyeshow(
                reel.eyeshow === true ||
                reel.eyeshow === "true" ||
                reel.eyeshow === 1
            );

            // Existing videos
            if (reel.video) {
                const videoUrls = Array.isArray(reel.video) ? reel.video : [reel.video];
                setVideos(videoUrls.map((url) => ({ type: "existing", url, file: null })));
            }

            // Existing photo
            if (reel.photo) {
                setExistingPhoto(reel.photo);
                setPhotoPreview(reel.photo);
            }

            setIsInitialLoaded(true);
        }
    }, [reels_list, id, isInitialLoaded]);

    // Cleanup object URLs on unmount
    useEffect(() => {
        return () => {
            dispatch(resetUpdateReel());
            videos.forEach((v) => {
                if (v.type === "new") URL.revokeObjectURL(v.url);
            });
            if (photo && photoPreview && photoPreview !== existingPhoto) {
                URL.revokeObjectURL(photoPreview);
            }
        };
    }, [dispatch]); // eslint-disable-line react-hooks/exhaustive-deps

    // ── Video handlers ──
    const handleVideoChange = (e) => {
        if (e.target.files) {
            const selectedFiles = Array.from(e.target.files);
            const newItems = selectedFiles.map((file) => ({
                type: "new",
                url: URL.createObjectURL(file),
                file,
            }));
            setVideos(newItems);
            e.target.value = "";
        }
    };

    const removeVideo = (index) => {
        setVideos((prev) =>
            prev.filter((v, i) => {
                if (i === index && v.type === "new") URL.revokeObjectURL(v.url);
                return i !== index;
            })
        );
    };

    // ── Photo handlers ──
    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        // revoke previous blob if it was a new one
        if (photo && photoPreview && photoPreview !== existingPhoto) {
            URL.revokeObjectURL(photoPreview);
        }
        setPhoto(file);
        setPhotoPreview(URL.createObjectURL(file));
        e.target.value = "";
    };

    const removePhoto = () => {
        if (photo && photoPreview && photoPreview !== existingPhoto) {
            URL.revokeObjectURL(photoPreview);
        }
        setPhoto(null);
        setExistingPhoto(null);
        setPhotoPreview(null);
    };

    const openPreview = (url, type) => {
        setPreviewUrl(url);
        setPreviewType(type);
        setShowPreview(true);
    };

    // ── Submit ──
    const handleSubmit = async () => {
        if (!gfid) { toast.error("Please select a companion"); return; }
        if (videos.length === 0) { toast.error("Please add at least one video"); return; }
        if (!photoPreview) { toast.error("Please select a cover photo"); return; }

        const formData = new FormData();
        formData.append("gfid", gfid);
        formData.append("description", description);
        formData.append("sound", String(sound));
        formData.append("eyeshow", String(eyeshow));

        // New video files
        videos.forEach((v) => {
            if (v.type === "new" && v.file) formData.append("video", v.file);
        });
        // Existing video URLs to keep
        // videos.forEach((v) => {
        //     if (v.type === "existing") formData.append("existing_videos", v.url);
        // });

        // Photo
        if (photo) {
            formData.append("photo", photo);             // new file
        }

        try {
            const result = await dispatch(UpdateReelAction(id, formData, setLoading));
            if (result) {
                toast.success("Reel updated successfully!");
                navigate("/reels-list");
            } else {
                toast.error("Failed to update reel");
            }
        } catch (error) {
            console.error("Error updating reel:", error);
            toast.error("An error occurred while updating reel");
        }
    };

    const isFormComplete = videos.length > 0 && gfid && description.trim() && photoPreview;

    return (
        <div className="main-content">
            <div className="row">
                <div className="col-lg-12">
                    <div className="card stretch stretch-full">
                        <div className="card-header">
                            <h5 className="card-title">Edit Reel</h5>
                        </div>
                        <div className="card-body pt-4">

                            <div className="row">
                                {/* ── Companion (GFID) ── */}
                                <div className="col-md-4 mb-3 d-flex flex-column">
                                    <label className="form-label">Select GirlFriend (GFID)</label>
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

                                {/* ── Videos ── */}
                                <div className="col-md-4 mb-3">
                                    <label className="form-label">
                                        Videos{" "}
                                        {videos.length > 0 && (
                                            <span className="badge bg-primary ms-1">{videos.length} total</span>
                                        )}
                                    </label>
                                    <DropZone
                                        label="Upload Videos"
                                        accept="video/*"
                                        multiple={false}
                                        onChange={handleVideoChange}
                                        disabled={loading}
                                        previewImages={videos.map(vid => vid.url)}
                                        onRemoveImage={(idx) => removeVideo(idx)}
                                        previewWidth={100}
                                        previewHeight={100}
                                        isVideo={true}
                                    />
                                </div>

                                {/* ── Cover Photo ── */}
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
                                            id="soundToggleEdit"
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
                                            id="eyeToggleEdit"
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
                                    onClick={() => navigate("/reels")}
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
                                            Updating...
                                        </>
                                    ) : (
                                        "Update Reel"
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
    reels_list: state?.reels_list,
});

export default connect(mapStateToProps)(EditReels);
