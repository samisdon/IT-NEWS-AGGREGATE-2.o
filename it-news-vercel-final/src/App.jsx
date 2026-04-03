import { useEffect, useState } from "react";
import axios from "axios";

const API_KEY = import.meta.env.VITE_API_KEY;

export default function App() {
  const [news, setNews] = useState([]);
  const [country, setCountry] = useState("in");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [dark, setDark] = useState(false);
  const [saved, setSaved] = useState(
    JSON.parse(localStorage.getItem("savedNews")) || []
  );
  const [page, setPage] = useState(1);

  // 🔥 Fetch News
  const fetchNews = async (reset = false) => {
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

      if (reset) {
        setNews(res.data.results || []);
      } else {
        setNews((prev) => [...prev, ...(res.data.results || [])]);
      }
    } catch (err) {
      console.log(err);
    }
  };

  // 🔄 First Load
  useEffect(() => {
    fetchNews(true);
  }, [country, category]);

  // 🔍 Live Search
  useEffect(() => {
    const delay = setTimeout(() => {
      fetchNews(true);
    }, 500);
    return () => clearTimeout(delay);
  }, [search]);

  // 🔄 Auto Refresh
  useEffect(() => {
    const interval = setInterval(() => {
      fetchNews(true);
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  // ⚡ Infinite Scroll
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop >=
        document.documentElement.offsetHeight - 100
      ) {
        fetchNews();
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // ❤️ Save News
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
    <div style={dark ? darkApp : lightApp}>
      
      {/* 🔥 HEADER */}
      <div style={header}>
        <h1>📰 IT News Aggregate</h1>
        <button onClick={() => setDark(!dark)} style={btn}>
          {dark ? "☀️ Light" : "🌙 Dark"}
        </button>
      </div>

      {/* 🔍 SEARCH */}
      <input
        placeholder="Search news..."
        onChange={(e) => setSearch(e.target.value)}
        style={input}
      />

      {/* 🌍 FILTERS */}
      <div style={filters}>
        <button onClick={() => setCountry("in")} style={btn}>🇮🇳 India</button>
        <button onClick={() => setCountry("us")} style={btn}>🌍 World</button>

        <select onChange={(e) => setCategory(e.target.value)} style={input}>
          <option value="">All</option>
          <option value="technology">Tech</option>
          <option value="sports">Sports</option>
          <option value="business">Business</option>
          <option value="health">Health</option>
        </select>
      </div>

      {/* 🔥 TOP HEADLINE */}
      {news[0] && (
        <div style={banner}>
          <h2>{news[0].title}</h2>
        </div>
      )}

      {/* 📰 NEWS */}
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

            <a href={n.link} target="_blank">Read →</a>
          </div>
        ))}
      </div>
    </div>
  );
}

/* 🎨 STYLES */

const lightApp = {
  background: "#f8fafc",
  minHeight: "100vh",
  padding: "20px"
};

const darkApp = {
  background: "#020617",
  color: "white",
  minHeight: "100vh",
  padding: "20px"
};

const header = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center"
};

const filters = {
  margin: "10px 0",
  display: "flex",
  gap: "10px"
};

const input = {
  padding: "10px",
  borderRadius: "10px",
  border: "1px solid #ccc"
};

const btn = {
  padding: "8px 12px",
  borderRadius: "10px",
  border: "none",
  cursor: "pointer"
};

const banner = {
  background: "#2563eb",
  color: "white",
  padding: "15px",
  borderRadius: "10px",
  margin: "15px 0"
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
  boxShadow: "0 5px 15px rgba(0,0,0,0.1)"
};

const actions = {
  display: "flex",
  gap: "10px",
  margin: "10px 0"
};

const date = {
  fontSize: "12px",
  color: "gray"
};
