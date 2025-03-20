import { useState } from "react";
import { useNavigate } from "react-router-dom";

const RegisterPage = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phone_number, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("customer");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost/apis.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          email,
          phone_number,
          password,
          role,
        }),
      });

      const data = await response.json(); // Parse the response JSON

      console.log("Response Data:", data); // Log the response data to the console

      if (data) {
        // If registration is successful, redirect to login page
        navigate("/login");
      } else {
        setError(
          data.message || "Error during registration. Please try again."
        );
      }
    } catch (error) {
      setError({ error });
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-200">
      <form
        className="bg-white p-8 rounded-lg shadow-lg w-96"
        onSubmit={handleRegister}
      >
        <h2 className="text-2xl font-semibold text-center mb-6">Register</h2>
        {error && (
          <p className="text-red-500 text-center">{error}</p>
        )}
        <div className="mb-4">
          <label
            htmlFor="username"
            className="block text-sm font-medium text-gray-700"
          >
            Username
          </label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
            required
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
            required
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="phoneNumber"
            className="block text-sm font-medium text-gray-700"
          >
            Phone Number
          </label>
          <input
            type="text"
            id="phoneNumber"
            value={phone_number}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
            required
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700"
          >
            Password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
            required
          />
        </div>

        {/* Role Selection */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Role
          </label>
          <div className="flex items-center">
            <label className="mr-4">
              <input
                type="radio"
                id="customer"
                name="role"
                value="Customer"
                checked={role === "Customer"}
                onChange={() => setRole("Customer")}
                className="mr-2"
              />
              Customer
            </label>
            <label className="mr-4">
              <input
                type="radio"
                id="driver"
                name="role"
                value="Driver"
                checked={role === "Driver"}
                onChange={() => setRole("Driver")}
                className="mr-2"
              />
              Driver
            </label>
            <label>
              <input
                type="radio"
                id="admin"
                name="role"
                value="Admin"
                checked={role === "Admin"}
                onChange={() => setRole("Admin")}
                className="mr-2"
              />
              Admin
            </label>
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-2 bg-blue-500 hover:bg-blue-700 text-white rounded-lg"
        >
          Register
        </button>
        <div className="mt-4 text-center">
          <p className="text-sm">
            Already have an account?{" "}
            <span
              className="text-blue-500 hover:text-blue-700 cursor-pointer"
              onClick={() => navigate("/login")}
            >
              Login here
            </span>
          </p>
        </div>
      </form>
    </div>
  );
};

export default RegisterPage;
