import { useEffect, useState } from "react";
import axios from "axios";

const API_KEY = import.meta.env.VITE_API_KEY;

export default function App() {
  const [news, setNews] = useState([]);
  const [country, setCountry] = useState("in");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchNews = async () => {
    setLoading(true);
    try {
      let url = "";

      // 🇮🇳 India news
      if (country === "in") {
        url = `https://newsdata.io/api/1/news?apikey=${API_KEY}&country=in&language=en`;
      } 
      // 🌍 World news FIX
      else {
        url = `https://newsdata.io/api/1/news?apikey=${API_KEY}&language=en&category=top`;
      }

      // 🔍 Search support
      if (search) {
        url += `&q=${search}`;
      }

      const res = await axios.get(url);
      setNews(res.data.results || []);
    } catch (err) {
      console.log(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchNews();
  }, [country]);

  return (
    <div style={appStyle}>
      
      {/* 🔥 HEADER */}
      <div style={header}>
        <h1>📰 IT News Aggregate</h1>
        <p style={{ opacity: 0.7 }}>Your Daily Tech + World News Hub</p>
      </div>

      {/* 🔍 SEARCH */}
      <div style={searchBox}>
        <input
          placeholder="Search news..."
          onChange={(e) => setSearch(e.target.value)}
          style={input}
        />
        <button onClick={fetchNews} style={btn}>Search</button>
      </div>

      {/* 🌍 TOGGLE */}
      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        <button
          onClick={() => setCountry("in")}
          style={country === "in" ? activeBtn : btn}
        >
          🇮🇳 India
        </button>
        <button
          onClick={() => setCountry("us")}
          style={country === "us" ? activeBtn : btn}
        >
          🌍 World
        </button>
      </div>

      {/* 🔄 LOADING */}
      {loading && <h2 style={{ textAlign: "center" }}>Loading...</h2>}

      {/* ❌ EMPTY STATE */}
      {!loading && news.length === 0 && (
        <h2 style={{ textAlign: "center" }}>No news found 😢</h2>
      )}

      {/* 📰 NEWS GRID */}
      {!loading && news.length > 0 && (
        <div style={grid}>
          {news.map((n, i) => (
            <div key={i} style={card}>
              <h3>{n.title}</h3>
              <p style={{ fontSize: "12px", opacity: 0.6 }}>
                {n.source_id || "Unknown"}
              </p>
              <a href={n.link} target="_blank" style={link}>
                Read More →
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* 🔥 STYLES */

const appStyle = {
  background: "linear-gradient(135deg,#020617,#0f172a)",
  minHeight: "100vh",
  color: "white",
  padding: "20px"
};

const header = {
  textAlign: "center",
  marginBottom: "20px"
};

const searchBox = {
  display: "flex",
  justifyContent: "center",
  gap: "10px",
  marginBottom: "20px"
};

const input = {
  padding: "10px",
  borderRadius: "10px",
  border: "none",
  width: "250px"
};

const btn = {
  padding: "10px 15px",
  borderRadius: "10px",
  border: "none",
  background: "#1e293b",
  color: "white",
  cursor: "pointer"
};

const activeBtn = {
  ...btn,
  background: "#2563eb"
};

const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))",
  gap: "20px"
};

const card = {
  background: "rgba(255,255,255,0.08)",
  backdropFilter: "blur(15px)",
  padding: "15px",
  borderRadius: "15px",
  transition: "0.3s",
  boxShadow: "0 4px 20px rgba(0,0,0,0.3)"
};

const link = {
  color: "#38bdf8",
  textDecoration: "none",
  fontWeight: "bold"
};
