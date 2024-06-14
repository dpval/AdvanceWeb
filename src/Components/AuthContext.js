import React, { createContext, useState, useEffect } from "react";
import { auth, fs } from "../Config/Firebase";
import { collection, getDocs, doc, getDoc, setDoc } from "firebase/firestore";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [cart, setCart] = useState([]);
    const [user, setUser] = useState(null);
    const [usertype, setUserType] = useState(null);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
            if (currentUser) {
                const userDocRef = doc(fs, "tblUsers", currentUser.uid);
                const userDoc = await getDoc(userDocRef);
                if (userDoc.exists()) {
                    const userData = userDoc.data();
                    setUser(currentUser);
                    setUserType(userData.usertype || "user");
                    
                    const cartCollectionRef = collection(fs, `tblUsers/${currentUser.uid}/tblCart`);
                    const snapshot = await getDocs(cartCollectionRef);
                    const cartData = snapshot.docs.map(doc => ({
                        id: doc.id,
                        ...doc.data()
                    }));
                    setCart(cartData);
                } else {
                    console.error("User document does not exist");
                }
            } else {
                setUser(null);
                setUserType(null);
                setCart([]);
            }
        });

        return () => unsubscribe();
    }, []);

    const getTotalItems = () => {
        return cart.reduce((total, item) => total + item.prodQty, 0);
    };

    useEffect(() => {
        if (user) {
            cart.forEach(async (item) => {
                const userBucketDocRef = doc(fs, 'tblUsers', user.uid, 'tblCart', item.id);
                await setDoc(userBucketDocRef, item, { merge: true });
            });
        }
    }, [cart, user]);

    return (
        <AuthContext.Provider value={{ cart, setCart, getTotalItems, usertype }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
