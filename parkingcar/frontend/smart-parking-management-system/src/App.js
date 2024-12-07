// src/App.js
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ref, get } from "firebase/database";
import { database, auth } from './firebase'; // Import database từ file firebase.js
import ProtectedRoute from './components/ProtectedRoute';
import Header from './components/Header';
import Footer from './components/Footer';
import Dashboard from './components/Dashboard';
import ParkingSpotDetails from './components/ParkingSpotDetails';
import UserAccount from './components/userDashboard/UserAccount';
import Login from './components/Login';
import FindSpot from "./components/FindSpot";
import Register from "./components/Register";
import AdminDashboard from './components/adminDashboard/AdminDashboard';

function App() {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);

  // Định nghĩa hàm fetchUserData để lấy dữ liệu người dùng từ Firebase
  const fetchUserData = async (userId) => {
    const userRef = ref(database, `users/${userId}`); // Giả sử dữ liệu người dùng lưu trong đường dẫn này
    const snapshot = await get(userRef);
    if (snapshot.exists()) {
      return snapshot.val(); // Trả về dữ liệu người dùng
    }
    return null;
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        const userId = user.uid; // Lấy ID người dùng từ Firebase Authentication
        const userData = await fetchUserData(userId);
        
        if (userData) {
          setUser(userData);
          setRole(userData.role); // Lấy role từ dữ liệu người dùng
          console.log("User data:", userData);
          console.log("Role:", userData.role);
        } else {
          console.log("User không có dữ liệu, sử dụng role mặc định 'user'");
          auth.signOut(); // Đăng xuất người dùng
          setUser(user);  // Đặt user hiện tại là người đăng nhập
          setRole('user'); // Gán role mặc định là 'user'
        }
      } else {
        setUser(null);
        setRole(null); // Nếu không có người dùng đăng nhập, đặt lại user và role
      }
    });

    return () => unsubscribe(); // Hủy đăng ký khi component bị hủy
  }, []); // Chạy chỉ một lần khi component mount

  return (
    <Router>
      <Header />
      <div className="min-h-screen">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route path="/account" element={
            <ProtectedRoute user={user} role={role} requiredRole="user">
              <UserAccount />
            </ProtectedRoute>
          } />

          <Route path="/spot/:id" element={<ParkingSpotDetails />} />
          <Route path="/find-spot" element={<FindSpot />} />
          <Route path="/admin" element={
            <ProtectedRoute user={user} role={role} requiredRole="admin">
              <AdminDashboard />
            </ProtectedRoute>
          } />
        </Routes>
      </div>
      <Footer />
    </Router>
  );
}

export default App;
