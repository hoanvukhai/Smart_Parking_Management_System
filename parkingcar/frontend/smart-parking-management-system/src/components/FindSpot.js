import React, { useState, useEffect } from "react";
import { database, ref, onValue } from "../firebase";
import { Link } from "react-router-dom";
import { FaCar, FaMapMarkerAlt } from "react-icons/fa";

function FindSpot() {
  const [availableSpots, setAvailableSpots] = useState([]);

  useEffect(() => {
    const spotsRef = ref(database, "parking");
    onValue(spotsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const spots = Object.keys(data)
          .filter(
            (spot) => spot.startsWith("spot") && data[spot].status === "Free"
          )
          .map((spot) => ({
            id: spot,
            distanceToPickup: data[spot].distanceToPickup,
          }));
        setAvailableSpots(spots);
      }
    });
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
        <div className="container mx-auto p-6">
        {/* Tiêu đề */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-blue-700">Tìm Chỗ Trống</h1>
          <p className="text-gray-600">
            Danh sách các chỗ đỗ xe khả dụng trong bãi.
          </p>
        </div>

        {/* Danh sách chỗ trống */}
        {availableSpots.length > 0 ? (
          <div>
            <div className="mb-4 bg-green-100 text-green-700 p-4 rounded-md shadow-md text-center">
              Có {availableSpots.length} chỗ trống sẵn sàng!
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {availableSpots.map((spot) => (
                <Link
                  to={`/spot/${spot.id}`}
                  key={spot.id}
                  className="block bg-white rounded-lg shadow-md p-4 hover:shadow-lg transform hover:scale-105 transition-all duration-200"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-bold text-gray-700">
                      <FaCar size={20} className="inline-block text-gray-500 mr-2" />
                      {spot.id.replace("spot", "Chỗ ")}
                    </h3>
                  </div>
                  <p className="text-gray-600 flex items-center mt-2">
                    <FaMapMarkerAlt
                      size={16}
                      className="mr-2 text-blue-500"
                    />
                    Khoảng Cách Đến Giới Hạn Đỗ: {spot.distanceToPickup} cm
                  </p>
                </Link>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-red-100 text-red-700 p-4 rounded-md shadow-md text-center">
            <p>Hiện tại không có chỗ trống.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default FindSpot;
