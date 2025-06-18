import React, { useEffect, useState, useCallback } from 'react';

export default function MyOrder() {
  const [orderData, setOrderData] = useState({});

  const fetchMyOrder = useCallback(async () => {
    try {
      const res = await fetch("https://urbanbite-backend.onrender.com/api/myorderData",{
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: localStorage.getItem('userEmail'),
        }),
      });

      const response = await res.json();
      setOrderData(response);
    } catch (error) {
      console.error("Error fetching order data:", error);
    }
  }, []);

  useEffect(() => {
    fetchMyOrder();
  }, [fetchMyOrder]);
  const deleteSingleItem = async (orderDate, item) => {
  try {
    const res = await fetch("https://urbanbite-backend.onrender.com/api/deleteItemFromData",{
      method: "DELETE",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email: localStorage.getItem("userEmail"),
        orderDate,
        name: item.name,
        size: item.size
      })
    });

    const response = await res.json();
    if (response.success) {
      fetchMyOrder();
    } else {
      console.error("Item deletion failed:", response.error);
    }
  } catch (error) {
    console.error("Error deleting item:", error);
  }
};


const deleteOrder = async (orderGroupId) => {
  try {
    const res = await fetch("https://urbanbite-backend.onrender.com/api/deleteOrder",{
      method: "DELETE",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email: localStorage.getItem("userEmail"),
        orderGroupId // using _id of the group, not order_date
      })
    });

    const response = await res.json();
    if (response.success) {
      fetchMyOrder(); // Refresh UI
    } else {
      console.error("Delete failed:", response.error);
    }
  } catch (error) {
    console.error("Error deleting order:", error);
  }
};


  return (
    <div>
      <div className="container">
        <div className="row">
          {orderData && orderData.orderData ? (
            orderData.orderData
              .slice(0)
              .reverse()
              .map((orderGroup, index) => (
                <React.Fragment key={index}>
                  <div className="m-auto mt-5 w-100">
                    <strong>Order Date:</strong> {new Date(orderGroup.order_date).toLocaleString()}
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
                        </div>
                      </div>
                    </div>
                  ))}
                </React.Fragment>
              ))
          ) : (
            <div>No orders found.</div>
          )}
        </div>
      </div>
    </div>
  );
}
