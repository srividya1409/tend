import { useState, lazy, Suspense } from "react";

const Users = lazy(() => import("./Users"));

function App() {
  const [showUsers, setShowUsers] = useState(false);

  return (
    <div style={{
      height: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      background: "linear-gradient(to right, #4facfe, #00f2fe)"
    }}>
      <div style={{
        textAlign: "center",
        background: "white",
        padding: "40px",
        borderRadius: "12px",
        boxShadow: "0 10px 30px rgba(0,0,0,0.2)"
      }}>
        <h1 style={{ color: "#333" }}>User Dashboard</h1>

        <button
          onClick={() => setShowUsers(true)}
          style={{
            padding: "12px 20px",
            background: "#4facfe",
            border: "none",
            color: "white",
            borderRadius: "8px",
            cursor: "pointer",
            fontSize: "16px"
          }}
        >
          Load Users
        </button>

        <Suspense fallback={<p style={{ marginTop: "20px" }}>Loading...</p>}>
          {showUsers && <Users />}
        </Suspense>
      </div>
    </div>
  );
}

export default App;