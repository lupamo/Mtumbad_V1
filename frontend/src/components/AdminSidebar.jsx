import React from "react";
import { assets } from "../assets/assets";

const AdminSidebar = ({ setActiveComponent, activeComponent }) => {
	return(
		<div className="w-[20%] min-h-screen border-r-2">
			<div className="flex flex-col gap-4 pt-6 pl-[20%] text-[15px]">
				<button onClick={() => setActiveComponent('add')} className={`flex items-center gap-3 border border-gray-400 border-r-0 px-3 py-2 rounded-l ${activeComponent === 'add' ? 'bg-blue-100' : ''}`}>
					<img className="w-5 h-5" src={assets.add} alt="add" />
					<p className="hidden md:block">Add Product</p>
				</button>
				<button onClick={() => setActiveComponent('list')} className={`flex items-center gap-3 border border-gray-400 border-r-0 px-3 py-2 rounded-l ${activeComponent === 'list' ? 'bg-blue-100' : ''}`}>
					<img className="w-5 h-5" src={assets.list} alt="add" />
					<p className="hidden md:block">List Items</p>
				</button>
				<button onClick={() => setActiveComponent('placed-orders')} className={`flex items-center gap-3 border border-gray-400 border-r-0 px-3 py-2 rounded-l ${activeComponent === 'orders' ? 'bg-blue-100' : ''}`}>
					<img className="w-5 h-5" src={assets.orders} alt="add" />
					<p className="hidden md:block">Orders</p>
				</button>
			</div>
		</div>

	);
};
export default AdminSidebar;