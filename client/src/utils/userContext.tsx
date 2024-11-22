import { createContext, useState, useContext } from 'react';

type UserType = {
    message: string;
    plan: string;
    brands: { name: string, description: string, image: string, id: number, brandOwner?: string }[];
    subEndDate: string | null;
    subActive: boolean | null;
    reviews?: {
      productId: number
    }[];
} | null;

const UserContext = createContext<{ 
    userData: UserType; 
    setUser: (user: UserType | null) => void 
}>({
    userData: null,
    setUser: () => {}
});

export const UserProvider = ({ children }: {children: React.ReactNode}) => {
  const [userData, setUser] = useState<UserType>(null);

  return (
    <UserContext.Provider value={{ userData, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);