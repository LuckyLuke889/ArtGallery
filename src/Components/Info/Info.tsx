import "../../App.css";
import { useNavigate } from "react-router-dom";

export const Info = () => {
  const navigate = useNavigate();

  return (
    <div className="background">
      <div style={{ maxWidth: "720px", margin: "0 auto", padding: "24px", display: "flex", flexDirection: "column", gap: "24px" }}>
        <div style={{ boxShadow: "0 2px 6px rgba(0,0,0,0.1)", padding: "16px", borderRadius: "12px", background: "white" }}>
          <h2 style={{ fontSize: "20px", fontWeight: "bold", marginBottom: "12px" }}>The Art Gallery Problem</h2>
          <p style={{ fontSize: "14px", lineHeight: "1.6" }}>
            The <strong>Art Gallery Problem</strong> is a classic question in computational geometry.
            It asks: "Given the floor plan of an art gallery in the shape of a simple polygon, what is the minimum number of guards required so that every point inside the gallery is visible to at least one guard?"
          </p>
          <p style={{ fontSize: "14px", lineHeight: "1.6" }}>
            The problem was first posed by <strong>Victor Klee</strong> in 1973. In 1975, <strong>Fisk’s Art Gallery Theorem</strong> provided a complete answer: for any simple polygon with <em>n</em> vertices,
            ⌊<em>n</em>/3⌋ guards are always sufficient and sometimes necessary.
          </p>
        </div>

        <div style={{ boxShadow: "0 2px 6px rgba(0,0,0,0.1)", padding: "16px", borderRadius: "12px", background: "white" }}>
          <h2 style={{ fontSize: "20px", fontWeight: "bold", marginBottom: "12px" }}>Triangulation & 3-Coloring Solution</h2>
          <p style={{ fontSize: "14px", lineHeight: "1.6" }}>
            The proof of Fisk’s theorem uses two key ideas: <strong>triangulation</strong> and <strong>3-coloring</strong>.
          </p>
          <ol style={{ paddingLeft: "20px", fontSize: "14px", lineHeight: "1.6" }}>
            <li><strong>Triangulation:</strong> Any simple polygon can be divided into non-overlapping triangles by drawing non-intersecting diagonals between its vertices. This process is called triangulation, and it uses exactly <em>n-3</em> diagonals.</li>
            <li><strong>3-Coloring:</strong> The vertices of the triangulated polygon can always be colored with just three colors so that no two adjacent vertices share the same color.</li>
            <li>In a triangulated polygon, every triangle has one vertex of each color. Choosing the color that appears the least gives at most ⌊<em>n</em>/3⌋ vertices. Placing guards on these vertices ensures that each triangle, and thus the entire polygon, is visible to a guard.</li>
          </ol>
        </div>

        <div style={{ boxShadow: "0 2px 6px rgba(0,0,0,0.1)", padding: "16px", borderRadius: "12px", background: "white" }}>
          <h2 style={{ fontSize: "20px", fontWeight: "bold", marginBottom: "12px" }}>Visual Diagram</h2>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <svg width="320" height="220" viewBox="0 0 320 220">
              <polygon points="60,40 260,40 300,100 280,180 180,200 100,180 40,120" fill="#f3f4f6" stroke="#374151" strokeWidth="2" />
              <line x1="60" y1="40" x2="300" y2="100" stroke="#9ca3af" strokeDasharray="4" />
              <line x1="60" y1="40" x2="280" y2="180" stroke="#9ca3af" strokeDasharray="4" />
              <line x1="60" y1="40" x2="180" y2="200" stroke="#9ca3af" strokeDasharray="4" />
              <circle cx="60" cy="40" r="6" fill="#ef4444" />
              <circle cx="260" cy="40" r="6" fill="#10b981" />
              <circle cx="300" cy="100" r="6" fill="#3b82f6" />
              <circle cx="280" cy="180" r="6" fill="#10b981" />
              <circle cx="180" cy="200" r="6" fill="#3b82f6" />
              <circle cx="100" cy="180" r="6" fill="#10b981" />
              <circle cx="40" cy="120" r="6" fill="#3b82f6" />
            </svg>
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "center", marginTop: "24px" }}>
          <button
            style={{ padding: "12px 24px", fontSize: "14px", fontWeight: "bold", borderRadius: "8px", background: "#3b82f6", color: "white", border: "none", cursor: "pointer" }}
            onClick={() => navigate('/')}
          >
            Return
          </button>
        </div>
      </div>
    </div>
  );
}
