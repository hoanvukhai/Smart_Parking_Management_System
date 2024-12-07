import React, { useState } from "react";
import { getDatabase, ref, update, push } from "firebase/database";

function Payment({ user, setUsers }) {
  const [isOpen, setIsOpen] = useState(false); // Trạng thái mở popup
  const [paymentAmount, setPaymentAmount] = useState(""); // Số tiền thanh toán

  const handlePayment = () => {
    if (!paymentAmount || isNaN(paymentAmount) || Number(paymentAmount) <= 0) {
      alert("Vui lòng nhập số tiền hợp lệ!");
      return;
    }
  
    const db = getDatabase();
    const userRef = ref(db, `users/${user.uid}`);
    const newFeePaid = (user.feePaid || 0) + Number(paymentAmount);
  
    // Thêm giao dịch vào mảng `transactions`
    const transaction = {
      date: new Date().toISOString(), // ISO format
      amountPaid: Number(paymentAmount),
    };
  
    update(userRef, { feePaid: newFeePaid })
      .then(() => {
        const transactionsRef = ref(db, `users/${user.uid}/transactions`);
        return push(transactionsRef, transaction); // Đảm bảo chỉ tiếp tục khi ghi giao dịch thành công
      })
      .then(() => {
        try {
          alert(`Thanh toán thành công ${paymentAmount} VND`);
  
          // Cập nhật lại danh sách người dùng
          setUsers((prevUsers) =>
            prevUsers.map((u) =>
              u.uid === user.uid
                ? {
                    ...u,
                    feePaid: newFeePaid,
                    transactions: [...(u.transactions || []), transaction],
                  }
                : u
            )
          );
  
          setPaymentAmount(""); // Reset số tiền
        } catch (error) {
          console.error("Lỗi trong xử lý cập nhật danh sách người dùng:", error);
        }
      })
      .catch((err) => {
        console.error("Lỗi khi thanh toán hoặc lưu giao dịch:", err);
        alert("Thanh toán thất bại. Vui lòng thử lại!");
      })
      .finally(() => {
        setIsOpen(false); // Đảm bảo popup luôn đóng
      });
  };
  

  return (
    <div>
      {/* Nút mở popup thanh toán */}
      <button
        onClick={() => setIsOpen(true)}
        className="text-blue-500 hover:underline"
      >
        Thanh toán
      </button>

      {/* Popup thanh toán */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
        onClick={() => setIsOpen(false)}
        >
          <div className="bg-white shadow-md p-6 rounded-lg"
          onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold mb-4">Thanh toán</h3>
            <div className="mb-4">
              <label className="block mb-2 text-sm font-medium">
                Nhập số tiền (VND)
              </label>
              <input
                type="number"
                className="border border-gray-300 rounded-lg p-2 w-full"
                value={paymentAmount}
                onChange={(e) => setPaymentAmount(e.target.value)}
              />
            </div>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Hủy
              </button>
              <button
                onClick={handlePayment}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Payment;
