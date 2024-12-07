import React, { useState } from "react";
import { getDatabase, ref, remove } from "firebase/database";

function PendingCards({ pendingCards, setPendingCards }) {
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  // Xử lý xóa thẻ
  const handleDeleteCard = (cardId) => {
    const db = getDatabase();
    const cardRef = ref(db, `pending/${cardId}`);
    remove(cardRef)
      .then(() => {
        alert("Thẻ đang chờ đã bị xóa");
        setPendingCards(pendingCards.filter((card) => card !== cardId));
      })
      .catch((err) => {
        console.error("Lỗi khi xóa thẻ:", err);
      });
  };

  // Xử lý copy thẻ
  const handleCopyCard = (cardId) => {
    navigator.clipboard
      .writeText(cardId)
      .then(() => alert("Đã sao chép thẻ vào clipboard"))
      .catch((err) => console.error("Lỗi khi sao chép:", err));
  };

  return (
    <div>
      <button
        onClick={() => setIsPopupOpen(true)}
        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
      >
        Quản lý thẻ đang chờ
      </button>
      {isPopupOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
        onClick={() => setIsPopupOpen(false)}
        >
          <div className="bg-white shadow-md p-6 rounded-lg w-full lg:w-1/3 relative"
          onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setIsPopupOpen(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
            >
              ✕
            </button>
            <h3 className="text-lg font-semibold mb-4">Danh sách thẻ đang chờ</h3>
            <ul className="space-y-3">
              {pendingCards.map((card) => (
                <li key={card} className="flex justify-between items-center">
                  <span className="text-gray-700">{card}</span>
                  <div className="space-x-2">
                    <button
                      onClick={() => handleCopyCard(card)}
                      className="text-green-500 hover:underline"
                    >
                      Sao chép
                    </button>
                    <button
                      onClick={() => handleDeleteCard(card)}
                      className="text-red-500 hover:underline"
                    >
                      Xóa
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

export default PendingCards;
