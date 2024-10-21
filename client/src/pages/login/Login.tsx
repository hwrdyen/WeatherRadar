import "./Login.scss";
import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AxiosError } from "axios";
import { AuthContext } from "../../context/AuthContext";
import { apiRequest } from "../../lib/apiRequest";

const Login = () => {
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const authContext = useContext(AuthContext);
  if (!authContext) {
    throw new Error(
      "useContext(AuthContext) must be used within an AuthContextProvider"
    );
  }
  const { updateUser } = authContext;

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const email = formData.get("email");
    const password = formData.get("password");

    try {
      const res = await apiRequest.post("/auth/login", {
        email,
        password,
      });
      updateUser(res.data);
      navigate("/");
    } catch (err) {
      // Check if the error is an instance of AxiosError
      if (err instanceof AxiosError) {
        // Access error message from the response data
        console.log(err.response?.data.message);
        setError(err.response?.data.message || "An error occurred.");
      } else {
        // Handle non-Axios errors
        console.log("Error:", err);
        setError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="Login__container">
      <form className="Login--form__container" onSubmit={handleSubmit}>
        <h1>Welcome back</h1>

        <input
          className="Login--formInput"
          name="email"
          type="text"
          placeholder="Email"
          required
        />
        <input
          className="Login--formInput"
          name="password"
          type="password"
          placeholder="Password"
          required
        />
        <button className="Login--formButton" disabled={isLoading}>
          Sign In
        </button>
        {error && <span className="Login__error">{error}</span>}
        <p>
          You {"don't"} have an account?{" "}
          <Link to="/register">Register here</Link>
        </p>
        <p>
          Return to Home Page <Link to={"/"}>Home</Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
