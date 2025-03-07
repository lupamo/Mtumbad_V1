import React, { useState, useContext, useEffect } from "react";
import { assets } from "../assets/assets";
import { ShopContext } from "../context/ShopContext";
import { toast } from 'react-toastify';

const Add = () => {
	// const { API_URL } = useContext(ShopContext);
	const [images, setImages] = useState([null, null, null, null]);
	const [productName, setProductName] = useState('');
	const [productDescription, setProductDescription] = useState('');
	const [categories, setCategories] = useState([]);
    const [subcategories, setSubcategories] = useState([]);
	const [productCategory, setProductCategory] = useState('');
    const [productSubCategory, setProductSubCategory] = useState('');
	const [productPrice, setProductPrice] = useState('');
	const [productSizes, setProductSizes] = useState([
		{ size: '', stock: '' },
		{ size: '', stock: '' },
		{ size: '', stock: '' },
		{ size: '', stock: '' },
		{ size: '', stock: '' }
	]);
	const [bestSelling, setBestSelling] = useState(false);

	//fetch catefories on component mount
	useEffect(() => {
		const fetchCategories = async () => {
			try {
				const response = await fetch('http://localhost:8000/categories/');
				const data = await response.json();
				setCategories(data);

				// Fetch subcategories for the first category
				if (data.length > 0) {
					const subResponse = await fetch(`http://localhost:8000/categories/${data[0].id}/subcategories`);
					const subData = await subResponse.json();
					setSubcategories(subData);
				}
			} catch (error) {
				console.error('Error fetching categories:', error);
				toast.error('Failed to load categories');
			}
		};
		fetchCategories();
	}, []);

	// Handle image selection
	const handleImageChange = (index, file) => {
		const newImages = [...images];
		newImages[index] = file;
		setImages(newImages);
	};

	// Handle size and stock input changes
	const handleSizeChange = (index, field, value) => {
		const newSizes = [...productSizes];
		newSizes[index][field] = value;
		setProductSizes(newSizes);
	};

	// Filter out empty sizes
	const getFilteredSizes = () => {
		return productSizes
			.filter(sizeObj => sizeObj.size.trim() !== '' && sizeObj.stock.trim() !== '')
			.map(sizeObj => ({
				size: sizeObj.size.trim(),
				stock: parseInt(sizeObj.stock, 10)
			}));
	};

	// Handle product submission
	const handleSubmit = async (e) => {
		e.preventDefault();
	
		// Validate inputs
		if (!productName || !productDescription || !productPrice) {
			toast.error('Please fill in all required fields');
			return;
		}

		if (!productCategory) {
			toast.error('Please select a category');
			return;
		}
		if (!productSubCategory) {
            toast.error('Please select a subcategory');
            return;
        }
	
		// Prepare filtered sizes with proper type conversion
		const filteredSizes = productSizes
			.filter(sizeObj => sizeObj.size.trim() !== '' && sizeObj.stock.trim() !== '')
			.map(sizeObj => ({
				size: sizeObj.size.trim(),
				stock: parseInt(sizeObj.stock, 10)
			}));
	
		// Validate sizes
		if (filteredSizes.length === 0) {
			toast.error('Please add at least one size and stock');
			return;
		}
	
		// Retrieve the authentication token
		const token = localStorage.getItem('authtoken') || sessionStorage.getItem('authtoken');
	
		try {
			// Prepare product data payload (without image_urls initially)
			const productData = {
				name: productName,
				description: productDescription,
				price: parseFloat(productPrice),
				category_id: productCategory,
				subcategory_id: productSubCategory,
				sizes: filteredSizes,
				best_selling: bestSelling,
			};
			// First, create the product
			const productResponse = await fetch('http://localhost:8000/products/', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'Authorization': `Bearer ${token}`
				},
				body: JSON.stringify(productData)
			});
	
			// Enhanced error handling
			if (!productResponse.ok) {
				const errorText = await productResponse.text();
				console.error('Error response:', errorText);
				throw new Error(errorText || 'Failed to create product');
			}
	
			const createdProductData = await productResponse.json();
			const productId = createdProductData.id;

			// Prepare image upload
			const imageFiles = images.filter(img => img !== null);
			if (imageFiles.length > 0) {
				const imageFormData = new FormData();
				imageFiles.forEach((file) => {
					imageFormData.append('files', file);
				});

				// Upload images
				const imageUploadResponse = await fetch(`http://localhost:8000/products/${productId}/images`, {
					method: 'POST',
					headers: {
						'Authorization': `Bearer ${token}`
					},
					body: imageFormData
				});
	
				if (!imageUploadResponse.ok) {
					const errorData = await imageUploadResponse.text();
					throw new Error(errorData || 'Failed to upload images');
				}
			}
	
			// Reset form
			toast.success('Product added successfully!');
			resetForm();
			
		} catch (error) {
			console.error('Product submission error:', error);
			toast.error(error.message || 'Failed to add product');
		}
	};

	// Reset form to initial state
	const resetForm = () => {
		setImages([null, null, null, null]);
		setProductName('');
		setProductDescription('');
		setProductCategory('Men');
		setProductSubCategory('topWear');
		setProductPrice('');
		setProductSizes([
			{ size: '', stock: '' },
			{ size: '', stock: '' },
			{ size: '', stock: '' },
			{ size: '', stock: '' },
			{ size: '', stock: '' }
		]);
		setBestSelling(false);
	};

	return(
		<form onSubmit={handleSubmit} className="flex flex-col w-full items-start gap-4">
			<div>
				<p>Upload Image (max 4)</p>
				<div className="flex gap-2">
					{[0, 1, 2, 3].map((index) => (
						<label 
							key={index} 
							className="w-20 h-21 rounded-sm border border-gray-300 object-cover overflow-hidden" 
							htmlFor={`image${index+1}`}
						>
							<img 
								className="object-cover" 
								src={images[index] ? URL.createObjectURL(images[index]) : assets.upload} 
								alt={`upload ${index+1}`} 
							/>
							<input 
								onChange={(e) => handleImageChange(index, e.target.files[0])} 
								type="file" 
								id={`image${index+1}`} 
								hidden 
								accept="image/*"
							/>
						</label>
					))}
				</div>
			</div>
			<div className="w-full">
				<p className="mb-2">Product Name</p>
				<input 
					onChange={(e)=>setProductName(e.target.value)} 
					value={productName} 
					className="w-full border rounded-sm border-gray-300 max-w-[700px] px-3 py-2" 
					type="text" 
					placeholder="Type Here" 
					required 
				/>
			</div>
			<div className="w-full">
				<p className="mb-2">Product Description</p>
				<textarea 
					onChange={(e)=>setProductDescription(e.target.value)} 
					value={productDescription} 
					className="w-full border rounded-sm border-gray-300 max-w-[700px] px-3 py-2" 
					placeholder="Write Here" 
					required 
				/>
			</div>
			<div className="flex flex-col sm:flex-row gap-2 w-full sm:gap-8">
				<div>
					<p className='mb-2'>Product Category</p>
					<select 
						value={productCategory} 
						onChange={(e) => {
							setProductCategory(e.target.value);
							// Fetch subcategories for the selected category
							const selectedCategory = categories.find(cat => cat.id === e.target.value);
							if (selectedCategory) {
								fetch(`http://localhost:8000/categories/${selectedCategory.id}/subcategories`)
									.then(res => res.json())
									.then(setSubcategories)
									.catch(console.error);
							}
						}}
						className="w-full px-3 py-2 border rounded-sm border-gray-300 max-w-[100px]"
					>
						<option value="">Select Category</option>
                    	{categories.map(category => (
							<option key={category.id} value={category.id}>
								{category.name}
							</option>
                    	))}
					</select>
				</div>
				<div>
					<p className='mb-2'>Product SubCategory</p>
					<select 
						value={productSubCategory} 
						onChange={(e)=>setProductSubCategory(e.target.value)}
						disabled={!productCategory}
						className="w-full px-3 py-2 border rounded-sm border-gray-300 max-w-[120px]"
					>
						<option value="">Select Subcategory</option>
						{subcategories.map(subcategory => (
							<option key={subcategory.id} value={subcategory.id}>
								{subcategory.name}
							</option>
						))}
					</select>
				</div>
				<div>
					<p className='mb-2'>Product Price</p>
					<input 
						value={productPrice} 
						onChange={(e)=>setProductPrice(e.target.value)} 
						className="w-full px-3 py-2 border rounded-sm border-gray-300 max-w-[120px]" 
						type="number" 
						placeholder="200" 
						required 
					/>
				</div>
				<div>
					<p className="mb-3">Enter Product Sizes and Stock</p>
					<div className="flex gap-2">
						{productSizes.map((sizeObj, index) => (
							<div key={index} className="flex flex-col">
								<input 
									className="w-10 h-8 text-center rounded-sm border border-gray-300 mb-1" 
									type="text" 
									placeholder="Size"
									value={sizeObj.size}
									onChange={(e) => handleSizeChange(index, 'size', e.target.value)}
								/>
								<input 
									className="w-10 h-8 text-center rounded-sm border border-gray-300" 
									type="number" 
									placeholder="Stock"
									value={sizeObj.stock}
									onChange={(e) => handleSizeChange(index, 'stock', e.target.value)}
								/>
							</div>
						))}
					</div>
				</div>
			</div>
			<div className="flex items-center gap-2 mt-2">
				<input 
					checked={bestSelling} 
					onChange={() => setBestSelling(prev => !prev)} 
					type="checkbox" 
					id="bestSelling" 
				/>
				<label className="cursor-pointer" htmlFor="bestSelling">
					Add to best selling
				</label>
			</div>
			<button 
				type="submit" 
				className="w-28 mt-4 bg-black text-white py-2 rounded hover:bg-gray-800 transition"
			>
				ADD PRODUCT
			</button>
		</form>
	)
};

export default Add;