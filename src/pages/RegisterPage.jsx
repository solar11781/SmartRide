import { useState } from "react";
import { useNavigate } from "react-router-dom";

const RegisterPage = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phone_number, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("customer");
  const [idCard, setIdCard] = useState(null);
  const [driverLicense, setDriverLicense] = useState(null);
  const [insuranceDocument, setInsuranceDocument] = useState(null);
  const [licensePlate, setLicensePlate] = useState("");
  const [vehicleType, setVehicleType] = useState("Car");
  const [vehicleColor, setVehicleColor] = useState("Black");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    // 🔐 Client-side validation
    if (!/^[0-9]{10,15}$/.test(phone_number)) {
      return setError("Phone number must be 10-15 digits.");
    }

    if (password.length < 6 || !/[!@#$%^&*]/.test(password)) {
      return setError(
        "Password must be at least 6 characters and include a special character."
      );
    }

    const formData = new FormData();
    formData.append("username", username);
    formData.append("email", email);
    formData.append("phone_number", phone_number);
    formData.append("password", password);
    formData.append("role", role);
    if (idCard) formData.append("idCard", idCard);
    if (driverLicense) formData.append("driverLicense", driverLicense);
    if (insuranceDocument)
      formData.append("insuranceDocument", insuranceDocument);
    if (licensePlate) formData.append("licensePlate", licensePlate);
    if (vehicleType) formData.append("vehicleType", vehicleType);
    if (vehicleColor) formData.append("vehicleColor", vehicleColor);

    try {
      const response = await fetch("http://localhost:5001/api/auth/register", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (response.ok && data.success) {
        alert("✅ Account created successfully!");
        navigate("/login");
      } else {
        setError(data.message || "Registration failed. Please try again.");
      }
    } catch (error) {
      setError("❌ Server error. Please try again later.");
    }
  };

  return (
    <div className="flex items-center justify-center bg-gray-200 px-4">
      <form
        className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg my-5"
        onSubmit={handleRegister}
        encType="multipart/form-data"
      >
        <h2 className="text-2xl font-semibold text-center mb-6">Register</h2>
        {error && <p className="text-red-500 text-center">{error}</p>}

        {/* Username */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Username
          </label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
            required
          />
        </div>

        {/* Email */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
            required
          />
        </div>

        {/* Phone Number */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Phone Number
          </label>
          <input
            type="text"
            value={phone_number}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
            required
          />
        </div>

        {/* Password */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
            required
          />
        </div>

        {/* Role */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Role
          </label>
          <div className="flex space-x-4 mt-1">
            {["customer", "driver"].map((r) => (
              <label key={r}>
                <input
                  type="radio"
                  value={r}
                  checked={role === r}
                  onChange={() => setRole(r)}
                  className="mr-1"
                />
                {r}
              </label>
            ))}
          </div>
        </div>

        {/* ID Card */}
        {role === "driver" && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              ID Card
            </label>
            <input
              type="file"
              onChange={(e) => setIdCard(e.target.files[0])}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
        )}

        {/* Driver License */}
        {role === "driver" && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Driver License
            </label>
            <input
              type="file"
              onChange={(e) => setDriverLicense(e.target.files[0])}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
        )}

        {/* Insurance Document */}
        {role === "driver" && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Insurance Document
            </label>
            <input
              type="file"
              onChange={(e) => setInsuranceDocument(e.target.files[0])}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
        )}

        {/* License Plate */}
        {role === "driver" && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              License Plate
            </label>
            <input
              type="text"
              value={licensePlate}
              onChange={(e) => setLicensePlate(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>
        )}

        {/* Vehicle Type */}
        {role === "driver" && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Vehicle Type
            </label>
            <div className="flex space-x-4 mt-1">
              {["Car", "Motorbike"].map((r) => (
                <label key={r}>
                  <input
                    type="radio"
                    value={r}
                    checked={vehicleType === r}
                    onChange={() => setVehicleType(r)}
                    className="mr-1"
                  />
                  {r}
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Vehicle Color */}
        {role === "driver" && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Vehicle Color
            </label>
            <div className="flex space-x-4 mt-1">
              {["Black", "White", "Other"].map((r) => (
                <label key={r}>
                  <input
                    type="radio"
                    value={r}
                    checked={vehicleColor === r}
                    onChange={() => setVehicleColor(r)}
                    className="mr-1"
                  />
                  {r}
                </label>
              ))}
            </div>
          </div>
        )}

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
