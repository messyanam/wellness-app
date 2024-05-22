import React from 'react';
import { useNavigate } from "react-router-dom";


const handleImageClick = (pageUrl) => {
  
};

const HomeDashboard = () => {
  // Function to handle button clicks
  const history = useNavigate()
  const handleButtonClick = (buttonText) => {
    // Add your logic here based on the button clicked
    console.log(`Button "${buttonText}" clicked`);
  };

  return (
    <div style={{ textAlign: 'center', position: 'relative' }}>
      {/* Image wrapper for the left corner */}
      <div style={{ position: 'absolute', top: '100px', left: '50px' }}>
        <a  onClick={() => history("/home/dailygoal")} >
          <img
            src="https://i.postimg.cc/qzRQjBtN/Daily-Goal-PNG.png" // Provided image URL
            alt="Daily Goal"
            style={{ width: '400px', height: '150px', cursor: 'pointer' }} // Adjust size as needed
          />
        </a>
      </div>
       {/* Second image wrapper */}
       <div style={{ position: 'absolute', top: '100px', left: '500px' }}>
       <a  onClick={() => history("/home/nutrition")} >
          <img
            src="https://i.postimg.cc/LYsV4fqB/Nutrition-Tracking.png" // Updated image URL
            alt="Nutrition Tracking"
            style={{ width: '400px', height: '150px', cursor: 'pointer' }}
          />
        </a>
      </div>
      {/* Third image wrapper */}
      <div style={{ position: 'absolute', top: '100px', right: '150px' }}>
      <a  onClick={() => history("/home/physical")} >
          <img
            src="https://i.postimg.cc/svrfqRMy/Physical-Activity.png" // New image URL
            alt="Physical Activity"
            style={{ width: '400px', height: '150px', cursor: 'pointer' }}
          />
        </a>
      </div>
      {/* Image wrapper for the left corner */}
      <div style={{ position: 'absolute', top: '350px', left: '50px' }}>
      <a  onClick={() => history("/home/sleep")} >
          <img
            src="https://i.postimg.cc/YqG9h3gN/Sleep-Tracking.png" // Provided image URL
            alt="Sleep Tracking"
            style={{ width: '400px', height: '150px', cursor: 'pointer' }} // Adjust size as needed
          />
        </a>
      </div>
      {/* Second image wrapper */}
      <div style={{ position: 'absolute', top: '350px', left: '500px' }}>
      <a  onClick={() => history("/home/metrics")} >
          <img
            src="https://i.postimg.cc/HLCgzGxz/Health-Metrics.png" // Updated image URL
            alt="Health Metrics"
            style={{ width: '400px', height: '150px', cursor: 'pointer' }}
          />
        </a>
      </div>
      {/* Third image wrapper */}
      <div style={{ position: 'absolute', top: '350px', right: '150px' }}>
      <a  onClick={() => history("/home/meditation")} >
          <img
            src="https://i.postimg.cc/2jtwbh2d/Meditation.png" // New image URL
            alt="Meditation"
            style={{ width: '400px', height: '150px', cursor: 'pointer' }}
          />
        </a>
      </div>
      {/* Second image wrapper */}
      <div style={{ position: 'absolute', top: '600px', left: '500px' }}>
      <a  onClick={() => history("/home/progress")} >
          <img
            src="https://i.postimg.cc/8k2c9zZB/Goal-Progress.png" // Updated image URL
            alt="Goal Progress"
            style={{ width: '400px', height: '150px', cursor: 'pointer' }}
          />
        </a>
      </div>
      <div style={{ textAlign: 'center' }}>
        <h1>WELCOME</h1>
        {/* Update onClick to pass the URL */}
        <a onClick={() => history("/home/user")} style={{ position: 'absolute', top: '10px', right: '10px' }}>
          <img
            src="https://i.postimg.cc/RJJ2xn5P/user-profile.png"  // Updated image URL
            alt="User Profile"
            style={{  cursor: 'pointer' }}  // Adjust size as needed
          />
        </a>
      </div>
    </div>
  );
};

export default HomeDashboard;
