import { useState } from "react";
import { useDispatch } from "react-redux"; // Import dispatch to use redux
import { useNavigate } from "react-router-dom";
import apiClient from "../api/api";
import { setUser } from "../store/authSlice"; // Import your action

const Login = () => {
  const dispatch = useDispatch(); // Initialize dispatch
  const navigate = useNavigate();

  const [formErrors, setFormErrors] = useState({});
  const [input, setInput] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInput((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when typing
    if (formErrors[name]) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!input.email) {
      errors.email = "Email is required";
    }
    if (!input.password) {
      errors.password = "Password is required";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      const response = await apiClient.post(`/auth/loginUser`, input);

      if (response.data.success) {
        // Dispatch user to Redux store
        dispatch(setUser(response.data.data.user)); // Set user in Redux store
        navigate(`/profile/${response.data.data.user._id}`);
      }
    } catch (error) {
      console.error("Login error:", error);
      if (error.response && error.response.data) {
        setFormErrors({ general: error.response.data.message });
      } else {
        setFormErrors({ general: "An unexpected error occurred" });
      }
    }
  };

  return (
    <>
      <div>
        <h1>Login</h1>
        <div>
          <form onSubmit={onSubmit}>
            <label htmlFor="email">Email:</label>
            <input
              type="text"
              name="email"
              id="email"
              value={input.email}
              onChange={handleChange}
            />
            {formErrors.email && <p>{formErrors.email}</p>}
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              name="password"
              id="password"
              value={input.password}
              onChange={handleChange}
            />
            {formErrors.password && <p>{formErrors.password}</p>}
            <button type="submit">Login</button>
            {formErrors.general && <p>{formErrors.general}</p>}
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;

// navigate(`/profile/${response.data.data.user._id}`);
