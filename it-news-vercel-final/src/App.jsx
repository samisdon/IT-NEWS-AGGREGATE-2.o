import { useEffect, useState } from "react";

export default function App() {
  const [news, setNews] = useState([]);

  const fetchNews = async () => {
    try {
      const res = await fetch(
        "https://api.rss2json.com/v1/api.json?rss_url=https://timesofindia.indiatimes.com/rssfeedstopstories.cms"
      );
      const data = await res.json();
      setNews(data.items || []);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  return (
    <div style={app}>
      <h1 style={title}>📰 IT News Aggregate</h1>
      <p style={subtitle}>India News 🇮🇳 (Always Working)</p>

      <div style={grid}>
        {news.map((n, i) => (
          <div key={i} style={card}>
            <h3>{n.title}</h3>

            <p style={date}>
              {new Date(n.pubDate).toLocaleString()}
            </p>

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
  background: "#f1f5f9",
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

const date = {
  fontSize: "12px",
  color: "gray"
};

const link = {
  color: "#2563eb",
  textDecoration: "none"
};
