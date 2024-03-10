import { useAuth0 } from "@auth0/auth0-react";
import { useEffect, useState } from "react";

const Test = () => {
    const { user, isAuthenticated, getAccessTokenSilently } = useAuth0();
    const [userMetadata, setUserMetadata] = useState(null);

    useEffect(() => {
        const getUserMetadata = async () => {
      
          try {
            const accessToken = await getAccessTokenSilently();
            const userDetailsByIdUrl = `${import.meta.env.VITE_API_URL}`;
      
            const metadataResponse = await fetch(userDetailsByIdUrl, {
              headers: {
                authorization: `Bearer ${accessToken}`,
              },
            });
      
            const responseData = await metadataResponse.json();
      
            console.log(responseData);
          } catch (e: any) {
            console.log(e.message);
          }
        };
      
        getUserMetadata();
      }, [getAccessTokenSilently, user?.sub]);

    const sendRequest = async () => {
        try {
            const token = await getAccessTokenSilently();
            console.log(token);
            const response = await fetch(`${import.meta.env.VITE_API_URL}/protected`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const responseData = await response.json();
            console.log(responseData);

        } catch (error) {
            console.error(error);
        }
    };

    return (
      <div>
        {isAuthenticated && (
          <div>
            <img src={user?.picture} alt={user?.name} />
            <h2>{user?.name}</h2>
            <p>{user?.email}</p>
            <h3>User Metadata</h3>
            {userMetadata ? (
              <pre>{JSON.stringify(userMetadata, null, 2)}</pre>
              ) : (
                "No user metadata defined"
                )}
            <br></br>
          </div>
        )}
        <button onClick={sendRequest}>Send Request</button>
      </div>
      );
};


export default Test;