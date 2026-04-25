import React, { useState } from "react";
import { Trash2, X } from "react-feather";
import { useDispatch } from "react-redux";
import { DeleteCompanion } from "../../store/action/useAction";
import { toast } from "react-toastify";

const DeleteModal = ({ 
  show, 
  onHide, 
  id, 
  onSuccess, 
  title = "Delete Companion", 
  message = "Do you really want to delete this companion? This action cannot be undone and will also remove the image from storage.",
  action // Optional custom delete action
}) => {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  if (!show) return null;

  const handleDelete = async () => {
    try {
      const deleteAction = action || DeleteCompanion;
      const result = await dispatch(deleteAction(id, setLoading));
      
      if (result.success || result.detail?.includes("successfully") || result.message?.includes("successfully")) {
        toast.success(result.detail || result.message || "Deleted successfully!");
        if (onSuccess) onSuccess();
        onHide();
      } else {
        toast.error(result.message || result.detail || "Failed to delete item");
      }
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("An error occurred while deleting");
    }
  };

  return (
    <>
      <div className="modal-backdrop fade show"></div>
      <div className="modal fade show d-block" tabIndex="-1" role="dialog">
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content border-0 shadow-lg">
            <div className="modal-header border-0 p-0">
              <button
                type="button"
                onClick={onHide}
                style={{ 
                  position: 'absolute',
                  top: '12px',
                  right: '12px',
                  background: 'none', 
                  border: 'none', 
                  padding: '5px',
                  zIndex: 1,
                  cursor: 'pointer'
                }}
                aria-label="Close"
              >
                <X size={20} color="#6B7280" />
              </button>
            </div>

            <div className="modal-body p-4 text-center">
              <div className="mb-3">
                <div className="d-inline-flex p-3 rounded-circle mb-3" style={{ backgroundColor: '#FEE2E2' }}>
                  <Trash2 size={40} className="text-danger" />
                </div>
                <h4 className="fw-bold text-dark">Are you sure?</h4>
                <p className="text-muted mb-0 px-3">
                  {message}
                </p>
              </div>
            </div>

            <div className="modal-footer border-0 justify-content-center pb-4 pt-0">
              <button
                type="button"
                className="btn btn-light px-4 me-3"
                onClick={onHide}
                disabled={loading}
                style={{ borderRadius: '8px', fontWeight: '600' }}
              >
                CANCEL
              </button>
              <button
                type="button"
                className="btn btn-danger px-4 shadow-sm"
                onClick={handleDelete}
                disabled={loading}
                style={{ borderRadius: '8px', fontWeight: '600', backgroundColor: '#EF4444', border: 'none' }}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true" />
                    DELETING...
                  </>
                ) : (
                  "YES, DELETE IT!"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DeleteModal;
