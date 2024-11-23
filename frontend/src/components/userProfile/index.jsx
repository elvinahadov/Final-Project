import React, { useEffect, useState } from "react";
import useAuthStore from "../../store/authStore"; // Assume store is set up
import { Link, useParams } from "react-router-dom"; // useParams kullanarak URL parametrelerine erişebilirsiniz

const UserProfile = () => {
  const { user, updateProfile, loading, error } = useAuthStore();
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    surname: "",
    profilePic: null,
  });
  const [profilePhoto, setProfilePhoto] = useState(null);

  // URL parametresi ile reset token'ı almak
  const { resetToken } = useParams();

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        surname: user.surname || "",
      });
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setProfilePhoto(e.target.files[0]);
  };

  const handleSave = async () => {
    await updateProfile(formData, profilePhoto, user.profilePic?.public_id);
    setEditMode(false);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="w-full flex flex-col items-center p-6 bg-white text-black shadow rounded-lg min-h-screen">
      <h2 className="text-xl font-bold pb-4">Your Profile</h2>
      {editMode ? (
        <div className="w-full max-w-lg mx-auto">
          <div className="mb-4">
            <label className="block text-sm font-medium">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="border px-2 py-1 w-full"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium">Surname</label>
            <input
              type="text"
              name="surname"
              value={formData.surname}
              onChange={handleInputChange}
              className="border px-2 py-1 w-full"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium">Profile Photo</label>
            <input
              type="file"
              name="profilePic"
              onChange={handleFileChange}
              className="w-full"
            />
          </div>
          <button
            onClick={handleSave}
            className="bg-black text-white px-4 py-2 rounded-md mr-2"
          >
            Save
          </button>
          <button
            onClick={() => setEditMode(false)}
            className="bg-black text-white px-4 py-2 rounded-md"
          >
            Cancel
          </button>
        </div>
      ) : (
        <div className="flex gap-5 flex-col sm:flex-col md:flex-row lg:flex-row justify-center items-center">
          <div className="w-full sm:w-auto mt-20">
            <p>
              <strong>Name:</strong> {user?.name}
            </p>
            <p>
              <strong>Surname:</strong> {user?.surname}
            </p>
            <p>
              <strong>Email:</strong> {user?.email}
            </p>
            <div className="flex items-center justify-between mt-4">
              <button
                onClick={() => setEditMode(true)}
                className="bg-black text-white px-4 py-2 rounded-lg"
              >
                Edit
              </button>
              {resetToken ? (
                <Link
                  to={`/reset-password`}
                  className="bg-black text-white rounded-lg py-2 px-3"
                >
                  Change Password
                </Link>
              ) : (
                <Link
                  to="/change-password"
                  className="bg-black text-white rounded-lg py-2 px-3"
                >
                  Change Password
                </Link>
              )}
            </div>
          </div>
          <div className="w-[150px] h-[150px] sm:w-[200px] sm:h-[200px] lg:w-[250px] lg:h-[250px] relative">
            {user?.profilePic && (
              <img
                src={user.profilePic.secure_url}
                alt="Profile"
                className="absolute object-cover rounded-full overflow-hidden"
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;