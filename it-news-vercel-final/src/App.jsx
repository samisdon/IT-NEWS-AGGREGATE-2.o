import { useEffect, useState } from "react";
import axios from "axios";

const API_KEY = import.meta.env.VITE_API_KEY;

export default function App() {
  const [news, setNews] = useState([]);

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    const res = await axios.get(
      `https://newsdata.io/api/1/news?apikey=${API_KEY}&country=in`
    );
    setNews(res.data.results || []);
  };

  return (
    <div style={{padding:"20px"}}>
      <h1>📰 IT News (Final)</h1>
      {news.map((n,i)=>(
        <div key={i} style={{margin:"10px",padding:"10px",background:"#eee"}}>
          <h3>{n.title}</h3>
          <a href={n.link}>Read</a>
        </div>
      ))}
    </div>
  );
}
