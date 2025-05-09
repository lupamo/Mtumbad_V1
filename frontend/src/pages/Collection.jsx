import React, { useEffect } from "react";
import { useState, useContext } from "react";
import { assets } from "../assets/assets";
import Title from "../components/Title";
import { ShopContext } from "../context/ShopContext";
import ProductItem from "../components/ProductItem";


const Collection = () => {
	const { products, search, showSearch } = useContext(ShopContext);
	const [showFilter, setShowFilter] = useState(false);
	const [filterProducts, setFilterProducts] = useState([]);
	const [category, setCategory] = useState([]);
	const [subcategory, setSubcategory] = useState([]);
	const [sortType, setSortType] = useState('relevant');


	const toggleCategory = (e) => {
		if (category.includes(e.target.value)) {
			setCategory(prev => prev.filter(item => item !== e.target.value));
		}
		else{
			setCategory(prev => [...prev, e.target.value]);
		}
	};

	const toggleSubcategory = (e) => {
		if(subcategory.includes(e.target.value)){
			setSubcategory(prev => prev.filter(item => item !== e.target.value));
		} else {
			setSubcategory(prev => [...prev, e.target.value]);
		}
	};

	const applyFilter = () => {
		let productsCopy = products.slice();

		if (showSearch && search) {
			productsCopy = productsCopy.filter(item => item.name.toLowerCase().includes(search.toLowerCase()));
		}

		if (category.length > 0) {
			productsCopy = productsCopy.filter(item => category.includes(item.category));
		}

		if (subcategory.length > 0) {
			productsCopy = productsCopy.filter(item => subcategory.includes(item.subcategory));
		}

		setFilterProducts(productsCopy);


	};
	
	const sortProducts = () => {
		let filterProductsCopy = filterProducts.slice();

		switch (sortType) {
			case 'low-high':
				setFilterProducts(filterProductsCopy.sort((a, b) => a.price - b.price));
				break;
			case 'high-low':
				setFilterProducts(filterProductsCopy.sort((a, b) => b.price - a.price));
				break;
			default:
				applyFilter();
				break;
		}
	};

	useEffect(() => {
		applyFilter();
	}, [category, subcategory, search, showSearch]);

	useEffect(() => {
		sortProducts();
	}, [sortType]);
	return (
		<div className="flex flex-col sm:flex-row gap-1 sm:gap-10 pt-10 birder-t">
			{/* fillter */}
			<div className="min-w-60">
				<p className="ny-2 text-xl flex items-center cursor-pointer gap-2">FILTERS
					<img onClick={() => setShowFilter(!showFilter)} className={`h-3 sm:hidden ${showFilter ? 'rotate-180' : '' }`} src={assets.drop} alt="dropdown" />
				</p>
				{/* Category Filter */}
				<div className={`border border-gray-300 pl-5 py-3 mt-6 ${showFilter ? '' : 'hidden'} sm:block`}>
					<p className="mb-3 text-sm font-medium">CATEGORY</p>
					<div className="flex flex-col gap-2 text-sm font-light text-gray-600">
						<p className="flex gap-2">
							<input className='w-3' type="checkbox" value={'Men'} onChange={toggleCategory}/>Men
						</p>
						<p className="flex gap-2">
							<input className='w-3' type="checkbox" value={'Women'} onChange={toggleCategory}/>Women
						</p>
						<p className="flex gap-2">
							<input className='w-3' type="checkbox" value={'Kids'} onChange={toggleCategory}/>Kids
						</p>
					</div>
				</div>

				{/* Subcategory */}
				<div className={`border border-gray-300 pl-5 py-3 my-5 ${showFilter ? '' : 'hidden'} sm:block`}>
					<p className="mb-3 text-sm font-medium">TYPE</p>
					<div className="flex flex-col gap-2 text-sm font-light text-gray-600">
						<p className="flex gap-2">
							<input className='w-3' type="checkbox" value={'topWear'} onChange={toggleSubcategory}/>TopWear
						</p>
						<p className="flex gap-2">
							<input className='w-3' type="checkbox" value={'bottomWear'} onChange={toggleSubcategory}/>Bottom Wear
						</p>
					</div>
				</div>
			</div>

			{/* Side */}
			<div className="flex-1">
				<div className="flex justify-between text-base sm:text-2xl mb-4">
					<Title text1={'ALL'} text2={'COLLECTIONS'} />
					{/* product sorting */}
					<select onChange={(e) => setSortType(e.target.value)} className="border-2 border-gray-300 text-sm px-2">
						<option value="relevant">Sort by: Relevant</option>
						<option value="low-high">Sort by: Low-High</option>
						<option value="high-low">Sort by: High-low</option>
					</select>
				</div>
				{/* Map */}
				<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 gap-y-6">
					{
						filterProducts.map((item, index) => (
							<ProductItem key={index} name={item.name} id={item.id} image={item.image} price={item.price} />
						))
					}
				</div>
			</div>
		</div>
	);
}

export default Collection;