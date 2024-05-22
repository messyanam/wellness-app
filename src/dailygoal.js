import React, { useState, useEffect } from "react";
import { getFirestore, doc, setDoc, collection, getDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import "./styles.css";

const DailyGoal = () => {
  const [goals, setGoals] = useState([]);
  const [newGoal, setNewGoal] = useState("");
  const [user, setUser] = useState(null);
  const db = getFirestore();
  const auth = getAuth();
  const [percentageCompleted, setPercentageCompleted] = useState(0);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user);
        const goalsDocRef = doc(collection(db, "goals"), user.uid);
        const goalsDocSnap = await getDoc(goalsDocRef);
        if (goalsDocSnap.exists()) {
          const goalsData = goalsDocSnap.data().goals || [];
          setGoals(goalsData);
          calculatePercentageCompleted(goalsData);
        }
      } else {
        setUser(null);
        setGoals([]);
        setPercentageCompleted(0);
      }
    });

    return () => unsubscribe();
  }, [auth, db]);

  useEffect(() => {
    if (user) {
      const goalsDocRef = doc(collection(db, "goals"), user.uid);
      updateDoc(goalsDocRef, { goalsPercent: percentageCompleted }, { merge: true });
    }
  }, [percentageCompleted, user, db]);

  const saveGoalToFirestore = async () => {
    if (!user) {
      alert("User not authenticated");
      return;
    }

    const updatedGoals = [...goals, { text: newGoal, completed: false }];

    const goalsDocRef = doc(collection(db, "goals"), user.uid);
    await setDoc(goalsDocRef, { goals: updatedGoals });

    setGoals(updatedGoals);
    setNewGoal("");
    calculatePercentageCompleted(updatedGoals);
  };

  const toggleGoalCompletion = async (index) => {
    const updatedGoals = [...goals];
    updatedGoals[index].completed = !updatedGoals[index].completed;

    const goalsDocRef = doc(collection(db, "goals"), user.uid);
    await updateDoc(goalsDocRef, { goals: updatedGoals });

    setGoals(updatedGoals);
    calculatePercentageCompleted(updatedGoals);
  };

  const editGoal = async (index, newText) => {
    const updatedGoals = [...goals];
    updatedGoals[index].text = newText;

    const goalsDocRef = doc(collection(db, "goals"), user.uid);
    await updateDoc(goalsDocRef, { goals: updatedGoals });

    setGoals(updatedGoals);
    calculatePercentageCompleted(updatedGoals);
  };

  const deleteGoal = async (index) => {
    const updatedGoals = goals.filter((_, i) => i !== index);

    const goalsDocRef = doc(collection(db, "goals"), user.uid);
    await updateDoc(goalsDocRef, { goals: updatedGoals });

    setGoals(updatedGoals);
    calculatePercentageCompleted(updatedGoals);
  };

  const calculatePercentageCompleted = (goalsList) => {
    const completedGoals = goalsList.filter((goal) => goal.completed);
    const percentage = (completedGoals.length / goalsList.length) * 100;
    setPercentageCompleted(percentage.toFixed(2));
  };

  return (
    
    <div className="DailyGoal">
      <h1>Daily Goals</h1>
      {user ? (
        <>
          <div>
            <input
              type="text"
              value={newGoal}
              onChange={(e) => setNewGoal(e.target.value)}
              placeholder="Enter your goal"
            />
            <button onClick={saveGoalToFirestore}>Add Goal</button>
          </div>
          <div className="bg-image">
      {/* Your component content */}
    </div>
          <ul>
            {goals.map((goal, index) => (
              <li key={index}>
                <label>
                  <input
                    type="checkbox"
                    checked={goal.completed}
                    onChange={() => toggleGoalCompletion(index)}
                  />
                  {goal.text}
                </label>
                <button onClick={() => editGoal(index, prompt("Enter new goal text:"))}>Edit</button>
                <button onClick={() => deleteGoal(index)}>Delete</button>
              </li>
            ))}
          </ul>
          <p>Percentage of Goals Completed: {percentageCompleted}%</p>
        </>
      ) : (
        <p>Please log in to track your daily goals.</p>
      )}
    </div>
  );
};

export default DailyGoal;
