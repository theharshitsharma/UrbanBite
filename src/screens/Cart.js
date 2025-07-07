import React from 'react';
import { useNavigate } from 'react-router-dom';
import Delete from '@mui/icons-material/Delete';
import { useCart, useDispatchCart } from '../components/ContextReducer';
import { toast } from 'react-toastify';

export default function Cart() {
  const data = useCart();
  const dispatch = useDispatchCart();
  const navigate = useNavigate();

  const totalPrice = data.reduce((total, food) => total + food.price, 0);

  const handleCheckOut = () => {
    navigate("/payment", {
      state: {
        cartItems: data,
        totalPrice
      }
    });
  };

  if (data.length === 0) {
    return (
      <div className="container text-center py-5">
        <h3 className="text-muted">
          🛒 Your cart is empty!
        </h3>
        <p className="text-secondary">Looks like you're hungry — go add something tasty.</p>
      </div>
    );
  }

  return (
    <div className="container my-5">
      <div className="card shadow-sm border-0">
        <div className="card-body">
          <h3 className="card-title text-success mb-4">🧾 Your Cart</h3>

          <div className="table-responsive">
            <table className="table table-striped table-hover align-middle">
              <thead className="table-success text-center">
                <tr>
                  <th>#</th>
                  <th>Item</th>
                  <th>Quantity</th>
                  <th>Size</th>
                  <th>Price</th>
                  <th></th>
                </tr>
              </thead>
              <tbody className="text-center">
                {data.map((food, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{food.name}</td>
                    <td>{food.qty}</td>
                    <td>{food.size}</td>
                    <td>₹{food.price}</td>
                    <td>
                      <button
                        className="btn btn-outline-danger btn-sm"
                        onClick={() => {
                          dispatch({ type: "REMOVE", index });
                          toast.info("Item removed from cart");
                        }}
                      >
                        <Delete fontSize="small" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="d-flex justify-content-between align-items-center mt-4">
            <h4 className="fw-semibold text-dark">
              Total Price: <span className="text-success">₹{totalPrice}/-</span>
            </h4>
            <button className="btn btn-success btn-lg" onClick={handleCheckOut}>
              ✅ Proceed to Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
