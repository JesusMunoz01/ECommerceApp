import Profile from "../components/Auth/auth0-profile";
import UserBrandPagesList from "../components/Brands/userBrandList";
import UserProductList from "../components/Products/userProductList";

const AccountPage = () => {

  return (
    <div className="flex gap-2 w-11/12 mr-4">
      <div className="mt-2 w-full">
        <h1 className="text-2xl border-b border-slate-500 w-full mb-4">Account Details</h1>
        <Profile />
        <div className="flex flex-row w-12/12 mt-4">
          <div className="mt-2 w-6/12 gap-4 flex flex-col">
            <h2 className="text-xl border-b border-slate-500 w-full">Your Products</h2>
            <UserProductList />
          </div>
          <div className="mt-2 ml-2 w-6/12 gap-4 flex flex-col">
            <h2 className="text-xl border-b border-slate-500 w-full">Your Brand</h2>
            <UserBrandPagesList />
          </div>
        </div>
      </div>
    </div>
  );
}

export default AccountPage;