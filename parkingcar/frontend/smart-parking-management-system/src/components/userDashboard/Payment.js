import React, { useState } from "react";
import { MdQrCode2 } from "react-icons/md";

function Payment({ user }) {
    const [showPopup, setShowPopup] = useState(false);
    const handleClosePopup = () => {
        setShowPopup(false); // Đóng popup
      };
    return (
        <>
            <button
                onClick={() => setShowPopup(true)}
                className="bg-orange-500 text-white py-2 px-4 rounded"
            >
                Thanh Toán
            </button>
            {showPopup && (
                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50"
                onClick={() => setShowPopup(false)}
                >
                    <div className="bg-white p-6 rounded-lg shadow-lg md:w-1/2 w-11/12"
                    onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex justify-between mb-6">
                            <div className="md:text-2xl text-lg font-semibold">Thông Tin Thanh Toán</div>
                            <button
                                onClick={() => setShowPopup(false)}
                                className="bg-red-500 text-white py-2 px-4 rounded md:text-base text-sm"
                            >
                                Đóng
                            </button>                        
                        </div>
                        <div className="border-t pt-2">
                            <p className="md:text-lg mb-4">
                            <span className="font-semibold">Tổng Phí Còn Nợ:</span> {(user.feeOwed - user.feePaid).toLocaleString()} VND
                            </p>
                            <p className="md:text-lg mb-4">
                                <span className="font-semibold">Vui lòng chuyển khoản tới tài khoản sau:</span>
                            </p>
                            <div className="bg-gray-100 p-4 rounded-lg">
                                <p className="text-lg"><strong>Tên Tài Khoản:</strong> Nguyễn Văn A</p>
                                <p className="text-lg"><strong>Số Tài Khoản:</strong> 123456789</p>
                                <p className="text-lg"><strong>Ngân Hàng:</strong> Vietcombank</p>
                            </div>
                            {/* Mã QR thanh toán */}
                            <div className="text-center flex justify-center">
                                {/* <img src="your-qr-code-image-url.png" alt="QR Code Thanh Toán" /> */}
                                <MdQrCode2   className="size-60"/>
                            </div>                        
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}



export default Payment;
