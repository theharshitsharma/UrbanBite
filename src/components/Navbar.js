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
    dispatch({ type: "DROP" }); // Reset cart state
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
      <nav className="navbar navbar-expand-lg navbar-dark bg-success">
        <div className="container-fluid">
          <Link className="navbar-brand fs-1 fst-italic" to="/">
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
            </ul>

            {localStorage.getItem("authToken") ? (
              <div className="d-flex align-items-center gap-2">
                <ThemeToggle/>
                <button
                  className="btn btn-light text-success position-relative"
                  onClick={handleCartOpen}
                >
                  My Cart
                  <Badge pill bg="danger" className="position-absolute top-0 start-100 translate-middle">
                    {cartData.reduce((total, item) => total + item.qty, 0)}
                  </Badge>
                </button>

                <Link className="btn btn-light text-success" to="/profile">
                  View Profile
                </Link>

                <button
                  className="btn btn-light text-success"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="d-flex">
                <Link className="btn btn-outline-light mx-1" to="/login">
                  Login
                </Link>
                <Link className="btn btn-light text-success mx-1" to="/createuser">
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Cart Modal */}
      <Modal show={cartView} onHide={handleCartClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Your Cart</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className="fw-bold">Total Items: {cartData.reduce((a, i) => a + i.qty, 0)}</p>
          <p className="fw-bold">Total Price: ₹{cartData.reduce((a, i) => a + i.price, 0)}</p>

          {cartData.length === 0 ? (
            <p>Your cart is empty.</p>
          ) : (
            <ul className="list-unstyled">
              {cartData.map((item, index) => (
                <li key={`${item.name}-${index}`} className="d-flex justify-content-between align-items-center mb-2">
                  <span>{item.name} (Qty: {item.qty}, Size: {item.size}) - ₹{item.price}</span>
                  <button
                    className="btn btn-sm btn-danger"
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
            <Link to="/cart" className="btn btn-primary" onClick={handleCartClose}>
              Go to Cart
            </Link>
          )}
        </Modal.Footer>
      </Modal>
    </>
  );
}
