import { useEffect, useState } from "react";
import axios from "axios";

const API_KEY = import.meta.env.VITE_API_KEY;

export default function App() {
  const [news, setNews] = useState([]);
  const [country, setCountry] = useState("in");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [saved, setSaved] = useState(
    JSON.parse(localStorage.getItem("savedNews")) || []
  );

  // 🔥 Fetch News
  const fetchNews = async (reset = true) => {
    try {
      let url = "";

      if (country === "in") {
        url = `https://newsdata.io/api/1/news?apikey=${API_KEY}&country=in`;
      } else {
        url = `https://newsdata.io/api/1/news?apikey=${API_KEY}`;
      }

      if (category) url += `&category=${category}`;
      if (search) url += `&q=${search}`;

      const res = await axios.get(url);
      setNews(res.data.results || []);
    } catch (err) {
      console.log(err);
    }
  };

  // 🔄 Load
  useEffect(() => {
    fetchNews();
  }, [country, category]);

  // 🔍 Live Search
  useEffect(() => {
    const delay = setTimeout(() => {
      fetchNews();
    }, 400);
    return () => clearTimeout(delay);
  }, [search]);

  // ❤️ Save
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
      
      {/* 🔥 HEADER */}
      <div style={header}>
        <h1>📰 IT News Aggregate</h1>
        <p>Simple • Clean • Modern News App</p>
      </div>

      {/* 🔍 SEARCH */}
      <input
        placeholder="Search news..."
        onChange={(e) => setSearch(e.target.value)}
        style={input}
      />

      {/* 🌍 FILTER */}
      <div style={filters}>
        <button onClick={() => setCountry("in")} style={btn}>India</button>
        <button onClick={() => setCountry("us")} style={btn}>World</button>

        <select onChange={(e) => setCategory(e.target.value)} style={input}>
          <option value="">All</option>
          <option value="technology">Tech</option>
          <option value="sports">Sports</option>
          <option value="business">Business</option>
          <option value="health">Health</option>
        </select>
      </div>

      {/* 🔥 TOP NEWS */}
      {news[0] && (
        <div style={banner}>
          <h2>{news[0].title}</h2>
        </div>
      )}

      {/* 📰 CARDS */}
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

/* 🎨 CLEAN LIGHT STYLES */

const app = {
  background: "#f1f5f9",
  minHeight: "100vh",
  padding: "20px"
};

const header = {
  textAlign: "center",
  marginBottom: "20px",
  color: "#0f172a"
};

const filters = {
  display: "flex",
  gap: "10px",
  margin: "15px 0"
};

const input = {
  padding: "10px",
  borderRadius: "10px",
  border: "1px solid #cbd5e1"
};

const btn = {
  padding: "10px 15px",
  borderRadius: "10px",
  border: "none",
  background: "#e2e8f0",
  cursor: "pointer"
};

const banner = {
  background: "#38bdf8",
  padding: "15px",
  borderRadius: "10px",
  color: "white",
  margin: "15px 0"
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
  boxShadow: "0 4px 10px rgba(0,0,0,0.08)"
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
