import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "./Title";
import ProductItem from "./ProductItem";


const BestSelling = () => {
	const {products} = useContext(ShopContext);
	const [bestSelling, setBestSelling] = useState([]);

	useEffect(() => {
		const bestProduct = products.filter((item) => (item.bestSelling));
		setBestSelling(bestProduct.slice(0, 5));
	}, [])

	return (
		<div className="my-10">
			<div className="text-center text-3xl py-8">
				<Title text1={'TOP'} text2={'SELLING Products'} />
				<p className="w-3/4 m-auto text-xs sm:text-sm md:text-base text-gray-600">
					Our best selling products are now available. Get them while they last.
				</p>
			</div>
			<div className="grid grid-cols-2 sm:grid-cols-1 md:grid-cols-5 gap-4 gap-y-6">
				{
					bestSelling.map((item, index) => (
						<ProductItem key={index} id={item.id} name={item.name} image={item.image} price={item.price} />
					))
				}
			</div>
		</div>
	)
};

export default BestSelling;