import React, { useState, useEffect } from "react";
import { getFirestore, doc, setDoc, collection, getDoc, updateDoc } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";

const Meditation = () => {
  const [meditationData, setMeditationData] = useState([]);
  const [timeMeditated, setTimeMeditated] = useState("");
  const [user, setUser] = useState(null);
  const [averageMeditationTime, setAverageMeditationTime] = useState(0);

  const db = getFirestore();
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user);
        const meditationDocRef = doc(collection(db, "meditation"), user.uid);
        const meditationDocSnap = await getDoc(meditationDocRef);
        if (meditationDocSnap.exists()) {
          setMeditationData(meditationDocSnap.data().meditationData || []);
          calculateAverageMeditationTime(meditationDocSnap.data().meditationData || []);
        }
      } else {
        setUser(null);
        setMeditationData([]);
        setAverageMeditationTime(0);
      }
    });

    return () => unsubscribe();
  }, [auth, db]);


  useEffect(() => {
    if (user) {
      const meditationDocRef = doc(collection(db, "meditation"), user.uid);
      updateDoc(meditationDocRef, { meditationPercent: averageMeditationTime }, { merge: true });
    }
  }, [averageMeditationTime, user, db]);


  const saveMeditationToFirestore = async () => {
    if (!user) {
      alert("User not authenticated");
      return;
    }

    const newMeditationEntry = { day: `Day ${meditationData.length + 1}`, time: timeMeditated };
    const updatedMeditationData = [...meditationData, newMeditationEntry];

    const meditationDocRef = doc(collection(db, "meditation"), user.uid);
    const meditationDocSnap = await getDoc(meditationDocRef);

    if (meditationDocSnap.exists()) {
      await updateDoc(meditationDocRef, { meditationData: updatedMeditationData });
    } else {
      await setDoc(meditationDocRef, { meditationData: updatedMeditationData });
    }

    setMeditationData(updatedMeditationData);
    calculateAverageMeditationTime(updatedMeditationData);

    // Reset input field after saving
    setTimeMeditated("");
  };

  const calculateAverageMeditationTime = (meditationEntries) => {
    const totalMinutes = meditationEntries.reduce((total, entry) => total + parseInt(entry.time || 0, 10), 0);
    const average = totalMinutes / meditationEntries.length || 0;
    setAverageMeditationTime(average.toFixed(2));
  };

  return (
    <div className="Meditation">
      <h1>Meditation Tracker</h1>
      {user ? (
        <>
          <div>
            <label>Time Meditated (minutes):</label>
            <input
              type="number"
              value={timeMeditated}
              onChange={(e) => setTimeMeditated(e.target.value)}
              placeholder="Time Meditated"
            />
          </div>
          <button onClick={saveMeditationToFirestore}>Add Meditation Time</button>
          <div>
            <h2>Meditation Data:</h2>
            <ul>
              {meditationData.map((entry, index) => (
                <li key={index}>
                  {entry.day}: {entry.time} minutes
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p>Average Meditation Time: {averageMeditationTime} minutes</p>
          </div>
        </>
      ) : (
        <p>Please log in to track your meditation time.</p>
      )}
    </div>
  );
};

export default Meditation;
