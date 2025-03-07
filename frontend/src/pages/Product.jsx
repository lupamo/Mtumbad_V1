import React, { useContext, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import { assets } from "../assets/assets";
import RelatedProduct from "../components/RelatedProduct";

const Product = () => {

	const {productId} = useParams();
	const {products, currency, addToCart, loading } = useContext(ShopContext);
	const [productData , setProductData] = useState(false);
	const [image, setImage] = useState('');
	const [size, setSize] = useState('');
	const [isLoading, setIsLoading] = useState(true);

	// const fetchProductData = async () => {
	// 	products.map((item) => {
	// 		if(item.id === productId) {
	// 			setProductData(item)
	// 			setImage(item.image[0])
	// 			return null;
	// 		}
	// 	})
	// }

	useEffect(() => {
		const fetchProductData = async () => {
			setIsLoading(true);

			const existingProduct = products.find((item) => item.id === productId);
			if (existingProduct) {
				setProductData(existingProduct);
				setImage(existingProduct.image[0] || '');
				setIsLoading(false);
				return;
			}

			try {
				const response = await fetch(`${API_URL}/products/${productId}`);

				if (!response.ok) {
					throw new Error('Product not found');
				}
				const data = await response.json();

				const transformedProduct = {
					id: data.id,
					name: data.name,
					description: data.description,
					price: data.price,
					category: data.category_id,
					subCategory: data.subcategory_id,
					image: data.image_urls || [],
					sizes: data.sizes.map(size => ({
					  size: size.size,
					  quantity: size.stock
					})),
					bestselling: data.bestselling || false
				  };
				  setProductData(transformedProduct);
				  if (transformedProduct.image.length > 0) {
					setImage(transformedProduct.image[0]);
				  }
			} catch (error) {
				console.error('Error fetching product:', error);
			}finally {
				setIsLoading(false);
			}
		}
	}, [productId, products]);

	if (isLoading || !productData) {
		return (
		  <div className="flex justify-center items-center h-screen">
			<div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
		  </div>
		);
	}

	return (
		<div className="border-t-2 pt-10 transition-opacity ease-in duration-500 opacity-100">
		  <div className="flex gap-12 sm:gap-12 flex-col sm:flex-row">
			{/* image */}
			<div className="flex-1 flex flex-col-reverse gap-3 sm:flex-row">
			  <div className="flex sm:flex-col overflow-x-auto sm:overflow-y-scroll justify-between sm:justify-normal sm:w-[18.7%] w-full">
				{
				  productData.image.map((item, index) => (
					<img onClick={() => setImage(item)} src={item} key={index} className="w-[24%] sm:w-full sm:mb-3 flex-shrink-0 cursor-pointer" alt="thumbnails" />
				  ))
				}
			  </div>
			  <div className="w-full sm:w-[80%]">
				<img className="w-full h-110" src={image} alt="main" />
			  </div>
			</div>
	
			{/*---product info------ */}
			<div className="flex-1">
			  <h1 className="font-medium text-2xl mt-2">{productData.name}</h1>
			  <div className="flex flex-col mt-5">
				<p className="mt-5 text-2xl font-medium">{currency}{productData.price}</p>
				<p className="mt-5 text-gray-500 md:w-4/5">{productData.description}</p>
			  </div>
			  <div className="flex flex-col gap-4 my-8">
				<p>Select Size</p>
				<div className="flex gap-2">
				  {
					productData.sizes.map((item, index) => (
					  <button 
						onClick={() => setSize(item.size)} 
						className={`border py-2 px-4 bg-gray-100 cursor-pointer ${item.size === size ? 'border-orange-500': ''}`} 
						key={index}
					  >
						{item.size}
					  </button>
					))
				  }
				</div>
			  </div>
			  <button 
				onClick={() => addToCart(productData.id, size)}  
				className="bg-black text-white px-8 py-3 text-sm active:bg-gray-700"
			  >
				ADD TO CART
			  </button>
			  <hr className="mt-8 sm:w-4/5" />
			  <div className="text-sm text-gray-500 mt-5 flex flex-col gap-1">
				<p>100% original product</p>
				<p>Cash on delivery available</p>
			  </div>
			</div>
		  </div>
		  {/* ---Description-----*/}
		  <div className="mt-20">
			<div className="flex">
			  <b className="border px-5 py-3 text-sm">Description</b>
			</div>
			<div className="flex flex-col gap-4 border px-6 py-6 text-sm text-gray-500">
			  <p>{productData.description}</p>
			</div>
		  </div>
	
		  {/* ---You may also like---- */}
		  <RelatedProduct category={productData.category} subCategory={productData.subCategory} />
		</div>
	  );
}

export default Product