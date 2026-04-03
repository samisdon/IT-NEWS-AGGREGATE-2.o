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

  const fetchNews = async () => {
    try {
      let url = "";

      // ✅ INDIA NEWS
      if (country === "in") {
        url = `https://newsdata.io/api/1/news?apikey=${API_KEY}&country=in&language=en`;
      } 
      // ✅ WORLD NEWS (FIXED)
      else {
        url = `https://newsdata.io/api/1/news?apikey=${API_KEY}&language=en&q=technology`;
      }

      // 🔍 search
      if (search) url += `&q=${search}`;

      const res = await axios.get(url);
      setNews(res.data.results || []);
    } catch (err) {
      console.log(err);
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
        <p style={{ color: "#475569" }}>India • World News</p>
      </div>

      {/* SEARCH */}
      <input
        placeholder="Search news..."
        onChange={(e) => setSearch(e.target.value)}
        style={input}
      />

      {/* ONLY INDIA + WORLD */}
      <div style={filters}>
        <button onClick={() => setCountry("in")} style={btnBlue}>
          🇮🇳 India
        </button>
        <button onClick={() => setCountry("us")} style={btnBlue}>
          🌍 World
        </button>
      </div>

      {/* TOP NEWS */}
      {news[0] && (
        <div style={banner}>
          <h2>{news[0].title}</h2>
        </div>
      )}

      {/* EMPTY FIX */}
      {news.length === 0 && (
        <h2 style={{ textAlign: "center" }}>Loading news...</h2>
      )}

      {/* NEWS */}
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
    </div>
  );
}

/* 🎨 STYLE */

const app = {
  background: "linear-gradient(135deg,#e0f2fe,#f0fdf4)",
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
  border: "1px solid #cbd5e1",
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

const btnBlue = {
  padding: "10px 15px",
  borderRadius: "10px",
  border: "none",
  background: "#3b82f6",
  color: "white",
  cursor: "pointer"
};

const banner = {
  background: "#6366f1",
  padding: "15px",
  borderRadius: "10px",
  color: "white",
  margin: "15px 0",
  textAlign: "center"
};

const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))",
  gap: "15px"
};

const card = {
  background: "white",
  padding: "15px",
  borderRadius: "12px",
  boxShadow: "0 4px 12px rgba(0,0,0,0.08)"
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
