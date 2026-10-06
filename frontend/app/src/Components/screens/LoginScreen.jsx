import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function LoginScreen() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault();
    setError("");

    if (username.trim() === "" || password.trim() === "") {
      setError("Username and password rendum venum");
      return;
    }

    try {
      const response = await fetch("/api/handlelogin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: username, password: password }),
      });

      const data = await response.json();

      if (response.ok) {
        navigate("/");
      } else {
        setError(data.error || "Invalid username or password");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Server connect aagala. Backend run aagudha paarunga.");
    }
  };

  return (
    <div className="container-fluid p-3">
      <div className="row justify-content-center mt-5">
        <div className="col-md-4">
          <div className="border p-4">
            <h5
              className="text-secondary text-uppercase mb-4"
              style={{ letterSpacing: "2px" }}
            >
              Login
            </h5>

            <form onSubmit={handleLogin}>
              <div className="mb-3">
                <label className="form-label text-secondary">Username</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>

              <div className="mb-3">
                <label className="form-label text-secondary">Password</label>
                <input
                  type="password"
                  className="form-control"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              {error && <p className="text-danger">{error}</p>}

              <button type="submit" className="btn btn-dark rounded-0 px-4 py-3 w-100">
                LOGIN
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginScreen;