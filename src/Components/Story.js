
import React, { useState, useEffect } from "react";
import { auth, fs } from '../Config/Firebase'
import { doc, getDoc, } from 'firebase/firestore';

import Nav from './Nav';
import {  storage } from '../Config/Firebase';
import { collection, addDoc } from 'firebase/firestore'; 
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useNavigate } from 'react-router-dom';

const Story = () => {
  const navigate = useNavigate();

  const [petImage, setPetImage] = useState(null);
  const [petImageUrl, setPetImageUrl] = useState(null);
  const [petName, setPetName] = useState('');
  const [story, setStory] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      const file = e.target.files[0];
      setPetImage(file);

      // Create a URL for the image preview
      const imageUrl = URL.createObjectURL(file);
      setPetImageUrl(imageUrl);
    }
  };

  const addStory = async () => {
    if (!petImage) {
      setErrorMsg('Please upload an image of the pet.');
      return;
    }

    try {
      // Upload image to Firebase Storage
      const storageRef = ref(storage, `pets/${petImage.name}`);
      await uploadBytes(storageRef, petImage);
      const imageUrl = await getDownloadURL(storageRef);

      // Add document to Firestore
      const storyRef = collection(fs, 'tblStory');
      await addDoc(storyRef, {
        petName,
        story,
        imageUrl,
      });

      setSuccessMsg('Story shared successfully');

      // Clear input fields
      setPetName('');
      setStory('');
      setPetImage(null);
      setPetImageUrl(null);
      document.getElementById('petImage').value = '';

      // Redirect after 3 seconds
      setTimeout(() => {
        setSuccessMsg('');
        navigate('/memories');
      }, 3000);
    } catch (error) {
      setErrorMsg(error.message);
    }
  };

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
         <Nav user={user} />
      <div className="story-container">
        <h1>Share Your Pet Story</h1>
        <div className="input-group">
          <label htmlFor="petImage">Upload Memory:</label>
          <input id="petImage" type="file" accept="image/*" onChange={handleImageChange} />
        </div>
        {petImageUrl && (
          <div className="image-preview">
            <img src={petImageUrl} alt="Pet Preview" style={{ maxWidth: '100%', marginTop: '10px' }} />
          </div>
        )}
        <div className="input-group">
          <label htmlFor="petName">Pet Name:</label>
          <input id="petName" type="text" value={petName} onChange={(e) => setPetName(e.target.value)} />
        </div>
        <div className="input-group">
          <label htmlFor="story">Share Your Story:</label>
          <textarea id="story" value={story} onChange={(e) => setStory(e.target.value)} />
        </div>
        <button onClick={addStory}>Share Story</button>
        {successMsg && <p style={{ color: 'green' }}>{successMsg}</p>}
        {errorMsg && <p style={{ color: 'red' }}>{errorMsg}</p>}
      </div>
    </div>
  );
};

export default Story;
