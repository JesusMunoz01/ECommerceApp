import { useAuth0 } from "@auth0/auth0-react";
import { useUser } from "../../utils/userContext";
//import { useEffect, useState } from "react";

const Profile = () => {
    const { user, isAuthenticated } = useAuth0();
    const { userData } = useUser();

    return (
      <div className="h-18 mt-4 sm:h-32">
        {isAuthenticated ? 
          <div className="flex flex-col h-full items-start sm:flex-row sm:items-start sm:justify-start">
            <img src={user?.picture} alt={user?.name}/>
            <div className="flex flex-col ml-2 gap-2 h-full">
              <h2>Username: {user?.name}</h2>
              <p>Email: {user?.email}</p>
              <p>Plan: {userData?.plan}</p>
            </div>
            <br></br>
          </div>
         : 
          <div>
            <h2>Not Logged In</h2>
            <p>Please log in to see your account details</p>
          </div>
        }
      </div>
      );
};


export default Profile;