import React from "react";
import { useContext } from "react";
import { ShopContext } from "../context/ShopContext";

const LatestCollection = () => {

	const { products } = useContext(ShopContext);
	console.log(products);

	return (
		<div>
			<h1>lar</h1>
		</div>
	);
};

export default LatestCollection;