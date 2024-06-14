import React, { useState, useEffect } from "react";
import { auth, fs } from '../Config/Firebase'
import { doc, getDoc, } from 'firebase/firestore';
import Nav from "./Nav";
const Contacts = () => {


    const [user, setUser] = useState(null);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(async (authUser) => {
            if (authUser) {
                const userDoc = doc(fs, 'tblUsers', authUser.uid);
                const userSnapshot = await getDoc(userDoc);
                setUser(userSnapshot.data()?.FullName || 'User'); 
            } else {
                setUser(null);
            }
        });
  
        return () => unsubscribe();
    }, []);
  
   
        


    return (
    
        
     <div>  
           <>
          <Nav user={user} />
        
      </>        
        <div className="contact">
         
            <h1 className="text-center" style={{ color: "white" }}>Emergency Contacts </h1>
         
            <div className="contactpage">
                <div className="contact-container">
                    <h2>Philippine Animal Welfare Society (PAWS)</h2>
                    <p>Hotline: +63 2 8724 5267</p>
                </div>
                <div className="contact-container">
                    <h2>Animal Kingdom Foundation (AKF)</h2>
                    <p>Hotline: +63 917 848 8850</p>
                </div>
                <div className="contact-container">
                    <h2>Philippine Society for the Prevention of Cruelty to Animals (PSPCA)</h2>
                    <p>Hotline: +63 2 723 0413</p>
                </div>
                <div className="contact-container">
                    <h2>Animal Welfare Coalition (AWC)</h2>
                    <p>Hotline: +63 2 8722 4792</p>
                </div>
                <div className="contact-container">
                    <h2>Philippine Animal Rescue Team (PART)</h2>
                    <p>Hotline: +63 2 8376 0128</p>
                </div>
                <div className="contact-container">
                    <h2>Philippine Animal Rescue Volunteers (PARV)</h2>
                    <p>Hotline: +63 2 8936 5976</p>
                </div>
                <div className="contact-container">
                    <h2>Compassion and Responsibility for Animals (CARA)</h2>
                    <p>Hotline: +63 917 579 8840</p>
                </div>
                <div className="contact-container">
                    <h2>Philippine Pet Birth Control Center Foundation (PPBCCF)</h2>
                    <p>Hotline: +63 927 359 5819</p>
                </div>
                <div className="contact-container">
                    <h2>People for the Ethical Treatment of Animals (PETA) Asia-Pacific</h2>
                    <p>Hotline: +63 2 8844 1826</p>
                </div>
                <div className="contact-container">
                    <h2>Animal Kingdom Foundation (AKF)</h2>
                    <p>Hotline: +63 917 848 8850</p>
                </div>
            </div>
        </div>
        </div>
    );
}

export default Contacts;
