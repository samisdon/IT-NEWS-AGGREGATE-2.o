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

      if (country === "in") {
        url = `https://newsdata.io/api/1/news?apikey=${API_KEY}&country=in&language=en`;
      } else {
        url = `https://newsdata.io/api/1/news?apikey=${API_KEY}&language=en&category=top`;
      }

      if (search) url += `&q=${search}`;

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
    <div style={app}>
      
      {/* 🔥 HEADER */}
      <div style={header}>
        <h1>📰 IT News Aggregate</h1>
        <p>Tech • India • World • Real-time Updates</p>
      </div>

      {/* 🔍 SEARCH */}
      <div style={searchBox}>
        <input
          placeholder="Search news..."
          onChange={(e) => setSearch(e.target.value)}
          style={input}
        />
        <button onClick={fetchNews} style={searchBtn}>
          Search
        </button>
      </div>

      {/* 🌍 TOGGLE */}
      <div style={toggle}>
        <button
          onClick={() => setCountry("in")}
          style={country === "in" ? active : btn}
        >
          🇮🇳 India
        </button>
        <button
          onClick={() => setCountry("us")}
          style={country === "us" ? active : btn}
        >
          🌍 World
        </button>
      </div>

      {/* 🔄 LOADING */}
      {loading && <h2 style={{ textAlign: "center" }}>Loading...</h2>}

      {/* ❌ EMPTY */}
      {!loading && news.length === 0 && (
        <h2 style={{ textAlign: "center" }}>No news found 😢</h2>
      )}

      {/* 📰 CARDS */}
      <div style={grid}>
        {news.map((n, i) => (
          <div key={i} style={card} className="card-hover">
            <h3>{n.title}</h3>
            <p style={source}>{n.source_id || "Unknown"}</p>
            <a href={n.link} target="_blank" style={link}>
              Read Full →
            </a>
          </div>
        ))}
      </div>

      {/* 🔥 ANIMATIONS */}
      <style>{`
        @keyframes fadeDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .card-hover:hover {
          transform: scale(1.05);
          box-shadow: 0 10px 30px rgba(0,0,0,0.2);
        }
      `}</style>
    </div>
  );
}

/* 🎨 LIGHT UI STYLES */

const app = {
  background: "linear-gradient(135deg,#e0f2fe,#f8fafc)",
  minHeight: "100vh",
  paddingBottom: "40px",
  color: "#0f172a"
};

const header = {
  textAlign: "center",
  padding: "30px 20px",
  animation: "fadeDown 1s ease"
};

const searchBox = {
  display: "flex",
  justifyContent: "center",
  gap: "10px",
  marginBottom: "20px"
};

const input = {
  padding: "12px",
  borderRadius: "25px",
  border: "1px solid #ccc",
  width: "260px"
};

const searchBtn = {
  padding: "12px 18px",
  borderRadius: "25px",
  border: "none",
  background: "#2563eb",
  color: "white",
  cursor: "pointer"
};

const toggle = {
  textAlign: "center",
  marginBottom: "25px"
};

const btn = {
  margin: "5px",
  padding: "10px 18px",
  borderRadius: "20px",
  border: "none",
  background: "#e2e8f0",
  color: "#0f172a",
  cursor: "pointer"
};

const active = {
  ...btn,
  background: "#2563eb",
  color: "white"
};

const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))",
  gap: "20px",
  padding: "20px"
};

const card = {
  background: "white",
  borderRadius: "15px",
  padding: "20px",
  transition: "0.3s",
  boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
  cursor: "pointer"
};

const source = {
  fontSize: "12px",
  color: "#64748b",
  margin: "10px 0"
};

const link = {
  color: "#2563eb",
  textDecoration: "none",
  fontWeight: "bold"
};
