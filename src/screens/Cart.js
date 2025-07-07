import React from 'react';
import {  useNavigate } from 'react-router-dom';

import Delete from '@mui/icons-material/Delete';
import { useCart, useDispatchCart} from '../components/ContextReducer';
import { toast } from 'react-toastify';


export default function Cart() {
  const data = useCart();
  const dispatch = useDispatchCart();
let navigate=useNavigate()
  if (data.length === 0) {
    return (
      <div>
        <div className='m-5 w-100 text-center fs-3'>The Cart is Empty!</div>
      </div>
    );
  }

  const handleCheckOut = async () => {
     navigate("/payment", {
    state: {
      cartItems: data,
      totalPrice
    }
  });
    // const userEmail = localStorage.getItem("userEmail");
    // console.log("📦 userEmail:", userEmail);

    // try {
    //   const response = await fetch("https://urbanbite-backend.onrender.com/api/orderData",{
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify({
    //       email: userEmail,
    //       order: { items: data }
    //     })
    //   });

    //   if (response.ok) {
    //     dispatch({ type: "DROP" });
    //     toast.success("✅ Order placed successfully!");
    //     navigate("/myorder")
    //   } else {
    //     const errorText = await response.text();
    //     toast.error("❌ Order failed: " + errorText);
    //   }
    // } catch (error) {
    //   console.error("Checkout error:", error);
    //   toast.error("❌ Checkout error: " + error.message);
    // }
  };

  const totalPrice = data.reduce((total, food) => total + food.price, 0);

  return (
    <div>
      <div className='container m-auto mt-5 table-responsive table-responsive-sm table-responsive-md'>
        <table className='table table-hover'>
          <thead className='text-success fs-4'>
            <tr>
              <th scope='col'>#</th>
              <th scope='col'>Name</th>
              <th scope='col'>Quantity</th>
              <th scope='col'>Option</th>
              <th scope='col'>Amount</th>
              <th scope='col'></th>
            </tr>
          </thead>
          <tbody>
            {data.map((food, index) => (
              <tr key={index}>
                <th scope='row'>{index + 1}</th>
                <td>{food.name}</td>
                <td>{food.qty}</td>
                <td>{food.size}</td>
                <td>{food.price}</td>
                <td>
                  <button type="button" className="btn p-0">
                    <Delete onClick={() => {
                      dispatch({ type: "REMOVE", index });
                      toast.info("Item removed from cart");
                    }} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div><h1 className='fs-2'>Total Price: ₹{totalPrice}/-</h1></div>
        <div>
          <button className='btn bg-success mt-5' onClick={handleCheckOut}>Check Out</button>
        </div>
      </div>
    </div>
  );
}
