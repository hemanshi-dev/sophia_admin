
import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import DataTable from "react-data-table-component";
import { toast } from "react-toastify";
import { DeleteCompanion, GetGalleryImages, GetAllCompanions, DeleteGalleryImage, UploadGalleryImages, DeleteMultipleGalleryImages } from "../../../store/action/useAction";
import { Edit, Trash2, Eye, X, Trash, Plus, Upload } from "react-feather";
import DeleteModal from "../../common/DeleteModal";

const ImageCell = ({ row }) => {
  // const BasePath = 'https://sin1.contabostorage.com/292910c350ea4c699a44f11998b096be:my-storage-bucket/'
  const imageUrl =  row.url || row.filename || row.image || (typeof row === 'string' ? row : "");
  const [imgError, setImgError] = useState(!imageUrl);

  return (
    <div 
      className="d-flex align-items-center justify-content-center"
      style={{ 
        width: "60px", 
        height: "60px", 
        borderRadius: "12px",
        backgroundColor: "#F3F4F6",
        border: "1px solid #E5E7EB",
        overflow: "hidden",
        position: "relative"
      }}
    >
      {imgError ? (
        <div style={{ color: "#9CA3AF", fontSize: "10px", textAlign: "center", padding: "4px" }}>
          No Image
        </div>
      ) : (
        <img
          src={imageUrl}
          alt="gallery"
          title={imageUrl}
          onError={() => setImgError(true)}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
      )}
    </div>
  );
};




