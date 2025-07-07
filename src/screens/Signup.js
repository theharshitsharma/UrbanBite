import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

function Signup() {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({ name: "", email: "", password: "", location: "", otp: "" });
  const [otpSent, setOtpSent] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const onChange = (e) => setCredentials({ ...credentials, [e.target.name]: e.target.value });

  const sendOTP = async (e) => {
  e.preventDefault();
  if (credentials.password.length < 6) {
    return toast.warn("Password must be at least 6 characters", {
      position: "top-center",
      autoClose: 3000
    });
  }
  try {
    const res = await fetch("https://urbanbite-backend.onrender.com/api/sendotp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: credentials.email })
    });
    const json = await res.json();

    if (json.success) {
      setOtpSent(true);
      toast.success("OTP sent!", { position: "top-center", autoClose: 3000 });
    } else {
      toast.error(json.message || "Failed to send OTP", { position: "top-center", autoClose: 3000 });
    }

  } catch {
    toast.error("Server error sending OTP", { position: "top-center", autoClose: 3000 });
  }
};


  const verifyOTP = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("https://urbanbite-backend.onrender.com/api/verifyotp", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: credentials.email, otp: credentials.otp })
      });
      const json = await res.json();
      if (json.success) {
        toast.success("OTP verified! Registering...", { position: "top-center", autoClose: 1500 });
        completeSignup();
      } else {
        toast.error("Invalid or expired OTP", { position: "top-center", autoClose: 3000 });
      }
    } catch {
      toast.error("Server error verifying OTP", { position: "top-center", autoClose: 3000 });
    }
  };

const completeSignup = async () => {
  try {
    const res = await fetch("https://urbanbite-backend.onrender.com/api/createuser", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials)
    });
    const json = await res.json();
if (json.success) {
  toast.success("Signup successful!", {
    position: "top-center",
    autoClose: 2000,
    onClose: () => navigate("/login")
  });
} else {
  toast.error(json.message || "Signup failed!", {
    position: "top-center",
    autoClose: 3000
  });
}

  } catch {
    toast.error("Server error during signup", {
      position: "top-center",
      autoClose: 3000
    });
  }
};


  const handleGoogleSuccess = async (response) => {
  const { credential } = response;
  try {
    const res = await fetch("https://urbanbite-backend.onrender.com/api/googlelogin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ credential })
    });

    const json = await res.json();

    if (json.success) {
      // ✅ Save user data to localStorage
      localStorage.setItem("userEmail", json.user.email);
      localStorage.setItem("authToken", json.token);  // if your backend sends one
      localStorage.setItem("userName", json.user.name);

      toast.success("Logged in with Google!", {
        position: "top-center",
        autoClose: 1500,
        onClose: () => navigate("/")
      });
    } else {
      toast.error(json.message || "Google login failed", {
        position: "top-center", autoClose: 3000
      });
    }
  } catch {
    toast.error("Server error during Google login", {
      position: "top-center", autoClose: 3000
    });
  }
};


  const handleGoogleError = () => {
    toast.error("Google sign-in failed", { position: "top-center", autoClose: 3000 });
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100" style={{ backgroundImage: 'url("https://images.pexels.com/photos/326278/pexels-photo-326278.jpeg")', backgroundSize: 'cover' }}>
      <div className="bg-white bg-opacity-75 p-5 rounded-4 shadow-lg" style={{ maxWidth: '480px', width: '100%' }}>
        <div className="text-center mb-4">
          <img src="/logo192.png" alt="UrbanBite" className="mb-2" style={{ width: '60px' }} />
          <h2 className="fw-bold">Join UrbanBite</h2>
          <p className="text-muted">Delicious meals delivered fast 🌯</p>
        </div>

        <form onSubmit={otpSent ? verifyOTP : sendOTP}>
          {!otpSent && (
            <>
              <div className="mb-3">
                <input type="text" className="form-control" placeholder="Name" name="name" value={credentials.name} onChange={onChange} required />
              </div>
              <div className="mb-3">
                <input type="email" className="form-control" placeholder="Email" name="email" value={credentials.email} onChange={onChange} required />
              </div>
              <div className="mb-3 position-relative">
                <input type={showPassword ? "text" : "password"} className="form-control" placeholder="Password" name="password" value={credentials.password} onChange={onChange} required />
                <span onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', top: '50%', right: '15px', cursor: 'pointer' }}>
                  {showPassword ? "🙈" : "👁️"}
                </span>
              </div>
              <div className="mb-4">
                <input type="text" className="form-control" placeholder="Location" name="location" value={credentials.location} onChange={onChange} required />
              </div>
            </>
          )}

          {otpSent && (
            <div className="mb-4">
              <input type="text" className="form-control" placeholder="Enter OTP" name="otp" value={credentials.otp} onChange={onChange} required />
            </div>
          )}

          <button type="submit" className="btn btn-primary w-100 mb-3">
            {otpSent ? "Verify OTP & Register" : "Send OTP"}
          </button>
        </form>

        <div className="text-center mb-3">— or —</div>

        <div className="d-flex justify-content-center mb-3">
          <GoogleLogin onSuccess={handleGoogleSuccess} onError={handleGoogleError} />
        </div>

        <div className="text-center">
          <Link to="/login" className="btn btn-link">Already have an account? Login</Link>
        </div>

        <ToastContainer />
      </div>
    </div>
  );
}

export default Signup;
