import { useState } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../api/api";

const Register = () => {
  const navigate = useNavigate();

  const [formErrors, setFormErrors] = useState({});
  const [input, setInput] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
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
    if (!input.name) {
      errors.name = "Name is required";
    }
    if (!input.email) {
      errors.email = "Email is required";
    }
    if (!input.password) {
      errors.password = "Password is required";
    }
    if (!input.phone) {
      errors.phone = "Phone number is required";
    }

    // Optional: More specific validation (e.g., for email format)
    const emailRegex = /\S+@\S+\.\S+/;
    if (input.email && !emailRegex.test(input.email)) {
      errors.email = "Please enter a valid email address.";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      const response = await apiClient.post(`/auth/registerUser`, input);

      if (response.data.success) {
        // Successfully registered, now redirect to profile page
        navigate("/profile"); // Redirect to profile
      }
    } catch (error) {
      console.error("Registration error:", error);
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
        <h1>Register</h1>
        <div>
          {formErrors.general && (
            <p style={{ color: "red" }}>{formErrors.general}</p>
          )}
          <form onSubmit={onSubmit}>
            <label htmlFor="name">Name:</label>
            <input
              type="text"
              name="name"
              id="name"
              value={input.name}
              onChange={handleChange}
            />
            {formErrors.name && <p>{formErrors.name}</p>}
            <br />

            <label htmlFor="phone">Phone:</label>
            <input
              type="text"
              name="phone"
              id="phone"
              value={input.phone}
              onChange={handleChange}
            />
            {formErrors.phone && <p>{formErrors.phone}</p>}
            <br />

            <label htmlFor="email">Email:</label>
            <input
              type="text"
              name="email"
              id="email"
              value={input.email}
              onChange={handleChange}
            />
            {formErrors.email && <p>{formErrors.email}</p>}
            <br />

            <label htmlFor="password">Password:</label>
            <input
              type="password"
              name="password"
              id="password"
              value={input.password}
              onChange={handleChange}
            />
            {formErrors.password && <p>{formErrors.password}</p>}

            <br />
            <button type="submit">Register</button>
          </form>
        </div>
      </div>
    </>
  );
};

export default Register;
