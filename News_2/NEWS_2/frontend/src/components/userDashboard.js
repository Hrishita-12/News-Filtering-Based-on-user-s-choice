import React, { useState, useEffect } from "react";
import { Search, User, MessageSquare, Mic } from "lucide-react"; // Added Mic icon
import { useNavigate } from "react-router-dom";
import "./HomePage.css";

const NEWSAPI_KEY = "2f6d531d56be49d98d31f71d9cece7c1"; // Replace with your NewsAPI key
const NEWSAPI_BASE_URL = "https://newsapi.org/v2/top-headlines";

const UserDashboard = () => {
  const [articles, setArticles] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [isListening, setIsListening] = useState(false); // State for voice search
  const navigate = useNavigate();

  // Initialize SpeechRecognition
  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = new SpeechRecognition();

  recognition.continuous = false; // Stop after one sentence
  recognition.interimResults = false; // Only final results
  recognition.lang = "en-US"; // Set language

  // Handle speech recognition results
  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    setSearchQuery(transcript); // Update search query with recognized speech
    setIsListening(false); // Stop listening
  };

  // Handle errors
  recognition.onerror = (event) => {
    console.error("Speech recognition error:", event.error);
    setIsListening(false);
  };

  // Start/stop voice search
  const toggleVoiceSearch = () => {
    if (isListening) {
      recognition.stop();
      setIsListening(false);
    } else {
      recognition.start();
      setIsListening(true);
    }
  };

  // Fetch News Articles
  useEffect(() => {
    const fetchNews = async () => {
      try {
        let url = "";

        if (searchQuery) {
          // Fetch news based on search query
          url = `${NEWSAPI_BASE_URL}?q=${encodeURIComponent(searchQuery)}&apiKey=${NEWSAPI_KEY}`;
        } else {
          // Fetch all top headlines
          url = `${NEWSAPI_BASE_URL}?country=us&apiKey=${NEWSAPI_KEY}`;
        }

        console.log("Fetching news from:", url);

        const response = await fetch(url);
        if (!response.ok) {
          throw new Error("Failed to fetch news");
        }
        const data = await response.json();
        console.log("API Response:", data);

        // Format NewsAPI response
        const formattedArticles = data.articles.map((article) => ({
          title: article.title,
          url: article.url,
          source: article.source?.name || "Unknown Source",
          urlToImage: article.urlToImage || "",
          description: article.description || "",
        }));

        setArticles(formattedArticles);
      } catch (error) {
        console.error("Error fetching news:", error);
      }
    };

    fetchNews();
  }, [searchQuery]);

  return (
    <div className="bg-gray-100">
      {/* Navbar */}
      <nav className="navbar">
        <div className="nav-container">
          <div className="nav-title">Your News</div>
          <div className="nav-buttons">
            <Search
              className="search-icon"
              size={24}
              onClick={() => setShowSearch(!showSearch)}
            />
            {showSearch && (
              <div className="search-box-container">
                <input
                  type="text"
                  className="search-box"
                  placeholder="Search news..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Mic
                  className={`voice-search-icon ${isListening ? "active" : ""}`}
                  size={20}
                  onClick={toggleVoiceSearch}
                />
              </div>
            )}
            <User
              className="user-icon"
              size={24}
              onClick={() => navigate("/profile")}
            />
            <MessageSquare
              className="feedback-icon"
              size={24}
              onClick={() => navigate("/feedback")}
            />
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header>
        <h1>Stay Informed with Your News</h1>
        <p>Your trusted source for the latest news.</p>
      </header>

      {/* News Grid */}
      <main className="news-grid">
        {articles.length > 0 ? (
          articles.map((news, index) => (
            <div key={index} className="news-card">
              {news.urlToImage && <img src={news.urlToImage} alt={news.title} />}
              <div className="news-card-content">
                <span className="text-sm text-gray-500">{news.source}</span>
                <h2>{news.title}</h2>
                <p>{news.description}</p>
                <a href={news.url} target="_blank" rel="noopener noreferrer">
                  Read More →
                </a>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center w-full text-gray-600">No news available.</p>
        )}
      </main>

      {/* Footer */}
      <footer>
        <p>&copy; 2024 Your News. All rights reserved.</p>
        <div>
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Service</a>
          <a href="#">Contact Us</a>
        </div>
      </footer>
    </div>
  );
};

export default UserDashboard;