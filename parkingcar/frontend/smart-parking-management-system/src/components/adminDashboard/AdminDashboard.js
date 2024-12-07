import React, { useState, useEffect } from 'react';
import { getDatabase, ref, get } from 'firebase/database';
import UserInfo from "./UserInfo";
import Payment from "./Payment";
import TransactionHistory from "./TransactionHistory";
import AccessHistory from "./AccessHistory";
import DeleteUser from "./DeleteUser";
import PendingCards from "./PendingCards"; 

function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [pendingCards, setPendingCards] = useState([]);

  useEffect(() => {
    const db = getDatabase();
    const usersRef = ref(db, 'users/');
    get(usersRef).then(snapshot => {
      if (snapshot.exists()) {
        const usersData = snapshot.val();
        const userList = Object.keys(usersData).map(uid => ({
          uid,
          ...usersData[uid],
        }));
        setUsers(userList);
      }
    });
    const pendingCardsRef = ref(db, 'pending/');
    get(pendingCardsRef).then(snapshot => {
      if (snapshot.exists()) {
        setPendingCards(Object.keys(snapshot.val()));
      }
    });
  }, []);

  return (
    <div className="admin-dashboard m-2">
      <div className="flex justify-between m-4">
        <div className="text-xl font-bold">Quản lý người dùng</div>
        <PendingCards pendingCards={pendingCards} setPendingCards={setPendingCards} />
      </div>
      <table className="table-auto w-full border-collapse border border-gray-300">
        <thead>
          <tr>
            <th className="border border-gray-300 p-2 md:text-base text-xs">Tên</th>
            <th className="border border-gray-300 p-2 md:text-base text-xs">Email</th>
            <th className="border border-gray-300 p-2 md:text-base text-xs">Thẻ</th>
            <th className="border border-gray-300 p-2 md:text-base text-xs">Tổng nợ</th>
            <th className="border border-gray-300 p-2 md:text-base text-xs">Tổng trả</th>
            <th className="border border-gray-300 p-2 md:text-base text-xs">Còn nợ</th>
            <th className="border border-gray-300 p-2 md:text-base text-xs">Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className="hover:bg-gray-100">
              <td className="border border-gray-300 p-2 md:text-base text-xs">{user.name}</td>
              <td className="border border-gray-300 p-2 md:text-base text-xs">{user.email}</td>
              <td className="border border-gray-300 p-2 md:text-base text-xs">{user.cardId}</td>
              <td className="border border-gray-300 p-2 md:text-base text-xs">{user.feeOwed}</td>
              <td className="border border-gray-300 p-2 md:text-base text-xs">{user.feePaid}</td>
              <td className="border border-gray-300 p-2 md:text-base text-xs">
                {user.feeOwed - user.feePaid}
              </td>
              <td className="border border-gray-300 p-2 space-x-2">
                <UserInfo user={user} />
                <Payment user={user} />
                <TransactionHistory user={user} />
                <AccessHistory user={user} />
                <DeleteUser user={user} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminDashboard;
