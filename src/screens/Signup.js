import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

function Signup() {
  const navigate = useNavigate();

  const [credentials, setCredentials] = useState({
    name: "",
    email: "",
    password: "",
    location: "",
    otp: ""
  });

  const [otpSent, setOtpSent] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const onChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const sendOTP = async (e) => {
    e.preventDefault();

    if (credentials.password.length < 6) {
      toast.warn("Password must be at least 6 characters long", {
        position: "top-center", autoClose: 3000
      });
      return;
    }

    try {
      const response = await fetch("https://urbanbite-backend.onrender.com/api/sendotp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: credentials.email })
      });

      const json = await response.json();
      if (json.success) {
        setOtpSent(true);
        toast.success("OTP sent to your email", { position: "top-center", autoClose: 3000 });
      } else {
        toast.error(json.message || "Failed to send OTP", { position: "top-center", autoClose: 3000 });
      }
    } catch (error) {
      toast.error("Server error while sending OTP", { position: "top-center", autoClose: 3000 });
    }
  };

  const verifyOTP = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("https://urbanbite-backend.onrender.com/api/verifyotp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: credentials.email, otp: credentials.otp })
      });

      const json = await response.json();
      if (json.success) {
        toast.success("OTP verified! Completing registration...", {
          position: "top-center",
          autoClose: 1500,
        });
        completeSignup();
      } else {
        toast.error("Invalid or expired OTP", { position: "top-center", autoClose: 3000 });
      }
    } catch (error) {
      toast.error("Server error during OTP verification", { position: "top-center", autoClose: 3000 });
    }
  };

  const completeSignup = async () => {
    try {
      const response = await fetch("https://urbanbite-backend.onrender.com/api/createuser", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials)
      });

      const json = await response.json();
      if (!json.success) {
        toast.error(json.message || "Signup failed!", { position: "top-center", autoClose: 3000 });
      } else {
        toast.success("Signup successful! Redirecting...", {
          position: "top-center",
          autoClose: 2000,
          onClose: () => navigate("/login")
        });
      }
    } catch (error) {
      toast.error("Server error during signup", { position: "top-center", autoClose: 3000 });
    }
  };

  return (
    <div style={{
      backgroundImage: 'url("https://images.pexels.com/photos/326278/pexels-photo-326278.jpeg")',
      height: '100vh',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    }}>
      <div style={{
        background: 'rgba(255, 255, 255, 0.15)',
        backdropFilter: 'blur(12px)',
        borderRadius: '20px',
        padding: '40px',
        width: '100%',
        maxWidth: '500px',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.25)',
        color: 'white',
        fontFamily: 'Segoe UI, sans-serif'
      }}>
        <div className="text-center mb-4">
  <img
    src="https://sdmntprcentralus.oaiusercontent.com/files/00000000-e7cc-61f5-baa4-ec4a652ddfbf/raw?se=2025-07-05T13%3A55%3A44Z&sp=r&sv=2024-08-04&sr=b&scid=d971ba93-2147-51d5-9ed8-afa4872c68bc&skoid=9ccea605-1409-4478-82eb-9c83b25dc1b0&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2025-07-04T14%3A12%3A12Z&ske=2025-07-05T14%3A12%3A12Z&sks=b&skv=2024-08-04&sig=0tl66cNYLSSlTIXDIW3BpHbkgGt8yM/JpMtNaO4J9U4%3D"
    alt="UrbanBite"
    style={{
      width: '80px',
      marginBottom: '10px',
      display: 'block',
      marginLeft: 'auto',
      marginRight: 'auto',
      filter: 'drop-shadow(0 0 6px rgba(0,0,0,0.6))'
    }}
  />
  <h2 style={{ marginTop: '10px', fontWeight: '600' }}>Join UrbanBite</h2>
  <p className="text-light" style={{ fontSize: '14px', opacity: 0.9 }}>
    Get delicious food at your doorstep
  </p>
</div>


        <form onSubmit={otpSent ? verifyOTP : sendOTP}>
          <div className="mb-3">
            <label>Name</label>
            <input
              type="text"
              className="form-control"
              name="name"
              value={credentials.name}
              onChange={onChange}
              required
              disabled={otpSent}
              style={inputStyle}
            />
          </div>
          <div className="mb-3">
            <label>Email</label>
            <input
              type="email"
              className="form-control"
              name="email"
              value={credentials.email}
              onChange={onChange}
              required
              disabled={otpSent}
              style={inputStyle}
            />
          </div>
          <div className="mb-3">
            <label>Password</label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? "text" : "password"}
                className="form-control"
                name="password"
                value={credentials.password}
                onChange={onChange}
                required
                disabled={otpSent}
                style={inputStyle}
              />
              <span
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: 10,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'white',
                  cursor: 'pointer'
                }}
              >
                {showPassword ? "🙈" : "👁️"}
              </span>
            </div>
          </div>
          <div className="mb-3">
            <label>Location</label>
            <input
              type="text"
              className="form-control"
              name="location"
              value={credentials.location}
              onChange={onChange}
              required
              disabled={otpSent}
              style={inputStyle}
            />
          </div>

          {otpSent && (
            <div className="mb-3">
              <label>Enter OTP</label>
              <input
                type="text"
                className="form-control"
                name="otp"
                value={credentials.otp}
                onChange={onChange}
                required
                style={inputStyle}
              />
            </div>
          )}

          <button type="submit" className="btn btn-primary w-100 mt-2">
            {otpSent ? "Verify OTP & Register" : "Send OTP"}
          </button>

          <Link to="/login" className="btn btn-outline-light w-100 mt-3">
            Already a user?
          </Link>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
}

// 🔧 Input styling (Glass UI)
const inputStyle = {
  background: 'rgba(255,255,255,0.1)',
  border: '1px solid rgba(255,255,255,0.3)',
  color: '#fff',
  padding: '10px',
  borderRadius: '10px'
};

export default Signup;
