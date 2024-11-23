import React, { useEffect, useState } from "react";
import useAuthStore from "../../../store/authStore";
import { FaUserAlt } from "react-icons/fa";
import { toast } from "react-toastify";

const UsersPage = () => {
  const { fetchAllUsers, users, loading, error, updateUserAdminStatus } =
    useAuthStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isUser, setIsUser] = useState(false);

  useEffect(() => {
    if (users.length === 0) {
      fetchAllUsers();
    }
  }, [fetchAllUsers, users.length]);

  const handleEditClick = (user) => {
    setSelectedUser(user);
    setIsAdmin(user.isAdmin);
    setIsUser(!user.isAdmin);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  const handleCheckboxChange = (type) => {
    if (type === "admin") {
      setIsAdmin(!isAdmin);
      setIsUser(false);
    } else if (type === "user") {
      setIsUser(!isUser);
      setIsAdmin(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selectedUser) {
      const newRole = isAdmin ? true : false;
      const result = await updateUserAdminStatus(selectedUser._id, newRole);
      if (result.success) {
        toast.success(result.message);
        handleModalClose();
      } else {
        toast.error(result.message);
      }
    }
  };

  if (loading)
    return <div className="text-center text-[64px] mt-4">Loading...</div>;
  if (error)
    return <div className="text-red-500 text-center mt-4">{error}</div>;

  return (
    <div className="font-azeret">
      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 bg-white rounded-lg shadow">
          <thead className="bg-black text-white">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                Profile Picture
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                Surname
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                Role
              </th>
              <th className="px-6 py-3 text-xs font-medium uppercase tracking-wider text-center">
                Edit
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user._id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <FaUserAlt />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{user.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">{user.surname}</td>
                <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {user.isAdmin ? "Admin" : "User"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <button
                    onClick={() => handleEditClick(user)}
                    className="bg-yellow-500 px-4 py-1 text-white rounded-lg"
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="block md:hidden">
        {users.map((user) => (
          <div
            key={user._id}
            className="bg-white shadow-lg rounded-lg p-4 my-3"
          >
            <div className="flex items-center">
              <FaUserAlt className="text-gray-600" />
              <div className="ml-4 flex-1">
                <h3 className="font-semibold text-lg">
                  {user.name} {user.surname}
                </h3>
                <p className="text-sm text-gray-600">{user.email}</p>
                <p className="text-sm text-gray-600">
                  Role: {user.isAdmin ? "Admin" : "User"}
                </p>
              </div>
              <button
                onClick={() => handleEditClick(user)}
                className="bg-yellow-500 px-2 py-1 text-white rounded-lg"
              >
                Edit
              </button>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 w-11/12 md:w-1/3">
            <h2 className="text-xl font-semibold mb-4">Edit User Role</h2>
            <form onSubmit={handleSubmit}>
              <div className="flex items-center mb-4">
                <input
                  type="checkbox"
                  id="admin"
                  checked={isAdmin}
                  onChange={() => handleCheckboxChange("admin")}
                  className="mr-2"
                />
                <label htmlFor="admin" className="text-gray-700">
                  Admin
                </label>
              </div>
              <div className="flex items-center mb-4">
                <input
                  type="checkbox"
                  id="user"
                  checked={isUser}
                  onChange={() => handleCheckboxChange("user")}
                  className="mr-2"
                />
                <label htmlFor="user" className="text-gray-700">
                  User
                </label>
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleModalClose}
                  className="mr-2 px-4 py-2 bg-gray-300 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersPage;
