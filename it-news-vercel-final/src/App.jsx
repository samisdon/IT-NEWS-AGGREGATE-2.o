import { useEffect, useState } from "react";
import axios from "axios";

const API_KEY = import.meta.env.VITE_API_KEY;

export default function App() {
  const [news, setNews] = useState([]);
  const [search, setSearch] = useState("");
  const [saved, setSaved] = useState(
    JSON.parse(localStorage.getItem("savedNews")) || []
  );
  const [loading, setLoading] = useState(true);

  const fetchNews = async () => {
    try {
      setLoading(true);

      // ✅ ONLY INDIA NEWS
      let url = `https://gnews.io/api/v4/top-headlines?token=${API_KEY}&country=in&lang=en`;

      if (search) url += `&q=${search}`;

      const res = await axios.get(url);

      setNews(res.data.articles || []);
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  useEffect(() => {
    const delay = setTimeout(fetchNews, 400);
    return () => clearTimeout(delay);
  }, [search]);

  const toggleSave = (item) => {
    let updated;
    if (saved.find((s) => s.url === item.url)) {
      updated = saved.filter((s) => s.url !== item.url);
    } else {
      updated = [...saved, item];
    }
    setSaved(updated);
    localStorage.setItem("savedNews", JSON.stringify(updated));
  };

  return (
    <div style={app}>
      
      {/* HEADER */}
      <h1 style={title}>📰 IT News Aggregate</h1>
      <p style={subtitle}>Latest India News 🇮🇳</p>

      {/* SEARCH */}
      <input
        placeholder="Search India news..."
        onChange={(e) => setSearch(e.target.value)}
        style={input}
      />

      {/* LOADING */}
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
                {n.publishedAt
                  ? new Date(n.publishedAt).toLocaleString()
                  : ""}
              </p>

              <div style={actions}>
                <button onClick={() => toggleSave(n)}>
                  {saved.find((s) => s.url === n.url) ? "❤️" : "🤍"}
                </button>
              </div>

              <a href={n.url} target="_blank" style={link}>
                Read →
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* 🎨 STYLE */

const app = {
  background: "linear-gradient(135deg,#e0f2fe,#f0fdf4)",
  minHeight: "100vh",
  padding: "20px"
};

const title = {
  textAlign: "center",
  color: "#1e40af"
};

const subtitle = {
  textAlign: "center",
  color: "#475569"
};

const input = {
  padding: "10px",
  borderRadius: "10px",
  border: "1px solid #ccc",
  width: "100%",
  maxWidth: "400px",
  display: "block",
  margin: "10px auto"
};

const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit,minmax(250px,1fr))",
  gap: "15px",
  marginTop: "20px"
};

const card = {
  background: "white",
  padding: "15px",
  borderRadius: "10px",
  boxShadow: "0 4px 10px rgba(0,0,0,0.1)"
};

const skeleton = {
  height: "120px",
  borderRadius: "10px",
  background: "#e2e8f0"
};

const date = {
  fontSize: "12px",
  color: "gray"
};

const actions = {
  margin: "10px 0"
};

const link = {
  color: "#2563eb",
  textDecoration: "none"
};
