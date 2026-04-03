import { useEffect, useState } from "react";
import axios from "axios";

const API_KEY = import.meta.env.VITE_API_KEY;

export default function App() {
  const [news, setNews] = useState([]);
  const [country, setCountry] = useState("in");
  const [search, setSearch] = useState("");
  const [saved, setSaved] = useState(
    JSON.parse(localStorage.getItem("savedNews")) || []
  );
  const [loading, setLoading] = useState(true);

  const fetchNews = async () => {
    try {
      setLoading(true);

      let url =
        country === "in"
          ? `https://newsdata.io/api/1/news?apikey=${API_KEY}&country=in&language=en`
          : `https://newsdata.io/api/1/news?apikey=${API_KEY}&language=en&q=technology`;

      if (search) url += `&q=${search}`;

      const res = await axios.get(url);

      // 🧠 small delay for smooth UI (no flicker)
      setTimeout(() => {
        setNews(res.data.results || []);
        setLoading(false);
      }, 300);

    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, [country]);

  useEffect(() => {
    const delay = setTimeout(fetchNews, 400);
    return () => clearTimeout(delay);
  }, [search]);

  const toggleSave = (item) => {
    let updated;
    if (saved.find((s) => s.link === item.link)) {
      updated = saved.filter((s) => s.link !== item.link);
    } else {
      updated = [...saved, item];
    }
    setSaved(updated);
    localStorage.setItem("savedNews", JSON.stringify(updated));
  };

  return (
    <div style={app}>
      
      {/* HEADER */}
      <div style={header}>
        <h1 style={{ color: "#1e40af" }}>📰 IT News Aggregate</h1>
      </div>

      {/* SEARCH */}
      <input
        placeholder="Search news..."
        onChange={(e) => setSearch(e.target.value)}
        style={input}
      />

      {/* FILTER */}
      <div style={filters}>
        <button onClick={() => setCountry("in")} style={btn}>
          🇮🇳 India
        </button>
        <button onClick={() => setCountry("us")} style={btn}>
          🌍 World
        </button>
      </div>

      {/* 🔥 SKELETON LOADING */}
      {loading ? (
        <div style={grid}>
          {[...Array(6)].map((_, i) => (
            <div key={i} style={skeleton}></div>
          ))}
        </div>
      ) : (
        <div style={grid}>
          {news.map((n, i) => (
            <div key={i} style={card}>
              <h3>{n.title}</h3>

              <p style={date}>
                {n.pubDate
                  ? new Date(n.pubDate).toLocaleString()
                  : "No date"}
              </p>

              <div style={actions}>
                <button onClick={() => toggleSave(n)}>
                  {saved.find((s) => s.link === n.link) ? "❤️" : "🤍"}
                </button>

                <button
                  onClick={() =>
                    navigator.share?.({
                      title: n.title,
                      url: n.link,
                    })
                  }
                >
                  📤
                </button>
              </div>

              <a href={n.link} target="_blank" style={link}>
                Read →
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* 🎨 STYLES */

const app = {
  background: "#f1f5f9",
  minHeight: "100vh",
  padding: "20px"
};

const header = {
  textAlign: "center",
  marginBottom: "20px"
};

const input = {
  padding: "10px",
  borderRadius: "10px",
  border: "1px solid #ccc",
  width: "100%",
  maxWidth: "400px",
  display: "block",
  margin: "0 auto"
};

const filters = {
  display: "flex",
  justifyContent: "center",
  gap: "10px",
  margin: "15px 0"
};

const btn = {
  padding: "10px 15px",
  borderRadius: "10px",
  border: "none",
  background: "#3b82f6",
  color: "white",
  cursor: "pointer"
};

const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit,minmax(250px,1fr))",
  gap: "15px"
};

const card = {
  background: "white",
  padding: "15px",
  borderRadius: "10px",
  boxShadow: "0 4px 10px rgba(0,0,0,0.08)"
};

const skeleton = {
  height: "120px",
  borderRadius: "10px",
  background: "linear-gradient(90deg,#e2e8f0,#f1f5f9,#e2e8f0)",
  animation: "pulse 1.5s infinite"
};

const actions = {
  display: "flex",
  gap: "10px",
  margin: "10px 0"
};

const date = {
  fontSize: "12px",
  color: "#64748b"
};

const link = {
  color: "#2563eb",
  textDecoration: "none",
  fontWeight: "bold"
};
