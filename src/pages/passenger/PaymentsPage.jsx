import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

const PaymentsPage = () => {
  const { ride_id } = useParams();
  const [payment, setPayment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPayment = async () => {
      try {
        const res = await fetch(`http://localhost:5001/api/payment/${ride_id}`);
        const data = await res.json();

        if (data.success) {
          setPayment(data.payment);
        } else {
          setError(data.message || "Payment not found.");
        }
      } catch (err) {
        setError("❌ Error fetching payment.");
      } finally {
        setLoading(false);
      }
    };

    fetchPayment();
  }, [ride_id]);

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold mb-4 text-center">💰 Payment Details</h1>

      {loading ? (
        <p className="text-center text-gray-500">Loading...</p>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : (
        <div className="space-y-3">
          <p><strong>💳 Amount:</strong> ${payment.amount}</p>
          <p><strong>📄 Method:</strong> {payment.method}</p>
          <p>
            <strong>✅ Status:</strong>{" "}
            <span className={payment.status === "Completed" ? "text-green-600" : "text-yellow-600"}>
              {payment.status}
            </span>
          </p>
          <p><strong>🕒 Time:</strong> {new Date(payment.created_at).toLocaleString()}</p>
        </div>
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