const ViewImages = ({ dispatch, companions_list, gallery }) => {
  const navigate = useNavigate();
  const { id: routeId } = useParams();
  const [loading, setLoading] = useState(false);
  const [galleryLoading, setGalleryLoading] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedImageForModal, setSelectedImageForModal] = useState(null);
  const [showPromptModal, setShowPromptModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);
  const [selectedCompanion, setSelectedCompanion] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [showImageDeleteModal, setShowImageDeleteModal] = useState(false);
  const [selectedImageId, setSelectedImageId] = useState(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = React.useRef(null);
  const [selectedItemIds, setSelectedItemIds] = useState([]);
  const [showBulkDeleteModal, setShowBulkDeleteModal] = useState(false);

  const fetchGalleryImages = React.useCallback(async (companionId) => {
    if (!companionId) return;
    try {
      setGalleryLoading(true);
      const data = await dispatch(GetGalleryImages(companionId, (l) => {}));
      if (data?.images) {
        setSelectedImages(data.images);
      }
    } catch (error) {
      toast.error("Failed to load gallery images");
    } finally {
      setGalleryLoading(false);
    }
  }, [dispatch]);

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    const formData = new FormData();
    files.forEach((file) => formData.append("images", file));

    try {
      setUploading(true);
      await dispatch(UploadGalleryImages(routeId, formData, setUploading));
      toast.success("Images uploaded successfully");
      fetchGalleryImages(routeId);
    } catch (error) {
      toast.error("Failed to upload images");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  useEffect(() => {
    if (!routeId && !companions_list?.isLoaded) {
      dispatch(GetAllCompanions(setLoading));
    }
  }, [dispatch, companions_list?.isLoaded, routeId]);

  useEffect(() => {
    if (routeId) {
      fetchGalleryImages(routeId);
    }
  }, [routeId, fetchGalleryImages]);
  const handleDelete = async () => {
    if (!selectedCompanion) return;

    try {
      await dispatch(DeleteCompanion(selectedCompanion.id || selectedCompanion._id));
      toast.success("Companion deleted successfully");

    } catch (error) {
      toast.error("Failed to delete companion");
    } finally {
      setShowDeleteModal(false);
      setSelectedCompanion(null);
    }
  };

  const handleBulkDelete = () => async (dispatch) => {
    if (selectedItemIds.length === 0) return { success: false, message: "No items selected" };
    
    try {
      // Single API call for multiple deletions
      const result = await dispatch(DeleteMultipleGalleryImages(routeId, selectedItemIds, (l) => {}));
      
      setSelectedItemIds([]);
      fetchGalleryImages(routeId);
      return result;
    } catch (error) {
      console.error("Bulk delete error:", error);
      throw error;
    }
  };

  const toggleImageSelection = (id) => {
    setSelectedItemIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedItemIds.length === selectedImages.length) {
      setSelectedItemIds([]);
    } else {
      setSelectedItemIds(selectedImages.map(img => img.id || img._id));
    }
  };

  const handleEdit = (id) => {
    navigate(`/companion/edit/${id}`);
  };


  const galleryColumns = [
    {
      name: "Sr. No.",
      width: "100px",
      center: true,
      cell: (row, index) => (
        <span style={{ fontWeight: "600", color: "#6B7280" }}>{index + 1}</span>
      ),
    },
    {
      name: "Image",
      width: "150px",
      center: true,
      cell: (row) => <ImageCell row={row} />,
    },
    {
      name: "Prompt",
      selector: (row) => row.prompt,
      sortable: true,
      wrap: true,
      cell: (row) => (
        <div style={{ color: "#4B5563", fontSize: "14px", padding: "8px" }}>
          {row.prompt || <span className="text-muted italic">No prompt available</span>}
        </div>
      ),
    },
    {
      name: "Action",
      width: "150px",
      center: true,
      cell: (row) => (
        <button
          type="button"
          className="btn btn-outline-danger p-2"
          onClick={() => {
            setSelectedImageId(row.id || row._id);
            setShowImageDeleteModal(true);
          }}
          title="Delete Image"
          style={{ borderRadius: "8px" }}
        >
          <Trash2 size={16} />
        </button>
      ),
    },
  ];

  const columns = [
    {
      name: "Sr. No.",
      width: "80px",
      center: true,
      cell: (row, index) => (
        <span style={{ fontWeight: "600", color: "#6B7280", fontSize: "14px" }}>
          {(currentPage - 1) * rowsPerPage + index + 1}
        </span>
      ),
    },
    {
      name: "Images",
      width: "220px",
      center: true,
      cell: (row) => {
        const companionId = row.id || row._id;
        const totalImages = row.total_images || 0;
        return (
          <div className="d-flex justify-content-center">
            <button
              className="btn btn-sm"
              disabled={galleryLoading}
              onClick={() => navigate(`/companion/images/view/${companionId}`)}
              style={{
                borderRadius: "8px",
                padding: "6px 16px",
                color: "white",
                fontSize: "13px",
                fontWeight: "600",
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                border: "none",
                display: "flex",
                alignItems: "center",
                gap: "6px",
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
              }}
            >
              <Eye size={14} />
              View {totalImages > 0 && `(${totalImages})`}
            </button>
          </div>
        );
      },
    },
    {
      name: "Prompt",
      width: "200px",
      center: true,
      cell: (row) => {
        const prompt = row.prompt || row.persona || "";
        const truncated = prompt.length > 100 ? prompt.substring(0, 100) + "..." : prompt;
        return (
          <div
            style={{
              padding: "8px",
              fontSize: "13px",
              color: "#4B5563",
              lineHeight: "1.5",
              cursor: "pointer",
            }}
          >
            {truncated || "No prompt available"}
          </div>
        );
      },
    },
    {
      name: "Action",
      button: true,
            width: "80px",
      center: true,
      cell: (row) => {
        const rowId = row.id || row._id;
        return (
          <div className="d-flex gap-2 justify-content-center flex-wrap">
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
              onClick={() => {
                setSelectedCompanion(row);
                setShowDeleteModal(true);
              }}
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

  const customStyles = {
    headRow: {
      style: {
        backgroundColor: "#F9FAFB",
        borderBottom: "2px solid #E5E7EB",
      },
    },
    headCells: {
      style: {
        fontWeight: "700",
        fontSize: "13px",
        color: "#374151",
        textTransform: "uppercase",
        letterSpacing: "0.5px",
      },
    },
    rows: {
      style: {
        minHeight: "72px",
        backgroundColor: "white",
        borderBottom: "1px solid #F3F4F6",
        "&:hover": {
          backgroundColor: "#F9FAFB",
        },
      },
      highlightOnHoverStyle: {
        backgroundColor: "#F3F4F6",
      },
    },
    cells: {
      style: {
        fontSize: "14px",
        color: "#1F2937",
      },
    },
    pagination: {
      style: {
        borderTop: "2px solid #E5E7EB",
        padding: "16px",
      },
    },
  };

  return (
    <div className="page-wrapper">
      <div className="content container-fulid" style={{ paddingTop: '5px' }}>


        <div className="card" style={{ marginTop: '5px' }}>
           <div className="card-header bg-white d-flex justify-content-between align-items-center py-3">
             <h4 className="card-title mb-0">
               {routeId ? "Companion Image Gallery" : "All Companions"}
             </h4>
              {routeId && (
                <div className="d-flex gap-2">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                    multiple
                    accept="image/*"
                    style={{ display: "none" }}
                  />
                  {routeId && selectedImages.length > 0 && (
                    <div className="d-flex align-items-center gap-2 me-2">
                       <div className="form-check mb-0">
                        <input 
                          className="form-check-input" 
                          type="checkbox" 
                          id="selectAll"
                          checked={selectedItemIds.length === selectedImages.length && selectedImages.length > 0}
                          onChange={toggleSelectAll}
                        />
                        <label className="form-check-label text-muted small" htmlFor="selectAll">
                          Select All
                        </label>
                      </div>
                      {selectedItemIds.length > 0 && (
                        <button 
                          className="btn btn-danger btn-sm d-flex align-items-center gap-1"
                          onClick={() => setShowBulkDeleteModal(true)}
                        >
                          <Trash size={14} />
                          Delete ({selectedItemIds.length})
                        </button>
                      )}
                    </div>
                  )}
                  <button 
                    className="btn btn-primary btn-sm d-flex align-items-center gap-1"
                    onClick={() => navigate(`/companion/images/add/${routeId}`)}
                  >
                    <Plus size={16} />
                    Add Images
                  </button>
                  <button 
                    className="btn btn-outline-secondary btn-sm"
                    onClick={() => navigate(`/companion/edit/${routeId}`)}
                  >
                    Back to Edit
                  </button>
                </div>
              )}
            </div>
          <div className="card-body">
            {routeId ? (
              galleryLoading ? (
                <div style={{ padding: "40px", textAlign: "center" }}>
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  <p style={{ marginTop: "12px", color: "#6B7280" }}>Loading images...</p>
                </div>
              ) : selectedImages.length === 0 ? (
                <div style={{ padding: "60px 20px", textAlign: "center" }}>
                  <div style={{ fontSize: "48px", marginBottom: "16px" }}>📷</div>
                  <p style={{ color: "#9CA3AF", fontSize: "16px" }}>
                    No images found for this companion
                  </p>
                </div>
              ) : (
                <div className="custom-gallery-scroll" style={{ 
                  display: "grid", 
                  gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", 
                  gap: "10px",
                  padding: "10px",
                  maxHeight: "75vh",
                  overflowY: "auto"
                }}>
                  {selectedImages.map((img, index) => {
                    // const BasePath = 'https://sin1.contabostorage.com/292910c350ea4c699a44f11998b096be:my-storage-bucket/'
                    const imageUrl = img.url || img.filename || img.image || (typeof img === 'string' ? img : "");
                    return (
                      <div 
                        key={index}
                        className="image-grid-item"
                        style={{ 
                          position: "relative", 
                          aspectRatio: "3/4", 
                          borderRadius: "12px", 
                          overflow: "hidden",
                          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                          cursor: "pointer"
                        }}
                        onMouseEnter={(e) => {
                          const btn = e.currentTarget.querySelector('.delete-overlay-btn');
                          if (btn) btn.style.opacity = '1';
                        }}
                        onMouseLeave={(e) => {
                          const btn = e.currentTarget.querySelector('.delete-overlay-btn');
                          if (btn) btn.style.opacity = '0';
                        }}
                        onClick={() => {
                          setSelectedImageForModal(img);
                          setShowImageModal(true);
                        }}
                      >
                        <img
                          src={imageUrl}
                          alt="gallery"
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            transition: "transform 0.3s ease",
                          }}
                          onMouseOver={(e) => e.currentTarget.style.transform = "scale(1.05)"}
                          onMouseOut={(e) => e.currentTarget.style.transform = "scale(1)"}
                        />
                        
                        {/* Checkbox with extended clickable area */}
                        {/* Invisible extended hit area - 15px padding around checkbox */}
                        <div
                          style={{
                            position: "absolute",
                            top: "10px",
                            left: "10px",
                            zIndex: 11,
                            width: "102px",
                            height: "102px",
                            marginTop: "-40px",
                            marginLeft: "-40px",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            // border: "2px dashed rgba(255, 0, 0, 0.5)"
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleImageSelection(img.id || img._id);
                          }}
                        >
                          <input
                            type="checkbox"
                            className="form-check-input shadow-sm"
                            style={{ width: "22px", height: "22px", cursor: "pointer", margin: 0 }}
                            checked={selectedItemIds.includes(img.id || img._id)}
                            onChange={(e) => {
                              e.stopPropagation();
                              toggleImageSelection(img.id || img._id);
                            }}
                            onClick={(e) => e.stopPropagation()}
                          />
                        </div>

                        {/* <button
                          type="button"
                          className="btn btn-danger delete-overlay-btn p-2"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedImageId(img.id || img._id);
                            setShowImageDeleteModal(true);
                          }}
                          style={{
                            position: "absolute",
                            top: "10px",
                            right: "10px",
                            opacity: "0",
                            transition: "opacity 0.2s ease",
                            borderRadius: "50%",
                            width: "36px",
                            height: "36px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
                            zIndex: 10
                          }}
                          title="Delete Image"
                        >
                          <Trash2 size={16} />
                        </button> */}
                      </div>
                    );
                  })}
                </div>
              )
            ) : (
              <DataTable
                columns={columns}
                data={companions_list?.data || []}
                progressPending={loading}
                progressComponent={
                  <div style={{ padding: "40px", textAlign: "center" }}>
                    <div className="spinner-border text-primary" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                    <p style={{ marginTop: "12px", color: "#6B7280" }}>Loading data...</p>
                  </div>
                }
                pagination
                highlightOnHover
                responsive
                striped
                customStyles={customStyles}
                noDataComponent={
                  <div style={{ padding: "60px 20px", textAlign: "center" }}>
                    <div style={{ fontSize: "48px", marginBottom: "16px" }}>📷</div>
                    <p style={{ color: "#9CA3AF", fontSize: "16px" }}>
                      No companions found
                    </p>
                  </div>
                }
              />
            )}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal for Companions */}
      <DeleteModal
        show={showDeleteModal}
        onHide={() => {
          setShowDeleteModal(false);
          setSelectedCompanion(null);
        }}
        id={selectedCompanion?.id || selectedCompanion?._id}
        onSuccess={() => {
           if (!routeId) dispatch(GetAllCompanions(setLoading));
        }}
      />

      <DeleteModal
        show={showImageDeleteModal}
        onHide={() => setShowImageDeleteModal(false)}
        id={selectedImageId}
        title="Delete Gallery Image"
        message="Are you sure you want to delete this specific image from the gallery? This action cannot be undone."
        action={(id, setL) => DeleteGalleryImage(routeId || selectedCompanion?.id || selectedCompanion?._id, id, setL)}
        onSuccess={() => fetchGalleryImages(routeId || selectedCompanion?.id || selectedCompanion?._id)}
      />

      {/* Bulk Delete Modal */}
      <DeleteModal
        show={showBulkDeleteModal}
        onHide={() => setShowBulkDeleteModal(false)}
        title="Batch Delete Images"
        message={`Are you sure you want to delete ${selectedItemIds.length} selected images? This action cannot be undone.`}
        action={handleBulkDelete}
        onSuccess={() => {}} 
      />

      {/* Full Image Modal */}
 {showImageModal && selectedImageForModal && (
  <>
    <div 
      className="modal-backdrop fade show" 
      onClick={() => setShowImageModal(false)} 
      style={{ backgroundColor: 'rgba(0,0,0,0.8)' }} 
    />

    <div 
      className="modal fade show d-block" 
      tabIndex="-1" 
      role="dialog" 
      onClick={() => setShowImageModal(false)}
    >
      <div 
        className="modal-dialog modal-dialog-centered modal-lg" 
        role="document" 
        onClick={e => e.stopPropagation()}
      >
        <div 
          className="modal-content border-0 shadow-none"
          style={{  borderRadius: '12px', overflow: 'hidden', position: 'relative' }}
        >
          {/* ✅ Close button — top-right INSIDE modal */}
          <button
            type="button"
            onClick={() => setShowImageModal(false)}
            style={{
              position: 'absolute',
              top: '15px',
              right: '15px',
              zIndex: 100,
              backgroundColor: 'white',
              border: 'none',
              borderRadius: '50%',
              width: '36px',
              height: '36px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
            }}
          >
            <X size={20} color="#333" />
          </button>

          {/* Image */}
          <div style={{ padding: '20px 20px 0' }}>
            <img
              src={
              
                selectedImageForModal.url ||
                  selectedImageForModal.filename ||
                  selectedImageForModal.image ||
                  (typeof selectedImageForModal === 'string' ? selectedImageForModal : '')
              }
              alt="Full View"
              style={{
                width: '100%',
                maxHeight: '65vh',
                borderRadius: '8px',
                objectFit: 'contain',
                display: 'block',
              }}
            />
          </div>

          {/* Prompt */}
          {selectedImageForModal.prompt && (
            <div 
              style={{ 
                padding: '16px 20px 20px',
                maxHeight: '160px', 
                overflowY: 'auto',
              }}
            >
              <p 
                style={{ 
                  margin: 0, 
                  fontSize: '13px', 
                  color: '#444', 
                  lineHeight: '1.6',
                  whiteSpace: 'pre-wrap',
                }}
              >
                {selectedImageForModal.prompt}
              </p>
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
  companions_list: state.companions_list,
  gallery: state.gallery,
});

export default connect(mapStateToProps)(ViewImages);