import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

function Profile() {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const email = localStorage.getItem('userEmail');
      const res = await fetch("http://localhost:5000/api/userprofile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const json = await res.json();
      if (json.success) setProfile(json.user);
      else toast.error("Failed to fetch profile.");
    };

    fetchProfile();
  }, []);

  if (!profile) return <div>Loading profile...</div>;

  return (
    <div className="container mt-5">
      <h2>Your Profile</h2>
      <div className="card p-4">
        <p><strong>Name:</strong> {profile.name}</p>
        <p><strong>Email:</strong> {profile.email}</p>
        <p><strong>Location:</strong> {profile.location}</p>
        <p><strong>Mobile:</strong> {profile.mobile || 'Not added'}</p>
      </div>
    </div>
  );
}

export default Profile;
