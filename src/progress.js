import React, { useState, useEffect } from "react";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";

const Progress = () => {
  const [dailyGoalPercentage, setDailyGoalPercentage] = useState(0);
  const [nutritionAverageCalories, setNutritionAverageCalories] = useState(0);
  const [nutritionAverageWater, setNutritionAverageWater] = useState(0);
  const [physicalAverageCaloriesBurnt, setPhysicalAverageCaloriesBurnt] = useState(0);
  const [sleepAverage, setSleepAverage] = useState(0);
  const [meditationAverage, setMeditationAverage] = useState(0);
  const [user, setUser] = useState(null);
  const db = getFirestore();
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user);
        await fetchData(user.uid);
      } else {
        setUser(null);
        resetAverages();
      }
    });

    return () => unsubscribe();
  }, [auth]);

  const fetchData = async (uid) => {
    try {
      // Fetch daily goal percentage
      const dailyGoalDoc = await getDoc(doc(db, "goals", uid));
      if (dailyGoalDoc.exists()) {
        setDailyGoalPercentage(dailyGoalDoc.data().goalsPercent || 0);
      }
  
      // Fetch nutrition data
      const nutritionDoc = await getDoc(doc(db, "nutrition", uid));
      if (nutritionDoc.exists()) {
        setNutritionAverageCalories(nutritionDoc.data().nutritionPercent || 0);
        setNutritionAverageWater(nutritionDoc.data().waterGlassesPercent || 0);
      }
  
      // Fetch physical data
      const physicalDoc = await getDoc(doc(db, "physical", uid));
      if (physicalDoc.exists()) {
        setPhysicalAverageCaloriesBurnt(physicalDoc.data().physicalPercent || 0);
      }
  
      // Fetch sleep data
      const sleepDoc = await getDoc(doc(db, "sleep", uid));
      if (sleepDoc.exists()) {
        setSleepAverage(sleepDoc.data().sleepPercent || 0);
      }
  
      // Fetch meditation data
      const meditationDoc = await getDoc(doc(db, "meditation", uid));
      if (meditationDoc.exists()) {
        setMeditationAverage(meditationDoc.data().meditationPercent || 0);
      }
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };
  

  const resetAverages = () => {
    setDailyGoalPercentage(0);
    setNutritionAverageCalories(0);
    setNutritionAverageWater(0);
    setPhysicalAverageCaloriesBurnt(0);
    setSleepAverage(0);
    setMeditationAverage(0);
  };

  return (
    <div className="Progress">
      <h1>Progress Tracker</h1>
      {user ? (
        <>
          <div>
            <p>Daily Goals Completion Percentage: {dailyGoalPercentage}%</p>
            <p>Nutrition Average Calories: {nutritionAverageCalories} kcal</p>
            <p>Nutrition Average Water Glasses: {nutritionAverageWater} glasses</p>
            <p>Physical Average Calories Burnt: {physicalAverageCaloriesBurnt} kcal</p>
            <p>Sleep Average Hours: {sleepAverage} hrs</p>
            <p>Meditation Average Time: {meditationAverage} mins</p>
          </div>
        </>
      ) : (
        <p>Please log in to track your progress.</p>
      )}
    </div>
  );
};

export default Progress;
