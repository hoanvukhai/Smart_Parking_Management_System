import React, { useState } from "react";
import { auth, database } from "../firebase";  // Import database
import { createUserWithEmailAndPassword } from "firebase/auth";
import { ref, set } from "firebase/database";  // Import các hàm database
import { useNavigate } from 'react-router-dom';

function Register() {
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();

        // Kiểm tra tên không để trống
        if (!name.trim()) {
            setError("Vui lòng nhập tên.");
            return;
        }

        // Kiểm tra mật khẩu trùng khớp
        if (password !== confirmPassword) {
            setError("Mật khẩu không trùng khớp. Vui lòng thử lại.");
            return;
        }

        try {
            // Tạo người dùng mới nếu mật khẩu trùng khớp
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const uid = userCredential.user.uid;  // Lấy UID của người dùng mới

            // Thông tin người dùng mặc định lưu trong Firebase Database
            const userData = {
                email: email,
                name: name,
                cardId: "",  // Admin sẽ cập nhật sau
                feePaid: 0,
                feeOwed: 0,
                role: "user",  // Phân quyền người dùng
                history: {} 
            };

            // Lưu thông tin người dùng vào Firebase Realtime Database
            await set(ref(database, `users/${uid}`), userData);

            alert("Đăng ký thành công!");
            navigate('/login');
        } catch (error) {
            setError(error.message || "Đã xảy ra lỗi. Vui lòng thử lại.");
        } finally {
            setIsLoading(false); // Tắt hiệu ứng tải
        }
    };

    return (
        <div className="flex justify-center min-h-screen bg-gray-100">
            <div className="mt-20 h-1/2 w-full max-w-md bg-white shadow-lg rounded-lg p-8">
                <h2 className="text-2xl font-bold text-center mb-4 text-gray-800">Đăng Ký</h2>
                <form onSubmit={handleRegister} className="space-y-4">
                <div>
                    <label className="block text-gray-600 font-medium">Email:</label>
                    <input
                    type="email"
                    placeholder="Nhập email của bạn"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="border w-full p-2 rounded focus:ring-2 focus:ring-blue-400"
                    />
                </div>
                <div>
                    <label className="block text-gray-600 font-medium">Tên đầy đủ:</label>
                    <input
                    type="text"
                    placeholder="Nhập tên đầy đủ"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="border w-full p-2 rounded focus:ring-2 focus:ring-blue-400"
                    />
                </div>
                <div>
                    <label className="block text-gray-600 font-medium">Mật khẩu:</label>
                    <input
                    type="password"
                    placeholder="Nhập mật khẩu"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="border w-full p-2 rounded focus:ring-2 focus:ring-blue-400"
                    />
                </div>
                <div>
                    <label className="block text-gray-600 font-medium">Xác nhận mật khẩu:</label>
                    <input
                    type="password"
                    placeholder="Nhập lại mật khẩu"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="border w-full p-2 rounded focus:ring-2 focus:ring-blue-400"
                    />
                </div>
                {error && <p className="text-red-500 text-sm">{error}</p>}
                <button
                    type="submit"
                    disabled={isLoading}
                    className={`w-full p-2 text-white rounded ${
                    isLoading ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-600"
                    }`}
                >
                    {isLoading ? "Đang xử lý..." : "Đăng Ký"}
                </button>
                </form>
            </div>
        </div>
    );
}

export default Register;
