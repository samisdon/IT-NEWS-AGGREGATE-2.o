import { useEffect, useState } from "react";
import axios from "axios";

const API_KEY = import.meta.env.VITE_API_KEY;

export default function App() {
  const [news, setNews] = useState([]);
  const [country, setCountry] = useState("in"); // default India
  const [loading, setLoading] = useState(true);

  const fetchNews = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `https://newsdata.io/api/1/news?apikey=${API_KEY}&country=${country}&language=en`
      );
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
    <div style={{ padding: "20px", background: "#0f172a", minHeight: "100vh", color: "white" }}>
      
      <h1 style={{ textAlign: "center" }}>📰 IT News Pro</h1>

      {/* 🔥 COUNTRY TOGGLE */}
      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        <button onClick={() => setCountry("in")} style={btn}>
          🇮🇳 India
        </button>
        <button onClick={() => setCountry("us")} style={btn}>
          🌍 World
        </button>
      </div>

      {/* 🔄 LOADING */}
      {loading ? (
        <h2 style={{ textAlign: "center" }}>Loading...</h2>
      ) : (
        <div style={grid}>
          {news.map((n, i) => (
            <div key={i} style={card}>
              <h3>{n.title}</h3>
              <p style={{ fontSize: "12px", opacity: 0.7 }}>
                {n.source_id}
              </p>
              <a href={n.link} target="_blank" style={{ color: "#38bdf8" }}>
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
const btn = {
  margin: "5px",
  padding: "10px 15px",
  borderRadius: "10px",
  border: "none",
  background: "#1e293b",
  color: "white",
  cursor: "pointer"
};

const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit,minmax(250px,1fr))",
  gap: "20px"
};

const card = {
  background: "rgba(255,255,255,0.1)",
  backdropFilter: "blur(10px)",
  padding: "15px",
  borderRadius: "15px",
  transition: "0.3s"
};
