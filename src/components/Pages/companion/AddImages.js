import React, { useState } from "react";
import { connect } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { GetAllCompanions, UploadGalleryImages } from "../../../store/action/useAction";
import DropZone from "../../common/DropZone";

const AddImages = ({ dispatch, companions_list }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState([]);
  const [prompt, setPrompt] = useState("");
  const [selectedGf, setSelectedGf] = useState(id || "");

  React.useEffect(() => {
    if (!companions_list?.isLoaded) {
      dispatch(GetAllCompanions(() => {}));
    }
  }, [dispatch, companions_list?.isLoaded]);

  React.useEffect(() => {
    if (id) {
      setSelectedGf(id);
    }
  }, [id]);

  const handleImages = (e) => {
    const files = Array.from(e.target.files);
    setImages((prev) => [...prev, ...files]);
  };

  const handleSubmit = async () => {
    if (!selectedGf) {
      toast.error("Please select a companion.");
      return;
    }

    if (images.length === 0) {
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
      images.forEach((file) => formData.append("files", file));
      formData.append("prompts", prompt.trim());

      const response = await dispatch(UploadGalleryImages(selectedGf, formData));

      if (response?.success) {
        toast.success(response.message || "Images added successfully!");
         navigate(`/companion/images/view/${selectedGf}`);
      } else {
        toast.error(response?.message || "Something went wrong.");
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-wrapper">
      <div className="content container-fluid" style={{ paddingTop: '5px' }}>
        <div className="card" style={{ marginTop: '5px' }}>
          <div className="card-header bg-white d-flex justify-content-between align-items-center py-3" style={{ borderBottom: '1px solid #f0f0f0' }}>
            <h4 className="card-title mb-0">Add Gallery Images</h4>
            <button 
              className="btn btn-outline-primary btn-sm"
              onClick={() => navigate(selectedGf ? `/companion/edit/${selectedGf}` : "/companion/images/view")}
            >
              {selectedGf ? "Back To Edit" : "Back To List"}
            </button>
          </div>
           <div className="card-body">
              <div className="form-group mb-4">
                <label className="form-label fw-semibold">Select Companion</label>
                <select
                  className="form-control"
                  value={selectedGf}
                  onChange={(e) => setSelectedGf(e.target.value)}
                  disabled={!!id || loading}
                >
                  <option value="">-- Select Companion --</option>
                  {Array.isArray(companions_list?.data) &&
                    companions_list.data.map((companion) => (
                      <option key={companion.id || companion._id} value={companion.id || companion._id}>
                        {companion.name} ({companion.id || companion._id})
                      </option>
                    ))}
                </select>
              </div>

            {/* Image Upload */}
            <div className="form-group mb-4">
              <label className="form-label fw-semibold">
                Images{" "}
                {images.length > 0 && (
                  <span className="badge bg-primary ms-1">{images.length} selected</span>
                )}
              </label>
              <DropZone
                label="Upload Images"
                accept="image/*"
                multiple
                onChange={handleImages}
                disabled={loading}
                previewImages={images.map((file) => URL.createObjectURL(file))}
                onRemoveImage={(idx) => setImages((prev) => prev.filter((_, i) => i !== idx))}
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

            {/* Add Button */}
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
                    Adding...
                  </>
                ) : (
                  "Add"
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

export default connect(mapStateToProps)(AddImages);