import { createContext, useState, useContext } from 'react';

type UserType = {
    email: string;
    name: string;
} | null;

const UserContext = createContext<{ 
    user: UserType; 
    setUser: (user: UserType | null) => void 
}>({
    user: null,
    setUser: () => {}
});

export const UserProvider = ({ children }: {children: React.ReactNode}) => {
  const [user, setUser] = useState<UserType>(null);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);