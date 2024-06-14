import React, { useState, useEffect } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { auth, fs } from "../Config/Firebase";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import log1 from '../assets/img/log1.png';

function Nav({ isLoggedIn, handleLogin }) {
  const [cart, setCart] = useState([]);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        const userDocRef = doc(fs, "tblUsers", currentUser.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          setUser({ uid: currentUser.uid, ...userDoc.data() });
        } else {
          console.error("User document does not exist");
        }
      } else {
        setUser(null);
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchCart = async () => {
      if (user) {
        try {
          const cartCollectionRef = collection(fs, `tblUsers/${user.uid}/tblCart`);
          const snapshot = await getDocs(cartCollectionRef);
          const cartData = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          setCart(cartData);
        } catch (error) {
          console.error("Error fetching cart data: ", error);
        }
      }
    };

    fetchCart();
  }, [user]);

  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigate("/login");
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  const handleCartClick = () => {
    if (!user) {
      alert("You must login first");
      navigate("/login");
    } else {
      navigate("/cart");
    }
  };

  // Count the total items by counting the prodId
  const totalItems = cart.length;

  return (
    <div>
      <style>
        {`
          .greeting {
            margin-left: 10px;
            color: white;
          }
          .navbar-icons .nav-link {
            margin-right: 15px;
            display: flex;
            align-items: center;
          }
          .cart-item-count {
            background: red;
            color: white;
            border-radius: 50%;
            padding: 2px 6px;
            font-size: 12px;
            margin-left: 5px;
          }
          .logout-link {
            color: white;
            display: flex;
            align-items: center;
          }
          .logout-link i {
            margin-right: 8px;
          }
          .navcart-container {
            position: relative;
            display: flex;
            align-items: center;
          }
          .navcart-icon {
            margin: 5px;
            background-color: #ebb978;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            display: flex;
            justify-content: center;
            align-items: center;
            position: relative;
          }
          .navcart-count {
            position: absolute;
            top: -5px;
            right: -5px;
            background-color: red;
            color: white;
            border-radius: 50%;
            width: 20px;
            height: 20px;
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 12px;
          }
          .logo {
            width: 50px; /* Adjust size as needed */
            height:auto;
          }
          .logo-container {
            display: flex;
            align-items: center;
          }
        `}
      </style>
      <header>
        <h1 className="site-heading text-center text-faded d-none d-lg-block">
          <span className="site-heading-lower">Pawsitively Obsessed</span>
        </h1>
      </header>
      <nav className="navbar navbar-expand-lg navbar-dark py-lg-4" id="mainNav">
        <div className="container">
          <div className="logo-container">
            <Link to="/products">
              <img src={log1} alt="Logo" className="logo" />
            </Link>
          </div>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav mx-auto">
              
              <li className="nav-item px-lg-4">
                <NavLink className="nav-link text-uppercase" to="/home" activeClassName="active">Home</NavLink>
              </li>
              <li className="nav-item px-lg-4">
                <NavLink className="nav-link text-uppercase" to="/contacts" activeClassName="active">Contacts</NavLink>
              </li>
              {user && (
                <>
                  <li className="nav-item px-lg-4">
                    <NavLink className="nav-link text-uppercase" to="/story" activeClassName="active">Pet Day</NavLink>
                  </li>
                  <li className="nav-item px-lg-4">
                    <NavLink className="nav-link text-uppercase" to="/products" activeClassName="active">Products</NavLink>
                  </li>
                  <li className="nav-item px-lg-4">
                    <NavLink className="nav-link text-uppercase" to="/memories" activeClassName="active">Story</NavLink>
                  </li>
                  {user.usertype === "Admin" && (
                    <li className="nav-item px-lg-4">
                      <NavLink className="nav-link text-uppercase" to="/addproduct" activeClassName="active">Add Products</NavLink>
                    </li>
                  )}
                </>
              )}
            </ul>
            <ul className="navbar-nav">
              {user && <span className="greeting">Hello, {user.FullName}!</span>}
            </ul>
            <div className="navcart-item">
              <div className="navcart-icons">
                <div className="nav-link text-uppercase navcart-container" onClick={handleCartClick}>
                  <div className="navcart-icon">
                    <FontAwesomeIcon icon={faShoppingCart} />
                    <p className="navcart-count">{totalItems}</p>
                  </div>
                </div>
              </div>
            </div>
            <ul className="navbar-nav">
              {user ? (
                <>
                  <li className="nav-item">
                    <button className="btn btn-link nav-link js-scroll-trigger" onClick={handleLogout}>
                      <i className="fas fa-sign-out-alt"></i> Logout
                    </button>
                  </li>
                </>
              ) : (
                <li className="nav-item">
                  <Link className="nav-link" to="/login">
                    Login | Signup
                  </Link>
                </li>
              )}
            </ul>
          </div>
        </div>
      </nav>
    </div>
  );
}
export default Nav;
