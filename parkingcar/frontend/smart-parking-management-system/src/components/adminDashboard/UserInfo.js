import React, { useState, useEffect } from "react";
import { getDatabase, ref, update, remove, onValue } from "firebase/database";

function UserInfo({ user, setUsers }) {
  const [isOpen, setIsOpen] = useState(false);
  const [editName, setEditName] = useState(user.name || "");
  const [editCardId, setEditCardId] = useState(user.cardId || "");
  const [editRole, setEditRole] = useState(user.role || "user");
  const [pendingCards, setPendingCards] = useState([]);

  useEffect(() => {
    const db = getDatabase();
    const pendingRef = ref(db, "pending");

    const unsubscribe = onValue(pendingRef, (snapshot) => {
      const pendingData = snapshot.val();
      if (pendingData) {
        setPendingCards(Object.keys(pendingData));
      } else {
        setPendingCards([]);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleSave = () => {
    const db = getDatabase();
    const userRef = ref(db, `users/${user.uid}`);
    const cardRef = ref(db, `pending/${editCardId}`);

    update(userRef, {
      name: editName,
      cardId: editCardId,
      role: editRole,
    })
      .then(() => {
        if (pendingCards.includes(editCardId)) {
          return remove(cardRef);
        }
      })
      .then(() => {
        try {
            alert("Cập nhật thông tin thành công!");
            setUsers((prevUsers) =>
            prevUsers.map((u) =>
                u.uid === user.uid
                ? { ...u, name: editName, cardId: editCardId, role: editRole }
                : u
            )
            );
            setIsOpen(false);
        }catch (error) {
            console.error("Lỗi trong xử lý cập nhật danh sách người dùng:", error);
        }

      })
      .catch((error) => {
        console.error("Lỗi khi cập nhật thông tin:", error);
        alert("Cập nhật thông tin thất bại. Vui lòng thử lại!");
      })
      .finally(() => {
        setIsOpen(false); // Đảm bảo popup luôn đóng
      });
  };

  return (
    <div>
      <button
        className="text-blue-500 hover:underline"
        onClick={() => setIsOpen(true)}
      >
        Thông tin
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
        onClick={() => setIsOpen(false)}
        >
          <div className="bg-white shadow-md p-6 rounded-lg w-full lg:w-1/3"
          onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold mb-4">Cập nhật thông tin</h3>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Tên:</label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded p-2"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Thẻ:</label>
              <div className="flex gap-2">
                <select
                  className="flex-1 border border-gray-300 rounded p-2"
                  value={editCardId}
                  onChange={(e) => setEditCardId(e.target.value)}
                >
                  <option value="">Chọn thẻ</option>
                  {pendingCards.map((card) => (
                    <option key={card} value={card}>
                      {card}
                    </option>
                  ))}
                </select>
                <input
                  type="text"
                  className="flex-1 border border-gray-300 rounded p-2"
                  placeholder="Nhập thủ công"
                  value={editCardId}
                  onChange={(e) => setEditCardId(e.target.value)}
                />
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Vai trò:</label>
              <select
                className="w-full border border-gray-300 rounded p-2"
                value={editRole}
                onChange={(e) => setEditRole(e.target.value)}
              >
                <option value="user">Người dùng</option>
                <option value="admin">Quản trị viên</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Email:</label>
              <p className="text-gray-600">{user.email}</p>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Tổng nợ:</label>
              <p className="text-gray-600">{user.feeOwed} VND</p>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Đã thanh toán:</label>
              <p className="text-gray-600">{user.feePaid} VND</p>
            </div>
            <div className="flex justify-end gap-2">
              <button
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                onClick={() => setIsOpen(false)}
              >
                Hủy
              </button>
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                onClick={handleSave}
              >
                Lưu
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserInfo;
