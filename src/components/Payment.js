import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useDispatchCart } from '../components/ContextReducer';

function Payment() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatchCart();

  const { cartItems, totalPrice } = location.state || {};

  const handlePayment = () => {
    if (!cartItems || cartItems.length === 0) {
      toast.error("🛒 No items to pay for.");
      return;
    }

    const options = {
      key: "rzp_test_JCXCkcwlHZeafM", // ✅ Replace with your Razorpay key
      amount: totalPrice * 100, // ₹ => paise
      currency: "INR",
      name: "UrbanBite",
      description: "Order Payment",
      image: "https://your-logo-url.com/logo.png", // Optional: your app logo
      handler: async function (response) {
  const paymentId = response.razorpay_payment_id;
  toast.success(`✅ Payment Successful!`);

  const email = localStorage.getItem("userEmail");

  try {
    const res = await fetch("https://urbanbite-backend.onrender.com/api/orderData", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        order: { items: cartItems },
        paymentId: paymentId
      })
    });

    const result = await res.json();

    if (result.success) {
      toast.success("🎉 Order Placed!");
      dispatch({ type: "DROP" });
      navigate("/myorder");
    } else {
      toast.error("❌ Order not saved.");
    }
  } catch (error) {
    console.error("Order error:", error);
    toast.error("❌ Error placing order.");
  }
}
,
      prefill: {
        name: "Harshit Sharma",
        email: localStorage.getItem("userEmail") || "example@gmail.com",
        contact: "9999999999"
      },
      theme: {
        color: "#0d6efd"
      }
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  return (
    <div className="container mt-5 text-center">
      <h2>💳 Confirm Your Payment</h2>
      <p>Total Amount: <strong>₹{totalPrice}</strong></p>
      <button className="btn btn-success mt-3" onClick={handlePayment}>
        Pay Now
      </button>
    </div>
  );
}

export default Payment;
