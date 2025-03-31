import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const ReportsAnalytics = () => {
  const [rideStats, setRideStats] = useState({
    totalRides: 0,
    ridesPerMonth: [],
  });
  const [revenueStats, setRevenueStats] = useState({
    totalRevenue: 0,
    revenuePerMonth: [],
  });

  useEffect(() => {
    // Fetch ride statistics
    axios
      .get("http://localhost:5001/api/analytics/rides")
      .then((response) => setRideStats(response.data))
      .catch((error) => console.error("Error fetching ride stats:", error));

    // Fetch revenue statistics
    axios
      .get("http://localhost:5001/api/analytics/revenue")
      .then((response) => setRevenueStats(response.data))
      .catch((error) => console.error("Error fetching revenue stats:", error));
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4 text-center">
        Reports & Analytics
      </h1>

      {/* Total Rides and Revenue */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-white p-4 rounded shadow text-center">
          <h2 className="text-lg font-semibold">Total Rides</h2>
          <p className="text-2xl font-bold">{rideStats.totalRides}</p>
        </div>
        <div className="bg-white p-4 rounded shadow text-center">
          <h2 className="text-lg font-semibold">Total Revenue</h2>
          <p className="text-2xl font-bold">
            {Number(revenueStats.totalRevenue).toFixed(2)} VND
          </p>
        </div>
      </div>

      {/* Rides Per Month Bar Chart */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Rides Per Month</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={rideStats.ridesPerMonth}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="total" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Revenue Per Month Line Chart */}
      <div>
        <h2 className="text-lg font-semibold mb-2">Revenue Per Month</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={revenueStats.revenuePerMonth}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="total" stroke="#82ca9d" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ReportsAnalytics;
