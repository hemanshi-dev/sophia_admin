import React, { useEffect, useState, useMemo } from "react";
import DataTable from "react-data-table-component";
import { connect } from "react-redux";
import { GetAllUsers, SearchUsers } from "../../../store/action/useAction";
import { toast } from "react-toastify";
import Loader from "../../common/Loader";

const UserList = ({ dispatch, users_list, search_users }) => {
    const [loading, setLoading] = useState(false);
    const [searchText, setSearchText] = useState("");
    const [isSearchMode, setIsSearchMode] = useState(false);
    const [loadingMore, setLoadingMore] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    // Initial load with limit=0
    const fetchUsers = React.useCallback(() => {
        setLoading(true);
        dispatch(GetAllUsers(setLoading, 0)).catch((err) => {
            console.error("Error loading users:", err);
            toast.error("Failed to load users");
        });
    }, [dispatch]);

    const loadMoreUsers = () => {
        if (users_list?.has_next && !loading && !loadingMore) {
            const newOffset = users_list?.data?.length || 0;
            setLoadingMore(true);
            dispatch(GetAllUsers(setLoadingMore, newOffset)).catch((err) => {
                console.error("Error loading more users:", err);
                toast.error("Failed to load more users");
            });
        }
    };

    // const searchUsers = React.useCallback((query) => {
    //     if (query.trim() === "") {
    //         setIsSearchMode(false);
    //         fetchUsers();
    //         return;
    //     }
    //     setIsSearchMode(true);
    //     dispatch(SearchUsers(query, setLoading)).catch((err) => {
    //         console.error("Error searching users:", err);
    //         toast.error("Failed to search users");
    //     });
    // }, [dispatch, fetchUsers]);

    const searchUsers = React.useCallback((query) => {
    if (query.trim() === "") {
        setIsSearchMode(false);
        // Call fetchUsers directly instead of referencing it
        setLoading(true);
        dispatch(GetAllUsers(setLoading, 0)).catch((err) => {
            console.error("Error loading users:", err);
            toast.error("Failed to load users");
        });
        return;
    }
    setIsSearchMode(true);
    dispatch(SearchUsers(query, setLoading)).catch((err) => {
        console.error("Error searching users:", err);
        toast.error("Failed to search users");
    });
}, [dispatch]); // ← only dispatch as dependency, stable reference now
 const isMounted = React.useRef(false);

useEffect(() => {
    fetchUsers();
}, []);

useEffect(() => {
    // Skip the very first render
    if (!isMounted.current) {
        isMounted.current = true;
        return;
    }

    const timeoutId = setTimeout(() => {
        if (searchText === "" || searchText.trim().length >= 3) {
            searchUsers(searchText);
        }
    }, 800);

    return () => clearTimeout(timeoutId);
}, [searchText]); // ← remove searchUsers from deps

    const rawData = useMemo(() => {
        const dataSource = isSearchMode ? search_users : users_list;
        if (!dataSource?.data) return [];
        return Array.isArray(dataSource.data) ? dataSource.data : [];
    }, [users_list, search_users, isSearchMode]);

    const columns = [
        {
            name: "Sr. No.",
            selector: (row, index) => (currentPage - 1) * rowsPerPage + index + 1,
            width: "110px",
            center: true,
            cell: (row, index) => (
                <span style={{ 
                    fontWeight: "600", 
                    color: "#6B7280",
                    fontSize: "14px"
                }}>
                  {(currentPage - 1) * rowsPerPage + index + 1}
                </span>
            )
        },
        {
            name: "ID",
            selector: (row) => row.id || row._id,
            sortable: true,
            width: "250px",
            center: true,
            cell: (row) => (
                <span style={{ fontSize: "12px", color: "#6B7280" }}>{row.id || row._id}</span>
            )
        },
        {
            name: "Photo",
            cell: (row) => (
                <div style={{ padding: "8px" }}>
                    {row.photo_url ? (
                        <img
                            src={row.photo_url}
                            alt="avatar"
                            referrerPolicy="no-referrer"
                            style={{
                                width: "40px", height: "40px", borderRadius: "50%",
                                objectFit: "cover", border: "1px solid #e3e6f0"
                            }}
                        />
                    ) : <></>}
                </div>
            ),
            width: "110px",
            center: true,
        },
        {
            name: "Name",
            selector: (row) => row.name || "N/A",
            sortable: true,
            width: "150px",
            center: true,
        },
        {
            name: "Email",
            selector: (row) => row.email || "N/A",
            sortable: true,
            width: "250px",
            center: true,
        },
        {
            name: "Credits",
            selector: (row) => row.credits || 0,
            sortable: true,
            width: "100px",
            center: true,
            cell: (row) => (
                <span style={{ fontWeight: "700", color: "#8B5CF6" }}>
                    🪙 {row.credits || 0}
                </span>
            )
        },
        {
            name: "IP Address",
            selector: (row) => row.ip || "N/A",
            sortable: true,
            width: "180px",
            center: true,
            cell: (row) => (
                <code style={{ fontSize: "11px", color: "#4B5563" }}>{row.ip || "N/A"}</code>
            )
        },
        {
            name: "Platform",
            selector: (row) => row.platform || "N/A",
            sortable: true,
            width: "110px",
            center: true,
            cell: (row) => (
                <span style={{
                    padding: "4px 8px", borderRadius: "12px", fontSize: "11px", fontWeight: "600",
                    backgroundColor: row.platform === "ios" ? "#FEE2E2" : row.platform === "android" ? "#DCFCE7" : "#F3F4F6",
                    color: row.platform === "ios" ? "#B91C1C" : row.platform === "android" ? "#15803D" : "#4B5563",
                    textTransform: "uppercase"
                }}>
                    {row.platform || "N/A"}
                </span>
            )
        },
        {
            name: "Type",
            selector: (row) => row.type || "N/A",
            sortable: true,
            width: "110px",
            center: true,
            cell: (row) => (
                <span style={{ textTransform: "capitalize" }}>{row.type || "N/A"}</span>
            )
        }
    ];

    const customStyles = {
        table: { style: { border: "1px solid #e3e6f0", borderRadius: "8px" } },
        headRow: { style: { backgroundColor: "#f8f9fc", borderBottom: "1px solid #e3e6f0", minHeight: "56px" } },
        headCells: {
            style: {
                borderRight: "1px solid #e3e6f0", justifyContent: "center",
                fontSize: "14px", fontWeight: "700", color: "#333",
                paddingLeft: "16px", paddingRight: "16px",
                "&:last-child": { borderRight: "none" },
            },
        },
        cells: {
            style: {
                borderRight: "1px solid #e3e6f0", justifyContent: "center",
                paddingLeft: "16px", paddingRight: "16px",
                "&:last-child": { borderRight: "none" },
            },
        },
        rows: {
            style: {
                minHeight: "80px",
                "&:not(:last-child)": { borderBottom: "1px solid #e3e6f0" },
            },
        },
    };

    return (
        <div className="main-content" style={{ padding: "24px" }}>
            <div style={{ marginBottom: "24px" }}>
                <h2 style={{ fontSize: "24px", fontWeight: "700", color: "#111827", marginBottom: "8px" }}>User Management</h2>
                <p style={{ color: "#6B7280", fontSize: "14px" }}>View and manage detailed information for all registered users.</p>
            </div>

            <div className="card" style={{
                background: "white", borderRadius: "12px",
                boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)",
                border: "none", overflow: "hidden"
            }}>
                <div style={{
                    padding: "20px", borderBottom: "1px solid #F3F4F6",
                    display: "flex", justifyContent: "space-between", alignItems: "center",
                    flexWrap: "wrap", gap: "16px"
                }}>
                    <div style={{ position: "relative", maxWidth: "450px", width: "100%" }}>
                        <input
                            type="text"
                            placeholder="Search by name, email, platform or ID..."
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                            style={{
                                width: "100%", padding: "10px 16px", borderRadius: "8px",
                                border: "1px solid #D1D5DB", fontSize: "14px", outline: "none",
                            }}
                            onFocus={(e) => e.target.style.borderColor = "#8B5CF6"}
                            onBlur={(e) => e.target.style.borderColor = "#D1D5DB"}
                        />
                    </div>
                    <div style={{ color: "#6B7280", fontSize: "14px" }}>
                    Total Users: <span style={{ fontWeight: "600", color: "#111827" }}>
    {isSearchMode 
        ? search_users?.total_count || rawData.length
        : users_list?.total_count || rawData.length}
</span>
                        {loadingMore && (
                            <span style={{ marginLeft: "12px", color: "#8B5CF6", fontSize: "12px" }}>Loading more...</span>
                        )}
                    </div>
                </div>

                <div className="card-body p-0">
                    <div style={{ overflowX: "auto", width: "100%" }}>
                        <div style={{ minWidth: "1200px" }}>
                            <DataTable
                                columns={columns}
                                data={rawData}
                                progressPending={loading}
                                progressComponent={<div style={{ padding: "40px" }}><Loader /></div>}
                                pagination
                                paginationPerPage={rowsPerPage}
                                paginationRowsPerPageOptions={[10, 20, 30, 50, 100]}
                                onChangePage={(page) => setCurrentPage(page)}
                                onChangeRowsPerPage={(newRowsPerPage, page) => {
                                    setRowsPerPage(newRowsPerPage);
                                    setCurrentPage(page);
                                }}
                                customStyles={customStyles}
                                noDataComponent={
                                    <div style={{ padding: "48px", textAlign: "center", color: "#6B7280" }}>
                                        <div style={{ fontSize: "48px", marginBottom: "16px" }}>👥</div>
                                        <p style={{ fontSize: "16px", fontWeight: "500" }}>No users found</p>
                                    </div>
                                }
                                responsive
                            />
                            
                            {users_list?.has_next && !isSearchMode && (
                                <div style={{ display: "flex", justifyContent: "center", padding: "20px" }}>
                                    <button 
                                        onClick={loadMoreUsers} 
                                        disabled={loadingMore}
                                        style={{
                                            padding: "10px 24px",
                                            backgroundColor: "#8B5CF6",
                                            color: "white",
                                            border: "none",
                                            borderRadius: "8px",
                                            cursor: loadingMore ? "not-allowed" : "pointer",
                                            fontWeight: "600",
                                            opacity: loadingMore ? 0.7 : 1
                                        }}
                                    >
                                        {loadingMore ? "Loading..." : "Load More Users"}
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const mapStateToProps = (state) => ({
    users_list: state?.users_list,
    search_users: state?.search_users,
});

export default connect(mapStateToProps)(UserList);
