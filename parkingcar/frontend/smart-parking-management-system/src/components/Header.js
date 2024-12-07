// giao dien 2
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { getDatabase, ref, get } from 'firebase/database';
import { FaUserCircle, FaSignOutAlt, FaSignInAlt, FaUserPlus, FaCar  } from "react-icons/fa";
import { MdDashboard, MdSearch } from "react-icons/md";

function Header() {
  const [currentUser, setCurrentUser] = useState(null);
  const [role, setRole] = useState(null);  // Thêm state để lưu vai trò người dùng
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Theo dõi trạng thái người dùng đăng nhập và lấy vai trò
  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user);
        
        // Lấy thông tin người dùng từ Firebase Realtime Database để lấy vai trò
        const db = getDatabase();
        const userRef = ref(db, `users/${user.uid}/role`);
        get(userRef).then(snapshot => {
          if (snapshot.exists()) {
            setRole(snapshot.val());
          } else {
            setRole('user');  // Nếu không có vai trò, mặc định là 'user'
          }
        });
      } else {
        setCurrentUser(null);
        setRole(null);  // Đặt lại vai trò khi người dùng đăng xuất
      }
    });
  }, []);

  const handleLogout = () => {
    const auth = getAuth();
    signOut(auth).then(() => {
      setCurrentUser(null);
      setRole(null);  // Đặt lại vai trò khi đăng xuất
      navigate('/login');
    }).catch((error) => {
      console.error("Error during logout:", error);
    });
  };

  return (
    <header className="bg-gradient-to-r from-blue-500 to-indigo-500 p-4 text-white shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <h1 className="text-2xl font-bold flex items-center">
          <span className="mr-2"><FaCar />
          </span> Smart Parking System
        </h1>

        <nav className="hidden md:flex space-x-6 items-center">
          <Link to="/" className="flex items-center space-x-2 hover:text-gray-200 transition">
            <MdDashboard className="text-xl" />
            <span>Dashboard</span>
          </Link>
          <Link to="/find-spot" className="flex items-center space-x-2 hover:text-gray-200 transition">
            <MdSearch className="text-xl" />
            <span>Find</span>
          </Link>

          {currentUser ? (
            <>
              {role === "admin" ? (
                <Link to="/admin" className="flex items-center space-x-2 hover:text-gray-200 transition">
                  <FaUserCircle className="text-xl" />
                  <span>Admin</span>
                </Link>
              ) : (
                <Link to="/account" className="flex items-center space-x-2 hover:text-gray-200 transition">
                  <FaUserCircle className="text-xl" />
                  <span>Account</span>
                </Link>
              )}
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 text-red-200 hover:text-red-400 transition"
              >
                <FaSignOutAlt className="text-xl" />
                <span>Logout</span>
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="flex items-center space-x-2 hover:text-gray-200 transition">
                <FaSignInAlt className="text-xl" />
                <span>Login</span>
              </Link>
              <Link to="/register" className="flex items-center space-x-2 hover:text-gray-200 transition">
                <FaUserPlus className="text-xl" />
                <span>Register</span>
              </Link>
            </>
          )}
        </nav>


        {/* Mobile Menu */}
<div className="md:hidden">
  <button
    className="focus:outline-none p-2 text-blue-700 hover:text-blue-900"
    onClick={() => setIsMenuOpen(!isMenuOpen)}
  >
    <span className="text-2xl text-white">{isMenuOpen ? "✖" : "☰"}</span>
  </button>
  {isMenuOpen && (
    <>
      <div
          className="fixed top-20 inset-0 z-40 bg-black opacity-50"
          onClick={() => setIsMenuOpen(false)}
        ></div>
      <div
        className="fixed left-0 top-20 w-full bg-blue-700 text-white rounded shadow-md z-50"
        onClick={() => setIsMenuOpen(false)} // Tự đóng menu khi nhấn vào mục
      >
        <nav className="flex flex-col space-y-2 p-4">
          <Link
            to="/"
            className="hover:bg-blue-800 p-2 rounded"
          >
            Dashboard
          </Link>
          <Link
            to="/find-spot"
            className="hover:bg-blue-800 p-2 rounded"
          >
            Find Spot
          </Link>
          {currentUser && role === "admin" && (
            <Link
              to="/admin"
              className="hover:bg-blue-800 p-2 rounded"
            >
              Admin
            </Link>
          )}
          {currentUser && (
            <Link
              to="/account"
              className="hover:bg-blue-800 p-2 rounded"
            >
              Account
            </Link>
          )}
          {currentUser ? (
            <button
              onClick={handleLogout}
              className="text-left hover:bg-red-800 p-2 rounded text-red-200"
            >
              Logout
            </button>
          ) : (
            <>
              <Link
                to="/login"
                className="hover:bg-blue-800 p-2 rounded"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="hover:bg-blue-800 p-2 rounded"
              >
                Register
              </Link>
            </>
          )}
        </nav>
      </div>
    </>
  )}
</div>

      </div>
    </header>
  );
}

export default Header;
