import { useAuth0 } from "@auth0/auth0-react";
//import { useEffect, useState } from "react";

const Account = () => {
    const { user, isAuthenticated, getAccessTokenSilently } = useAuth0();
    //const [userMetadata, setUserMetadata] = useState(null);

    const sendRequest = async () => {
        try {
            const token = await getAccessTokenSilently();
            const response = await fetch(`${import.meta.env.VITE_API_URL}/users/create`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ 
                  data: user?.sub,
                  test: "test"
                }),
            });

            const responseData = await response.json();
            console.log(responseData);

        } catch (error) {
            console.error(error);
        }
    };

    return (
      <div>
        {isAuthenticated ? 
          <div>
            <img src={user?.picture} alt={user?.name} />
            <h2>{user?.name}</h2>
            <p>{user?.email}</p>
            <h3>User Metadata</h3>
            {/* {userMetadata ? (
              <pre>{JSON.stringify(userMetadata, null, 2)}</pre>
              ) : (
                "No user metadata defined"
                )} */}
            <br></br>
          </div>
         : 
          <div>
            <h2>Not Logged In</h2>
            <p>Please log in to see your account details</p>
          </div>
        }
        <button onClick={sendRequest}>Send Request</button>
      </div>
      );
};


export default Account;