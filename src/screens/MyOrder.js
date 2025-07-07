import React, { useEffect, useState, useCallback } from 'react';

export default function MyOrder() {
  const [orderData, setOrderData] = useState([]);

  const fetchMyOrder = useCallback(async () => {
    try {
      const BASE_URL = process.env.NODE_ENV === "development"
        ? "http://localhost:5000/api/myorderData"
        : "https://urbanbite-backend.onrender.com/api/myorderData";

      const res = await fetch(BASE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: localStorage.getItem('userEmail') }),
      });

      const response = await res.json();
      setOrderData(response.orderData || []);
    } catch (error) {
      console.error("Error fetching order data:", error);
    }
  }, []);

  useEffect(() => {
    fetchMyOrder();
  }, [fetchMyOrder]);

  const deleteSingleItem = async (orderDate, item) => {
    try {
      const BASE_URL = process.env.NODE_ENV === "development"
        ? "http://localhost:5000/api/deleteItemFromData"
        : "https://urbanbite-backend.onrender.com/api/deleteItemFromData";

      const res = await fetch(BASE_URL, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: localStorage.getItem("userEmail"),
          orderDate,
          name: item.name,
          size: item.size
        })
      });

      const response = await res.json();
      if (response.success) fetchMyOrder();
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  const deleteOrder = async (orderGroupId) => {
    try {
      const BASE_URL = process.env.NODE_ENV === "development"
        ? "http://localhost:5000/api/deleteOrder"
        : "https://urbanbite-backend.onrender.com/api/deleteOrder";

      const res = await fetch(BASE_URL, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: localStorage.getItem("userEmail"),
          orderGroupId
        })
      });

      const response = await res.json();
      if (response.success) fetchMyOrder();
    } catch (error) {
      console.error("Error deleting order:", error);
    }
  };

  const formatDateTime = (isoDate) => {
    return new Date(isoDate).toLocaleString("en-IN", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
      timeZone: "Asia/Kolkata"
    });
  };

  return (
    <div className="container py-4">
      <div className="row">
        {orderData.length > 0 ? (
          orderData.slice(0).reverse().map((orderGroup, index) => (
            <React.Fragment key={index}>
              <div className="col-12 mt-4">
                <div className="d-flex justify-content-between align-items-center bg-light p-3 rounded shadow-sm">
                  <div>
                    <strong>Order Date:</strong> {formatDateTime(orderGroup.order_date)}<br />
                    <strong>Payment ID:</strong> {orderGroup.paymentId || 'N/A'}
                  </div>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => deleteOrder(orderGroup._id)}
                  >
                    Delete Entire Order
                  </button>
                </div>
              </div>

              {orderGroup.items.map((item, i) => (
                <div className="col-12 col-md-6 col-lg-3 mt-4" key={i}>
                  <div className="card shadow-sm h-100">
                    <img
                      src={item.img}
                      className="card-img-top"
                      alt={item.name}
                      style={{ height: "150px", objectFit: "cover" }}
                    />
                    <div className="card-body d-flex flex-column">
                      <h5 className="card-title">{item.name}</h5>
                      <div className="mb-2">
                        <span className="badge bg-primary me-1">Qty: {item.qty}</span>
                        <span className="badge bg-secondary me-1">Size: {item.size}</span>
                        <span className="badge bg-success">₹{item.price}</span>
                      </div>
                      <div className="mt-auto d-flex justify-content-end">
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => deleteSingleItem(orderGroup.order_date, item)}
                        >
                          🗑️ Remove
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </React.Fragment>
          ))
        ) : (
          <div className="text-center fs-4 w-100 mt-5 text-muted">
            🛒 No orders found.
          </div>
        )}
      </div>
    </div>
  );
}
