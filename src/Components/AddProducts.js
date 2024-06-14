import Nav from "./Nav";
import React, { useState, useEffect } from "react";
import { doc, getDoc, } from 'firebase/firestore';
import { auth, storage, fs } from '../Config/Firebase'
import { ref, getDownloadURL, uploadBytes } from 'firebase/storage'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'

const AddProducts = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [qty, setQty] = useState('');
    const [image, setImage] = useState(null);

    const [imageError, setImageError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');
    const [uploadError, setUploadError] = useState('');
    const [user, setUser] = useState(null); // Move setUser here

    const productsCollectionRef = collection(fs, `tblProducts`);
    const types = ['image/jpg', 'image/jpeg', 'image/png', 'image/PNG'];

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

    const handleProductsImg = (e) => {
        let selectedFile = e.target.files[0];
        if (selectedFile) {
            if (selectedFile && types.includes(selectedFile.type)) {
                setImage(selectedFile);
                setImageError('');
            } else {
                setImage(null);
                setImageError('Please select a valid file type (png or jpg)');
            }
        } else {
            console.log('Please select your file');
        }
    };

    const handleAddProducts = (e) => {
        e.preventDefault();
        if (image != null) {
            const user = auth.currentUser;
            if (user) {
                // Check if the user is an admin
                const userDocRef = doc(fs, 'tblUsers', user.uid);
                getDoc(userDocRef).then((userDoc) => {
                    const userData = userDoc.data();
                    if (userData && userData.usertype === 'Admin') {
                        // User is an admin, proceed with adding the product
                        const imgRef = ref(storage, `tblProducts/${image.name}`);
                        uploadBytes(imgRef, image).then((snapshot) => {
                            getDownloadURL(snapshot.ref).then((url) => {
                                addDoc(productsCollectionRef, {
                                    prodTitle: title,
                                    prodDesc: description,
                                    prodPrice: Number(price),
                                    prodQty: Number(qty),
                                    prodURL: url,
                                    timeStamp: serverTimestamp()
                                }).then(() => {
                                    setSuccessMsg('Product successfully added');
                                    setTitle('');
                                    setDescription('');
                                    setPrice('');
                                    setQty('');
                                    document.getElementById('file').value = '';
                                    setImageError('');
                                    setUploadError('');
                                    setTimeout(() => {
                                        setSuccessMsg('');
                                    }, 3000);
                                }).catch(error => setUploadError(error.message));
                            });
                        }).catch(error => setUploadError(error.message));
                    } else {
                        // User is not an admin
                        setUploadError('Only Admins can add products');
                    }
                }).catch(error => setUploadError(error.message));
            } else {
                setUploadError('User not authenticated');
            }
        }
    };
    
    return (
        <div>
              <Nav/>
            <div className="add-products-container">
            <h1 className="text-center" style={{ color: "white" }}>Product Form</h1>
                <br />
                <br />
                {successMsg && <div className='success-msg'>{successMsg}</div>}
                <div className="add-products-form">
                    <form autoComplete="off" className='form-group' onSubmit={handleAddProducts}>
                        <label>Product Title:</label>
                        <input type="text" className='form-control' required onChange={(e) => setTitle(e.target.value)} value={title} />

                        <label>Product Description:</label>
                        <input type="text" className='form-control' required onChange={(e) => setDescription(e.target.value)} value={description} />

                        <label>Product Price:</label>
                        <input type="number" className='form-control' required onChange={(e) => setPrice(e.target.value)} value={price} />

                        <label>Quantity:</label>
                        <input type="number" className='form-control' required onChange={(e) => setQty(e.target.value)} value={qty} />

                        <label>Upload Product Image:</label>
                        <input type="file" id="file" className='form-control' required onChange={handleProductsImg} />
                        {imageError && <div className='error-msg'>{imageError}</div>}
                        <br />

                        <button type="submit" style={{ backgroundColor: "green", marginRight: "10px" }}>Submit</button>
                    </form>
                    {uploadError && <div className='error-msg'>{uploadError}</div>}
                </div>
            </div>
        </div>
    );
};

export default AddProducts;
