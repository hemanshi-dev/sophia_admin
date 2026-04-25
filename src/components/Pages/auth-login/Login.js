import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { LoginUser } from "../../../store/action/useAction";
import { toast } from "react-toastify";
import { setCookie } from "../../../utils/cookieManager";
import aiCompanionApi from "../../../assets/images/aiCompanion.png";
const Login = ({ setAuth }) => {
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("2n*UQzT.=Kt:Udyu");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const result = await dispatch(
        LoginUser({ username, password }, setLoading)
      );

      console.log("Login result:", result);

      if (result?.access_token) {
        toast.success("Login successful!");

        // store token
        setCookie("authToken", result.access_token, 7);
        localStorage.setItem("authorization", result.access_token);

        if (setAuth) setAuth(true);
        // console.log("set Auth",setAuth)
        navigate("/select-admin", { replace: true });
      } else {
        toast.error(result?.message || "Login failed");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.detail ||
        error.response?.data?.message ||
        "An error occurred during login"
      );
    }
  };

  return (
    <main className="auth-minimal-wrapper">
      <div className="auth-minimal-inner">
        <div className="minimal-card-wrapper">
          <div className="card mb-4 mt-5 mx-4 mx-sm-0 position-relative">
            <div className="wd-50 bg-white p-2 rounded-circle shadow-lg position-absolute translate-middle top-0 start-50">
              <img
                src={aiCompanionApi}
                alt=""
                className="img-fluid"
              />
            </div>
            <div className="card-body p-sm-5">
              <h2 className="fs-20 fw-bolder mb-4">Login</h2>
              <h4 className="fs-13 fw-bold mb-2">Login to your account</h4>
              <p className="fs-12 fw-medium text-muted">
                Welcome back! Please enter your credentials to access the
                companion dashboard.
              </p>
              <form onSubmit={handleLogin} className="w-100 mt-4 pt-2">
                <div className="mb-4">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-3">
                  <input
                    type="password"
                    className="form-control"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                {/* <div className="d-flex align-items-center justify-content-between">
                  <div>
                    <div className="custom-control custom-checkbox">
                      <input
                        type="checkbox"
                        className="custom-control-input"
                        id="rememberMe"
                      />
                      <label
                        className="custom-control-label c-pointer"
                        htmlFor="rememberMe"
                      >
                        Remember Me
                      </label>
                    </div>
                  </div>
                  <div>
                    <a href="#!" className="fs-11 text-primary">
                      Forget password?
                    </a>
                  </div>
                </div> */}
                <div className="mt-5">
                  <button
                    type="submit"
                    className="btn btn-lg btn-primary w-100"
                    disabled={loading}
                  >
                    {loading ? "Logging in..." : "Login"}
                  </button>
                </div>
              </form>

            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Login;
