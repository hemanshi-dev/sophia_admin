import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import {
  AddCompanionData,
  resetAddCompanion,
} from "../../../store/action/useAction";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import DropZone from "../../common/DropZone";

const AddCompanion = ({ dispatch, add_companion }) => {
  const [androidImages, setAndroidImages] = useState([]);
  const [androidPreviews, setAndroidPreviews] = useState([]);
  const [iosImages, setIosImages] = useState([]);
  const [iosPreviews, setIosPreviews] = useState([]);
  
  const [name, setName] = useState("");
  const [prompt, setPrompt] = useState("");
  const [description, setDescription] = useState("");
  const [age, setAge] = useState("");
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const navigate = useNavigate();

  // Reset state on unmount
  useEffect(() => {
    return () => {
      dispatch(resetAddCompanion());
      // Cleanup object URLs
      androidPreviews.forEach((url) => URL.revokeObjectURL(url));
      iosPreviews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [dispatch]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleImageChange = (e, type) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      const newPreviews = selectedFiles.map((file) =>
        URL.createObjectURL(file)
      );

      if (type === "android") {
        setAndroidImages([...androidImages, ...selectedFiles]);
        setAndroidPreviews([...androidPreviews, ...newPreviews]);
      } else {
        setIosImages([...iosImages, ...selectedFiles]);
        setIosPreviews([...iosPreviews, ...newPreviews]);
      }

      // Reset input value to allow re-selecting same file
      e.target.value = "";
    }
  };

  const removeImage = (index, type) => {
    if (type === "android") {
      const updatedImages = androidImages.filter((_, i) => i !== index);
      const updatedPreviews = androidPreviews.filter((_, i) => {
        if (i === index) URL.revokeObjectURL(androidPreviews[i]);
        return i !== index;
      });
      setAndroidImages(updatedImages);
      setAndroidPreviews(updatedPreviews);
    } else {
      const updatedImages = iosImages.filter((_, i) => i !== index);
      const updatedPreviews = iosPreviews.filter((_, i) => {
        if (i === index) URL.revokeObjectURL(iosPreviews[i]);
        return i !== index;
      });
      setIosImages(updatedImages);
      setIosPreviews(updatedPreviews);
    }
  };

  const handlePromptChange = (e) => {
    setPrompt(e.target.value);
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

  // const handleSubmit = async () => {
  //   const formData = new FormData();

  //   // Process any remaining text in tagInput before submitting
  //   let finalTags = [...tags];
  //   if (tagInput.trim()) {
  //     const extraTags = tagInput
  //       .split(",")
  //       .map((t) => t.trim())
  //       .filter((t) => t !== "" && !finalTags.includes(t));
  //     finalTags = [...finalTags, ...extraTags];
  //   }

  //   // append android images
  //   if (androidImages.length > 0) {
  //     androidImages.forEach((file) => {
  //       formData.append("android_images", file);
  //     });
  //   }

  //   // append ios images
  //   if (iosImages.length > 0) {
  //     iosImages.forEach((file) => {
  //       formData.append("ios_images", file);
  //     });
  //   }

  //   formData.append("name", name.trim());
  //   formData.append("system_prompt", prompt.trim());
  //   formData.append("age", age);
  //   formData.append("description", description.trim());

  //   // Send tags as a comma-separated string instead of JSON string
  //   if (finalTags.length > 0) {
  //     formData.append("tags", finalTags.join(","));
  //   } else {
  //     formData.append("tags", "");
  //   }

  //   try {
  //     const result = await dispatch(AddCompanionData(formData, setLoading));
  //     if (result?.success === true || result?.id || result?._id) {
  //       toast.success("Companion added successfully!");
  //       resetForm();
  //       setTimeout(() => {
  //         navigate("/companion");
  //       }, 500);
  //     } else {
  //       toast.error(result?.message || "Failed to add companion");
  //     }
  //   } catch (error) {
  //     console.error("Error adding companion:", error);
  //     toast.error("An error occurred while adding companion");
  //   }
  // };


  const handleSubmit = async () => {
    const formData = new FormData();

    let finalTags = [...tags];
    if (tagInput.trim()) {
      const extraTags = tagInput
        .split(",")
        .map((t) => t.trim())
        .filter((t) => t !== "" && !finalTags.includes(t));
      finalTags = [...finalTags, ...extraTags];
    }

    // ✅ Android images — multiple append
    if (androidImages.length > 0) {
      androidImages.forEach((file) => {
        formData.append("android_images", file);
      });
    } else {
      // ✅ Empty hoy to dummy handle
      formData.append("android_images", new Blob([]), "empty.jpg");
    }

    // ✅ iOS images — multiple append
    if (iosImages.length > 0) {
      iosImages.forEach((file) => {
        formData.append("ios_images", file);
      });
    } else {
      // ✅ Empty hoy to dummy handle
      formData.append("ios_images", new Blob([]), "empty.jpg");
    }

    formData.append("name", name.trim());
    formData.append("system_prompt", prompt.trim());
    formData.append("age", age);
    formData.append("description", description.trim());
    formData.append("tags", finalTags.join(","));

    // ✅ Debug — check karo
    console.log("FormData entries:");
    for (let pair of formData.entries()) {
      console.log(pair[0], pair[1]);
    }

    try {
      const result = await dispatch(AddCompanionData(formData, setLoading));
      if (result?.success === true || result?.id || result?._id) {
        toast.success("Companion added successfully!");
        resetForm();
        setTimeout(() => {
          navigate("/companion");
        }, 500);
      } else {
        toast.error(result?.message || "Failed to add companion");
      }
    } catch (error) {
      console.error("Error adding companion:", error);
      toast.error("An error occurred while adding companion");
    }
};
  const resetForm = () => {
    androidPreviews.forEach((url) => URL.revokeObjectURL(url));
    iosPreviews.forEach((url) => URL.revokeObjectURL(url));
    setAndroidImages([]);
    setAndroidPreviews([]);
    setIosImages([]);
    setIosPreviews([]);
    setName("");
    setPrompt("");
    setDescription("");
    setAge("");
    setTags([]);
    setTagInput("");
  };

  const handleCancel = () => {
    resetForm();
    navigate("/companion");
  };

  const isFormComplete =
    (androidImages.length > 0 || iosImages.length > 0) && 
    name.trim() && 
    prompt.trim() && 
    age;

  return (
    <div className="main-content">
      <div className="row">
        <div className="col-lg-12">
          <div className="card stretch stretch-full">
            <div className="card-body">
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">
                    Android Images{" "}
                    {androidImages.length > 0 && (
                      <span className="badge bg-primary ms-1">{androidImages.length} selected</span>
                    )}
                  </label>
                  <DropZone
                    label="Upload Android Images"
                    accept="image/*"
                    multiple
                    onChange={(e) => handleImageChange(e, "android")}
                    disabled={loading}
                    previewImages={androidPreviews}
                    onRemoveImage={(idx) => removeImage(idx, "android")}
                    previewWidth={100}
                    previewHeight={100}
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label">
                    iOS Images{" "}
                    {iosImages.length > 0 && (
                      <span className="badge bg-primary ms-1">{iosImages.length} selected</span>
                    )}
                  </label>
                  <DropZone
                    label="Upload iOS Images"
                    accept="image/*"
                    multiple
                    onChange={(e) => handleImageChange(e, "ios")}
                    disabled={loading}
                    previewImages={iosPreviews}
                    onRemoveImage={(idx) => removeImage(idx, "ios")}
                    previewWidth={100}
                    previewHeight={100}
                  />
                </div>
              </div>

              <div className="row">
                <div className="col-md-4 mb-3">
                  <label className="form-label">
                    Name
                  </label>
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
                  <label className="form-label">
                    Age
                  </label>
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
                            fontWeight: "400px",
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
                <label className="form-label">
                  Description 
                </label>
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
                <label className="form-label">
                  Prompt
                </label>
                <textarea
                  className="form-control"
                  rows="25"
                  placeholder="Enter your prompt here..."
                  value={prompt}
                  onChange={handlePromptChange}
                  disabled={loading}
                ></textarea>
              </div>
              <div className="d-flex justify-content-end gap-2 mt-3">
                <button
                  id="delete_row"
                  className="btn btn-md bg-soft-danger text-danger"
                  onClick={handleCancel}
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  id="add_row"
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
                      ></span>
                      Adding...
                    </>
                  ) : (
                    "Add Items"
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
      )}
    </div>
  );
};

const mapStateToProps = (state) => ({
  add_companion: state?.companion,
});

export default connect(mapStateToProps)(AddCompanion);

