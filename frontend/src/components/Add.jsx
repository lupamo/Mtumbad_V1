import React, { useState } from "react";
import { assets } from "../assets/assets";

const Add = () => {
	const [image1, setImage1] = useState(false);
	const [image2, setImage2] = useState(false);
	const [image3, setImage3] = useState(false);
	const [image4, setImage4] = useState(false);
	const [productName, setProductName] = useState('');
	const [productDescription, setProductDescription] = useState('');
	const [productCategory, setProductCategory] = useState('Men');
	const [productSubCategory, setProductSubCategory] = useState('topWear');
	const [productPrice, setProductPrice] = useState('');
	const [productSizes, setProductSizes] = useState(['', '', '', '', '']);
	const [bestSelling, setBestSelling] = useState(false);
	const [stock, setStock] = useState('');
	

	// Handle size input changes
	const handleSizeChange = (index, value) => {
		const newSizes = [...productSizes];
		newSizes[index] = value;
		setProductSizes(newSizes);
	};

	// This will filter out empty sizes before submission
	const getFilteredSizes = () => {
		return productSizes.filter(size => size !== '');
	};


	// Create form data with all product info
	const handleSubmit = (e) => {
		e.preventDefault();
		
		// Create form data with all product info
		const productData = {
			name: productName,
			description: productDescription,
			category: productCategory,
			subCategory: productSubCategory,
			price: productPrice,
			sizes: getFilteredSizes(), // Only include non-empty sizes
			bestSelling: bestSelling,
			stock: stock,
			// Handle images separately if needed
		};
		console.log(productData);
	};

	return(
		<form onSubmit={handleSubmit} className="flex flex-col w-full items-start gap-4">
			<div>
				<p>Upload Image</p>
				<div className="flex gap-2">
					<label className="w-20 h-21 rounded-sm  border border-gray-300 object-cover overflow-hidden" htmlFor="image1">
						<img className="object-cover" src={! image1? assets.upload : URL.createObjectURL(image1)} alt="upload" />
						<input onChange ={(e) => setImage1(e.target.files[0])} type="file" id="image1" hidden/>
					</label>
					<label className="w-20 h-21 rounded-sm border border-gray-300 object-cover overflow-hidden" htmlFor="image2">
						<img src={! image2? assets.upload : URL.createObjectURL(image2)} alt="upload" />
						<input onChange ={(e) => setImage2(e.target.files[0])} type="file" id="image2" hidden/>
					</label>
					<label className="w-20 h-21 rounded-sm border border-gray-300 object-cover overflow-hidden" htmlFor="image3">
						<img src={! image3? assets.upload : URL.createObjectURL(image3)} alt="upload" />
						<input onChange ={(e) => setImage3(e.target.files[0])} type="file" id="image3" hidden/>
					</label>
					<label className="w-20 h-21 rounded-sm border border-gray-300 object-cover overflow-hidden" htmlFor="image4">
						<img src={! image4? assets.upload : URL.createObjectURL(image4)} alt="upload" />
						<input onChange ={(e) => setImage4(e.target.files[0])} type="file" id="image4" hidden/>
					</label>
				</div>
			</div>
			<div className="w-full">
				<p className="mb-2">Product Name</p>
				<input onChange={(e)=>setProductName(e.target.value)} value={productName} className="w-full border rounded-sm border-gray-300 max-w-[700px] px-3 py-2" type="text" placeholder="Type Here" required />
			</div>
			<div className="w-full">
				<p className="mb-2">Product Description</p>
				<textarea onChange={(e)=>setProductDescription(e.target.value)} value={productDescription} className="w-full border rounded-sm border-gray-300 max-w-[700px] px-3 py-2" type="text" placeholder="Write Here" required />
			</div>
			<div className="flex flex-col sm:flex-row gap-2 w-full sm:gap-8">
				<div>
					<p className='mb-2'>Product Category</p>
					<select value={productCategory} onChange={(e)=>setProductCategory(e.target.value)} className="w-full px-3 py-2 border rounded-sm border-gray-300 max-w-[100px]">
						<option value="Men">Men</option>
						<option value="Women">Women</option>
						<option value="Kids">Kids</option>
					</select>

				</div>
				<div>
					<p className='mb-2'>Product SubCategory</p>
					<select value={productSubCategory} onChange={(e)=>setProductSubCategory(e.target.value)} className="w-full px-3 py-2 border rounded-sm border-gray-300 max-w-[120px]">
						<option value="topWear">TopWear</option>
						<option value="bottomWear">BottomWear</option>
					</select>
				</div>
				<div>
					<p onChange={(e)=>setProductPrice(e.target.value)} value={productPrice} className='mb-2'>Product Price</p>
					<input className="w-full px-3 py-2 border rounded-sm border-gray-300 max-w-[120px]" type="Number" placeholder="200" />
				</div>
				<div>
					<p className="mb-3">Enter Product Sizes</p>
					<div className="flex gap-2">
						{[0, 1, 2, 3, 4].map((index) => (
							<div key={index}>
								<label htmlFor={`size${index+1}`}>
									<input 
										className="w-10 h-8 text-center rounded-sm border border-gray-300" 
										type="text" 
										id={`size${index+1}`}
										value={productSizes[index]}
										onChange={(e) => handleSizeChange(index, e.target.value)}
									/>
								</label>
							</div>
						))}
					</div>
				</div>
			</div>
			<div className="flex items-center gap-2 mt-2">
				<input checked={bestSelling} onChange={() => setBestSelling(prev => !prev)} type="checkbox" id="bestSelling" />
				<label  className="cursor-pointer" htmlFor="bestSelling">Add to best selling</label>
			</div>
			<div>
				<input value={stock} onChange={(e) => setStock(e.target.value)} type="Number" id="stock" />
				<label htmlFor="stock"></label>
			</div>
			<button type="submit" className="w-28 mt-4 bg-black text-white">ADD </button>
		</form>
	)

};


export default Add;
