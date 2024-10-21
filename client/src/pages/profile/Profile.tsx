import "./Profile.scss";
import { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserProfile } from "../../config/user-config";
import { apiRequest } from "../../lib/apiRequest";
import { AuthContext } from "../../context/AuthContext";
import { AxiosError } from "axios";

const Profile = () => {
  const [error, setError] = useState("");
  const [profileData, setProfileData] = useState<UserProfile | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const authContext = useContext(AuthContext);
  if (!authContext) {
    throw new Error(
      "useContext(AuthContext) must be used within an AuthContextProvider"
    );
  }
  const { updateUser, currentUser } = authContext;

  // fetch Profile
  const fetchProfileInfo = async () => {
    try {
      const response = await apiRequest.get(`/user/my-profile`);
      // Check if the response indicates no team found
      console.log(response.data);
      if (response.data) {
        setProfileData(response.data); // Set the team data if found
      } else {
        setError("No user was associated with this ID."); // Set error message if no team found
      }
    } catch (err) {
      console.error("Failed to fetch user data", err);
      setError("Failed to fetch user data."); // Set error message on fetch failure
    } finally {
      setLoading(false); // Stop loading when done
    }
  };

  useEffect(() => {
    fetchProfileInfo();
  }, [currentUser]);

  // Logout
  const [logoutLoading, setLogoutLoading] = useState(false);
  const handleLogout = async () => {
    setLogoutLoading(true);

    try {
      await apiRequest.post("/auth/logout");
      updateUser(null);
      navigate("/");
    } catch (err) {
      // Check if the error is an instance of AxiosError
      if (err instanceof AxiosError) {
        // Access error message from the response data
        console.log(err.response?.data.message);
      } else {
        // Handle non-Axios errors
        console.log("Error:", err);
      }
    } finally {
      setLogoutLoading(false);
    }
  };

  // Delete
  const handleDelete = async () => {
    try {
      setDeleteLoading(true);
      await apiRequest.delete("/user/delete-profile");
      await updateUser(null);
      navigate("/");
    } catch (err) {
      console.error("Failed to fetch team data", err);
      setError("Failed to fetch team data."); // Set error message on fetch failure
    } finally {
      setDeleteLoading(false); // Stop loading when done
    }
  };

  if (loading) {
    return <div>Loading...</div>; // Show loading indicator while fetching data
  }

  if (error) {
    return (
      <div>
        <div>{error}</div>
        <Link to={"/"}>Home</Link>

        <Link to={"/login"}>Login</Link>
      </div>
    ); // Show error message if there was an issue
  }

  return (
    <div className="Profile__container">
      {profileData ? (
        <div className="Profile--info__container">
          <h1>User Profile</h1>
          {profileData.avatar ? (
            <img src={profileData.avatar} alt="User Avatar" />
          ) : (
            <img
              src={"/user-avatar.png"}
              alt="Default Avatar"
              style={{ width: "50px", height: "50px" }}
            />
          )}
          <div>User Id: {profileData.id}</div>
          <div>User name: {profileData.username}</div>
          <div>User email: {profileData.email}</div>
        </div>
      ) : (
        <div>Loading...</div> // Show loading indicator while fetching data
      )}
      <div className="Profile--button__container">
        <button
          className="Profile--button"
          disabled={logoutLoading}
          onClick={handleLogout}
        >
          Logout
        </button>
        <button
          className="Profile--button"
          onClick={handleDelete}
          disabled={deleteLoading}
        >
          Delete User
        </button>
      </div>
    </div>
  );
};

export default Profile;
