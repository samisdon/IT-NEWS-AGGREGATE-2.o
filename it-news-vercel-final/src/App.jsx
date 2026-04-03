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
      
      {/* 🔥 HERO HEADER */}
      <div style={hero}>
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
        <button onClick={fetchNews} style={searchBtn}>Search</button>
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
            
            {/* 🖼 IMAGE */}
            {n.image_url && (
              <img src={n.image_url} style={img} />
            )}

            <div style={{ padding: "15px" }}>
              <h3 style={title}>{n.title}</h3>

              <p style={source}>
                {n.source_id || "Unknown"}
              </p>

              <a href={n.link} target="_blank" style={link}>
                Read Full →
              </a>
            </div>
          </div>
        ))}
      </div>
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
  padding: "40px 20px",
  fontSize: "22px"
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
  overflow: "hidden",
  transition: "0.3s",
  boxShadow: "0 10px 25px rgba(0,0,0,0.4)"
};

const img = {
  width: "100%",
  height: "180px",
  objectFit: "cover"
};

const title = {
  fontSize: "16px",
  marginBottom: "10px"
};

const source = {
  fontSize: "12px",
  opacity: 0.6,
  marginBottom: "10px"
};

const link = {
  color: "#38bdf8",
  textDecoration: "none",
  fontWeight: "bold"
};
