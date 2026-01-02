import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Profile.css";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await axios.get(
            "http://localhost:4000/api/profile",
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
      //  console.log('response: ', response);

        setUser(response.data.user);
      } catch (err) {
        setError("Failed to load user data");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  if (loading) return <h2>Loading...</h2>;
  if (error) return <h2 className="error">{error}</h2>;

  return (
    <div className="profile-container">
      <h2>User Profile</h2>

      <div className="profile-card">
        <p><strong>Name:</strong> {user.name}</p>
        <p><strong>Email:</strong> {user.email}</p>
      </div>
    </div>
  );
};

export default Profile;