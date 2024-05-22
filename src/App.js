import React from "react";
import CustomNavbar from './CustomNavbar';
import {BrowserRouter,Routes,Route} from "react-router-dom"
import Home from "./Home";
import HomeDashboard from "./HomeDashboard";
import User from "./User";
import DailyGoal from "./dailygoal";
import Nutrition from "./nutrition";
import Physical from "./physical";
import Sleep from "./sleep";
import Metrics from "./metrics";
import Meditation from "./meditation";
import Progress from "./progress";

const App = () => {
  return (
    <BrowserRouter>
    <div>
      <Routes>
        <Route path="/" element={<CustomNavbar/>}/>
        <Route path="/home" element={ <HomeDashboard />}/>
        <Route path="/home/user" element={<User/>}/>
        <Route path="/home/dailygoal" element={<DailyGoal/>}/>
        <Route path="/home/nutrition" element={<Nutrition/>}/>
        <Route path="/home/physical" element={<Physical/>}/>
        <Route path="/home/sleep" element={<Sleep/>}/>
        <Route path="/home/metrics" element={<Metrics/>}/>
        <Route path="/home/meditation" element={<Meditation/>}/>
        <Route path="/home/progress" element={<Progress/>}/>
      </Routes>
    </div>
    
    </BrowserRouter>
    
  );
};

export default App;
