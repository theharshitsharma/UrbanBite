import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Badge from "react-bootstrap/Badge";
import Modal from "react-bootstrap/Modal";
import ThemeToggle from "./ThemeToggle";
import { useCart, useDispatchCart } from './ContextReducer';

export default function Navbar() {
  const navigate = useNavigate();
  const [cartView, setCartView] = useState(false);
  const cartData = useCart();
  const dispatch = useDispatchCart();

  const handleLogout = () => {
    dispatch({ type: "DROP" });
    localStorage.removeItem("authToken");
    localStorage.removeItem("userEmail");
    navigate("/login");
  };

  const handleCartOpen = () => setCartView(true);
  const handleCartClose = () => setCartView(false);

  const handleRemove = (index) => {
    dispatch({ type: "REMOVE", index });
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-dark bg-success shadow-sm">
        <div className="container-fluid px-4">
          <Link className="navbar-brand fs-2 fw-bold fst-italic" to="/">
            UrbanBite
          </Link>

          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon" />
          </button>

          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <Link className="nav-link active fs-5" to="/">
                  Home
                </Link>
              </li>
              {localStorage.getItem("authToken") && (
                <li className="nav-item">
                  <Link className="nav-link fs-5" to="/myOrder">
                    My Orders
                  </Link>
                </li>
              )}
              <li className="nav-item">
                <Link className="nav-link fs-5" to="/payment">
                  Payment
                </Link>
              </li>
            </ul>

            {localStorage.getItem("authToken") ? (
              <div className="d-flex align-items-center gap-3">
                <ThemeToggle />

                <button
                  className="btn btn-outline-light position-relative"
                  onClick={handleCartOpen}
                >
                  🛒 My Cart
                  <Badge pill bg="danger" className="position-absolute top-0 start-100 translate-middle">
                    {cartData.reduce((total, item) => total + item.qty, 0)}
                  </Badge>
                </button>

                <Link className="btn btn-light text-success fw-semibold" to="/profile">
                  Profile
                </Link>

                <button
                  className="btn btn-outline-light fw-semibold"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="d-flex gap-2">
                <Link className="btn btn-outline-light" to="/login">
                  Login
                </Link>
                <Link className="btn btn-light text-success fw-semibold" to="/createuser">
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Cart Modal */}
      <Modal show={cartView} onHide={handleCartClose} centered>
        <Modal.Header closeButton className="bg-success text-white">
          <Modal.Title>Your Cart</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="mb-3">
            <p className="fw-bold mb-1">Total Items: {cartData.reduce((a, i) => a + i.qty, 0)}</p>
            <p className="fw-bold mb-2">Total Price: ₹{cartData.reduce((a, i) => a + i.price, 0)}</p>
          </div>

          {cartData.length === 0 ? (
            <p className="text-muted">Your cart is empty.</p>
          ) : (
            <ul className="list-group">
              {cartData.map((item, index) => (
                <li
                  key={`${item.name}-${index}`}
                  className="list-group-item d-flex justify-content-between align-items-center"
                >
                  <div>
                    {item.name} <span className="text-muted">(x{item.qty}, {item.size})</span>
                    <div className="text-success fw-semibold">₹{item.price}</div>
                  </div>
                  <button
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => handleRemove(index)}
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          )}
        </Modal.Body>
        <Modal.Footer>
          <button className="btn btn-secondary" onClick={handleCartClose}>
            Close
          </button>
          {cartData.length > 0 && (
            <Link to="/cart" className="btn btn-success" onClick={handleCartClose}>
              Go to Cart
            </Link>
          )}
        </Modal.Footer>
      </Modal>
    </>
  );
}
