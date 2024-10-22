import "./Register.scss";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { apiRequest } from "../../lib/apiRequest";
import { v4 as uuidv4 } from "uuid";
import { useSnackbar } from "notistack";

const Register = () => {
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const id = uuidv4();
    const username = formData.get("username");
    const email = formData.get("email");
    const password = formData.get("password");

    await apiRequest
      .post("/auth/register", {
        id,
        username,
        email,
        password,
      })
      .then(() => {
        enqueueSnackbar("Register Successfully!", {
          variant: "success",
        });
        navigate("/login");
      })
      .catch((error) => {
        enqueueSnackbar("Error", {
          variant: "error",
        });
        setError("Something went wrong!");
        console.log(error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <div className="Register__container">
      <form className="Register--form__container" onSubmit={handleSubmit}>
        <h1>Create Your Account</h1>
        <input
          className="Register--formInput"
          name="username"
          type="text"
          placeholder="User Name"
          required
        />
        <input
          className="Register--formInput"
          name="email"
          type="text"
          placeholder="Email"
          required
        />
        <input
          className="Register--formInput"
          name="password"
          type="password"
          placeholder="Password"
          required
        />

        <button className="Register--formButton" disabled={isLoading}>
          Register
        </button>
        {error && <span className="Register__error">{error}</span>}
        <p>
          Already have an account? <Link to="/login">Sign In</Link>
        </p>
        <p>
          Return to Home Page <Link to={"/"}>Home</Link>
        </p>
      </form>
    </div>
  );
};

export default Register;
