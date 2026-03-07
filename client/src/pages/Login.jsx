import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setLoading, setUser } from "../redux/authSlice";

const Login = () => {
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.auth.loading);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    dispatch(setLoading(true));

    try {
      const res = await fetch("/api/v1/demo/auth/loginUser", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Login failed");
      }

      // Save user in Redux
      dispatch(setUser(data.data));
      alert("Login successful!");
      setEmail("");
      setPassword("");
    } catch (err) {
      setError(err.message);
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <>
      <div>
        <h2>Login</h2>
        <form onSubmit={handleLogin}>
          <div>
            <label>Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label>Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>

          {error && (
            <div>
              <p>{error}</p>
            </div>
          )}
        </form>
      </div>
    </>
  );
};

export default Login;
