import { useQuery } from '@tanstack/react-query';
import { useAuth0 } from '@auth0/auth0-react';

export const useUserProductsQuery = (userId: string | undefined) => {
  // if (!userId) return { data: undefined, isLoading: false, error: undefined };
  const { getAccessTokenSilently } = useAuth0();

  return useQuery({
    queryKey: ['userProducts', userId],
    queryFn: async () => {
      const token = await getAccessTokenSilently();
      const response = await fetch(`${import.meta.env.VITE_API_URL}/products/user/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      return data;
    },
    enabled: !!userId,
  });
};