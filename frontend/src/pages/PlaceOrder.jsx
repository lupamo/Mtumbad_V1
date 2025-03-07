import React, { useContext, useState } from "react";
import Title from "../components/Title";
import Cart from "./Cart";
import CartTotal from "../components/CartTotal";
import { ShopContext } from "../context/ShopContext";
import { assets } from "../assets/assets";

const PlaceOrder = () => {

	const [method, setMethod] = useState('cod');
	const {navigate} = useContext(ShopContext);

	return (
		<div className="flex flex-col sm:flex-row justify-between gap-4 pt-5 sm:pt-14 min-h-[80vh] border-t">
			{/* left side */}
			<div className="flex flex-col gap-4 w-full sm:max-w-[480px]">
				<div className="text-xl sm:text-2xl my-3">
					<Title text1={'DELIVERY'} text2={'INFORMATION'} />
				</div>
				<div className="flex gap-3">
					<input className="border border-gray-300 rounded py-1.5 w-full px-3.5" type="text" placeholder="First Name" required />
					<input className="border border-gray-300 rounded py-1.5 w-full px-3.5" type="text" placeholder="Last Name" required />
				</div>
				<input className="border border-gray-300 rounded py-1.5 w-full px-3.5" type="email" placeholder="Email adreess" required />
				<input className="border border-gray-300 rounded py-1.5 w-full px-3.5" type="text" placeholder="Street" required />
				<div className="flex gap-3">
					<input className="border border-gray-300 rounded py-1.5 w-full px-3.5" type="text" placeholder="Location" />
					<input className="border border-gray-300 rounded py-1.5 w-full px-3.5" type="text" placeholder="County" />
				</div>
				<div className="flex gap-3">
					<input className="border border-gray-300 rounded py-1.5 w-full px-3.5" type="number" placeholder="Zip code" />
					<input className="border border-gray-300 rounded py-1.5 w-full px-3.5" type="text" placeholder="Counrty" />
				</div>
				<input className="border border-gray-300 rounded py-1.5 w-full px-3.5" type="number" placeholder="Phone" required />

			</div>

			{/* right side */}
			<div className="mt-8">
				<div className="mt-8 min-w-80">
					<CartTotal />
				</div>
				<div className="mt-12 w-full">
					<Title text1={'PAYMENT'} text2={'METHOD'} />
					{/* ----payment------ */}
					<div className="flex gap-3 flex-col lg:flex-row">
						<div onClick={() => setMethod('mpesa')} className="flex items-center gap-3 border border-gray-200 p-2 px-3 cursor-pointer">
							<p className={`min-w-3.5 h-3.5 border  border-gray-200 rounded-full ${method === 'mpesa' ? 'bg-green-400' : ''}`}></p>
							<img src={assets.mpesa} className="h-5 mx-4 w-15" />
						</div>
						{/* <div onClick={() => setMethod('paypal')} className="flex items-center gap-3 border border-gray-200 p-2 px-3 cursor-pointer">
							<p className={`min-w-3.5 h-3.5 border  border-gray-200 rounded-full ${method === 'paypal' ? 'bg-green-400' : ''}`}></p>
							<img src={assets.paypal} className="h-5 mx-4 w-15" />
						</div> */}
						<div onClick={() => setMethod('cod')} className="flex items-center gap-3 border border-gray-200 p-2 px-3 cursor-pointer">
							<p className={`min-w-3.5 h-3.5 border  border-gray-200 rounded-full ${method === 'cod' ? 'bg-green-400' : ''}`}></p>
							<p className="tex-gray-500 text-sm font-medium mx-4">CASH ON DELIVERY</p>
						</div>
					</div>
					<div className="w-full text-end mt-8">
						<button onClick={() => navigate('/orders')} className="bg-black  text-white px-16 py-3 text-sm">PLACE ORDER</button>
					</div>
				</div>
			</div>
		</div>
	);
}

export default PlaceOrder;