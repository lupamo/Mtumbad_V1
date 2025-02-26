import React from "react";
import { assets } from "../assets/assets";

const Footer = () => {
	return(
		<div>
			
			<div className="flex flex-col bg-dark-gray sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm">
				<div>
					<img src={assets.logo} alt="logo" className="mb-5 w-32" />
					<p className="w-full md:w-2/3 text-gray-700">
					Our brand is built on the principles of self-expression, quality craftsmanship, and sustainability, ensuring that every piece you wear tells a story of confidence and authenticity. Whether you're looking for timeless classics, bold new trends, or ethically sourced materials, we strive to bring you a diverse collection that speaks to your unique style.
					</p>
				</div>
				<div>
					<p className="tet-xl font-bold mb-5">COMPANY</p>
					<ul className="flex flex-col gap-1 text-gray-600">
						<li>Home</li>
						<li>About Us</li>
						<li>Delivery</li>
						<li>Our Policy</li>
					</ul>
				</div>
				<div>
					<p className="text-xl font-bold mb-5">GET IN TOUCH</p>
					<ul className="flex flex-col gap-1 text-gray-600">
						<li>+2547-14380595</li>
						<li>iandikenya@gmail.com</li>

					</ul>
				</div>
			</div>
			<div>
				<hr />
				<p className="py-5 text-sm text-center">copyright 2025@ I and I Kenya</p>
			</div>

		</div>
	)

};
export default Footer;