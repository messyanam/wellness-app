// CustomNavbar.js
import React, { useState } from "react";
import "./App.css";
import { auth } from "./firebase";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import {getFirestore, addDoc,collection} from "firebase/firestore";
import { useNavigate } from "react-router-dom";





const CustomNavbar = () => {
  const [action, setAction] = useState("SignUp");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const history = useNavigate()
  const signIn = (e) => {
    e.preventDefault();
    if(action==="Login") {
      signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        console.log(userCredential);
        history("/home")
      })
      .catch((error) => {
        console.log(error);
      });
    } else if(action==="SignUp") {
      createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        console.log(userCredential);
      })
      .catch((error) => {
        console.log(error);
      });
    }
    
  };
  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <a className="navbar-brand" href="#section1">
          <img
            src="https://i.postimg.cc/kVQcJZCX/wellness.png"
            border="0"
            alt="wellness"
          />
        </a>
        <button
          className="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav mr-auto">
            <li className="nav-item active">
              <a className="nav-link" href="#">
                Home <span className="sr-only">(current)</span>
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#section3">
                Contact
              </a>
            </li>
            <li className="nav-item dropdown">
              <a
                className="nav-link dropdown-toggle"
                href="#"
                id="navbarDropdown"
                role="button"
                data-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
              >
                Info
              </a>
              <div className="dropdown-menu" aria-labelledby="navbarDropdown">
                <a className="dropdown-item" href="#section2">
                  Daily Goal
                </a>
                <a className="dropdown-item" href="#section4">
                  Nutrition Tracking
                </a>
                <a className="dropdown-item" href="#section5">
                  Physical Activity
                </a>
                <a className="dropdown-item" href="#section6">
                  Sleep Tracking
                </a>
                <a className="dropdown-item" href="#section7">
                  Health Metrics
                </a>
                <a className="dropdown-item" href="#section8">
                  Meditation
                </a>
                <a className="dropdown-item" href="#section9">
                  Goal Progress
                </a>
              </div>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#section10">
                Sign Up/Sign in
              </a>
            </li>
          </ul>
         
        </div>
      </nav>
      <div>
        <div
          id="section1"
          style={{ border: "1px solid #000", textAlign: "center" }}
        >
          <h2>Wellness App</h2>
          <p>
            Wellness App is your comprehensive companion for a healthier
            lifestyle, providing a holistic approach to wellness by
            incorporating daily goal setting, nutrition tracking, and physical
            activity monitoring. With its intuitive design, you can easily log
            your meals and track nutritional intake to ensure you're getting the
            right balance of vitamins and nutrients. The app also encourages
            physical exercise by setting personalized activity goals and
            tracking your progress, helping you stay active and fit. Sleep
            tracking features analyze your sleep patterns, promoting better
            sleep hygiene for optimal health and energy. Additionally, the app
            offers guided meditation sessions to aid in stress reduction and
            mental clarity, enhancing your overall wellbeing. By monitoring your
            progress towards set goals, Wellness App gives you real-time
            insights into your health, empowering you with the knowledge to make
            informed wellness choices every day. Whether you're a fitness
            enthusiast or just starting your health journey, Wellness App is
            your daily partner in achieving a balanced and healthy lifestyle.
          </p>
          <img
            src="https://media.istockphoto.com/id/628504820/photo/they-keep-each-other-going.jpg?s=612x612&w=0&k=20&c=9bsULmyIarCyxiX5O7W3yZCkWZdhWLTPGu6E7k7mQNE="
            border="0"
            alt="Image Description"
          />
        </div>
        <div
          id="section2"
          style={{ border: "1px solid #000", textAlign: "center" }}
        >
          <h2>Daily Goal</h2>
          <p>
            Our app is designed to seamlessly integrate into your daily routine,
            empowering you to keep track of and achieve your daily goals with
            ease. By providing personalized insights and actionable feedback, we
            help you maintain a balanced lifestyle that promotes physical,
            mental, and emotional well-being. Whether you're looking to improve
            your diet, increase your physical activity, or enhance your sleep
            quality, our app serves as your trusted guide every step of the way,
            helping you make healthier choices day by day
          </p>
          <img
            src="https://www.shutterstock.com/image-vector/project-tracking-goal-tracker-task-600nw-1937035672.jpg"
            border="0"
            alt="Project Tracking Image"
          />
          <div id="section4" style={{ border: "1px solid #000" }}>
            <h2>Nutrition Tracking</h2>
            <p>
              Nutrition tracking is an essential feature of any wellness app,
              enabling users to monitor and manage their dietary intake
              effectively. With our intuitive and user-friendly interface, you
              can easily log meals, track calories, and analyze nutrient
              breakdowns. Our app empowers you to set personalized goals,
              whether it's weight management, building muscle, or improving
              overall health. By providing detailed insights into your eating
              habits, including macronutrients like carbs, proteins, and fats,
              as well as micronutrients such as vitamins and minerals, our
              nutrition tracking feature helps you make informed decisions about
              your diet. Stay on track, reach your health goals, and lead a
              balanced lifestyle with our comprehensive nutrition tracking
              tools.
            </p>
            <img
              src="https://media.istockphoto.com/id/486506976/photo/person-eating-lunch-looking-at-fitness-app-on-mobile-phone.jpg?s=612x612&w=0&k=20&c=Mf-eSVTQbfGfjSscATidt0_oM5FEv6cg_dHPtv5hVQs="
              border="0"
              alt="Person using fitness app on mobile phone"
            />
          </div>
          <div id="section5" style={{ border: "1px solid #000" }}>
            <h3>Physical Activity</h3>
            <p>
              Tracking physical activity is crucial for maintaining a healthy
              lifestyle, and our wellness app makes it easy and enjoyable. With
              our user-friendly interface, you can effortlessly log various
              activities, from walking and running to yoga and weightlifting.
              Set personalized fitness goals based on your preferences and
              monitor your progress over time. Our app provides detailed
              insights into your activity levels, including calories burned,
              distance covered, and workout duration. Whether you're a beginner
              looking to start a fitness routine or a seasoned athlete aiming to
              improve performance, our physical activity tracking feature helps
              you stay motivated and accountable. Take charge of your fitness
              journey and enjoy the benefits of an active lifestyle with our
              comprehensive tracking tools.
            </p>
            <img
              src="https://st2.depositphotos.com/1561359/7437/v/450/depositphotos_74373075-stock-illustration-modern-physical-activity-icons-set.jpg"
              border="0"
              alt="Modern Physical Activity Icons Set"
            />
          </div>
          <div id="section6" style={{ border: "1px solid #000" }}>
            <h3>Sleep Tracking</h3>
            <p>
              Sleep tracking is a fundamental aspect of overall wellness, and
              our app offers a comprehensive solution to monitor and improve
              your sleep quality. With our intuitive interface, you can easily
              log your sleep duration and track sleep patterns over time. Gain
              valuable insights into your sleep cycles, including deep and REM
              sleep stages, to understand your sleep quality better. Set
              personalized sleep goals based on recommended hours of sleep for
              your age group and lifestyle, and receive actionable tips to
              improve your sleep hygiene. Our app also integrates with wearable
              devices to provide real-time sleep data, making it convenient to
              track your sleep habits effortlessly. Prioritize restful sleep,
              optimize your sleep routine, and wake up refreshed with our
              advanced sleep tracking features.
            </p>
            <img
              src="https://i0.wp.com/post.healthline.com/wp-content/uploads/2021/09/sleep-sleeping-bed-1296x728-header.jpg?h=1528"
              border="0"
              alt="Person Sleeping in Bed"
            />
          </div>
          <div id="section7" style={{ border: "1px solid #000" }}>
            <h3>Health Metrics</h3>
            <p>
              Health metrics are vital indicators of overall well-being, and our
              wellness app provides a comprehensive platform to track and manage
              them effectively. Monitor key health metrics such as blood
              pressure, heart rate, blood sugar levels, cholesterol levels, and
              more with ease. Our app offers intuitive interfaces for entering
              and tracking this data, allowing you to visualize trends over time
              and gain valuable insights into your health status. Set
              personalized goals and receive actionable recommendations to
              improve your health metrics based on your individual needs and
              preferences. With regular monitoring and analysis of your health
              metrics, you can take proactive steps to maintain a healthy
              lifestyle and prevent potential health issues. Empower yourself
              with knowledge about your health, and achieve optimal well-being
              with our integrated health metrics tracking feature.
            </p>
            <img
              src="https://blog.healthians.com/wp-content/uploads/2023/12/Tablet-medical-application-950x500.jpg"
              border="0"
              alt="Medical Application on Tablet"
            />
          </div>
          <div id="section8" style={{ border: "1px solid #000" }}>
            <h3>Meditation</h3>
            <p>
              Meditation is a powerful practice for cultivating mental
              well-being and our wellness app offers a dedicated platform to
              support your meditation journey. With a variety of guided
              meditation sessions tailored to different goals such as stress
              reduction, mindfulness, focus, and relaxation, our app makes it
              easy for users of all levels to incorporate meditation into their
              daily routine. Choose from a range of meditation techniques,
              including mindfulness, deep breathing, visualization, and body
              scan, to find what works best for you. Track your meditation
              sessions, set goals, and receive insights into your progress and
              consistency. Our app also provides personalized recommendations
              and reminders to help you stay motivated and committed to your
              meditation practice. Embrace the benefits of meditation, reduce
              stress, improve mental clarity, and enhance overall well-being
              with our meditation feature.
            </p>
            <img
              src="https://puffy.com/cdn/shop/articles/how-to-meditate-3_1024x.jpg?v=1639635327"
              border="0"
              alt="Meditation Image"
            />
          </div>
          <div id="section9" style={{ border: "1px solid #000" }}>
            <h3>Goal Progress</h3>
            <p>
              Tracking your progress towards your wellness goals is essential
              for staying motivated and achieving long-term success. Our app
              provides comprehensive tools to monitor and manage your nutrition,
              physical activity, sleep, health metrics, and meditation
              practices. By setting personalized goals and using our intuitive
              tracking features, you can gain valuable insights into your habits
              and make informed decisions to improve your overall well-being.
              Whether you're aiming to lose weight, build muscle, improve sleep
              quality, manage stress, or enhance mindfulness, our app empowers
              you to take control of your health journey. Stay on track,
              celebrate your achievements, and live your best life with our goal
              progress tracking feature.
            </p>
            <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRY5U9IfvZcSo44amDbQfbLzVR_aMasbe6gKhp-WYYyug&s"
              border="0"
              alt="Image Description"
            />
          </div>
          <div id="section10" style={{ border: "1px solid #000" }}>
            <form onSubmit={signIn}>
              <h3>{action}</h3>
              <div>
                EMAIL-
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    console.log(e.target.value);
                  }}
                ></input>
              </div>
              <div>
                PASSWORD-
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                ></input>
              </div>
              <div>
                <button
                  type="submit"
                  onClick={() => {
                    setAction("SignUp");
                  }}
                >
                  Sign Up
                </button>
              </div>
              <button
                type="submit"
                onClick={() => {
                  setAction("Login");
                }}
              >
                Log In
              </button>
            </form>
          </div>
        </div>
        <div id="section3" style={{ border: "1px solid #000" }}>
          <h2>Contact</h2>
          <p>Address: XYZ</p>
          <p>Email: xyz@gmail.com</p>
        </div>
      </div>
    </div>
  );
};

export default CustomNavbar;
