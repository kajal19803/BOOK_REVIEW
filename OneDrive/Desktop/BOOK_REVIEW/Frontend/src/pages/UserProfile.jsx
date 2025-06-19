import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
const API = import.meta.env.VITE_API_URL;

const UserProfile = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({ name: "", password: "" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [editMode, setEditMode] = useState(false);

  const token = localStorage.getItem("userToken");

  useEffect(() => {
    fetchUserData();
  }, [id]);

  const fetchUserData = async () => {
    try {
      const res = await axios.get(`${API}/api/users/${id}`);
      setUser(res.data);
      setFormData({ name: res.data.name, password: "" });
      setLoading(false);
    } catch (err) {
      console.error("❌ Failed to load user profile:", err);
      setError("Could not load user profile.");
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    try {
      const updates = {
        name: formData.name,
      };

      if (formData.password.trim()) {
        updates.password = formData.password;
      }

      const res = await axios.put(`${API}/api/users/${id}`, updates, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setUser(res.data);
      setSuccessMsg("✅ Profile updated!");
      setEditMode(false);
      setFormData({ ...formData, password: "" });
    } catch (err) {
      console.error("Update failed:", err);
      setError("⚠️ Failed to update profile.");
    }
  };

  if (loading) return <p className="text-center py-8">⏳ Loading profile...</p>;
  if (error) return <p className="text-center text-red-500 py-8">{error}</p>;

  return (
    <div className="min-h-screen w-full px-4 py-6 bg-gradient-to-br from-blue-100 via-green-100 to-red-100 pt-20">
      <div className="max-w-4xl mx-auto bg-white rounded-lg p-6 shadow-md">
        <h2 className="text-2xl font-bold mb-4">👤 Profile</h2>

        {successMsg && <p className="text-green-600 mb-2">{successMsg}</p>}
        {error && <p className="text-red-500 mb-2">{error}</p>}

        <div className="space-y-3">
          <div>
            <label className="block text-gray-700 font-medium">Name:</label>
            {editMode ? (
              <input
                type="text"
                className="w-full border px-3 py-2 rounded mt-1"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            ) : (
              <p className="text-gray-700">{user.name}</p>
            )}
          </div>

          <div>
            <label className="block text-gray-700 font-medium">Email:</label>
            <p className="text-gray-700">{user.email}</p>
          </div>

          <div>
            <label className="block text-gray-700 font-medium">Verified:</label>
            <p className="text-gray-700">{user.isVerified ? "✅ Yes" : "❌ No"}</p>
          </div>

          <div>
            <label className="block text-gray-700 font-medium">Joined:</label>
            <p className="text-gray-700">{new Date(user.createdAt).toLocaleDateString()}</p>
          </div>

          {editMode && (
            <div>
              <label className="block text-gray-700 font-medium">New Password (optional):</label>
              <input
                type="password"
                className="w-full border px-3 py-2 rounded mt-1"
                placeholder="Leave blank to keep old password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>
          )}
        </div>

        <div className="mt-6 flex gap-4">
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            onClick={() => {
              setEditMode(!editMode);
              setSuccessMsg("");
              setError("");
            }}
          >
            {editMode ? "Cancel" : "Edit Profile"}
          </button>

          {editMode && (
            <button
              onClick={handleUpdate}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Save Changes
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;


