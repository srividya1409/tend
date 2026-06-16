import { useState, lazy, Suspense } from "react";
import Login from "./pages/Login";

const Dashboard = lazy(() => import("./pages/Dashboard"));

function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));

  return (
    <Suspense fallback={<h2 className="app-loading">Loading...</h2>}>
      {token ? (
        <Dashboard setToken={setToken} />
      ) : (
        <Login setToken={setToken} />
      )}
    </Suspense>
  );
}

export default App;