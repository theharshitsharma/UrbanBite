import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatchCart, useCart } from './ContextReducer';
import { toast } from 'react-toastify';

export default function Card({ foodItem, foodName, imgSrc, options = {} }) {
  const navigate = useNavigate();
  const dispatch = useDispatchCart();
  const cartData = useCart();

  const [qty, setQty] = useState(1);
  const variants = Object.keys(options);
  const initialSize = variants.length ? variants[0] : '';
  const [selectedSize, setSelectedSize] = useState(initialSize);

  const id = foodItem?._id || '';
  const fallbackImg = '/images/fallback.jpg'; // Host locally in public/images

  const pricePerUnit = parseInt(options[selectedSize] || 0, 10);
  const finalPrice = qty * pricePerUnit;

  const handleAddToCart = async () => {
    if (!localStorage.getItem('authToken')) {
      navigate('/login');
      return;
    }
        const cartItemId = `${id}-${selectedSize}`;


const existing = cartData.find(ci =>
  ci.id === id &&
  ci.size === selectedSize &&
  ci.name === foodName
);
    if (existing) {
      await dispatch({ type: 'UPDATE', id:cartItemId, size: selectedSize, price: finalPrice, qty:existing.qty + qty });
      toast.success("Item updated in cart!");
    } else {
      await dispatch({ type: 'ADD', id:cartItemId, name: foodName, price: finalPrice, qty, size: selectedSize, img: imgSrc || fallbackImg });
      toast.success("Item added to cart!");
    }
  };

  return (
    <div className="card mt-3" style={{ width: '16rem', maxHeight: '360px' }}>
      <img
        src={imgSrc || fallbackImg}
        onError={e => { e.currentTarget.src = fallbackImg; }}
        className="card-img-top"
        alt={foodName}
        style={{ height: '120px', objectFit: 'cover' }}
      />
      <div className="card-body">
        <h5 className="card-title">{foodName}</h5>

        <div className="d-flex align-items-center mb-2">
          <select
            className="form-select me-2"
            value={qty}
            onChange={e => setQty(parseInt(e.target.value, 10))}
          >
            {Array.from({ length: 6 }, (_, i) => i + 1).map(n => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>

          <select
            className="form-select me-2"
            value={selectedSize}
            onChange={e => setSelectedSize(e.target.value)}
          >
            {variants.map(v => (
              <option key={v} value={v}>{v}</option>
            ))}
          </select>

          <span className="fs-5">₹{finalPrice}/-</span>
        </div>

        <button
          className="btn btn-success w-100"
          onClick={handleAddToCart}
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}