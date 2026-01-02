import Login from "./components/Login/login";
import Signup from "./components/Signup/Signup";
import Profile from "./components/Profile/profile";
import "./App.css";

import { BrowserRouter as Router, Link, Route, Routes } from "react-router-dom";

function App() {
  const isLoggedIn = localStorage.getItem("token");

  return (
    <Router>
      <div className="App">
        <nav className="navbar">
          <h2 className="logo">Auth App</h2>
          <ul>
            {!isLoggedIn && (
              <>
                <li>
                  <Link to="/">Login</Link>
                </li>
                <li>
                  <Link to="/signup">Signup</Link>
                </li>
              </>
            )}

            {isLoggedIn && (
              <>
                <li>
                  <Link to="/profile">Profile</Link>
                </li>
                <li>
                  <button
                    className="logout-btn"
                    onClick={() => {
                      localStorage.removeItem("token");
                      window.location.href = "/";
                    }}
                  >
                    Logout
                  </button>
                </li>
              </>
            )}
          </ul>
        </nav>

        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Protected GET Route */}
          <Route
            path="/profile"
            element={isLoggedIn ? <Profile /> : <Login />}
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
