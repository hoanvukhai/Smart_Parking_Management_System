// src/components/ProtectedRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';
import { auth, database } from '../firebase';
import { useEffect, useState } from 'react';
import { ref, get } from 'firebase/database';

const ProtectedRoute = ({ children, requiredRole }) => {
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        const userRef = ref(database, `users/${user.uid}`);
        const snapshot = await get(userRef);
        if (snapshot.exists()) {
          setUserRole(snapshot.val().role);
        } else {
          console.error("Không tìm thấy vai trò của người dùng.");
          setUserRole(null);
        }
      } else {
        setUserRole(null);
      }
      setLoading(false);
    });
  
    return () => unsubscribe();
  }, []);
  
  if (loading) {
    return <div>Đang kiểm tra trạng thái...</div>;
  }
  
  if (!auth.currentUser || userRole === null) {
    return <Navigate to="/login" />;  // Hoặc trang phù hợp khác nếu không có role
  }
  
  if (userRole !== requiredRole) {
    return <Navigate to="/" />;
  }
  
  return children;
  
};

export default ProtectedRoute;
