
import React, { useState, useEffect } from "react";
import { auth, fs } from '../Config/Firebase'
import { doc, getDoc, } from 'firebase/firestore';
import { Link } from "react-router-dom";
import { collection, getDocs,updateDoc, deleteDoc } from 'firebase/firestore';
import { getFirestore } from 'firebase/firestore'; 
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../Config/Firebase';
import Nav from "./Nav";

const firestore = getFirestore(); 

export const Memories = () => {
    const [memories, setMemories] = useState([]);
    const [editableIndex, setEditableIndex] = useState(-1);
    const [isEditMode, setIsEditMode] = useState(false);
    const [isUpdateVisible, setIsUpdateVisible] = useState(false);

    useEffect(() => {
        const fetchMemories = async () => {
            try {
                const memoriesCollectionRef = collection(firestore, 'tblStory');
                const memoriesSnapshot = await getDocs(memoriesCollectionRef);
                const memoriesData = memoriesSnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                    isNew: false,
                    isEditing: false
                }));
                setMemories(memoriesData);
            } catch (error) {
                console.error('Error fetching memories:', error);
            }
        };

        fetchMemories();
    }, []);

    const toggleEditing = (index) => {
        setEditableIndex(index === editableIndex ? -1 : index);
        setIsEditMode(index === editableIndex ? false : true);
    };

    const saveChanges = async (memory) => {
        try {
            const memoryRef = doc(firestore, 'tblStory', memory.id);
            await updateDoc(memoryRef, memory);
            setEditableIndex(-1);
            setIsEditMode(false);
        } catch (error) {
            console.error('Error updating memory:', error);
        }
    };

    const deleteMemory = async (memoryId) => {
        try {
            await deleteDoc(doc(firestore, 'tblStory', memoryId));
            setMemories(memories.filter(memory => memory.id !== memoryId));
        } catch (error) {
            console.error('Error deleting memory:', error);
        }
    };

    const handleFileChange = (e, index) => {
        const file = e.target.files[0];
        const storageRef = ref(storage, `pets/${file.name}`);
        uploadBytes(storageRef, file).then(async () => {
            const url = await getDownloadURL(storageRef);
            const updatedMemories = [...memories];
            updatedMemories[index].imageUrl = url;
            setMemories(updatedMemories);
        });
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
            <h1 className="text-center" style={{ color: "white" }}>Pet Memories</h1>
                    <div className="product-box">
                        </div>
            <br />
            <div style={{ margin: '0 20px' }}>
                <br />
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
                    {memories.map((memory, index) => (
                        <li key={index} style={{ border: '1px solid #ccc', borderRadius: '5px', padding: '10px', backgroundColor: 'white' }}>
                            {editableIndex === index ? (
                                <div>
                                    <input type="text" value={memory.petName} onChange={(e) => setMemories(prevMemories => {
                                        const updatedMemories = [...prevMemories];
                                        updatedMemories[index].petName = e.target.value;
                                        return updatedMemories;
                                    })} />
                                    <input type="file" onChange={(e) => handleFileChange(e, index)} />
                                    {memory.imageUrl && (
                                        <img src={memory.imageUrl} alt={memory.petName} style={{ maxWidth: "100px" }} />
                                    )}
                                    <textarea value={memory.story} onChange={(e) => setMemories(prevMemories => {
                                        const updatedMemories = [...prevMemories];
                                        updatedMemories[index].story = e.target.value;
                                        return updatedMemories;
                                    })} />
                                    {isEditMode && (
                                        <div>
                                            <button onClick={() => saveChanges(memory)}>Save</button>
                                            <button onClick={() => setEditableIndex(-1)}>Cancel</button>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div>
                                    <h4>{memory.petName}</h4>
                                    {memory.imageUrl && (
                                        <img src={memory.imageUrl} alt={memory.petName} style={{ maxWidth: "100px" }} />
                                    )}
                                    <p>Story: {memory.story}</p>
                                    {isUpdateVisible && (
                                        <div>
                                            <button onClick={() => toggleEditing(index)}>Edit</button>
                                            <button onClick={() => deleteMemory(memory.id)}>Delete</button>
                                        </div>
                                    )}
                                </div>
                            )}
                        </li>
                    ))}
                </div>
            </div>
            <br />
            <Link to="/story" className="nav-link" style={{ textDecoration: 'none', color: 'inherit', display: 'inline-block', marginRight: '10px' }}>
                <button className="add-memory-button" style={{ backgroundColor: '#CD5C5C' }}>
                    Add Memory
                </button>
            </Link>
            <button className="add-memory-button" style={{ backgroundColor: '#CD5C5C' }} onClick={() => setIsUpdateVisible(!isUpdateVisible)}>
                Update
            </button>
        </div>
    );
};

export default Memories;
