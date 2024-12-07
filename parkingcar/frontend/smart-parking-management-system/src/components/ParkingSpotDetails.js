import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { database, ref, onValue } from "../firebase";

function ParkingSpotDetails() {
  const { id } = useParams();
  const [spotData, setSpotData] = useState({});
  const [duration, setDuration] = useState("");

  useEffect(() => {
    const spotRef = ref(database, `parking/${id}`);
    onValue(spotRef, (snapshot) => {
      const data = snapshot.val();
      setSpotData(data);

      // Tính toán thời gian đỗ xe
      if (data?.entryTime) {
        const currentTime = Math.floor(Date.now() / 1000);
        const totalMinutes = Math.floor((currentTime - data.entryTime) / 60);
        setDuration(formatDuration(totalMinutes));
      }
    });
  }, [id]);

  // Hàm chuyển đổi timestamp thành định dạng ngắn gọn
  const convertTimestampToDate = (timestamp) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Hàm định dạng thời gian đỗ xe
  const formatDuration = (totalMinutes) => {
    const minutesInAnHour = 60;
    const minutesInADay = 1440;

    const days = Math.floor(totalMinutes / minutesInADay);
    const hours = Math.floor((totalMinutes % minutesInADay) / minutesInAnHour);
    const minutes = totalMinutes % minutesInAnHour;

    const parts = [];
    if (days > 0) parts.push(`${days} ngày`);
    if (hours > 0) parts.push(`${hours} giờ`);
    if (minutes > 0 || parts.length === 0) parts.push(`${minutes} phút`);

    return parts.join(" ");
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto p-6">
        {/* Tiêu đề */}
        <h1 className="text-2xl font-bold text-blue-700 mb-4">
          Chi tiết chỗ đỗ: {id.replace("spot", "Chỗ ")}
        </h1>

        {/* Thông tin chỗ đỗ */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <p className="text-lg">
            <strong>Trạng thái:</strong>{" "}
            <span
              className={`font-bold ${
                spotData.status === "Free" ? "text-green-600" : "text-red-600"
              }`}
            >
              {spotData.status === "Free" ? "Chỗ Trống" : "Có Xe" || "N/A"}
            </span>
          </p>
          <p className="text-lg">
            <strong>Khoảng cách:</strong> {spotData.distanceToPickup || "N/A"} cm
          </p>
          {spotData.status === "Occupied" && spotData.entryTime && (
            <>
              <p className="text-lg">
                <strong>Thời gian vào bãi:</strong>{" "}
                {convertTimestampToDate(spotData.entryTime)}
              </p>
              <p className="text-lg">
                <strong>Thời gian đã đỗ:</strong> {duration}
              </p>
            </>
          )}
        </div>

        {/* Thông báo khi dữ liệu không khả dụng */}
        {!spotData.status && (
          <p className="text-red-600 mt-4">
            Dữ liệu cho chỗ đỗ này hiện không khả dụng.
          </p>
        )}
      </div>
    </div>
  );
}

export default ParkingSpotDetails;
