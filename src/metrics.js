import React, { useState, useEffect } from "react";
import "./firebase"; // Ensure firebase is initialized in this file
import { getFirestore, doc, setDoc, collection, getDoc } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";

const Metrics = () => {
  const [bp, setBp] = useState("");
  const [sugar, setSugar] = useState("");
  const [heartRate, setHeartRate] = useState("");
  const [weight, setWeight] = useState("");
  const [user, setUser] = useState(null);
  const db = getFirestore();
  const auth = getAuth();
  const [metricsStatus, setMetricsStatus] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user);
        const metricsDocRef = doc(collection(db, "metrics"), user.uid);
        const metricsDoc = await getDoc(metricsDocRef);
        if (metricsDoc.exists()) {
          const { bp, sugar, heartRate, weight } = metricsDoc.data();
          setBp(bp || "");
          setSugar(sugar || "");
          setHeartRate(heartRate || "");
          setWeight(weight || "");
          checkMetricsStatus(bp, sugar, heartRate, weight);
        }
      } else {
        setUser(null);
        setBp("");
        setSugar("");
        setHeartRate("");
        setWeight("");
        setMetricsStatus("");
      }
    });

    return () => unsubscribe();
  }, [auth, db]);

  const saveMetricsToFirestore = async () => {
    if (!user) {
      alert("User not authenticated");
      return;
    }

    const metricsData = { bp, sugar, heartRate, weight };

    const metricsDocRef = doc(collection(db, "metrics"), user.uid);
    await setDoc(metricsDocRef, metricsData, { merge: true });

    checkMetricsStatus(bp, sugar, heartRate, weight);
  };

  const checkMetricsStatus = (bp, sugar, heartRate, weight) => {
    // You can define your own criteria for "good" metrics here
    const goodBp = bp >= 90 && bp <= 120;
    const goodSugar = sugar >= 70 && sugar <= 140;
    const goodHeartRate = heartRate >= 60 && heartRate <= 100;
    const goodWeight = weight >= 50 && weight <= 100;

    if (goodBp && goodSugar && goodHeartRate && goodWeight) {
      setMetricsStatus("Good");
    } else {
      setMetricsStatus("Not Good");
    }
  };

  return (
    <div className="Metrics">
      <h1>Health Metrics Tracker</h1>
      {user ? (
        <>
          <div>
            <label>Blood Pressure (BP):</label>
            <input type="number" value={bp} onChange={(e) => setBp(e.target.value)} placeholder="BP" />
          </div>
          <div>
            <label>Sugar Level:</label>
            <input type="number" value={sugar} onChange={(e) => setSugar(e.target.value)} placeholder="Sugar Level" />
          </div>
          <div>
            <label>Heart Rate:</label>
            <input type="number" value={heartRate} onChange={(e) => setHeartRate(e.target.value)} placeholder="Heart Rate" />
          </div>
          <div>
            <label>Weight:</label>
            <input type="number" value={weight} onChange={(e) => setWeight(e.target.value)} placeholder="Weight" />
          </div>
          <button onClick={saveMetricsToFirestore}>Save Metrics</button>
          <div>
            <h2>Metrics Status:</h2>
            <p>{metricsStatus}</p>
          </div>
        </>
      ) : (
        <p>Please log in to track your health metrics.</p>
      )}
    </div>
  );
};

export default Metrics;
