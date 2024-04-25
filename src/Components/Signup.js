// Signup.js
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth, fs } from "../Config/Firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from 'firebase/firestore';


import '../styles.css';

const Signup = () => {
    const navigate = useNavigate();

    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    const [successMsg, setSuccessMsg] = useState('');
    const [petType, setPetType] = useState(''); // <-- Define petType and setPetType

    const handleSignup = async (e) => {
        e.preventDefault();
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const ref = doc(fs, "tblUsers", userCredential.user.uid);
            await setDoc(ref, {
                FullName: fullName,
                Email: email,
                Password: password,
                petType: petType,
            });
            setSuccessMsg("Signup Successful. You will now be redirected to Login");
            setFullName("");
            setPetType("");
            setEmail("");
            setPassword("");
            setErrorMsg("");
            setTimeout(() => {
                setSuccessMsg("");
                navigate('/login');
            }, 3000);
        } catch (error) {
            setErrorMsg(error.message);
        }
    }

    return (
        <>
            <section className="background-radial-gradient overflow-hidden">
                <div className="container px-4 py-5 px-md-5 text-center text-lg-start my-5 form-container">
                    <div className="row gx-lg-5 align-items-center mb-5">
                        <div className="col-lg-6 mb-5 mb-lg-0" style={{ zIndex: 10 }}>
                            <img src="./assets/img/paw-image.jpg" alt="" style={{ opacity: 0.7 }} />
                        </div>
                        <div className="col-lg-6 mb-5 mb-lg-0 position-relative">
                            <div className="card bg-glass">
                                <div className="card-body px-4 py-5 px-md-5">
                                    <h1>Sign-Up</h1>
                                    <hr />
                                    {successMsg && (
                                        <div className="success-msg">{successMsg}</div>
                                    )}
                                    <form className="form-group" autoComplete="off" onSubmit={handleSignup}>
                                        <label className="form-label" htmlFor="fullName">Full Name</label>
                                        <input type="text" id="fullName" className="form-control" required
                                            value={fullName} onChange={(e) => setFullName(e.target.value)} />
                                        <label className="form-label" htmlFor="petType">Pet Type</label>
                                         <select id="petType" className="form-control" value={petType} onChange={(e) => setPetType(e.target.value)}>
                                   <option value="">Select Pet Type</option>
                                      <option value="cat">Cat</option>
                                      <option value="dog">Dog</option>
                                      <option value="cat">Lion</option>
                                      <option value="dog">Dog</option>
                                      <option value="cat">Fish</option>
                                      <option value="dog">Bird</option>
                                     
                                          </select>
                                        <label className="form-label" htmlFor="email">Email address</label>
                                        <input type="email" id="email" className="form-control" required
                                            value={email} onChange={(e) => setEmail(e.target.value)} />
                                        <label className="form-label" htmlFor="password">Password</label>
                                        <input type="password" id="password" className="form-control" required
                                            value={password} onChange={(e) => setPassword(e.target.value)} />
                                        <button type="submit" className="btn btn-primary btn-block mt-4">Sign up</button>
                                        <div className="text-center mt-3">
                                            <span>Already have an account? <Link to="/login">Login</Link></span>
                                        </div>
                                    </form>
                                    {errorMsg && (
                                        <div className="error-msg mt-3">{errorMsg}</div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default Signup;
