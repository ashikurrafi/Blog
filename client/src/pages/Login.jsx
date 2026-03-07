import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import apiClient from "../api/apiClient";
import { setLoading, setToken, setUser } from "../redux/authSlice";

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
      const { data } = await apiClient.post("/auth/loginUser", {
        email,
        password,
      });

      dispatch(setUser(data.data.user));
      dispatch(setToken(data.data.token));
      setEmail("");
      setPassword("");
    } catch (err) {
      setError(err.message);
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
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
        {error && <p style={{ color: "red" }}>{error}</p>}
      </form>
    </div>
  );
};

export default Login;
