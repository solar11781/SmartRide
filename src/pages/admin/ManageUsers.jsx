import React, { useEffect, useState } from "react";
import axios from "axios";

const ManageUsers = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    // Fetch all users
    axios
      .get("http://localhost:5001/api/auth/users")
      .then((response) => setUsers(response.data))
      .catch((error) => console.error("Error fetching users:", error));
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4 text-center">User Management</h1>
      <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-md">
        <thead>
          <tr className="bg-gray-200">
            <th className="py-3 px-4 text-center font-semibold border-b border-gray-300">Username</th>
            <th className="py-3 px-4 text-center font-semibold border-b border-gray-300">Email</th>
            <th className="py-3 px-4 text-center font-semibold border-b border-gray-300">Role</th>
            <th className="py-3 px-4 text-center font-semibold border-b border-gray-300">Phone Number</th>
            <th className="py-3 px-4 text-center font-semibold border-b border-gray-300">Status</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => (
            <tr
              key={user.user_id}
              className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}
            >
              <td className="py-3 px-4 text-center border-b border-gray-300">{user.username}</td>
              <td className="py-3 px-4 text-center border-b border-gray-300">{user.email}</td>
              <td className="py-3 px-4 text-center border-b border-gray-300">{user.role}</td>
              <td className="py-3 px-4 text-center border-b border-gray-300">{user.phone_number}</td>
              {user.role === "driver" ? (
                <td className="py-3 px-4 text-center border-b border-gray-300">
                  {user.is_verified === null
                    ? "Not Verified"
                    : user.is_verified === 0
                    ? "Not Verified"
                    : "Verified"}
                </td>
              ) : (
                <td className="py-3 px-4 text-center border-b border-gray-300">Not a driver</td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ManageUsers;