import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";

function App() {
  return (
    <main className="app-shell">
      <p className="eyebrow">RANVEX PLATFORM</p>
      <h1>CN Exam</h1>
      <p className="subtitle">Platform ujian digital Citra Negara.</p>
      <span className="status">Frontend siap dikembangkan</span>
    </main>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
