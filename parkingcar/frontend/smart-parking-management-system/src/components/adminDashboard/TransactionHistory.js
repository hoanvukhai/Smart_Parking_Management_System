import React, { useState } from "react";

function TransactionHistory({ user }) {
  const [isOpen, setIsOpen] = useState(false); // Trạng thái popup
  const [transactions, setTransactions] = useState([]); // Dữ liệu giao dịch

  const handleViewTransactions = () => {
    if (user.transactions) {
      const transactionArray = Object.values(user.transactions);
      setTransactions(transactionArray);
    } else {
      setTransactions([]); // Không có dữ liệu
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
        onClick={handleViewTransactions}
      >
        Xem giao dịch
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
        onClick={() => setIsOpen(false)}
        >
          <div className="bg-white shadow-md p-6 rounded-lg w-full lg:w-2/3"
          onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Lịch sử giao dịch</h3>
              <button
                className="text-red-500 hover:underline"
                onClick={handleClosePopup}
              >
                Đóng
              </button>
            </div>
            {transactions.length > 0 ? (
              <ul className="space-y-2">
                {transactions.map((transaction, index) => (
                  <li key={index} className="flex justify-between">
                    <span>Ngày: {new Date(transaction.date).toLocaleString()}</span>
                    <span>Số tiền: {transaction.amountPaid.toLocaleString()} VND</span>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-gray-500">Chưa có giao dịch nào</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default TransactionHistory;
