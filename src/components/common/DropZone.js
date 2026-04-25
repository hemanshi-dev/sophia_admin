import React from "react";
import { Upload, X } from "react-feather";

const DropZone = ({
  label,
  accept,
  multiple,
  onChange,
  disabled,
  previewImages,
  onRemoveImage,
  previewWidth = 80,
  previewHeight = 80,
  maxFiles,
  isVideo = false,
}) => {
  const hasPreviews = previewImages && previewImages.length > 0;

  const renderPreview = (img, idx) => {
    const isVideoFile = isVideo || (typeof img === 'string' && (img.includes('.mp4') || img.includes('.webm') || img.includes('.mov')));
    
    if (isVideoFile) {
      return (
        <video
          src={typeof img === "string" ? img : img.url || img}
          width="100%"
          height="100%"
          style={{
            objectFit: "cover",
            borderRadius: "8px",
            border: "1px solid #E5E7EB",
          }}
          muted
        />
      );
    }
    
    return (
      <img
        src={typeof img === "string" ? img : img.url || img}
        alt={`preview-${idx}`}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          borderRadius: "8px",
          border: "1px solid #E5E7EB",
        }}
      />
    );
  };

  return (
    <div className="d-flex flex-column gap-2">
      {/* Styled Drop Zone */}
      <div
        style={{
          border: "2px dashed #CBD5E1",
          borderRadius: "8px",
          padding: hasPreviews ? "12px" : "20px",
          textAlign: "center",
          background: disabled ? "#F8FAFC" : "#FFFFFF",
          cursor: disabled ? "not-allowed" : "pointer",
          transition: "all 0.2s ease",
          minHeight: hasPreviews ? "auto" : "120px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        onMouseEnter={(e) => {
          if (!disabled) {
            e.currentTarget.style.borderColor = "#3B82F6";
            e.currentTarget.style.background = "#EFF6FF";
          }
        }}
        onMouseLeave={(e) => {
          if (!disabled) {
            e.currentTarget.style.borderColor = "#CBD5E1";
            e.currentTarget.style.background = "#FFFFFF";
          }
        }}
      >
        <input
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={onChange}
          disabled={disabled}
          style={{ display: "none" }}
          id={`dropzone-${label}`}
        />
        <label
          htmlFor={`dropzone-${label}`}
          style={{
            cursor: disabled ? "not-allowed" : "pointer",
            margin: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "8px",
            width: "100%",
          }}
        >
          {/* Preview Images - shown inside dropzone */}
          {hasPreviews ? (
            <div className="d-flex flex-wrap gap-2 justify-content-center">
              {previewImages.map((img, idx) => (
                <div
                  key={idx}
                  style={{
                    position: "relative",
                    width: previewWidth,
                    height: previewHeight,
                  }}
                >
                  {renderPreview(img, idx)}
                  {onRemoveImage && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        onRemoveImage(idx);
                      }}
                      style={{
                        position: "absolute",
                        top: -6,
                        right: -6,
                        width: 18,
                        height: 18,
                        borderRadius: "50%",
                        background: "#EF4444",
                        color: "#fff",
                        border: "none",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        padding: 0,
                        boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
                      }}
                      title="Remove"
                    >
                      <X size={10} />
                    </button>
                  )}
                </div>
              ))}
              {/* Add more button */}
              {multiple && (
                <div
                  style={{
                    width: previewWidth,
                    height: previewHeight,
                    borderRadius: "8px",
                    border: "2px dashed #CBD5E1",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "#F8FAFC",
                  }}
                >
                  <div
                    style={{
                      width: "28px",
                      height: "28px",
                      borderRadius: "50%",
                      background: "#3B82F6",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "white",
                    }}
                  >
                    <Upload size={14} />
                  </div>
                </div>
              )}
            </div>
          ) : (
            <>
              <div
                style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "50%",
                  background: disabled ? "#E2E8F0" : "#3B82F6",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "white",
                }}
              >
                <Upload size={20} />
              </div>
              <div>
                <p
                  style={{
                    margin: 0,
                    fontWeight: "500",
                    color: disabled ? "#94A3B8" : "#1E293B",
                    fontSize: "13px",
                  }}
                >
                  {label}
                </p>
                <p
                  style={{
                    margin: "2px 0 0 0",
                    fontSize: "11px",
                    color: disabled ? "#94A3B8" : "#64748B",
                  }}
                >
                  {multiple
                    ? "Click or drag files here"
                    : "Click or drag file here"}
                </p>
                {maxFiles && (
                  <p
                    style={{
                      margin: "2px 0 0 0",
                      fontSize: "10px",
                      color: "#94A3B8",
                    }}
                  >
                    Max {maxFiles} files
                  </p>
                )}
              </div>
            </>
          )}
        </label>
      </div>
    </div>
  );
};

export default DropZone;
