import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { auth, provider, signInWithPopup, database } from "../firebase";
import { signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import { getDatabase, ref, set, get } from "firebase/database";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSignIn = async (e) => {
    e.preventDefault();

    try {
      // Đăng nhập người dùng
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const userId = userCredential.user.uid;

      // Lấy dữ liệu người dùng từ Firebase Realtime Database
      const userRef = ref(database, `users/${userId}`);
      const snapshot = await get(userRef);

      if (snapshot.exists()) {
        const userData = snapshot.val();

        // Chuyển hướng dựa trên vai trò của người dùng
        if (userData.role === 'admin') {
          navigate('/admin'); // Chuyển hướng đến trang admin
        } else if (userData.role === 'user') {
          navigate('/account'); // Chuyển hướng đến trang user
        } else {
          alert('Vai trò không hợp lệ');
        }
        alert('Đăng nhập thành công!');
      } else {
        alert('Không tìm thấy thông tin người dùng.');
      }
    } catch (error) {
      console.error('Lỗi đăng nhập:', error);
      alert('Đăng nhập thất bại. Vui lòng kiểm tra lại email và mật khẩu.');
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      
      // Kết nối tới Realtime Database
      const db = getDatabase();
      
      // Kiểm tra xem người dùng đã tồn tại trong Realtime Database chưa
      const userRef = ref(db, `users/${user.uid}`);
      const snapshot = await get(userRef);
      
      if (!snapshot.exists()) {
        // Nếu chưa tồn tại, thêm thông tin vào Realtime Database
        const userData = {
          email: user.email,
          name: user.displayName,
          cardId: "",
          feePaid: 0,
          feeOwed: 0,
          role: "user",
          history: {}  // Mảng rỗng cho lịch sử quẹt thẻ
        };
        await set(userRef, userData);
        navigate("/account"); // Chuyển hướng đến trang user
      } else {
        const userData = snapshot.val();
        if (userData.role === "admin") {
          navigate("/admin");
      } else {
        navigate('/account');
      }
    }
      
      alert("Đăng nhập Google thành công!");
    } catch (err) {
      setError(err.message);
    }
  };

  const handlePasswordReset = async () => {
    if (!email) {
      setError("Vui lòng nhập email để đặt lại mật khẩu");
      return;
    }
    try {
      await sendPasswordResetEmail(auth, email);
      alert("Email đặt lại mật khẩu đã được gửi!");
      setError("");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="flex justify-center min-h-screen bg-gray-100">
      <div className="mt-20 w-full h-1/2 max-w-md bg-white shadow-lg rounded-lg p-8">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-700">Đăng nhập</h2>
        <form onSubmit={handleSignIn} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-600">
              Email:
            </label>
            <input
              type="email"
              id="email"
              placeholder="Nhập email của bạn"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-200"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-600">
              Mật khẩu:
            </label>
            <input
              type="password"
              id="password"
              placeholder="Nhập mật khẩu"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-200"
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            Đăng nhập
          </button>
        </form>
        {error && <p className="text-red-500 mt-2 text-center">{error}</p>}
        <button
          onClick={handleGoogleSignIn}
          className="w-full mt-4 py-2 px-4 bg-red-500 text-white font-semibold rounded-lg shadow-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400"
        >
          Đăng nhập bằng Google
        </button>
        <button
          onClick={handlePasswordReset}
          className="w-full mt-4 py-2 px-4 bg-gray-500 text-white font-semibold rounded-lg shadow-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400"
        >
          Quên mật khẩu?
        </button>
      </div>
    </div>
  );
}

export default Login;
