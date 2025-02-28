import React from "react";
import Title from "../components/Title";
import { assets } from "../assets/assets";

const About = () => {
	return (
		<div>
			<div className="text-2xl text-center pt-8 border-t">
			<Title text1={'ABOUT'} text2={'US'} />
		</div>
		<div className="my-10 flex flex-col md:flex-row gap-16">
			<img className="w-full md:max-w-[450px]" src={assets.img_13} alt="about" />
			<div className="flex flex-col justify-center gap-6 md:w-2/4 text-gray-600">
				<p>Welcome to I and I, your premier online destination for authentic, stylish, and culturally inspired fashion and lifestyle products in Kenya. At I and I, we celebrate individuality and self-expression through our carefully curated collections that blend modern trends with timeless African heritage.</p>
				
				<b className="text-gray-800">Our Mission</b>
				<p>Our mission is to empower you to embrace your unique identity while staying connected to your roots. From vibrant clothing and accessories to thoughtfully designed home goods, every item in our store tells a story of craftsmanship, quality, and pride. Whether you're looking to elevate your wardrobe or find the perfect gift, I and I is here to inspire and delight. Join us on this journey of style, culture, and community – because at I and I, it's all about you.</p>
			</div>
		</div>
		<div className="text-xl py-4">
			<Title text1={'WHY'} text2={'CHOOSE US'} />

		</div>
		<div className="flex flex-col md:flex-row text-sm mb-20">
			<div className="border px-10 md:px-16  py-18 sm:py-20 flex flex-col gap-5">
				<b>Quality Assurance:</b>
				<p className="text-gray-600">At I and I, we are committed to delivering excellence in every product you purchase. Our Quality Assurance process is designed to ensure that every item meets the highest standards of craftsmanship, durability, and authenticity.</p>
			</div>
			<div className="border px-10 md:px-16  py-18 sm:py-20 flex flex-col gap-5">
				<b>Convinence:</b>
				<p className="text-gray-600">At I and I, we understand that your time is precious, which is why we’ve designed our online store to make your shopping experience as seamless and hassle-free as possible. With just a few clicks, you can explore our wide range of stylish and culturally inspired products from the comfort of your home or on the go.</p>

			</div>
			<div className="border px-10 md:px-16  py-18 sm:py-20 flex flex-col gap-5">
				<b>Exceptional customer service:</b>
				<p className="text-gray-600">At I and I, your satisfaction is our top priority. We are committed to providing an unparalleled shopping experience, from the moment you browse our collections to the day your order arrives at your doorstep.</p>
				
			</div>
		</div>
		</div>
	);
}

export default About;