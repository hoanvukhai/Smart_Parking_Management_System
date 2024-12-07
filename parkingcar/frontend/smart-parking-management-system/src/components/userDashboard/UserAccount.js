import React, { useState, useEffect } from "react";
import { auth, database } from "../../firebase";
import { ref, onValue } from "firebase/database";
import UserInfo from "./UserInfo";
import Payment from "./Payment";
import TransactionHistory from "./TransactionHistory";
import AccessHistory from "./AccessHistory";

function UserAccount() {
    const [user, setUser] = useState(null);
    const [userData, setUserData] = useState({});

    useEffect(() => {
        const fetchUserData = async () => {
            const currentUser = auth.currentUser;
            if (currentUser) {
                setUser(currentUser);
                const userRef = ref(database, `users/${currentUser.uid}`);
                onValue(userRef, (snapshot) => {
                    if (snapshot.exists()) {
                        setUserData(snapshot.val());
                    }
                });
            }
        };

        fetchUserData();
    }, []);

    return (
        <div className="max-w-2xl mx-auto p-6 bg-gray-100 rounded-lg shadow-lg mt-10">
            <h1 className="text-2xl font-bold mb-6 text-center">Thông Tin Tài Khoản</h1>
            <div className="bg-white p-4 rounded-lg shadow-md mb-6">
                <UserInfo user={userData} />
            </div>
            <div className="flex flex-col space-y-4">
                <Payment user={userData} />
                <TransactionHistory user={userData} />
                <AccessHistory user={userData} />
            </div>
        </div>
    );
}

export default UserAccount;
