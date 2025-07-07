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
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      const email = localStorage.getItem('userEmail');
      if (!email) {
        toast.error("No email found. Please login first.");
        return;
      }

      try {
        const res = await fetch("https://urbanbite-backend.onrender.com/api/userprofile", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        });

        const json = await res.json();
        console.log("Profile API response:", json);

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
      } catch (error) {
        toast.error("Error fetching profile.");
        console.error("Fetch profile error:", error);
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

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formDataImg = new FormData();
    formDataImg.append("file", file);
    formDataImg.append("upload_preset", "urbanbit_upload");

    setIsUploading(true);

    try {
      const res = await fetch("https://api.cloudinary.com/v1_1/dbesvyrov/image/upload", {
        method: "POST",
        body: formDataImg
      });

      const data = await res.json();
      if (data.secure_url) {
        setFormData((prev) => ({ ...prev, image: data.secure_url }));
        toast.success("Image uploaded!");
      } else {
        toast.error("Upload failed.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Image upload failed.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSave = async (field) => {
    const email = localStorage.getItem('userEmail');
    if (!email) {
      toast.error("No email found.");
      return;
    }

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
            style={{ width: "120px", height: "120px", objectFit: "cover", border: '2px solid #ccc' }}
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
                placeholder="Enter mobile number"
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
                placeholder="Enter your address"
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

        {/* Image URL & Upload */}
        <div className="mb-3">
          <strong>Image:</strong>{' '}
          {editField.image ? (
            <>
              <input
                type="text"
                name="image"
                value={formData.image}
                onChange={handleChange}
                className="form-control my-2"
                placeholder="Paste image URL"
              />
              <input
                type="file"
                accept="image/*"
                className="form-control my-2"
                onChange={handleImageUpload}
              />
              <button
                className="btn btn-sm btn-success"
                onClick={() => handleSave('image')}
                disabled={isUploading}
              >
                {isUploading ? "Uploading..." : "Save"}
              </button>
            </>
          ) : (
            <>
              {profile.image ? (
                <a href={profile.image} target="_blank" rel="noopener noreferrer">
                  {profile.image.length > 30
                    ? `${profile.image.slice(0, 30)}...`
                    : profile.image}
                </a>
              ) : 'Not added'}{' '}
              <button className="btn btn-sm btn-outline-primary ms-2" onClick={() => setEditField({ ...editField, image: true })}>Edit</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Profile;
