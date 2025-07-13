import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatchCart } from '../components/ContextReducer';
import { toast } from "react-toastify";
import { GoogleLogin } from "@react-oauth/google";
import 'react-toastify/dist/ReactToastify.css';

export default function Login() {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [redirectToHome, setRedirectToHome] = useState(false);
  const dispatch = useDispatchCart();
  const navigate = useNavigate();

  // Redirect after toast
  useEffect(() => {
    if (redirectToHome) {
      navigate("/");
    }
  }, [redirectToHome, navigate]);

  const onChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch("https://urbanbite-backend.onrender.com/api/loginuser", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: credentials.email,
        password: credentials.password,
      }),
    });

    const json = await res.json();

    if (json.success) {
      toast.success("Login successful!", {
        position: "top-center",
        autoClose: 2000,
      });

      localStorage.setItem("userEmail", credentials.email);
      localStorage.setItem("authToken", json.authToken);
      dispatch({ type: "DROP" });

      setRedirectToHome(true); // 👈 Safe redirect after toast
    } else {
      toast.error("Invalid email or password", {
        position: "top-center",
        autoClose: 3000,
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
        localStorage.setItem("userEmail", json.user.email);
        localStorage.setItem("authToken", json.token);

        toast.success("Logged in with Google!", {
          position: "top-center",
          autoClose: 1500,
        });

        setRedirectToHome(true); // 👈 Triggers redirect
      } else {
        toast.error(json.message || "Google login failed", {
          position: "top-center",
          autoClose: 3000
        });
      }
    } catch {
      toast.error("Server error during Google login", {
        position: "top-center",
        autoClose: 3000
      });
    }
  };

  const handleGoogleError = () => {
    toast.error("Google sign-in failed", {
      position: "top-center",
      autoClose: 3000
    });
  };

  return (
    <div style={{
      backgroundImage: 'url("https://images.pexels.com/photos/1565982/pexels-photo-1565982.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1")',
      height: '100vh',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    }}>
      <div style={{
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
        backdropFilter: 'blur(8px)',
        borderRadius: '20px',
        padding: '40px',
        width: '100%',
        maxWidth: '400px',
        boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
        color: 'white',
      }}>
        <h2 className="text-center mb-4">Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label>Email address</label>
            <input
              type="email"
              className="form-control"
              name="email"
              value={credentials.email}
              onChange={onChange}
              required
            />
          </div>
          <div className="mb-3">
            <label>Password</label>
            <input
              type="password"
              className="form-control"
              name="password"
              value={credentials.password}
              onChange={onChange}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary w-100">Login</button>
        </form>

        <div className="text-center my-3">— or —</div>

        <div className="d-flex justify-content-center mb-3">
          <GoogleLogin onSuccess={handleGoogleSuccess} onError={handleGoogleError} />
        </div>

        <Link to="/createuser" className="btn btn-outline-light w-100 mt-3">
          New user?
        </Link>
      </div>
    </div>
  );
}
