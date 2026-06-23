import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { toast } from "react-toastify";
import { GetLiveMode, UpdateLiveMode } from "../../../store/action/useAction";
import { Activity, Server, Zap, Save, RefreshCw } from "react-feather";

const FIELD_LABELS = {
  project_id: "Project ID",
  test_contract_address: "Test Contract Address",
  live_contract_address: "Live Contract Address",
  test_chain_id: "Test Chain ID",
  live_chain_id: "Live Chain ID",
  test_rpc_url: "Test RPC URL",
  live_rpc_url: "Live RPC URL",
  test_reciver_address: "Test Receiver Address",
  live_reciver_address: "Live Receiver Address",
};

const FIELD_ORDER = [
  "project_id",
  "test_contract_address",
  "live_contract_address",
  "test_chain_id",
  "live_chain_id",
  "test_rpc_url",
  "live_rpc_url",
  "test_reciver_address",
  "live_reciver_address",
];

const TEST_FIELDS = [
  "project_id",
  "test_contract_address",
  "test_chain_id",
  "test_rpc_url",
  "test_reciver_address",
];

const LIVE_FIELDS = [
  "project_id",
  "live_contract_address",
  "live_chain_id",
  "live_rpc_url",
  "live_reciver_address",
];

const LiveMode = ({ dispatch, live_mode }) => {
  const [activeTab, setActiveTab] = useState("test"); // 'test' | 'live'
  const [form, setForm] = useState({});
  const [isLive, setIsLive] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);

  const fetchData = async () => {
    try {
      const data = await dispatch(GetLiveMode(setFetchLoading));
      if (data) {
        const { live_mode, ...rest } = data;
        setForm(rest);
        setIsLive(live_mode === "on" || live_mode === true);
      }
    } catch (err) {
      toast.error("Failed to fetch live mode settings");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Sync from redux when it loads
  useEffect(() => {
    if (live_mode?.data && !fetchLoading) {
      const { live_mode: lm, ...rest } = live_mode.data;
      setForm(rest);
      setIsLive(lm === "on" || lm === true);
    }
  }, [live_mode?.data]);

  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    try {
      const payload = {
        ...form,
        live_mode: isLive ? "on" : "off",
      };
      const result = await dispatch(UpdateLiveMode(payload, setSaveLoading));
      if (result?.success || result?.status) {
        toast.success(result?.message || "Settings saved successfully!");
        const { live_mode: lm, ...rest } = result;
        if (lm !== undefined) setIsLive(lm === "on" || lm === true);
        if (Object.keys(rest).length > 1) setForm(rest);
      } else {
        toast.error(result?.message || "Failed to save settings");
      }
    } catch (err) {
      toast.error("An error occurred while saving");
    }
  };

  const visibleFields = activeTab === "test" ? TEST_FIELDS : LIVE_FIELDS;

  const renderField = (key) => {
    const isUrl = key.includes("_url");
    const isAddress = key.includes("_address");
    return (
      <div key={key} className="col-md-6 mb-4">
        <label
          className="form-label fw-semibold"
          style={{ fontSize: "13px", color: "#374151", marginBottom: "6px" }}
        >
          {FIELD_LABELS[key] || key}
        </label>
        <input
          type="text"
          className="form-control"
          value={form[key] || ""}
          onChange={(e) => handleChange(key, e.target.value)}
          placeholder={`Enter ${FIELD_LABELS[key] || key}`}
          style={{
            fontSize: "13px",
            borderRadius: "8px",
            border: "1.5px solid #E5E7EB",
            padding: "10px 14px",
            fontFamily: isAddress || key === "project_id" ? "monospace" : "inherit",
            transition: "border-color 0.2s",
          }}
          onFocus={(e) => (e.target.style.borderColor = "#3454d1")}
          onBlur={(e) => (e.target.style.borderColor = "#E5E7EB")}
        />
      </div>
    );
  };

  return (
    <div className="main-content">
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "24px",
          flexWrap: "wrap",
          gap: "12px",
        }}
      >
        <div>
          <h2 style={{ fontSize: "22px", fontWeight: "700", color: "#111827", margin: 0 }}>
            Live Mode Settings
          </h2>
          <p style={{ color: "#6B7280", fontSize: "13px", marginTop: "4px", marginBottom: 0 }}>
            Configure blockchain network settings for test and live environments.
          </p>
        </div>
        <div className="d-flex gap-2">
          <button
            className="btn btn-outline-secondary d-flex align-items-center gap-2"
            onClick={fetchData}
            disabled={fetchLoading}
            style={{ borderRadius: "8px", fontSize: "13px" }}
          >
            <RefreshCw size={14} className={fetchLoading ? "spin-icon" : ""} />
            Refresh
          </button>
          <button
            className="btn btn-primary d-flex align-items-center gap-2"
            onClick={handleSave}
            disabled={saveLoading || fetchLoading}
            style={{ borderRadius: "8px", fontSize: "13px" }}
          >
            {saveLoading ? (
              <>
                <span className="spinner-border spinner-border-sm" role="status" />
                Saving...
              </>
            ) : (
              <>
                <Save size={14} />
                Save Settings
              </>
            )}
          </button>
        </div>
      </div>

      {/* Live Mode Toggle Card */}
      <div
        className="card mb-4"
        style={{
          borderRadius: "12px",
          border: "1.5px solid #E5E7EB",
          boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
        }}
      >
        <div className="card-body" style={{ padding: "20px 24px" }}>
          <div className="d-flex align-items-center justify-content-between flex-wrap gap-3">
            <div className="d-flex align-items-center gap-3">
              <div
                style={{
                  width: "44px",
                  height: "44px",
                  borderRadius: "10px",
                  background: isLive
                    ? "linear-gradient(135deg, #10B981, #059669)"
                    : "linear-gradient(135deg, #F59E0B, #D97706)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Zap size={20} color="white" />
              </div>
              <div>
                <h5 style={{ margin: 0, fontWeight: "700", fontSize: "15px", color: "#111827" }}>
                  Mode Status
                </h5>
                <p style={{ margin: 0, fontSize: "12px", color: "#6B7280" }}>
                  {isLive
                    ? "Live mode is active — real transactions enabled"
                    : "Test mode is active — safe for testing"}
                </p>
              </div>
            </div>

            {/* Toggle Switch */}
            <div className="d-flex align-items-center gap-3">
              <span
                style={{
                  fontSize: "13px",
                  fontWeight: "600",
                  color: !isLive ? "#F59E0B" : "#9CA3AF",
                  transition: "color 0.2s",
                }}
              >
                TEST
              </span>
              <div
                onClick={() => setIsLive((prev) => !prev)}
                style={{
                  width: "56px",
                  height: "28px",
                  borderRadius: "14px",
                  background: isLive
                    ? "linear-gradient(135deg, #10B981, #059669)"
                    : "#D1D5DB",
                  position: "relative",
                  cursor: "pointer",
                  transition: "background 0.3s ease",
                  boxShadow: isLive ? "0 0 0 3px rgba(16,185,129,0.2)" : "none",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: "3px",
                    left: isLive ? "31px" : "3px",
                    width: "22px",
                    height: "22px",
                    borderRadius: "50%",
                    background: "white",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
                    transition: "left 0.3s ease",
                  }}
                />
              </div>
              <span
                style={{
                  fontSize: "13px",
                  fontWeight: "600",
                  color: isLive ? "#10B981" : "#9CA3AF",
                  transition: "color 0.2s",
                }}
              >
                LIVE
              </span>
            </div>

            {/* Status Badge */}
            <span
              style={{
                padding: "6px 16px",
                borderRadius: "20px",
                fontSize: "13px",
                fontWeight: "700",
                background: isLive ? "#D1FAE5" : "#FEF3C7",
                color: isLive ? "#065F46" : "#92400E",
                letterSpacing: "0.5px",
              }}
            >
              {isLive ? "LIVE" : "TEST"}
            </span>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div
        style={{
          display: "flex",
          borderBottom: "2px solid #E5E7EB",
          marginBottom: "24px",
          gap: "4px",
        }}
      >
        {[
          { key: "test", label: "Test Mode", icon: <Server size={15} /> },
          { key: "live", label: "Live Mode", icon: <Activity size={15} /> },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "10px 20px",
              border: "none",
              background: "transparent",
              cursor: "pointer",
              fontSize: "14px",
              fontWeight: activeTab === tab.key ? "700" : "500",
              color:
                activeTab === tab.key
                  ? tab.key === "live"
                    ? "#10B981"
                    : "#3454d1"
                  : "#6B7280",
              borderBottom:
                activeTab === tab.key
                  ? `3px solid ${tab.key === "live" ? "#10B981" : "#3454d1"}`
                  : "3px solid transparent",
              marginBottom: "-2px",
              transition: "all 0.2s ease",
              borderRadius: "4px 4px 0 0",
            }}
          >
            {tab.icon}
            {tab.label}
            {tab.key === "test" && !isLive && (
              <span
                style={{
                  padding: "1px 8px",
                  borderRadius: "10px",
                  background: "#FEF3C7",
                  color: "#92400E",
                  fontSize: "10px",
                  fontWeight: "700",
                }}
              >
                ACTIVE
              </span>
            )}
            {tab.key === "live" && isLive && (
              <span
                style={{
                  padding: "1px 8px",
                  borderRadius: "10px",
                  background: "#D1FAE5",
                  color: "#065F46",
                  fontSize: "10px",
                  fontWeight: "700",
                }}
              >
                ACTIVE
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Settings Form */}
      <div
        className="card"
        style={{
          borderRadius: "12px",
          border: "1.5px solid #E5E7EB",
          boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
        }}
      >
        <div
          className="card-header"
          style={{
            background:
              activeTab === "live"
                ? "linear-gradient(135deg, #ECFDF5, #D1FAE5)"
                : "linear-gradient(135deg, #FFFBEB, #FEF3C7)",
            borderBottom: `2px solid ${activeTab === "live" ? "#A7F3D0" : "#FDE68A"}`,
            borderRadius: "12px 12px 0 0",
            padding: "16px 24px",
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <div
            style={{
              width: "32px",
              height: "32px",
              borderRadius: "8px",
              background: activeTab === "live" ? "#10B981" : "#F59E0B",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {activeTab === "live" ? (
              <Activity size={16} color="white" />
            ) : (
              <Server size={16} color="white" />
            )}
          </div>
          <div>
            <h5 style={{ margin: 0, fontWeight: "700", fontSize: "15px", color: "#111827" }}>
              {activeTab === "live" ? "Live Network Configuration" : "Test Network Configuration"}
            </h5>
            <p style={{ margin: 0, fontSize: "12px", color: "#6B7280" }}>
              {activeTab === "live"
                ? "Configure your mainnet / production blockchain settings"
                : "Configure your testnet / development blockchain settings"}
            </p>
          </div>
        </div>

        <div className="card-body" style={{ padding: "24px" }}>
          {fetchLoading ? (
            <div className="d-flex justify-content-center align-items-center py-5">
              <div className="spinner-border text-primary" role="status" />
              <span className="ms-3 text-muted">Loading settings...</span>
            </div>
          ) : (
            <div className="row">{visibleFields.map((key) => renderField(key))}</div>
          )}
        </div>
      </div>

      <style>{`
        .spin-icon {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

const mapStateToProps = (state) => ({
  live_mode: state?.live_mode,
});

export default connect(mapStateToProps)(LiveMode);
