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

  // 🕒 Format date-time for display in local timezone (IST)
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
    <div>
      <div className="container">
        <div className="row">
          {orderData.length > 0 ? (
            orderData.slice(0).reverse().map((orderGroup, index) => (
              <React.Fragment key={index}>
                <div className="m-auto mt-5 w-100">
                  <strong>Order Date:</strong>{" "}
                  {formatDateTime(orderGroup.order_date)}

                  <button
                    className="btn btn-danger btn-sm float-end"
                    onClick={() => deleteOrder(orderGroup._id)}
                  >
                    Delete
                  </button>
                  <hr />
                </div>

                {orderGroup.items.map((item, i) => (
                  <div className="col-12 col-md-6 col-lg-3" key={i}>
                    <div className="card mt-3" style={{ width: "16rem", maxHeight: "360px" }}>
                      <img
                        src={item.img}
                        className="card-img-top"
                        alt={item.name}
                        style={{ height: "120px", objectFit: "fill" }}
                      />
                      <div className="card-body">
                        <h5 className="card-title">{item.name}</h5>
                        <div className="container w-100 p-0" style={{ height: "38px" }}>
                          <span className="m-1">{item.qty}</span>
                          <span className="m-1">{item.size}</span>
                          <span className="m-1">₹{item.price}/-</span>
                        </div>
                        <span className="m-1">₹{item.price}/-</span>
                        <button
                          className="btn btn-sm btn-outline-danger float-end"
                          onClick={() => deleteSingleItem(orderGroup.order_date, item)}
                        >
                          🗑️
                        </button>
                        <div className="m-auto mt-3 w-100">
  <strong>Order Date:</strong> {formatDateTime(orderGroup.order_date)} <br />
  <strong>Payment ID:</strong> {orderGroup.paymentId || 'N/A'}
</div>

                      </div>
                    </div>
                  </div>
                ))}
              </React.Fragment>
            ))
          ) : (
            <div className="text-center fs-4 w-100 mt-5">🛒 No orders found.</div>
          )}
        </div>
      </div>
    </div>
  );
}
