import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setLoading, setUser } from "../redux/authSlice";

const Register = () => {
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.auth.loading);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    dispatch(setLoading(true));

    try {
      const res = await fetch("/api/v1/demo/auth/registerUser", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, phone }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Registration failed");
      }

      // Save user in Redux
      dispatch(setUser(data.data));
      alert("Registration successful!");
      setName("");
      setEmail("");
      setPassword("");
      setPhone("");
    } catch (err) {
      setError(err.message);
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <div>
      <div>
        <h2>Login</h2>
        <form onSubmit={handleLogin}>
          <div>
            <label>Name:</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
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
          <div>
            <label>Phone:</label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </div>

          <button type="submit" disabled={loading}>
            {loading ? "Registering..." : "Register"}
          </button>

          {error && (
            <div>
              <p>{error}</p>
            </div>
          )}
        </form>
      </div>{" "}
    </div>
  );
};

export default Register;
