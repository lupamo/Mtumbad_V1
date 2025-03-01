import React, { useContext } from "react";
import { ShopContext } from "../context/ShopContext";

const AdminLogin = () => {
	const { navigate } = useContext(ShopContext);
	return (
		<form className="flex flex-col items-center w-[90%] sm:max-w-96 m-auto mt-14 gap-4 text-gray-800">
			<div className="inline-flex items-center gap-2 mb-2 mt-10">
				<p className="prata-regularr text-3xl">Admin Login</p>
				
			</div>
			<input type="email" className="w-full px-3 py-2 border border-gray-800 " placeholder="Email" required />
			<input type="password" className="w-full px-3 py-2 border border-gray-800 " placeholder="Password" required />

			<div className="w-full flex justify-between text-sm mt-[-8px]">
				<p className="cursor-pointer">Forgot Your Password?</p>
			</div>
			<button className="bg-black text-white font-light px-8 py-2" onClick={() => navigate('/admin')}>login</button>
		</form>
	);
}

export default AdminLogin;