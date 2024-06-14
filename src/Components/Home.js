import React, { useEffect, useState } from "react";
import Content from "./Content";
import Footer from "./Footer";
import Nav from "./Nav";
import { auth, fs } from "../Config/Firebase";
import { getDoc, doc } from 'firebase/firestore';

export const Home = () => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const change = auth.onAuthStateChanged(async (authUser) => {
            if (authUser) {
                const userDoc = doc(fs, 'tblUsers', authUser.uid);
                const userSnapshot = await getDoc(userDoc);
                setUser(userSnapshot.data()?.fullName || 'user');
            } else {
                setUser(null);
            }
        });

        return () => change();
    }, []);

    return (
        <>
            <Nav user={user} />
            <Content />
            <Footer />
        </>
    );
}

export default Home;