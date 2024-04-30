import React, { useState, useEffect } from 'react';
import Header from "./Header";
import AddProducts from "./AddProducts";
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../Config/Firebase'; // Import your Firebase configuration

export const Product = () => {
    const [isAddingProduct, setIsAddingProduct] = useState(false);
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const productsCollectionRef = collection(db, 'tblProducts'); // Use db from Firebase config
                const productsSnapshot = await getDocs(productsCollectionRef);
                const productsData = productsSnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setProducts(productsData);
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        };

        fetchProducts();
    }, []);

    const toggleAddProduct = () => {
        setIsAddingProduct(!isAddingProduct);
    };

    const handleAddProduct = (newProduct) => {
        setProducts([...products, newProduct]);
    };

    return (
        <div>
            <Header />
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                <h2>Products</h2>
                <button onClick={toggleAddProduct}>
                    {isAddingProduct ? "Close Form" : "Add Product"}
                </button>
            </div>
            {isAddingProduct && <AddProducts onAddProduct={handleAddProduct} />}
            <div>
                <h3>Added Products:</h3>
                <ul>
                    {products.map((product, index) => (
                        <li key={index}>
                            <h4>{product.prodTitle}</h4>
                            <p>Description: {product.prodDesc}</p>
                            <p>Price: ${product.prodPrice}</p>
                            <p>Quantity: {product.prodQty}</p>
                            <img src={product.prodURL} alt={product.prodTitle} style={{ maxWidth: "200px" }} />
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default Product;
