import React, { useState, useEffect } from "react";
import "./firebase"; // Ensure firebase is initialized in this file
import { getFirestore, doc, setDoc, collection, getDoc } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";

const User = () => {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const db = getFirestore();
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user);
        const userDocRef = doc(collection(db, "users"), user.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          const data = userDoc.data();
          setUserData(data);
          setName(data.name || "");
          setAge(data.age || "");
          setGender(data.gender || "");
          setHeight(data.height || "");
          setWeight(data.weight || "");
        }
      } else {
        setUser(null);
        setUserData(null);
      }
    });

    return () => unsubscribe();
  }, [auth, db]);

  const saveDataToFirestore = async () => {
    if (!user) {
      alert("User not authenticated");
      return;
    }

    const userDocRef = doc(collection(db, "users"), user.uid);

    const updatedData = {
      ...userData,
      name,
      age,
      gender,
      height,
      weight,
      updatedAt: new Date(),
    };

    await setDoc(userDocRef, updatedData, { merge: true });

    setUserData(updatedData);

    alert("Document written to DB");
  };

  return (
    <div className="User">
      <h1>Save User Data</h1>
      {user ? (
        <>
          <input
            type="text"
            value={name}
            placeholder="Name"
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="number"
            value={age}
            placeholder="Age"
            onChange={(e) => setAge(e.target.value)}
          />
          <input
            type="text"
            value={gender}
            placeholder="Gender"
            onChange={(e) => setGender(e.target.value)}
          />
          <input
            type="number"
            value={height}
            placeholder="Height (cm)"
            onChange={(e) => setHeight(e.target.value)}
          />
          <input
            type="number"
            value={weight}
            placeholder="Weight (kg)"
            onChange={(e) => setWeight(e.target.value)}
          />
          <button onClick={saveDataToFirestore}>Save Data to Firestore</button>
          {userData && (
            <div>
              <h2>Saved Data:</h2>
              <p>Name: {userData.name}</p>
              <p>Age: {userData.age}</p>
              <p>Gender: {userData.gender}</p>
              <p>Height: {userData.height} cm</p>
              <p>Weight: {userData.weight} kg</p>
            </div>
          )}
        </>
      ) : (
        <p>Please log in to save and view data.</p>
      )}
    </div>
  );
};

export default User;
