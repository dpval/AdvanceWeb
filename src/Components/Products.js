import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from 'react-router-dom'; 
import Nav from './Nav';
import AuthContext from './AuthContext'; 
import { auth, fs } from '../Config/Firebase'; // Make sure 'auth' is exported from your Firebase config
import { collection, getDocs, doc, setDoc, deleteDoc } from 'firebase/firestore';

const Products = () => {
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true); // Add loading state
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [showLoginModal, setShowLoginModal] = useState(false);
    const { cart, setCart, usertype } = useContext(AuthContext); // Assuming userType is available from AuthContext
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate(); // Using useNavigate here

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const productsCollectionRef = collection(fs, 'tblProducts');
                const snapshot = await getDocs(productsCollectionRef);
                const productsData = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setProducts(productsData);
            } catch (error) {
                window.alert("Error fetching products: " + error.message);
            } finally {
                setIsLoading(false); // Set loading to false after data is fetched
            }
        };
        fetchProducts();
    }, []);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(user => {
            setIsLoggedIn(!!user);
        });

        return () => unsubscribe();
    }, []);

    const handleProductClick = (product) => {
        if (!isLoggedIn) {
            setShowLoginModal(true);
        } else {
            setSelectedProduct(product);
        }
    };

    const handleCartClick = async (product) => {
        if (!isLoggedIn) {
            window.alert("Hello there, login first!");
            navigate('/login');
        } else {
            const confirmAdd = window.confirm("This product is going to your cart?");
            if (!confirmAdd) return;

            const existingProduct = cart.find(item => item.id === product.id);
            let cartProduct;
            if (existingProduct) {
                setCart(cart.map(item =>
                    item.id === product.id ? { ...item, prodQty: item.prodQty + 1 } : item
                ));
                cartProduct = { ...existingProduct, prodQty: existingProduct.prodQty + 1 };
            } else {
                cartProduct = { ...product, prodQty: 1 }; // Add only one item initially
                setCart(prevCart => [...prevCart, cartProduct]);
            }

            const user = auth.currentUser;
            if (user) {
                try {
                    const userBucketDocRef = doc(fs, 'tblUsers', user.uid, 'tblCart', product.id);
                    await setDoc(userBucketDocRef, cartProduct, { merge: true });
        
                    window.location.reload();
                } catch (error) {
                    window.alert("Error adding product to cart: " + error.message);
                }
            }

            closeModals();
        }
    };

    const closeModals = () => {
        setShowLoginModal(false);
        setSelectedProduct(null);
    };

    const handleSearch = () => {
        const filteredProducts = products.filter(product => {
            return product.prodTitle.toLowerCase().includes(searchTerm.toLowerCase());
        });
        setProducts(filteredProducts);
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    const handleButtonClick = () => {
        handleSearch();
    };

    const handleEditProduct = (productId) => {
        navigate(`/edit-product/${productId}`); // Assuming you have a route to edit product with productId
    };

    const handleDeleteProduct = async (productId) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this product?");
        if (confirmDelete) {
            try {
                await deleteDoc(doc(fs, 'tblProducts', productId));
                setProducts(products.filter(product => product.id !== productId));
                window.alert("Product deleted successfully!");
            } catch (error) {
                window.alert("Error deleting product: " + error.message);
            }
        }
    };

    return (
        <>
            <Nav />
            <section className="page-section bg-light" id="cart">
                <div className="container">
                    <div className="text-center">
                        <h2 className="section-heading text-uppercase">Products</h2>
                      
                    </div>
                    <br />
                    
                    {isLoading ? (
                        <div className="container-fluid" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                            <img src="asset/img/loading.gif" alt="Loading" style={{ maxWidth: '100%', height: 'auto' }} />
                        </div>
                    ) : (
                        products.length > 0 ? (
                            <div className="row">
                                {products.map(product => (
                                    <div key={product.id} className="col-lg-4 col-sm-6 mb-4">
                                        <div className="cart-item">
                                            <a
                                                className="cart-link"
                                                href="#"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    handleProductClick(product);
                                                }}
                                            >
                                                <div className="cart-hover">
                                                    <div className="cart-hover-content"><i className="fas fa-plus fa-3x" /></div>
                                                </div>
                                                <img className="img-fluid" src={product.prodURL} alt="..." />
                                            </a>
                                            <div className="cart-caption">
                                                <div className="cart-caption-heading">{product.prodTitle}</div>
                                                <div className="cart-caption-heading">{product.prodDesc}</div>
                                                <ul><div className="cart-caption-heading">Qty: {product.prodQty}</div></ul>
                                                <div className="cart-caption-heading">Price: {product.prodPrice}</div>
                                                {usertype === 'user' ? (
                                                    <button className="btn-cart" onClick={() => handleCartClick(product)}>Add to Cart</button>
                                                ) : (
                                                    <div>
                                                        <button className="btn-edit" onClick={() => handleEditProduct(product.id)}>Edit</button>
                                                        <button className="btn-delete" onClick={() => handleDeleteProduct(product.id)}>Delete</button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div>No products found.</div>
                        )
                    )}
                </div>
            </section>
            {/* Modals and other components */}
        </>
    );
}
export default Products;