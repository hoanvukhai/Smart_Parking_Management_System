import React, { useState } from "react";

function AccessHistory({ user }) {
    const [showPopup, setShowPopup] = useState(false);
    const [historyData, setHistoryData] = useState([]); // Dữ liệu lịch sử
    
    const handleViewHistory = () => {
    if (user.history) {
        const historyArray = Object.values(user.history);
        setHistoryData(historyArray);
    } else {
        setHistoryData([]); // Không có dữ liệu
    }
    setShowPopup(true); // Mở popup
    };

    const handleClosePopup = () => {
    setShowPopup(false); // Đóng popup
    };

    return (
        <>
            <button
                onClick={handleViewHistory}
                className="bg-blue-500 text-white py-2 px-4 rounded"
            >
                Lịch Sử Ra Vào
            </button>
            {showPopup && (
                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50"
                onClick={handleClosePopup}
                >
                    <div className="bg-white p-6 rounded-lg shadow-lg md:w-1/2 w-11/12"
                    onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex justify-between mb-6">
                            <div className="text-2xl font-semibold">Lịch Sử Ra Vào</div>
                            <button
                                onClick={handleClosePopup}
                                className="bg-red-500 text-white py-2 px-4 rounded"
                            >
                                Đóng
                            </button>
                        </div>
                        <div className="min-w-full bg-white rounded-lg shadow-md">
                            <div>
                                <div className="flex justify-around bg-gray-200">
                                        <div className="py-3 px-4 text-gray-700 font-semibold text-left">Thời Gian Vào</div>
                                        <div className="py-3 px-4 text-gray-700 font-semibold text-left">Thời Gian Ra</div>
                                        <div className="py-3 px-4 text-gray-700 font-semibold text-left">Số Tiền</div>
                                </div>
                            </div>
                            <div>
                                {historyData.length > 0 ? (
                                <div className="space-y-2">
                                {historyData.map((record, index) => (
                                    <div key={index} className="flex justify-between border-b">
                                        <div className="py-3 px-4 text-gray-700 md:text-base text-xs">{new Date(record.entryTime * 1000).toLocaleString()}</div>
                                        <div className="py-3 px-4 text-gray-700 md:text-base text-xs">{new Date(record.exitTime * 1000).toLocaleString()}</div>
                                        <div className="py-3 px-4 text-gray-700 md:text-base text-xs">{record.fee} VND</div>
                                    </div>
                                    ))}
                                </div>
                                ) : (
                                <div className="text-gray-500">Chưa có dữ liệu</div>
                                )}
                            </div>
                        </div>    
                    </div>
                </div>
            )}
        </>
    );
}

export default AccessHistory;
