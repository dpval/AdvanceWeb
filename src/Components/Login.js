import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth, fs } from "../Config/Firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

export const Login = () => {
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    const [successMsg, setSuccessMsg] = useState('');

    const handleSignup = async (e) => {
        e.preventDefault();
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            const userDocRef = doc(fs, "tblUsers", user.uid);
            const userDoc = await getDoc(userDocRef);

            if (userDoc.exists()) {
                const userData = userDoc.data();
                const usertype = userData.usertype;
                setSuccessMsg('Login Successfully! You will now be redirected to HomePage');
                setEmail('');
                setPassword('');
                setErrorMsg('');
                setTimeout(() => {
                    setSuccessMsg('');
                    navigate('/');
                }, 3000);
            } else {
                setErrorMsg("User data does not exist");
            }
        } catch (error) {
            setErrorMsg(error.message);
        }
    };

    return (
        <section className="background-radial-gradient overflow-hidden">
            <div className="container px-4 py-5 px-md-5 text-center text-lg-start my-5  form-container">
                <div className="row gx-lg-5 align-items-center mb-5">
                    <div className="col-lg-6 mb-5 mb-lg-0" style={{ zIndex: 10 }}>
                        <div className="left-text text-center">
                            <h2>Welcome Back!</h2>
                            <p>"The purity of a person's heart can be quickly measured by how they regard animals." - Unknown</p>
                            <img src="./assets/img/animals.png" alt="" className="img-fluid" />
                        </div>
                    </div>
                    <div className="col-lg-6 mb-5 mb-lg-0 position-relative">
                        <div className="card bg-glass">
                            <div className="card-body px-4 py-5 px-md-5">
                                <h1>Login</h1>
                                <hr />
                                {successMsg && (
                                    <div className="success-msg">{successMsg}</div>
                                )}
                                <form className="form-group" autoComplete="off" onSubmit={handleSignup}>
                                    <label className="form-label" htmlFor="email">Email address</label>
                                    <input type="email" id="email" className="form-control" required
                                        value={email} onChange={(e) => setEmail(e.target.value)} />
                                    <label className="form-label" htmlFor="password">Password</label>
                                    <input type="password" id="password" className="form-control" required
                                        value={password} onChange={(e) => setPassword(e.target.value)} />
                                    <button type="submit" className="btn btn-primary btn-block mt-4">Login</button>
                                    <p>If you don't have an account yet, <Link to="/signup">Sign Up Here</Link>.</p>
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
    );
}

export default Login;
