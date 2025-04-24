import { createContext, useEffect, useState } from "react";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userState, setUserState] = useState(() => {
    const storedUser = localStorage.getItem('token');
    return storedUser 
  });

  useEffect(() => {
    if (userState) {
      localStorage.setItem("token", userState);
    } else {
      localStorage.removeItem("token");
    }
  }, [userState]);

  return (
    <UserContext.Provider value={{ userState, setUserState }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
