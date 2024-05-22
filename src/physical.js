import React, { useState, useEffect } from "react";
import "./firebase"; // Ensure firebase is initialized in this file
import { getFirestore, doc, setDoc, collection, getDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";

const Physical = () => {
  const [physicalData, setPhysicalData] = useState([]);
  const [day, setDay] = useState("");
  const [exerciseName, setExerciseName] = useState("");
  const [timeSpent, setTimeSpent] = useState("");
  const [caloriesBurnt, setCaloriesBurnt] = useState("");
  const [user, setUser] = useState(null);
  const db = getFirestore();
  const auth = getAuth();
  const [totalCaloriesBurnt, setTotalCaloriesBurnt] = useState(0);
  const [averageCaloriesBurnt, setAverageCaloriesBurnt] = useState(0);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user);
        const physicalDocRef = doc(collection(db, "physical"), user.uid);
        const physicalDoc = await getDoc(physicalDocRef);
        if (physicalDoc.exists()) {
          const data = physicalDoc.data().physicalData || [];
          setPhysicalData(data);
          calculateTotalCaloriesBurnt(data);
          calculateAverageCaloriesBurnt(data);
        }
      } else {
        setUser(null);
        setPhysicalData([]);
        setTotalCaloriesBurnt(0);
        setAverageCaloriesBurnt(0);
      }
    });

    return () => unsubscribe();
  }, [auth, db]);

  useEffect(() => {
    if (user) {
      const physicalDocRef = doc(collection(db, "physical"), user.uid);
      updateDoc(physicalDocRef, { physicalPercent: averageCaloriesBurnt }, { merge: true });
    }
  }, [averageCaloriesBurnt, user, db]);

  const savePhysicalToFirestore = async () => {
    if (!user) {
      alert("User not authenticated");
      return;
    }

    const newExercise = { day, exerciseName, timeSpent, caloriesBurnt };
    const updatedPhysicalData = [...physicalData, newExercise];

    const physicalDocRef = doc(collection(db, "physical"), user.uid);
    await setDoc(physicalDocRef, { physicalData: updatedPhysicalData }, { merge: true });

    setPhysicalData(updatedPhysicalData);
    calculateTotalCaloriesBurnt(updatedPhysicalData);
    calculateAverageCaloriesBurnt(updatedPhysicalData);

    // Reset input fields after saving
    setDay("");
    setExerciseName("");
    setTimeSpent("");
    setCaloriesBurnt("");
  };

  const calculateTotalCaloriesBurnt = (exerciseList) => {
    const totalCalories = exerciseList.reduce((total, exercise) => total + parseInt(exercise.caloriesBurnt || 0, 10), 0);
    setTotalCaloriesBurnt(totalCalories);
  };

  const calculateAverageCaloriesBurnt = (exerciseList) => {
    if (exerciseList.length === 0) {
      setAverageCaloriesBurnt(0);
      return;
    }
    const totalCalories = exerciseList.reduce((total, exercise) => total + parseInt(exercise.caloriesBurnt || 0, 10), 0);
    const averageCalories = totalCalories / exerciseList.length;
    setAverageCaloriesBurnt(averageCalories.toFixed(2));
  };

  const editExercise = async (index) => {
    const entry = physicalData[index];
    const newDay = prompt("Enter new day:", entry.day);
    const newExerciseName = prompt("Enter new exercise name:", entry.exerciseName);
    const newTimeSpent = prompt("Enter new time spent (minutes):", entry.timeSpent);
    const newCaloriesBurnt = prompt("Enter new calories burnt:", entry.caloriesBurnt);

    const updatedEntry = {
      ...entry,
      day: newDay,
      exerciseName: newExerciseName,
      timeSpent: newTimeSpent,
      caloriesBurnt: newCaloriesBurnt,
    };

    const updatedPhysicalData = [...physicalData];
    updatedPhysicalData[index] = updatedEntry;

    const physicalDocRef = doc(collection(db, "physical"), user.uid);
    await updateDoc(physicalDocRef, { physicalData: updatedPhysicalData });

    setPhysicalData(updatedPhysicalData);
    calculateTotalCaloriesBurnt(updatedPhysicalData);
    calculateAverageCaloriesBurnt(updatedPhysicalData);
  };

  const deleteExercise = async (index) => {
    const updatedPhysicalData = physicalData.filter((_, i) => i !== index);

    const physicalDocRef = doc(collection(db, "physical"), user.uid);
    await updateDoc(physicalDocRef, { physicalData: updatedPhysicalData });

    setPhysicalData(updatedPhysicalData);
    calculateTotalCaloriesBurnt(updatedPhysicalData);
    calculateAverageCaloriesBurnt(updatedPhysicalData);
  };

  return (
    <div className="Physical">
      <h1>Physical Activity Tracker</h1>
      {user ? (
        <>
          <div>
            <label>Day:</label>
            <input type="text" value={day} onChange={(e) => setDay(e.target.value)} placeholder="Day" />
          </div>
          <div>
            <label>Exercise Name:</label>
            <input type="text" value={exerciseName} onChange={(e) => setExerciseName(e.target.value)} placeholder="Exercise Name" />
          </div>
          <div>
            <label>Time Spent (minutes):</label>
            <input type="number" value={timeSpent} onChange={(e) => setTimeSpent(e.target.value)} placeholder="Time Spent" />
          </div>
          <div>
            <label>Calories Burnt:</label>
            <input type="number" value={caloriesBurnt} onChange={(e) => setCaloriesBurnt(e.target.value)} placeholder="Calories Burnt" />
          </div>
          <button onClick={savePhysicalToFirestore}>Add Exercise</button>
          <div>
            <h2>Exercises:</h2>
            <ul>
              {physicalData.map((exercise, index) => (
                <li key={index}>
                  {exercise.day}: {exercise.exerciseName} - {exercise.timeSpent} minutes ({exercise.caloriesBurnt} calories burnt)
                  <button onClick={() => editExercise(index)}>Edit</button>
                  <button onClick={() => deleteExercise(index)}>Delete</button>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <label>Total Calories Burnt:</label>
            <span>{totalCaloriesBurnt}</span>
          </div>
          <div>
            <label>Average Calories Burnt:</label>
            <span>{averageCaloriesBurnt}</span>
          </div>
        </>
      ) : (
        <p>Please log in to track your physical activity.</p>
      )}
    </div>
  );
};

export default Physical;
