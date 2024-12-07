import { useEffect, useState } from "react";
import { database, ref, onValue } from "../firebase";
import { Link } from "react-router-dom";
import { FaParking, FaCar, FaMapMarkerAlt } from "react-icons/fa";

function Dashboard() {
  const [spots, setSpots] = useState({});
  const [availableSpots, setAvailableSpots] = useState(0);

  useEffect(() => {
    const spotsRef = ref(database, "parking");
    onValue(spotsRef, (snapshot) => {
      const data = snapshot.val();
      setAvailableSpots(data.availableSpots);

      // Loại bỏ trường 'availableSpots' trước khi lưu vào state
      const filteredData = Object.keys(data)
        .filter((key) => key !== "availableSpots")
        .reduce((obj, key) => {
          obj[key] = data[key];
          return obj;
        }, {});

      setSpots(filteredData);
    });
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto p-6">
        {/* Header Section */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-blue-700 md:text-3xl">
            Hệ Thống Bãi Đỗ Xe Thông Minh
          </h1>
          <p className="text-gray-600 text-sm md:text-base">Quản Lý, Giám Sát Và Tìm Kiếm Các Chỗ Đỗ Xe Trong Thời Gian Thực</p>
        </div>

        {/* Available Spots */}
        <div className="bg-blue-100 text-blue-800 p-4 rounded-md shadow-md flex items-center justify-center mb-6">
          <FaParking size={28} className="mr-2" />
          <h2 className="text-xl font-semibold">Số Chỗ Trống: {availableSpots}</h2>
        </div>

        {/* Parking Spots Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Object.keys(spots).map((spot) => (
            <Link
              to={`/spot/${spot}`}
              key={spot}
              className="block bg-white rounded-lg shadow-lg p-4 hover:shadow-xl transform hover:scale-105 transition-all duration-200"
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-bold text-gray-700">
                  {spot.replace("spot", "Chỗ ")}
                </h3>
                <FaCar size={24} className="text-blue-500" />
              </div>
              <p className="text-gray-600">
                Trạng Thái:{" "}
                <span
                  className={`font-semibold ${
                    spots[spot].status === "Occupied"
                      ? "text-red-500"
                      : "text-green-500"
                  }`}
                >
                  {spots[spot].status === "Occupied" ? "Có Xe" : "Chỗ Trống"}
                </span>
              </p>
              <p className="text-gray-600 flex items-center mt-2">
                <FaMapMarkerAlt size={16} className="mr-1 text-red-500" />
                Khoảng Cách Đến Giới Hạn Đỗ: {spots[spot].distanceToPickup}m
              </p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
