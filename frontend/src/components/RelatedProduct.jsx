import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "./Title";
import Product from "../pages/Product";
import ProductItem from "./ProductItem";


const RelatedProduct = ({ category, subCategory }) => {
	const {products} = useContext(ShopContext);
	const [relatedProducts, setRelatedProducts] = useState([]);

	useEffect(() => {
		if (products.length > 0) {
			let productsCopy = products.slice();
			productsCopy = productsCopy.filter((item) => category === item.category);
			productsCopy = productsCopy.filter((item) => subCategory === item.subCategory);

			setRelatedProducts(productsCopy.slice(0, 5));
		}
	}, [products]);

	return (
		<div className="my-24">
			<div className="text-center text-3xl py-2">
				<Title text1={'RELATED'} text2={'PRODUCTS'} />
			</div>
			<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-5">
				{relatedProducts.map((item, index) => (
					<ProductItem key={index} id={item.id} name={item.name} price={item.price} image={item.image} />
				))}
			</div>
		</div>
	)

};

export default RelatedProduct;