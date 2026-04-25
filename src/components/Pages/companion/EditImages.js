import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import DropZone from "../../common/DropZone";

const EditImages = ({ dispatch, companions_list }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const existingData = location.state || {}; // Pass previous data via navigate state

  const [loading, setLoading] = useState(false);
  const [newImages, setNewImages] = useState([]);         // newly added File objects
  const [prevImages, setPrevImages] = useState(           // previously saved image URLs
    existingData.images || []
  );
  const [removedPrevImages, setRemovedPrevImages] = useState([]); // track removed old images
  const [prompt, setPrompt] = useState(existingData.prompt || "");

  const handleNewImages = (e) => {
    const files = Array.from(e.target.files);
    setNewImages((prev) => [...prev, ...files]);
  };

  const handleRemovePrevImage = (url) => {
    setRemovedPrevImages((prev) => [...prev, url]);
    setPrevImages((prev) => prev.filter((img) => img !== url));
  };

  const handleRemoveNewImage = (idx) => {
    setNewImages((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = async () => {
    if (prevImages.length === 0 && newImages.length === 0) {
      toast.error("Please select at least one image.");
      return;
    }
    if (!prompt.trim()) {
      toast.error("Please enter a prompt.");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      newImages.forEach((file) => formData.append("images", file));
      formData.append("prompt", prompt);
      formData.append("removedImages", JSON.stringify(removedPrevImages));
      formData.append("existingImages", JSON.stringify(prevImages));

      // dispatch your API action here
      // await dispatch(editCompanionImages(existingData.id, formData));

      toast.success("Images updated successfully!");
      navigate(-1);
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-wrapper">
      <div className="content container-fluid">

        {/* Form Card */}
        <div className="card mt-5">
          <div className="card-body">

            {/* Image Upload */}
            <div className="form-group mb-4">
              <label className="form-label fw-semibold">
                Images{" "}
                {(prevImages.length > 0 || newImages.length > 0) && (
                  <span className="badge bg-primary ms-1">{prevImages.length + newImages.length} total</span>
                )}
              </label>
              <DropZone
                label="Upload New Images"
                accept="image/*"
                multiple
                onChange={handleNewImages}
                disabled={loading}
                previewImages={[...prevImages, ...newImages.map(file => URL.createObjectURL(file))]}
                onRemoveImage={(idx) => {
                  if (idx < prevImages.length) {
                    handleRemovePrevImage(prevImages[idx]);
                  } else {
                    handleRemoveNewImage(idx - prevImages.length);
                  }
                }}
                previewWidth={80}
                previewHeight={80}
              />
            </div>

            {/* Prompt */}
            <div className="form-group mb-4">
              <label className="form-label fw-semibold">Prompt</label>
              <textarea
                className="form-control"
                rows={5}
                placeholder="Enter your prompt here..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
              />
            </div>

            {/* Edit Button */}
            <div className="text-end">
              <button
                className="btn btn-primary px-4"
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm me-2"
                      role="status"
                    />
                    Updating...
                  </>
                ) : (
                  "Edit"
                )}
              </button>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  companions_list: state.companions_list,
});

export default connect(mapStateToProps)(EditImages);