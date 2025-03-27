import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";

const PaymentsPage = () => {
  const { ride_id } = useParams();
  const [payment, setPayment] = useState(null);
  const [ride, setRide] = useState(null);
  const [receipt, setReceipt] = useState(null); // <-- New
  const [loading, setLoading] = useState(true);
  const [method, setMethod] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resRide = await fetch(`http://localhost:5001/api/rides/${ride_id}`);
        const rideData = await resRide.json();

        if (rideData.success) {
          setRide(rideData.ride);
          setPayment({
            amount: rideData.ride.distance_km * 5000,
            method: rideData.ride.payment_method || "",
            status: rideData.ride.status === "Completed" ? "Paid" : "Pending",
            created_at: new Date(rideData.ride.created_at),
          });
        } else {
          setMessage("❌ Ride not found.");
        }
      } catch (err) {
        console.error("Error:", err);
        setMessage("❌ Error fetching ride info.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [ride_id]);

  const handlePayment = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`http://localhost:5001/api/payment/pay/${ride_id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ method }),
      });

      const data = await res.json();
      if (data.success) {
        setMessage("✅ Payment completed!");
        setReceipt(data.receipt); // <-- Set the receipt
        setPayment((prev) => ({
          ...prev,
          method,
          status: "Paid",
          created_at: new Date(),
        }));
      } else {
        setMessage(data.message || "❌ Payment failed.");
      }
    } catch (err) {
      setMessage("❌ Server error.");
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold mb-4 text-center">💰 Payment Details</h1>

      {loading ? (
        <p className="text-center text-gray-500">Loading...</p>
      ) : message && payment?.status !== "Paid" ? (
        <p className="text-center text-red-500">{message}</p>
      ) : (
        <>
          <div className="space-y-3 mb-6">
            <p><strong>💵 Amount to Pay:</strong> {payment.amount.toLocaleString()} VND</p>
            <p><strong>🚗 Vehicle:</strong> {ride.vehicle_type}</p>
            <p><strong>📏 Distance:</strong> {ride.distance_km} km</p>
            <p><strong>🕒 Ride Created:</strong> {new Date(ride.created_at).toLocaleString()}</p>
            <p><strong>✅ Current Status:</strong> {payment.status}</p>
          </div>

          {payment.status !== "Paid" && (
            <form onSubmit={handlePayment} className="space-y-4">
              <div>
                <label className="block mb-1 font-medium">Payment Method</label>
                <select
                  value={method}
                  onChange={(e) => setMethod(e.target.value)}
                  className="w-full border px-3 py-2 rounded"
                  required
                >
                  <option value="">Select method</option>
                  <option value="Cash">Cash</option>
                  <option value="Credit Card">Credit Card</option>
                  <option value="E-Wallet">E-Wallet</option>
                </select>
              </div>
              <button
                type="submit"
                className="w-full py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg"
              >
                Make Payment
              </button>
            </form>
          )}

          {payment.status === "Paid" && (
            <>
              <p className="text-green-600 font-semibold text-center mt-4">
                🎉 Payment has been completed!
              </p>

              {/* ✅ Receipt View */}
              {receipt && (
  <div className="mt-6 bg-gray-100 p-4 rounded-lg border">
    <h3 className="text-lg font-semibold mb-2">🧾 Receipt</h3>
    <p><strong>Receipt ID:</strong> #{receipt.receipt_id || "---"}</p>
    <p><strong>Amount:</strong> {receipt.amount.toLocaleString()} VND</p>
    <p><strong>Method:</strong> {receipt.method}</p>
    <p><strong>Time:</strong> {new Date(receipt.created_at).toLocaleString()}</p>
  </div>
)}

            </>
          )}
        </>
      )}

      <div className="mt-6 text-center">
        <Link
          to="/dashboard/ride-history"
          className="text-blue-500 hover:text-blue-700 underline"
        >
          ← Back to Ride History
        </Link>
      </div>
    </div>
  );
};

export default PaymentsPage;
