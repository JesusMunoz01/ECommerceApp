import Profile from "../components/Auth/auth0-profile";
import UserProductList from "../components/Products/userProductList";

const AccountPage = () => {

  return (
    <div className="flex gap-2 w-1/2" style={{ height: 'calc(100vh - 6rem)' }}>
      <div className="mt-2 w-11/12">
        <h1 className="text-2xl border-b border-slate-500 w-full mb-2">Account Details</h1>
        <Profile />
        <div className="flex flex-row w-12/12 mt-4">
          <div className="mt-2 w-6/12">
            {/* <h2 className="text-xl border-b border-slate-500 w-full">Your Products</h2>
            <ul className="flex flex-col mt-4 gap-4">
              <li>Product 1</li>
              <li>Product 2</li>
            </ul> */}
            <h2 className="text-xl border-b border-slate-500 w-full">Your Products</h2>
            <UserProductList />
          </div>
          <div className="mt-2 ml-2 w-6/12">
            <h2 className="text-xl border-b border-slate-500 w-full">Your Brand</h2>
            <ul className="flex flex-col mt-4 gap-4">
              <li>Product 1</li>
              <li>Product 2</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AccountPage;