// Login.js
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../Config/Firebase";
import { signInWithEmailAndPassword } from "firebase/auth";

const Login = () => {
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    const [successMsg, setSuccessMsg] = useState('');

    const handleLogin = (e) => {
        e.preventDefault();
        signInWithEmailAndPassword(auth, email, password)
            .then(() => {
                setSuccessMsg('Login Successful! You will now be redirected to HomePage');
                setEmail('');
                setPassword('');
                setErrorMsg('');
                setTimeout(() => {
                    setSuccessMsg('');
                    navigate('/home');
                }, 3000);
            }).catch(error => setErrorMsg(error.message));
    }

    return (
        <>
            <section className="background-radial-gradient overflow-hidden">
                <div className="container px-4 py-5 px-md-5 text-center text-lg-start my-5  form-container">
                    <div className="row gx-lg-5 align-items-center mb-5">
                        <div className="col-lg-6 mb-5 mb-lg-0" style={{ zIndex: 10 }}></div>
                        <div className="col-lg-6 mb-5 mb-lg-0 position-relative">
                            <div className="card bg-glass">
                                <div className="card-body px-4 py-5 px-md-5">
                                    <h1>Login</h1>
                                    <hr />
                                    {successMsg && (
                                        <div className="success-msg">{successMsg}</div>
                                    )}
                                    <form className="form-group" autoComplete="off" onSubmit={handleLogin}>
                                        <label className="form-label" htmlFor="email">Email address</label>
                                        <input type="email" id="email" className="form-control" required
                                            value={email} onChange={(e) => setEmail(e.target.value)} />
                                        <label className="form-label" htmlFor="password">Password</label>
                                        <input type="password" id="password" className="form-control" required
                                            value={password} onChange={(e) => setPassword(e.target.value)} />
                                        <button type="submit" className="btn btn-primary btn-block mt-4">Login</button>
                                        <div className="text-center mt-3">
                                            <span>No account yet? <Link to="/signup">Sign up here</Link></span>
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
    )
}

export default Login;