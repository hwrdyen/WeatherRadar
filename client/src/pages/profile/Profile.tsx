import "./Profile.scss";
import { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserProfile } from "../../config/user-config";
import { apiRequest } from "../../lib/apiRequest";
import { AuthContext } from "../../context/AuthContext";
import { AxiosError } from "axios";
import { useSnackbar } from "notistack";

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
      if (response.data) {
        setProfileData(response.data);
      } else {
        setError("No user was associated with this ID.");
      }
    } catch (err) {
      console.error("Failed to fetch user data", err);
      setError("Failed to fetch user data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfileInfo();
  }, [currentUser]);

  // Logout
  const [logoutLoading, setLogoutLoading] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const handleLogout = async () => {
    setLogoutLoading(true);

    try {
      await apiRequest
        .post("/auth/logout")
        .then(() => {
          updateUser(null);
          enqueueSnackbar("Logout Successfully!", {
            variant: "success",
          });
          navigate("/");
        })
        .catch((error) => {
          enqueueSnackbar("Error", {
            variant: "error",
          });
          console.log(error);
        });
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
    setDeleteLoading(true);
    await apiRequest
      .delete("/user/delete-profile")
      .then(() => {
        updateUser(null);
        enqueueSnackbar("Delete User Successfully!", {
          variant: "success",
        });
        navigate("/");
      })
      .catch((error) => {
        enqueueSnackbar("Error", {
          variant: "error",
        });
        setError("Something went wrong!");
        console.log(error);
      })
      .finally(() => {
        setDeleteLoading(false);
      });
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
