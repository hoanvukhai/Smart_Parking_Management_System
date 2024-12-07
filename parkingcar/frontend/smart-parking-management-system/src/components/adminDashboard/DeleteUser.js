import React, { useState } from "react";
import { getDatabase, ref, remove } from "firebase/database";

function DeleteUser({ user, setUsers }) {
  const [isOpen, setIsOpen] = useState(false); // Trạng thái popup xác nhận

  const handleDeleteUser = () => {
    const db = getDatabase();
    const userRef = ref(db, `users/${user.uid}`);
    remove(userRef)
        .then(() => {
            try {
                alert("Người dùng đã bị xóa");
                setUsers((prevUsers) => prevUsers.filter((u) => u.uid !== user.uid)); // Cập nhật danh sách người dùng
                setIsOpen(false); // Đóng popup
            } catch (error) {
                console.error("Lỗi trong xử lý cập nhật danh sách người dùng:", error);
            }
        })
        .catch((error) => {
            console.error("Lỗi khi xóa người dùng:", error);
            alert("Không thể xóa người dùng. Vui lòng thử lại!");
        })
        .finally(() => {
            setIsOpen(false); // Đảm bảo popup luôn đóng
        });
  };

  return (
    <div>
      {/* Nút xóa */}
      <button
        onClick={() => setIsOpen(true)}
        className="text-red-500 hover:underline"
      >
        Xóa
      </button>

      {/* Popup xác nhận */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
        onClick={() => setIsOpen(false)}
        >
          <div className="bg-white shadow-md p-6 rounded-lg"
          onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold mb-4">
              Bạn có chắc chắn muốn xóa người dùng này?
            </h3>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Hủy
              </button>
              <button
                onClick={handleDeleteUser}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Xóa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DeleteUser;
