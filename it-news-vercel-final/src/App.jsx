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
      <div style={hero}>
        <h1 style={{ animation: "fadeDown 1s ease" }}>
          📰 IT News Aggregate
        </h1>
        <p style={{ opacity: 0.7 }}>
          Tech • India • World • Real-time Updates
        </p>
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

      {/* 🌍 FILTER */}
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
          <div key={i} style={card}>
            <h3>{n.title}</h3>
            <p style={source}>{n.source_id || "Unknown"}</p>
            <a href={n.link} target="_blank" style={link}>
              Read Full →
            </a>
          </div>
        ))}
      </div>

      {/* 🔥 ANIMATION CSS */}
      <style>{`
        @keyframes fadeDown {
          from {
            opacity: 0;
            transform: translateY(-30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        div:hover {
          transform: scale(1.03);
        }
      `}</style>
    </div>
  );
}

/* 🔥 STYLES */

const app = {
  background: "linear-gradient(135deg,#020617,#0f172a)",
  minHeight: "100vh",
  color: "white",
  paddingBottom: "40px"
};

const hero = {
  textAlign: "center",
  padding: "40px 20px"
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
  border: "none",
  width: "280px"
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
  marginBottom: "30px"
};

const btn = {
  margin: "5px",
  padding: "10px 18px",
  borderRadius: "20px",
  border: "none",
  background: "#1e293b",
  color: "white",
  cursor: "pointer"
};

const active = {
  ...btn,
  background: "#2563eb"
};

const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))",
  gap: "25px",
  padding: "20px"
};

const card = {
  background: "rgba(255,255,255,0.08)",
  backdropFilter: "blur(20px)",
  borderRadius: "15px",
  padding: "20px",
  transition: "0.3s",
  boxShadow: "0 10px 25px rgba(0,0,0,0.4)",
  cursor: "pointer"
};

const source = {
  fontSize: "12px",
  opacity: 0.6,
  margin: "10px 0"
};

const link = {
  color: "#38bdf8",
  textDecoration: "none",
  fontWeight: "bold"
};
