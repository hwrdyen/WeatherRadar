import { Link } from "react-router-dom";
import "./Navbar.scss";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

const Navbar = () => {
  const authContext = useContext(AuthContext);
  if (!authContext) {
    throw new Error(
      "useContext(AuthContext) must be used within an AuthContextProvider"
    );
  }
  const { isLoggedIn, currentUser } = authContext;

  return (
    <div className="Navbar__container">
      <Link className="Navbar--title" to={"/"}>
        WeatherRadar
      </Link>
      {isLoggedIn ? (
        <Link className="Navbar--profileimgLink" to={"/my-profile"}>
          <img
            className="Navbar--profileimg"
            src={currentUser?.avatar || "/user-avatar.png"}
          />
        </Link>
      ) : (
        <Link className="Navbar--login" to={"/login"}>
          Login
        </Link>
      )}
    </div>
  );
};

export default Navbar;
