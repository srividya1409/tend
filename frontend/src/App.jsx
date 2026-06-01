import { useState } from "react";

function App() {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [color, setColor] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [loggedInUser, setLoggedInUser] = useState("");

  const handleSubmit = async () => {
    const url = isLogin
      ? "http://localhost:5000/login"
      : "http://localhost:5000/register";

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          username: name,
          password: password
        })
      });

      const data = await res.json();

      console.log(data); 

      if (data.success) {
        if (data.token) {
          console.log(data.token); 
          localStorage.setItem("token", data.token);
          setLoggedInUser(name);
        }

        setMessage(data.message);
        setColor("lightgreen");
      } else {
        setMessage(data.message);
        setColor("red");
      }
    } catch (err) {
      console.log(err);
      setMessage("Server error");
      setColor("red");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setLoggedInUser("");
  };

  if (loggedInUser) {
    return (
      <div style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        background: "#0f172a",
        color: "white"
      }}>
        <div style={{ textAlign: "center" }}>
          <h1>Welcome {loggedInUser} 🎉</h1>
          <button onClick={handleLogout}>Logout</button>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
      background: "linear-gradient(to right, #0f172a, #1e293b)"
    }}>
      <div style={{
        backgroundColor: "#0b1220",
        padding: "35px",
        borderRadius: "12px",
        width: "320px",
        textAlign: "center"
      }}>
        <h2 style={{ color: "white" }}>
          {isLogin ? "Login" : "Signup"}
        </h2>

        <input
          placeholder="Username"
          onChange={(e) => setName(e.target.value)}
          style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
        />

        <input
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
          style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
        />

        <button onClick={handleSubmit}>
          {isLogin ? "Login" : "Signup"}
        </button>

        <p style={{ color: color }}>{message}</p>

        <p
          style={{ cursor: "pointer", color: "lightblue" }}
          onClick={() => setIsLogin(!isLogin)}
        >
          {isLogin ? "Create new account" : "Already have an account?"}
        </p>
      </div>
    </div>
  );
}

export default App;