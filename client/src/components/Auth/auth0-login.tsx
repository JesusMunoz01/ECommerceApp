import { useAuth0 } from "@auth0/auth0-react";

const LoginButton = () => {
  const { loginWithRedirect } = useAuth0();

  return <button className="flex w-22 h-8 items-center justify-center" onClick={() => loginWithRedirect()}>Log In</button>;
};

export default LoginButton;