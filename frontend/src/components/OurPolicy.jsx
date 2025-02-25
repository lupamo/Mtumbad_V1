import React from "react";
import { assets } from "../assets/assets";
const OurPolicy = () => {
	return (
		<div className="flex flex-col sm:flex-row justify-around gap-6 text-center py-20 text-xs sm:text-smm md:text-base text-gray-700">
			<div className="border border-1 bg-gray border-gray-200 p-5 rounded w-80 text-center">
				<img src={assets.box} alt="" className="w-12 m-auto mb-5 " />
				<p className="font-semibold">Easy Exchange policy</p>
				<p className="text-gray-400">Hassle free Policy</p>
			</div>
			<div className="border border-1 bg-gray border-gray-200 p-5 rounded w-80">
				<img src={assets.bike} alt="" className="w-12 m-auto mb-5" />
				<p className="font-semibold">Fast Deliveries</p>
				<p className="text-gray-400">Fast Delivery services</p>
			</div>
			<div className="border border-1 bg-gray border-gray-200 p-5 rounded w-80">
				<img src={assets.kenya} alt="" className="w-12 m-auto mb-5" />
				<p className="font-semibold">Country Wide</p>
				<p className="text-gray-400">We deliver our services country wide</p>
			</div>
		</div>
	)
};

export default OurPolicy;