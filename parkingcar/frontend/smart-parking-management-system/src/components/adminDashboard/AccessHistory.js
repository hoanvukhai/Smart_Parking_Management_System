import React, { useState } from "react";

function AccessHistory({ user }) {
  const [isOpen, setIsOpen] = useState(false); // Trạng thái popup
  const [historyData, setHistoryData] = useState([]); // Dữ liệu lịch sử

  const handleViewHistory = () => {
    if (user.history) {
      const historyArray = Object.values(user.history);
      setHistoryData(historyArray);
    } else {
      setHistoryData([]); // Không có dữ liệu
    }
    setIsOpen(true); // Mở popup
  };

  const handleClosePopup = () => {
    setIsOpen(false); // Đóng popup
  };

  return (
    <div>
      <button
        className="text-blue-500 hover:underline"
        onClick={handleViewHistory}
      >
        Xem lịch sử
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
        onClick={() => setIsOpen(false)}
        >
          <div className="bg-white shadow-md p-6 rounded-lg w-full lg:w-2/3"
          onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Lịch sử ra vào</h3>
              <button
                className="text-red-500 hover:underline"
                onClick={handleClosePopup}
              >
                Đóng
              </button>
            </div>
            {historyData.length > 0 ? (
              <ul className="space-y-2">
                {historyData.map((record, index) => (
                  <li key={index} className="flex justify-between">
                    <span>Vào lúc: {new Date(record.entryTime * 1000).toLocaleString()}</span>
                    <span>Ra lúc: {new Date(record.exitTime * 1000).toLocaleString()}</span>
                    <span>Phí: {record.fee} VND</span>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-gray-500">Chưa có dữ liệu</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default AccessHistory;
