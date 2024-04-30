import React, {useState} from "react";
import {storage, fs} from '../Config/Firebase'
import {ref, getDownloadURL, uploadBytes} from 'firebase/storage'

import {collection, addDoc, serverTimestamp} from 'firebase/firestore'


export const AddProducts = () => {
    const [title, setTitle]=useState('');
    const [description, setDescription]=useState('');
    const [price, setPrice]=useState('');
    const [qty, setQty]=useState('');
    const [image, setImage]=useState(null);

    const [imageError, setImageError]=useState('');
    const [successMsg, setSuccessMsg]=useState('');
    const [uplaodError, setUploadError]=useState('');

    const productsCollectionRef = collection (fs, `tblProducts`);
    const types = ['image/jpg', 'image/jpeg', 'image/png', 'image/PNG'];

    const handleProductsImg=(e)=>{
        let selectedFile = e.target.files[0];
        if(selectedFile){
            if(selectedFile&&types.includes(selectedFile.type)){
                setImage(selectedFile);
                setImageError('');

        }else{
            setImage(null);
            setImageError('Please select a valid file type (png or jpg)')
        }
        }else{
            console.log('Please select your file');
        }

    }
    const handleAddProducts=(e)=>{
        e.preventDefault();
        if(image!=null){
            const imgRef = ref(storage, `tblProducts/${image.name}`);
            uploadBytes(imgRef, image).then((snapshot)=>{
                getDownloadURL (snapshot.ref).then((url)=>{
                    addDoc(productsCollectionRef,{
                        prodTitle: title,
                        prodDesc:  description,
                        prodPrice: Number(price),
                        prodQty:   Number(qty),
                        prodURL:   url,
                        timeStamp: serverTimestamp()
                    
                }).then(()=>{
                        setSuccessMsg('Product successfully added');
                        setTitle('');
                        setDescription('');
                        setPrice('');
                        setQty('');
                        document.getElementById('file').value='';
                        setImageError('');
                        setUploadError('');
                        setTimeout(()=>{
                            setSuccessMsg('');
                        
                        },3000)

                }).catch(error=>setUploadError(error.meassage));

                })
            
        })


        }
    }


    return (
        <div>
           <div className="add-products-container">
            <h2>Add Product</h2>
            <br></br>
            <br></br>
            {successMsg&&<>
                <div className='success-msg'>{successMsg}</div>

            </>}
            <div className="add-products-form">
            <form autoComplete="off" className='form-group' onSubmit={handleAddProducts}>

                <label>Product Title:</label>
                <input type="text" classname='form-control' required onChange={(e)=>setTitle(e.target.value)} value={title}></input>
                
                <label>Product Description:</label>
                <input type="text" classname='form-control' required onChange={(e)=>setDescription(e.target.value)} value={description}></input>
                

                <label>Product Price:</label>
                <input type="number" classname='form-control' required onChange={(e)=>setPrice(e.target.value)} value={price}></input>
                

                <label >Quantity:</label>
                <input type="number" classname='form-control' required onChange={(e)=>setQty(e.target.value)} value={qty}></input>
                

                <label >Upload Product Image:</label>
                <input type="file" id="file" classname='form-control' required onChange={handleProductsImg}></input>
                {imageError&&<>
                <br></br>
                <div className='error-msg'>{imageError}</div>
                
                </>}
                <br></br>

                <button type="submit">Add Product</button>
            </form>
{uplaodError&&<>
<br></br>
<div className='error-msg'>{uplaodError}</div>
</>}

            
        </div>
        </div>
        </div>
    );
};

export default AddProducts;
