import React, { useContext }from "react";
import Title from "./Title";
import { ShopContext } from "../context/ShopContext";

const AdminNav = () => {
	const { logout } = useContext(ShopContext);
	const handleLogout = () => {
		logout();
	}

	return(
		<div className="flex justify-between items-center py-4 border-b">
			<Title text1={'ADMIN'} text2={'DASHBOARD'} />
			<button className="bg-gray-600 text-white px-5 py-2 sm:px-7 sm:py-2 rounded-full  text-xs sm:text:sm" onClick={handleLogout}>Logout</button>
		</div>
	)

};


export default AdminNav;
