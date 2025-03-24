import React, { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "./HomePage.css";

const GUARDIAN_API_KEY = "fbb92440-f590-4fb3-8f86-fca7aff30ca8";
const GUARDIAN_BASE_URL = "https://content.guardianapis.com/search";
const NEWSAPI_KEY = "2f6d531d56be49d98d31f71d9cece7c1";
const NEWSAPI_BASE_URL = "https://newsapi.org/v2/top-headlines";

const NewsPage = () => {
  const [activeCategory, setActiveCategory] = useState("general");
  const [articles, setArticles] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const navigate = useNavigate();

  const categories = [
    "General",
    "Business",
    "Technology",
    "Health",
    "Science",
    "Politics",
    "Sports",
    "Entertainment",
    "Culture",
    "Weather",
  ];

  useEffect(() => {
    const fetchNews = async () => {
      try {
        let url = "";

        if (searchQuery) {
          url = `${NEWSAPI_BASE_URL}?q=${searchQuery}&apiKey=${NEWSAPI_KEY}`;
        } else if (["art", "culture", "weather"].includes(activeCategory)) {
          url = `${GUARDIAN_BASE_URL}?section=${activeCategory}&api-key=${GUARDIAN_API_KEY}`;
        } else {
          url = `${NEWSAPI_BASE_URL}?category=${activeCategory.toLowerCase()}&apiKey=${NEWSAPI_KEY}`;
        }

        const response = await fetch(url);
        const data = await response.json();

        // NewsAPI and The Guardian have different structures, so adjust accordingly
        const formattedArticles =
          "response" in data
            ? data.response.results.map((article) => ({
                title: article.webTitle,
                url: article.webUrl,
                source: { name: "The Guardian" },
                urlToImage: "", // The Guardian API does not provide images directly
                description: "", // No direct description, only titles
              }))
            : data.articles || [];

        setArticles(formattedArticles);
      } catch (error) {
        console.error("Error fetching news:", error);
      }
    };

    fetchNews();
  }, [activeCategory, searchQuery]);

  return (
    <div className="bg-gray-100">
      {/* Navbar */}
      <nav className="navbar">
        <div className="nav-container">
          <div className="nav-title">Yours News</div>
          <div className="nav-buttons">
            <Search
              className="search-icon"
              size={85}
              onClick={() => setShowSearch(!showSearch)}
            />
            {showSearch && (
              <input
                type="text"
                className="search-box"
                placeholder="Search news..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            )}
            <button className="login-btn" onClick={() => navigate("/login")}>
              Login
            </button>
            <button
              className="signup-btn"
              onClick={() => navigate("/register")}
            >
              Sign Up
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header>
        <h1>Stay Informed with Yours News</h1>
        <p>Your trusted source for the latest news.</p>
      </header>

      {/* Category Filter */}
      <section className="category-filter">
        {categories.map((category) => (
          <button
            key={category}
            className={
              activeCategory === category.toLowerCase() ? "active" : ""
            }
            onClick={() => setActiveCategory(category.toLowerCase())}
          >
            {category}
          </button>
        ))}
      </section>

      {/* News Grid */}
      <main className="news-grid">
        {articles.length > 0 ? (
          articles.map((news, index) => (
            <div key={index} className="news-card">
              {news.urlToImage && (
                <img src={news.urlToImage} alt={news.title} />
              )}
              <div className="news-card-content">
                <span className="text-sm text-gray-500">
                  {news.source.name}
                </span>
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
        <p>&copy; 2023 Yours News. All rights reserved.</p>
        <div>
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Service</a>
          <a href="#">Contact Us</a>
        </div>
      </footer>
    </div>
  );
};

export default NewsPage;
