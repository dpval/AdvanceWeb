import React, { useContext, useEffect } from "react";
import { FaTrash, FaMinus, FaPlus } from 'react-icons/fa';
import { doc, deleteDoc, setDoc, collection, onSnapshot } from 'firebase/firestore';
import AuthContext from './AuthContext'; // Correct import
import { auth, fs } from '../Config/Firebase'; // Import your Firebase configuration

import Nav from "./Nav";
import Footer from "./Footer";

const Cart = () => {
    const { cart, setCart } = useContext(AuthContext);

    useEffect(() => {
        const user = auth.currentUser;
        if (user) {
            const cartCollectionRef = collection(fs, 'tblUsers', user.uid, 'tblCart');
            const unsubscribe = onSnapshot(cartCollectionRef, (snapshot) => {
                const updatedCart = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setCart(updatedCart);
            });
            return () => unsubscribe(); // Cleanup on unmount
        }
    }, [setCart]);

    const removeItem = async (product) => {
        if (window.confirm("Change of mind shopping, Delete this product?")) {
            try {
                const user = auth.currentUser;
                if (user) {
                    const userCartDocRef = doc(fs, 'tblUsers', user.uid, 'tblCart', product.id);
                    await deleteDoc(userCartDocRef);
                    window.alert("Product removed!");
                    window.location.reload();
                }
            } catch (error) {
                window.alert("Error removing product from cart: " + error.message);
            }
        }
    };

    const updateQuantity = async (product, quantity) => {
        if (product.prodQty === 1 && quantity < 0) {
            if (!window.confirm("Are you sure you don't want to buy it anymore?")) {
                return;
            } else {
                window.location.reload(); // Reload the page after the user confirms
            }
        }

        const updatedCart = cart.map(item =>
            item.id === product.id ? { ...item, prodQty: item.prodQty + quantity } : item
        ).filter(item => item.prodQty > 0);

        setCart(updatedCart);

        const user = auth.currentUser;
        if (user) {
            try {
                const userCartDocRef = doc(fs, 'tblUsers', user.uid, 'tblCart', product.id);
                if (quantity < 0 && product.prodQty === 1) {
                    await deleteDoc(userCartDocRef);
                } else {
                    await setDoc(userCartDocRef, { ...product, prodQty: product.prodQty + quantity }, { merge: true });
                }
            } catch (error) {
                window.alert("Error updating product quantity: " + error.message);
            }
        }
    };

    const calculateTotalPrice = () => {
        return cart.reduce((total, item) => total + (item.prodPrice * item.prodQty), 0);
    };

    const calculateTotalQuantity = () => {
        return cart.reduce((total, item) => total + item.prodQty, 0);
    };

    return (
        <div>
            <Nav />
            <h1 className="text-center" style={{ color: "white" }}>My Cart</h1>
            {cart.length === 0 && <p className="text-center" style={{ color: "white" }}>CART IS EMPTY</p>}
            <div className="cart-container">
                {cart.map((item, index) => (
                    <div key={item.id} className="cart-item">
                        <div className="delete-container">
                            <button className="delete-icon" onClick={() => removeItem(item)}><FaTrash /></button>
                        </div>
                        
                        <img src={item.prodURL} alt={item.prodTitle} />
                        <div className="products-text title">Brand: {item.prodTitle}</div>
                        <div className="products-text title">Description: {item.prodDesc}</div>
                        <div className="products-text title">Price: {item.prodPrice}</div>
                        <div className="quantity-container">
                            <button className="quantity-btn" onClick={() => updateQuantity(item, -1)}><FaMinus /></button>
                            <div className="quantity">{item.prodQty}</div>
                            <button className="quantity-btn" onClick={() => updateQuantity(item, 1)}><FaPlus /></button>
                        </div>
                    </div>
                ))}
            </div>
            <div className="total-price-container" style={{ backgroundColor: "lightyellow",  }}>
                <div className="total-quantity">Total Items: {calculateTotalQuantity()}</div>
               <p>- - - - - - - - - - - - - - - -</p>
                <div className="total-price">Total Amount: php {calculateTotalPrice()}</div>

                
            </div>
            <Footer />
        </div>
    );
}

export default Cart;
