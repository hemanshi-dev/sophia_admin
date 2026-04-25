import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { connect } from "react-redux";
import { toast } from "react-toastify";
import Loader from "../../common/Loader";
import { GetAllFeedback } from "../../../store/action/useAction";

const Feedback = ({ dispatch, feedback_list }) => {
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const fetchFeedback = React.useCallback(() => {
        dispatch(GetAllFeedback(setLoading)).catch(() => {
            toast.error("Failed to load feedback");
        });
    }, [dispatch]);

    useEffect(() => {
        fetchFeedback();
    }, [fetchFeedback]);

    const columns = [
        {
            name: "Sr. No.",
            selector: (row, index) => {
                return (currentPage - 1) * rowsPerPage + index + 1;
            },
            width: "80px",
            center: true,
        },
        {
            name: "User ID",
            selector: (row) => row.userid || "N/A",
            sortable: true,
            center: true,
            wrap: true,
        },
        {
            name: "IP Address",
            selector: (row) => row.ip || "N/A",
            sortable: true,
            center: true,
            wrap: true,
        },
        {
            name: "Description",
            selector: (row) => row.description || "N/A",
            sortable: true,
            center: true,
            wrap: true,
        },
    ];

    const raw = Array.isArray(feedback_list?.data) && feedback_list.data.length > 0
        ? feedback_list.data
        : [];
    const feedback = raw.map((item) => {
        const d = item.data || item;
        return { userid: d.user_id || d.userid || "N/A", ip: d.ip || "N/A", description: d.description || "N/A" };
    });

    const customStyles = {
        table: { style: { border: "1px solid #e3e6f0", borderRadius: "8px" } },
        headRow: { style: { backgroundColor: "#f8f9fc", borderBottom: "1px solid #e3e6f0", minHeight: "56px" } },
        headCells: {
            style: {
                borderRight: "1px solid #e3e6f0",
                justifyContent: "center",
                fontSize: "14px", fontWeight: "700", color: "#333",
                paddingLeft: "16px", paddingRight: "16px",
                "&:last-child": { borderRight: "none" },
            },
        },
        cells: {
            style: {
                borderRight: "1px solid #e3e6f0",
                justifyContent: "center",
                paddingLeft: "16px", paddingRight: "16px",
                "&:last-child": { borderRight: "none" },
                wordBreak: "break-all",
            },
        },
        rows: {
            style: {
                minHeight: "72px",
                "&:not(:last-child)": { borderBottom: "1px solid #e3e6f0" },
            },
        },
    };

    return (
        <div className="main-content">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h3 className="mb-0">Feedback List</h3>
            </div>
            <div className="card">
                <div className="card-body p-0">
                    <div style={{ overflowX: "auto", width: "100%" }}>
                        <div style={{ minWidth: "600px" }}>
                        <DataTable
                            title="Feedback"
                            columns={columns}
                            data={feedback}
                            progressPending={loading}
                            progressComponent={<Loader />}
                            pagination
                            paginationPerPage={10}
                            paginationRowsPerPageOptions={[10, 30, 50, 100]}
                            onChangePage={(page) => setCurrentPage(page)}
                            onChangeRowsPerPage={(newRowsPerPage, page) => {
                                setRowsPerPage(newRowsPerPage);
                                setCurrentPage(page);
                            }}
                            customStyles={customStyles}
                            noDataComponent={
                                <div className="py-5 text-center text-muted">No feedback found.</div>
                            }
                        />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const mapStateToProps = (state) => ({
    feedback_list: state?.feedback_list,
});

export default connect(mapStateToProps)(Feedback);
