import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { connect } from "react-redux";
import {
  GetAllCompanions,
  UpdateCompanionData,
  resetUpdateCompanion,
} from "../../../store/action/useAction";
import DropZone from "../../common/DropZone";

const EditCompanion = ({ dispatch, companions_list, update_companion }) => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [prompt, setPrompt] = useState("");
  const [description, setDescription] = useState("");
  const [age, setAge] = useState("");
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");

  const [androidImages, setAndroidImages] = useState([]); 
  const [iosImages, setIosImages] = useState([]);
  
  const [loading, setLoading] = useState(false);
  const fileInputRef = React.useRef(null);
  const [replaceIndex, setReplaceIndex] = useState(null);
  const [replaceType, setReplaceType] = useState(null); // 'android' or 'ios'
  const [isInitialLoaded, setIsInitialLoaded] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [showPreview, setShowPreview] = useState(false);

  // Reset update state on unmount
  useEffect(() => {
    return () => {
      dispatch(resetUpdateCompanion());
      [...androidImages, ...iosImages].forEach((img) => {
        if (img.type === "new") URL.revokeObjectURL(img.url);
      });
    };
  }, [dispatch, androidImages, iosImages]); // eslint-disable-line react-hooks/exhaustive-deps

  // Fetch all companions
  useEffect(() => {
    if (!companions_list?.isLoaded) {
      dispatch(GetAllCompanions(setLoading)).catch(() =>
        toast.error("Failed to load companions")
      );
    }
  }, [dispatch, companions_list?.isLoaded]);

  // Set initial form fields
  useEffect(() => {
    const companionsData = Array.isArray(companions_list?.data)
      ? companions_list.data
      : companions_list?.data?.data;

    if (!companionsData || isInitialLoaded) return;

    // loose equality for id match
    // eslint-disable-next-line eqeqeq
    const companion = companionsData.find((item) => (item.id || item._id) == id);

    if (companion) {
      setName(companion.name || "");
      setPrompt(companion.system_prompt || companion.prompt || "");
      setDescription(companion.description || "");
      setAge(companion.age || "");
      let rawTags = companion.tags;
      if (rawTags) {
        if (Array.isArray(rawTags)) {
          setTags(rawTags);
        } else if (typeof rawTags === "string") {
          try {
            const parsed = JSON.parse(rawTags);
            setTags(Array.isArray(parsed) ? parsed : [parsed]);
          } catch (e) {
            // Not valid JSON, split by comma
            setTags(rawTags.split(",").map(t => t.trim()).filter(t => t !== ""));
          }
        }
      } else {
        setTags([]);
      }

      // Handle android images
      if (companion.android_images && Array.isArray(companion.android_images)) {
        setAndroidImages(companion.android_images.map(url => ({ type: 'existing', url, file: null })));
      } else if (companion.filename) {
        setAndroidImages([{ type: 'existing', url: companion.filename, file: null }]);
      }

      // Handle ios images
      if (companion.ios_images && Array.isArray(companion.ios_images)) {
        setIosImages(companion.ios_images.map(url => ({ type: 'existing', url, file: null })));
      } else if (companion.image) {
        setIosImages([{ type: 'existing', url: companion.image, file: null }]);
      }

      setIsInitialLoaded(true);
    } else {
      if (!loading && companionsData.length > 0) {
        toast.error("Companion not found");
      }
    }
  }, [companions_list, id, loading]);

  const handleImageChange = (e, type) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFiles = Array.from(e.target.files);

      if (replaceIndex !== null && replaceType === type) {
        // Replacement logic
        const file = selectedFiles[0];
        const newUrl = URL.createObjectURL(file);

        if (type === "android") {
          const updatedImages = [...androidImages];
          if (updatedImages[replaceIndex].type === 'new') {
            URL.revokeObjectURL(updatedImages[replaceIndex].url);
          }
          updatedImages[replaceIndex] = { type: 'new', url: newUrl, file };
          setAndroidImages(updatedImages);
        } else {
          const updatedImages = [...iosImages];
          if (updatedImages[replaceIndex].type === 'new') {
            URL.revokeObjectURL(updatedImages[replaceIndex].url);
          }
          updatedImages[replaceIndex] = { type: 'new', url: newUrl, file };
          setIosImages(updatedImages);
        }
        setReplaceIndex(null);
        setReplaceType(null);
      } else {
        // Normal append logic
        const newItems = selectedFiles.map(file => ({
          type: 'new',
          url: URL.createObjectURL(file),
          file
        }));
        if (type === "android") {
          setAndroidImages([...androidImages, ...newItems]);
        } else {
          setIosImages([...iosImages, ...newItems]);
        }
      }
      e.target.value = "";
    }
  };

  const removeImage = (index, type) => {
    if (type === "android") {
      const updatedImages = androidImages.filter((_, i) => {
        if (i === index && androidImages[i].type === 'new') {
          URL.revokeObjectURL(androidImages[i].url);
        }
        return i !== index;
      });
      setAndroidImages(updatedImages);
    } else {
      const updatedImages = iosImages.filter((_, i) => {
        if (i === index && iosImages[i].type === 'new') {
          URL.revokeObjectURL(iosImages[i].url);
        }
        return i !== index;
      });
      setIosImages(updatedImages);
    }
  };

  const triggerReplace = (index, type) => {
    setReplaceIndex(index);
    setReplaceType(type);
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const openPreview = (url) => {
    setPreviewImage(url);
    setShowPreview(true);
  };

  const handleTagKeyDown = (e) => {
    if (e.key === "," || e.key === "Enter") {
      e.preventDefault();
      addTags(tagInput);
    }
  };

  const addTags = (input) => {
    const newTags = input
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag !== "" && !tags.includes(tag));

    if (newTags.length > 0) {
      setTags([...tags, ...newTags]);
    }
    setTagInput("");
  };

  const removeTag = (tagToRemove) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  // Handle submit
  const handleSubmit = async () => {
    try {
        if (!androidImages || androidImages.length === 0) {
        toast.error("At least one Android image is required.");
        return;
      }

      const formData = new FormData();

      // Text fields
      formData.append("name", name.trim());
      formData.append("age", age);
      formData.append("description", description.trim());
      formData.append("system_prompt", prompt.trim());
      formData.append("tags", tags.join(","));

      // ✅ Append ONLY new android image files
      const newAndroid = androidImages.filter(img => img.type === "new" && img.file);
      newAndroid.forEach((img) => {
        formData.append("android_images", img.file);
      });

      // ✅ Append ONLY new ios image files
      const newIos = iosImages.filter(img => img.type === "new" && img.file);
      newIos.forEach((img) => {
        formData.append("ios_images", img.file);
      });

      // Debug
      for (let [key, value] of formData.entries()) {
        console.log(`${key}:`, value);
      }

      const response = await dispatch(
        UpdateCompanionData(id, formData, setLoading)
      );

      if (response?.success === true || response?.id || response?._id) {
        toast.success("Companion updated successfully!");
        navigate("/companion");
      } else {
        toast.error(response?.message || "Failed to update companion");
      }
    } catch (error) {
      console.error("Update failed:", error);
      toast.error("Failed to update companion");
    }
  };


  return (
    <div className="main-content">
      <div className="row">
        <div className="col-lg-12">
          <div className="card stretch stretch-full">
            <div className="card-body">
              <h5 className="card-title mb-4">Edit Companion</h5>

          <div className="row">
            {/* Android Images Section */}
            <div className="col-md-6 mb-3">
              <label className="form-label">
                Android Images{" "}
                {androidImages.length > 0 && (
                  <span className="badge bg-primary ms-1">{androidImages.length} total</span>
                )}
              </label>
              <DropZone
                label="Upload Android Images"
                accept="image/*"
                multiple
                onChange={(e) => handleImageChange(e, "android")}
                disabled={loading}
                previewImages={androidImages.map(img => img.url)}
                onRemoveImage={(idx) => removeImage(idx, "android")}
                previewWidth={100}
                previewHeight={100}
              />
              {/* Keep the ref on a hidden input or handle it better for two buttons */}
               <input
                type="file"
                style={{display: 'none'}}
                ref={fileInputRef}
                onChange={(e) => handleImageChange(e, replaceType)}
                accept="image/*"
              />
            </div>

            {/* iOS Images Section */}
            <div className="col-md-6 mb-3">
              <label className="form-label">
                iOS Images{" "}
                {iosImages.length > 0 && (
                  <span className="badge bg-primary ms-1">{iosImages.length} total</span>
                )}
              </label>
              <DropZone
                label="Upload iOS Images"
                accept="image/*"
                multiple
                onChange={(e) => handleImageChange(e, "ios")}
                disabled={loading}
                previewImages={iosImages.map(img => img.url)}
                onRemoveImage={(idx) => removeImage(idx, "ios")}
                previewWidth={100}
                previewHeight={100}
              />
            </div>
          </div>

          <div className="row">
            {/* Name Section */}
            <div className="col-md-4 mb-3">
              <label className="form-label">Name</label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={loading}
              />
            </div>


            <div className="col-md-4 mb-3">
              <label className="form-label">Age</label>
              <input
                type="number"
                className="form-control"
                placeholder="Enter Age"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                disabled={loading}
              />
            </div>
            <div className="col-md-4 mb-3">
              <label className="form-label">Tags</label>
              <div
                className="d-flex flex-wrap gap-2 align-items-center"
                style={{
                  border: "1px solid #ced4da",
                  borderRadius: "6px",
                  padding: "8px 10px",
                  minHeight: "38px",
                  height: "auto",
                  cursor: "text",
                  backgroundColor: loading ? "#f8f9fa" : "#fff",
                }}
                onClick={(e) => e.currentTarget.querySelector("input")?.focus()}
              >
                {tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="badge bg-primary d-flex align-items-center gap-1"
                    style={{ fontSize: "12px", padding: "4px 8px" }}
                  >
                    {tag}
                    <span
                      onClick={() => removeTag(tag)}
                      style={{
                        cursor: "pointer",
                        fontSize: "14px",
                        color: "white",
                        lineHeight: 1,
                      }}
                    >
                      &times;
                    </span>
                  </span>
                ))}
                <input
                  type="text"
                  className="border-0 bg-transparent"
                  style={{
                    outline: "none",
                    minWidth: "120px",
                    flex: 1,
                    padding: "2px 0",
                    fontSize: "14px",
                  }}
                  placeholder={tags.length === 0 ? "Add tags..." : ""}
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleTagKeyDown}
                  onBlur={() => addTags(tagInput)}
                  disabled={loading}
                />
              </div>
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label">Description</label>
            <textarea
              className="form-control"
              rows="5"
              placeholder="Enter description..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={loading}
            ></textarea>
          </div>

          <div className="mb-3">
            <label className="form-label">Prompt</label>
            <textarea
              className="form-control"
              rows="25"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />
          </div>

          <div className="d-flex justify-content-end gap-2 mt-3">
            <button
              id="delete_row"
              className="btn btn-md bg-soft-danger text-danger"
              onClick={() => navigate("/companion")}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              id="add_row"
              className="btn btn-md btn-primary"
              onClick={handleSubmit}
              disabled={loading || !prompt.trim() || !name.trim()}
            >
              {loading ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                    aria-hidden="true"
                  ></span>
                  Updating...
                </>
              ) : (
                "Update"
              )}
            </button>
          </div>
      </div>
    </div>
  </div>
</div>

      {/* Image Preview Modal */}
      {showPreview && (
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
      )}
    </div>
  );
};

const mapStateToProps = (state) => ({
  companions_list: state?.companions_list,
  update_companion: state?.update_companion,
});

export default connect(mapStateToProps)(EditCompanion);

