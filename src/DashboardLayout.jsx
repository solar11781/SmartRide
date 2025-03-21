import { Link, Outlet } from "react-router-dom"; // Use Outlet for nested routes
import MapComponent from "./components/MapComponent";

const DashboardLayout = () => {
  return (
    <div className="flex h-screen">
      {/* Left Column: Map and Information */}
      <div className="flex-1 bg-gray-300">
        {/* Here you can embed your map (using something like Google Maps or Mapbox) */}
        <div className="h-full">
          <h2 className="text-center p-4">Map (or other info/buttons)</h2>
          <MapComponent />
        </div>
      </div>

      {/* Right Column: Panel with Links and Content */}
      <div className="w-80 bg-white shadow-md">
        <header className="p-4 border-b">
          <nav className="flex justify-between">
            <Link to="/dashboard/book-ride" className="text-blue-500">
              Book Ride
            </Link>
            <Link to="/dashboard/profile" className="text-blue-500">
              Profile
            </Link>
          </nav>
        </header>

        {/* Content Area: Where the user interacts */}
        <div className="p-4 overflow-y-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
