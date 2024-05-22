import React, { useState, useEffect } from "react";
import { getFirestore, doc, setDoc, collection, getDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";

const Nutrition = () => {
  const [nutritionData, setNutritionData] = useState([]);
  const [day, setDay] = useState("");
  const [breakfastFood, setBreakfastFood] = useState("");
  const [breakfastCalories, setBreakfastCalories] = useState("");
  const [lunchFood, setLunchFood] = useState("");
  const [lunchCalories, setLunchCalories] = useState("");
  const [dinnerFood, setDinnerFood] = useState("");
  const [dinnerCalories, setDinnerCalories] = useState("");
  const [waterGlasses, setWaterGlasses] = useState("");
  const [user, setUser] = useState(null);
  const db = getFirestore();
  const auth = getAuth();
  const [averageCaloriesPerWeek, setAverageCaloriesPerWeek] = useState(0);
  const [averageWaterGlasses, setAverageWaterGlasses] = useState(0);
  const [totalCalories, setTotalCalories] = useState(0);
  const [totalWaterGlasses, setTotalWaterGlasses] = useState(0);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user);
        const nutritionDocRef = doc(collection(db, "nutrition"), user.uid);
        const nutritionDoc = await getDoc(nutritionDocRef);
        if (nutritionDoc.exists()) {
          setNutritionData(nutritionDoc.data().nutritionData || []);
          calculateTotalsAndAverages(nutritionDoc.data().nutritionData || []);
        }
      } else {
        setUser(null);
        setNutritionData([]);
        setAverageCaloriesPerWeek(0);
        setAverageWaterGlasses(0);
        setTotalCalories(0);
        setTotalWaterGlasses(0);
      }
    });

    return () => unsubscribe();
  }, [auth, db]);

  useEffect(() => {
    if (user) {
      const nutritionDocRef = doc(collection(db, "nutrition"), user.uid);
      updateDoc(nutritionDocRef, { nutritionPercent: averageCaloriesPerWeek, waterGlassesPercent: averageWaterGlasses }, { merge: true });
    }
  }, [averageCaloriesPerWeek, averageWaterGlasses, user, db]);

  const saveNutritionToFirestore = async () => {
    if (!user) {
      alert("User not authenticated");
      return;
    }

    const newNutritionEntry = {
      day: `Day ${nutritionData.length + 1}`,
      breakfastFood,
      breakfastCalories,
      lunchFood,
      lunchCalories,
      dinnerFood,
      dinnerCalories,
      waterGlasses,
    };
    const updatedNutritionData = [...nutritionData, newNutritionEntry];

    const nutritionDocRef = doc(collection(db, "nutrition"), user.uid);
    await setDoc(nutritionDocRef, { nutritionData: updatedNutritionData }, { merge: true });

    setNutritionData(updatedNutritionData);
    calculateTotalsAndAverages(updatedNutritionData);

    // Reset input fields after saving
    setDay("");
    setBreakfastFood("");
    setBreakfastCalories("");
    setLunchFood("");
    setLunchCalories("");
    setDinnerFood("");
    setDinnerCalories("");
    setWaterGlasses("");
  };

  const calculateTotalsAndAverages = (nutritionEntries) => {
    let totalCalories = 0;
    let totalWaterGlasses = 0;
    nutritionEntries.forEach((entry) => {
      totalCalories +=
        parseInt(entry.breakfastCalories || 0) +
        parseInt(entry.lunchCalories || 0) +
        parseInt(entry.dinnerCalories || 0);
      totalWaterGlasses += parseInt(entry.waterGlasses || 0);
    });
    const averageCalories = totalCalories / nutritionEntries.length;
    const averageWater = totalWaterGlasses / nutritionEntries.length;
    setTotalCalories(totalCalories);
    setTotalWaterGlasses(totalWaterGlasses);
    setAverageCaloriesPerWeek(averageCalories.toFixed(2));
    setAverageWaterGlasses(averageWater.toFixed(2));
  };

  const editEntry = async (index) => {
    const entry = nutritionData[index];
    const newBreakfastFood = prompt("Enter new breakfast food:", entry.breakfastFood);
    const newBreakfastCalories = prompt("Enter new breakfast calories:", entry.breakfastCalories);
    const newLunchFood = prompt("Enter new lunch food:", entry.lunchFood);
    const newLunchCalories = prompt("Enter new lunch calories:", entry.lunchCalories);
    const newDinnerFood = prompt("Enter new dinner food:", entry.dinnerFood);
    const newDinnerCalories = prompt("Enter new dinner calories:", entry.dinnerCalories);
    const newWaterGlasses = prompt("Enter new water glasses:", entry.waterGlasses);

    const updatedEntry = {
      ...entry,
      breakfastFood: newBreakfastFood,
      breakfastCalories: newBreakfastCalories,
      lunchFood: newLunchFood,
      lunchCalories: newLunchCalories,
      dinnerFood: newDinnerFood,
      dinnerCalories: newDinnerCalories,
      waterGlasses: newWaterGlasses,
    };

    const updatedNutritionData = [...nutritionData];
    updatedNutritionData[index] = updatedEntry;

    const nutritionDocRef = doc(collection(db, "nutrition"), user.uid);
    await updateDoc(nutritionDocRef, { nutritionData: updatedNutritionData });

    setNutritionData(updatedNutritionData);
    calculateTotalsAndAverages(updatedNutritionData);
  };

  const deleteEntry = async (index) => {
    const updatedNutritionData = nutritionData.filter((_, i) => i !== index);

    const nutritionDocRef = doc(collection(db, "nutrition"), user.uid);
    await updateDoc(nutritionDocRef, { nutritionData: updatedNutritionData });

    setNutritionData(updatedNutritionData);
    calculateTotalsAndAverages(updatedNutritionData);
  };

  return (
    <div className="Nutrition">
      <h1>Nutrition Tracker</h1>
      {user ? (
        <>
          <div>
            <label>Day:</label>
            <input type="text" value={day} onChange={(e) => setDay(e.target.value)} placeholder="Day" />
          </div>
          <div>
            <label>Breakfast Food:</label>
            <input type="text" value={breakfastFood} onChange={(e) => setBreakfastFood(e.target.value)} placeholder="Breakfast Food" />
            <label>Breakfast Calories:</label>
            <input type="number" value={breakfastCalories} onChange={(e) => setBreakfastCalories(e.target.value)} placeholder="Breakfast Calories" />
          </div>
          <div>
            <label>Lunch Food:</label>
            <input type="text" value={lunchFood} onChange={(e) => setLunchFood(e.target.value)} placeholder="Lunch Food" />
            <label>Lunch Calories:</label>
            <input type="number" value={lunchCalories} onChange={(e) => setLunchCalories(e.target.value)} placeholder="Lunch Calories" />
          </div>
          <div>
            <label>Dinner Food:</label>
            <input type="text" value={dinnerFood} onChange={(e) => setDinnerFood(e.target.value)} placeholder="Dinner Food" />
            <label>Dinner Calories:</label>
            <input type="number" value={dinnerCalories} onChange={(e) => setDinnerCalories(e.target.value)} placeholder="Dinner Calories" />
          </div>
          <div>
            <label>Water Glasses:</label>
            <input type="number" value={waterGlasses} onChange={(e) => setWaterGlasses(e.target.value)} placeholder="Water Glasses" />
          </div>
          <button onClick={saveNutritionToFirestore}>Add Nutrition</button>
          <div>
            <h2>Nutrition Data:</h2>
            <ul>
              {nutritionData.map((entry, index) => (
                <li key={index}>
                  {entry.day}: Breakfast - {entry.breakfastFood} ({entry.breakfastCalories} calories), Lunch - {entry.lunchFood} ({entry.lunchCalories} calories), Dinner - {entry.dinnerFood} ({entry.dinnerCalories} calories), Water - {entry.waterGlasses} glasses
                  <button onClick={() => editEntry(index)}>Edit</button>
                  <button onClick={() => deleteEntry(index)}>Delete</button>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p>Total Calories: {totalCalories} calories</p>
            <p>Total Glasses of Water: {totalWaterGlasses} glasses</p>
            <p>Average Calories: {averageCaloriesPerWeek} calories</p>
            <p>Average Water Glasses: {averageWaterGlasses} glasses</p>
          </div>
        </>
      ) : (
        <p>Please log in to track your nutrition.</p>
      )}
    </div>
  );
};

export default Nutrition;
