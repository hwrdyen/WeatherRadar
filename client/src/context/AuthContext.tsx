import { createContext, useState, useEffect, ReactNode } from "react";

// Define the shape of the user data and the context
interface User {
  id: string;
  username: string;
  email: string;
  avatar?: string;
}

interface AuthContextType {
  currentUser: User | null;
  isLoggedIn: boolean;
  updateUser: (data: User | null) => void;
}

// Create the context with a default value
export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

// Create a provider component
export const AuthContextProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser != null ? true : false;
  });

  // Function to update the current user state
  const updateUser = (data: User | null) => {
    setCurrentUser(data);
  };

  // Persist the current user to local storage when it changes
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem("user", JSON.stringify(currentUser));
      setIsLoggedIn(true);
    } else {
      localStorage.removeItem("user"); // Remove the item if the user is null
      setIsLoggedIn(false);
    }
  }, [currentUser]);

  return (
    <AuthContext.Provider value={{ currentUser, isLoggedIn, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};
