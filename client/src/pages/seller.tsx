import { useState } from "react";
import ProductForm from "../components/Products/productForm";
import Sidebar from "../components/Sidebar/sidebar";

const SellPage = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => {
      setIsSidebarOpen(!isSidebarOpen);
    };

    return (
        <div className="flex gap-2 w-full" style={{ height: 'calc(100vh - 6rem)' }}>
        <div className="flex flex-col h-full">
          {!isSidebarOpen && <button onClick={toggleSidebar}>Toggle Sidebar</button>}
            <Sidebar isOpen={isSidebarOpen} toggle={toggleSidebar} />
        </div>
            <h1>Sell Page</h1>
            <p>Create A Product to Sell</p>
            <ProductForm />
        </div>
    );
};

export default SellPage;