import React, { useState, useEffect } from "react";
import "./firebase"; // Ensure firebase is initialized in this file
import { getFirestore, doc, setDoc, collection, getDoc, updateDoc } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";

const Sleep = () => {
  const [sleepData, setSleepData] = useState([]);
  const [dayNumber, setDayNumber] = useState(1);
  const [hoursSlept, setHoursSlept] = useState("");
  const [user, setUser] = useState(null);
  const db = getFirestore();
  const auth = getAuth();
  const [averageSleep, setAverageSleep] = useState(0);
  const [sleepStatus, setSleepStatus] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user);
        const sleepDocRef = doc(collection(db, "sleep"), user.uid);
        const sleepDoc = await getDoc(sleepDocRef);
        if (sleepDoc.exists()) {
          const { dayNumber, sleepData } = sleepDoc.data();
          setDayNumber(dayNumber || 1);
          setSleepData(sleepData || []);
          calculateAverageSleep(sleepData || []);
        } else {
          await setDoc(sleepDocRef, { dayNumber: 1, sleepData: [] });
        }
      } else {
        setUser(null);
        setSleepData([]);
        setAverageSleep(0);
        setSleepStatus("");
      }
    });

    return () => unsubscribe();
  }, [auth, db]);

  useEffect(() => {
    if (user) {
      const sleepDocRef = doc(collection(db, "sleep"), user.uid);
      updateDoc(sleepDocRef, { sleepPercent: averageSleep }, { merge: true });
    }
  }, [averageSleep, user, db]);

  const saveSleepToFirestore = async () => {
    if (!user) {
      alert("User not authenticated");
      return;
    }

    const newSleepEntry = { day: `Day ${dayNumber}`, hours: hoursSlept };
    const updatedSleepData = [...sleepData, newSleepEntry];

    const sleepDocRef = doc(collection(db, "sleep"), user.uid);
    await updateDoc(sleepDocRef, { dayNumber: dayNumber + 1, sleepData: updatedSleepData });

    setSleepData(updatedSleepData);
    setDayNumber(dayNumber + 1);

    // Calculate and update average sleep
    calculateAverageSleep(updatedSleepData);

    // Reset input fields after saving
    setHoursSlept("");
  };

  const editSleepEntry = async (index, updatedHours) => {
    const updatedSleepData = [...sleepData];
    updatedSleepData[index].hours = updatedHours;

    const sleepDocRef = doc(collection(db, "sleep"), user.uid);
    await updateDoc(sleepDocRef, { sleepData: updatedSleepData });

    setSleepData(updatedSleepData);

    // Calculate and update average sleep
    calculateAverageSleep(updatedSleepData);
  };

  const deleteSleepEntry = async (index) => {
    const updatedSleepData = [...sleepData];
    updatedSleepData.splice(index, 1);

    const sleepDocRef = doc(collection(db, "sleep"), user.uid);
    await updateDoc(sleepDocRef, { sleepData: updatedSleepData });

    setSleepData(updatedSleepData);

    // Calculate and update average sleep
    calculateAverageSleep(updatedSleepData);
  };

  const calculateAverageSleep = (sleepEntries) => {
    const totalHours = sleepEntries.reduce((total, entry) => total + parseInt(entry.hours || 0, 10), 0);
    const average = totalHours / sleepEntries.length || 0;
    setAverageSleep(average.toFixed(2));

    if (average < 8) {
      setSleepStatus("Sleep more");
    } else if (average === 8) {
      setSleepStatus("Good");
    } else {
      setSleepStatus("Sleep less");
    }
  };

  return (
    <div className="Sleep">
      <h1>Sleep Tracker</h1>
      {user ? (
        <>
          <div>
            <label>{`Day ${dayNumber} - Hours Slept:`}</label>
            <input
              type="number"
              value={hoursSlept}
              onChange={(e) => setHoursSlept(e.target.value)}
              placeholder="Hours Slept"
            />
          </div>
          <button onClick={saveSleepToFirestore}>Add Sleep Data</button>
          <div>
            <h2>Sleep Data:</h2>
            <ul>
            {sleepData.map((entry, index) => (
                <li key={index}>
                  {entry.day}: {entry.hours} hours
                  <button onClick={() => editSleepEntry(index, prompt("Enter updated hours:"))}>Edit</button>
                  <button onClick={() => deleteSleepEntry(index)}>Delete</button>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2>Sleep Metrics:</h2>
            <p>Average Sleep: {averageSleep} hours</p>
            <p>Sleep Status: {sleepStatus}</p>
          </div>
        </>
      ) : (
        <p>Please log in to track your sleep.</p>
      )}
    </div>
  );
};

export default Sleep;

