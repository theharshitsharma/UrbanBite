import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

function Profile() {
  const [profile, setProfile] = useState(null);
  const [editField, setEditField] = useState({
    mobile: false,
    address: false,
    image: false
  });
  const [formData, setFormData] = useState({
    mobile: '',
    address: '',
    image: ''
  });

  useEffect(() => {
    const fetchProfile = async () => {
      const email = localStorage.getItem('userEmail');
      const res = await fetch("https://urbanbite-backend.onrender.com/api/userprofile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const json = await res.json();
      if (json.success) {
        setProfile(json.user);
        setFormData({
          mobile: json.user.mobile || '',
          address: json.user.address || '',
          image: json.user.image || ''
        });
      } else {
        toast.error("Failed to fetch profile.");
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSave = async (field) => {
    const email = localStorage.getItem('userEmail');
    const updatePayload = { email };
    updatePayload[field] = formData[field];

    const res = await fetch("https://urbanbite-backend.onrender.com/api/updateprofile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatePayload),
    });

    const json = await res.json();
    if (json.success) {
      toast.success(`${field} updated successfully!`);
      setProfile(json.user);
      setEditField(prev => ({ ...prev, [field]: false }));
    } else {
      toast.error("Failed to update profile.");
    }
  };

  if (!profile) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '70vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <h2 className="mb-4 text-center">👤 Your Profile</h2>
      <div className="card shadow-lg p-4 mx-auto" style={{ maxWidth: '500px' }}>
        <div className="text-center mb-4">
          <img
            src={formData.image || 'https://via.placeholder.com/120'}
            alt="Profile"
            className="rounded-circle shadow"
            style={{ width: "120px", height: "120px", objectFit: "cover" }}
          />
        </div>

        <p><strong>Name:</strong> {profile.name}</p>
        <p><strong>Email:</strong> {profile.email}</p>
        <p><strong>Location:</strong> {profile.location}</p>

        {/* Mobile Field */}
        <div className="mb-3">
          <strong>Mobile:</strong>{' '}
          {editField.mobile ? (
            <>
              <input
                type="text"
                name="mobile"
                value={formData.mobile}
                onChange={handleChange}
                className="form-control my-2"
              />
              <button className="btn btn-sm btn-success" onClick={() => handleSave('mobile')}>Save</button>
            </>
          ) : (
            <>
              {profile.mobile || 'Not added'}{' '}
              <button className="btn btn-sm btn-outline-primary ms-2" onClick={() => setEditField({ ...editField, mobile: true })}>Edit</button>
            </>
          )}
        </div>

        {/* Address Field */}
        <div className="mb-3">
          <strong>Address:</strong>{' '}
          {editField.address ? (
            <>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="form-control my-2"
              />
              <button className="btn btn-sm btn-success" onClick={() => handleSave('address')}>Save</button>
            </>
          ) : (
            <>
              {profile.address || 'Not added'}{' '}
              <button className="btn btn-sm btn-outline-primary ms-2" onClick={() => setEditField({ ...editField, address: true })}>Edit</button>
            </>
          )}
        </div>

        {/* Image Field */}
        <div className="mb-3">
          <strong>Image URL:</strong>{' '}
          {editField.image ? (
            <>
              <input
                type="text"
                name="image"
                value={formData.image}
                onChange={handleChange}
                className="form-control my-2"
              />
              <button className="btn btn-sm btn-success" onClick={() => handleSave('image')}>Save</button>
            </>
          ) : (
            <>
              {profile.image || 'Not added'}{' '}
              <button className="btn btn-sm btn-outline-primary ms-2" onClick={() => setEditField({ ...editField, image: true })}>Edit</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Profile;
