import { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import axios from "axios";
import LandingPage from "./components/LandingPage";
import Login from "./components/Login";
import Register from "./components/Register";
import HomePage from "./components/HomePage";
import UserNewsPage from "./components/userDashboard";
import Profile from "./components/profile";
import Feedback from "./components/feedback";

function App() {
  useEffect(() => {
    const fetchBackend = async () => {
      try {
        const response = await axios.get("http://localhost:5000");
        console.log("Backend Response:", response.data);
      } catch (error) {
        console.error("Error connecting to backend:", error.message);
      }
    };

    fetchBackend();
  }, []);

  return (
    <Router>
      <div className="app-container">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/userDashboard" element={<UserNewsPage />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/feedback" element={<Feedback />} />
          {/* 404 Page (Optional) */}
          <Route path="*" element={<h2>404 - Page Not Found</h2>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;