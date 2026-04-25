import React, { useState } from "react";
import { Trash2 } from "react-feather";
import { useDispatch } from "react-redux";
import { DeleteReelAction } from "../../store/action/useAction";
import { toast } from "react-toastify";

const DeleteModal = ({ show, onHide, id, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  if (!show) return null;

  const handleDelete = async () => {
      setLoading(true); 
    try {
      const result = await dispatch(DeleteReelAction(id, setLoading));
      if (result?.message || result?.deleted_count >= 0) {
            toast.success(result?.message || "Deleted successfully!");
            if (onSuccess) onSuccess();
            onHide(); // ✅ Now this will actually run
        } else {
            toast.error("Failed to delete. Please try again.");
        }
     
    } catch (error) {
      toast.error("An error occurred while deleting the companion");
    }
  };

  return (
    <>
      <div className="modal-backdrop fade show"></div>
      <div className="modal fade show d-block" tabIndex="-1" role="dialog">
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content border-0 shadow-lg">
            <div className="modal-header  text-white border-0">
              <p className="modal-title d-flex align-items-center">
                Delete Companion
              </p>
              <button
                type="button"
                className="btn-close btn-close-white"
                onClick={onHide}
                aria-label="Close"
              ></button>
            </div>

            <div className="modal-body p-4 text-center">
              <div className="mb-3">
                <div className="bg-soft-danger d-inline-flex p-3 rounded-circle mb-3">
                  <Trash2 size={40} className="text-danger" />
                </div>
                <h4 className="fw-bold">Are you sure?</h4>
                <p className="text-muted mb-0">
                  Do you really want to delete this companion? This action
                  cannot be undone and will also remove the image from storage.
                </p>
              </div>
            </div>

            <div className="modal-footer border-0 justify-content-center pb-4">
              <button
                type="button"
                className="btn btn-md bg-soft-danger text-danger px-4"
                onClick={onHide}
                disabled={loading}
              >
                CANCEL
              </button>
              <button
                type="button"
                className="btn btn-md btn-primary px-4"
                onClick={handleDelete}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm me-2"
                      role="status"
                      aria-hidden="true"
                    ></span>
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
