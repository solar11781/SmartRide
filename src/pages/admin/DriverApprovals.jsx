import React, { useEffect, useState } from "react";
import axios from "axios";

const DriverApprovals = () => {
  const [users, setUsers] = useState([]);

  // TODO: Fix these 2 API calls because they dont fucking work for some reason
  useEffect(() => {
    // Fetch all users
    axios.get("http://localhost:5001/api/auth/users")
      .then(response => setUsers(response.data))
      .catch(error => console.error("Error fetching users:", error));
  }, []);

  const handleVerify = (user_id) => {
    // Verify user
    axios.post("http://localhost:5001/api/auth/users/verify", { user_id })
      .then(response => {
        // Update the user list after verification
        setUsers(users.map(user => user.user_id === user_id ? { ...user, verified: 1 } : user));
      })
      .catch(error => console.error("Error verifying user:", error));
  };

  return (
    <div>
      <h1>Driver Approvals</h1>
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="py-2">Username</th>
            <th className="py-2">Email</th>
            <th className="py-2">Role</th>
            <th className="py-2">Phone Number</th>
            <th className="py-2">Status</th>
            <th className="py-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.user_id}>
              <td className="py-2">{user.username}</td>
              <td className="py-2">{user.email}</td>
              <td className="py-2">{user.role}</td>
              <td className="py-2">{user.phone_number}</td>
              <td className="py-2">{user.verified === 1 ? "Verified" : "Not Verified"}</td>
              <td className="py-2">
                {user.verified === 0 ? (
                  <button
                    onClick={() => handleVerify(user.user_id)}
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                  >
                    Verify
                  </button>
                ) : (
                  "Verified"
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DriverApprovals;