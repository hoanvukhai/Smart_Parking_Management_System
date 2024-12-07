import React from "react";

function UserInfo({ user }) {
    const feeOwed = user.feeOwed ?? 0; // Nếu feeOwed là undefined hoặc null, gán giá trị mặc định là 0
    const feePaid = user.feePaid ?? 0; // Tương tự cho feePaid
    return (
        <div>
            <div className="bg-white p-4 rounded-lg shadow-md mb-6">
                <p className="text-lg">
                    <span className="font-semibold">Họ và tên:</span> {user.name || "Chưa cập nhật"}
                </p>
                <p className="text-lg">
                    <span className="font-semibold">Email:</span> {user.email || "Chưa cập nhật"}
                </p>
                <p className="text-lg">
                    <span className="font-semibold">RFID:</span> {user.cardId || "Chưa khả dụng"}
                </p>
            </div>


            <div className="bg-white p-4 rounded-lg shadow-md mb-4">
                <h3 className="text-lg font-semibold mb-2">Thông Tin Phí</h3>
                <p className="text-lg">
                    <span className="font-semibold">Tổng Phí Nợ:</span> {feeOwed.toLocaleString()} VND
                </p>
                <p className="text-lg">
                    <span className="font-semibold">Tổng Phí Trả:</span> {feePaid.toLocaleString()} VND
                </p>
                <p className="text-lg">
                    <span className="font-semibold">Số Tiền Còn Nợ:</span> {(feeOwed - feePaid).toLocaleString()} VND
                </p>
            </div>
        </div>
    );
}

export default UserInfo;
