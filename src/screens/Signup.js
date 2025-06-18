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

  const onChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const sendOTP = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("https://urbanbite-backend.onrender.com/api/sendotp",{
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: credentials.email })
      });

      const json = await response.json();
      if (json.success) {
        setOtpSent(true);
        toast.success("OTP sent to your email", { position: "top-center", autoClose: 3000 });
      } else {
        toast.error("Failed to send OTP", { position: "top-center", autoClose: 3000 });
      }
    } catch (error) {
      toast.error("Server error while sending OTP", { position: "top-center", autoClose: 3000 });
    }
  };

  const verifyOTP = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("https://urbanbite-backend.onrender.com/api/verifyotp",{
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
      const response = await fetch("http://localhost:5000/api/createuser", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials)
      });

      const json = await response.json();
      if (!json.success) {
        toast.error("Signup failed!", { position: "top-center", autoClose: 3000 });
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
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
        backdropFilter: 'blur(8px)',
        borderRadius: '20px',
        padding: '40px',
        width: '100%',
        maxWidth: '450px',
        boxShadow: '0 8px 32px rgba(31,38,135,0.37)',
        color: 'white'
      }}>
        <h2 className="text-center mb-4">Sign Up</h2>
        <form onSubmit={otpSent ? verifyOTP : sendOTP}>
          <div className="mb-3">
            <label>Name</label>
            <input type="text" className="form-control" name="name" value={credentials.name} onChange={onChange} required disabled={otpSent} />
          </div>
          <div className="mb-3">
            <label>Email</label>
            <input type="email" className="form-control" name="email" value={credentials.email} onChange={onChange} required disabled={otpSent} />
          </div>
          <div className="mb-3">
            <label>Password</label>
            <input type="password" className="form-control" name="password" value={credentials.password} onChange={onChange} required disabled={otpSent} />
          </div>
          <div className="mb-3">
            <label>Location</label>
            <input type="text" className="form-control" name="location" value={credentials.location} onChange={onChange} required disabled={otpSent} />
          </div>

          {otpSent && (
            <div className="mb-3">
              <label>Enter OTP</label>
              <input type="text" className="form-control" name="otp" value={credentials.otp} onChange={onChange} required />
            </div>
          )}

          <button type="submit" className="btn btn-primary w-100">
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

export default Signup;
