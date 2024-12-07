import React, { useState } from "react";

function TransactionHistory({ user }) {
    const [showPopup, setShowPopup] = useState(false);
    const [transactions, setTransactions] = useState([]); // Dữ liệu giao dịch

    const handleViewTransactions = () => {
        if (user.transactions) {
          const transactionArray = Object.values(user.transactions);
          setTransactions(transactionArray);
        } else {
          setTransactions([]); // Không có dữ liệu
        }
        setShowPopup(true); // Mở popup
      };
    
      const handleClosePopup = () => {
        setShowPopup(false); // Đóng popup
      };

    return (
        <>
            <button
                onClick={handleViewTransactions}
                className="bg-green-500 text-white py-2 px-4 rounded"
            >
                Lịch Sử Giao Dịch
            </button>
            {showPopup && (
                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50"
                onClick={handleClosePopup}
                >
                    <div className="bg-white p-6 rounded-lg shadow-lg md:w-1/2 w-11/12"
                    onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex justify-between mb-6">
                            <div className="text-2xl font-semibold">Lịch Sử Giao Dịch</div>
                            <button
                                onClick={handleClosePopup}
                                className=" bg-red-500 text-white py-2 px-4 rounded "
                            >
                                Đóng
                            </button>
                        </div>
                        <div className="min-w-full bg-white rounded-lg shadow-md">
                            <div>
                                <div className="flex justify-around bg-gray-200">
                                    <div className="py-3 px-4 text-gray-700 font-semibold text-left">Ngày Giao Dịch</div>
                                    <div className="py-3 px-4 text-gray-700 font-semibold text-left">Số Tiền</div>
                                </div>
                            </div>
                            <div>
                            {transactions.length > 0 ? (
                                <div className="space-y-2">
                                    {transactions.map((transaction, index) => (
                                    <div key={index} className="flex justify-around border-b">
                                        <div className="py-3 px-4 text-gray-700 md:text-base text-xs">{new Date(transaction.date).toLocaleString()}</div>
                                        <div className="py-3 px-4 text-gray-700 md:text-base text-xs">{transaction.amountPaid.toLocaleString()} VND</div>
                                    </div>
                                    ))}
                                </div>
                                ) : (
                                <div className="text-gray-500">Chưa có giao dịch nào</div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default TransactionHistory;
