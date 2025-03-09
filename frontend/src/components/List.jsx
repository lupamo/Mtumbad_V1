import React, {useState, useEffect, useContext} from "react";
import { ShopContext } from  "../context/ShopContext";
import { toast } from 'react-toastify';
import { useNavigate } from "react-router-dom";
import bin from "../assets/delete.png";

const List = () => {

	const { requireAdmin } = useContext(ShopContext);	
	const navigate = useNavigate();
	const [loading, setLoading] = useState(false);
	const [productList, setProductList] = useState([]);
	const [filter, setFilter] = useState("");
	const API_URL = 'http://localhost:8000';

	useEffect(() => {
		fetchProducts();
	}, []);

	const fetchProducts = async () => {
		try {
			setLoading(true);
			const response = await fetch(`${API_URL}/products/`);
			if (!response.ok) {
				throw new Error('Failed to fetch products');
			}
			const data = await response.json();
			
			// Transform the data to include additional info
			const formattedProducts = data.map(product => ({
				id: product.id,
				name: product.name,
				description: product.description,
				price: product.price,
				category: product.category_id,
				subcategory: product.subcategory_id,
				image_urls: product.image_urls || [],
				sizes: product.sizes || [],
				totalStock: product.sizes ? product.sizes.reduce((total, size) => total + size.stock, 0) : 0
			}));
			
			setProductList(formattedProducts);
		} catch (error) {
			console.error("Error fetching products:", error);
			toast.error("Failed to load products");
		} finally {
			setLoading(false);
		}
	};

	const handleDelete = async (productId) => {
		// Check if admin before delete operation
		requireAdmin(async () => {
			if (window.confirm("Are you sure you want to delete this product?")) {
				try {
					const token = localStorage.getItem('authtoken') || sessionStorage.getItem('authtoken');
					
					const response = await fetch(`${API_URL}/products/${productId}`, {
						method: 'DELETE',
						headers: {
							'Authorization': `Bearer ${token}`
						}
					});

					if (!response.ok) {
						throw new Error('Failed to delete product');
					}

					toast.success("Product deleted successfully");
					// Refresh the product list
					fetchProducts();
				} catch (error) {
					console.error("Error deleting product:", error);
					toast.error("Failed to delete product");
				}
			}
		});
	};

	// const handleEdit = (productId) => {
	// 	requireAdmin(() => {
	// 		// Navigate to edit page or open edit modal
	// 		navigate(`/admin/edit-product/${productId}`);
	// 	});
	// };

	const handleFilterChange = (e) => {
		setFilter(e.target.value.toLowerCase());
	};

	// Filter products based on search term
	const filteredProducts = filter 
		? productList.filter(product => 
			product.name.toLowerCase().includes(filter) || 
			product.description.toLowerCase().includes(filter) ||
			product.category.toLowerCase().includes(filter)
		)
		: productList;

	if (loading) {
		return (
			<div className="flex justify-center items-center py-10">
				<div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
			</div>
		);
	}

	return(
		<>
			<div className="flex justify-between items-center mb-4">
				<h2 className="text-xl font-bold">Product Management</h2>
				<div className="flex">
					<input 
						type="text" 
						placeholder="Search products..." 
						className="border rounded px-3 py-2 mr-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
						value={filter}
						onChange={handleFilterChange}
					/>
					<button 
						className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded" 
						onClick={() => navigate('/admin/add-product')}
					>
						Add New
					</button>
				</div>
			</div>
			
			<div className="bg-white rounded-lg shadow-md overflow-hidden">
				{/* Table header */}
				<div className="hidden md:grid grid-cols-6 gap-4 bg-gray-100 p-4 font-semibold">
					<span>Image</span>
					<span className="col-span-2">Product Details</span>
					<span>Price</span>
					<span>Inventory</span>
					<span className="text-center">Actions</span>
				</div>
				
				{/* Product list */}
				{filteredProducts.length === 0 ? (
					<div className="text-center py-8 text-gray-500">No products found</div>
				) : (
					filteredProducts.map((product) => (
						<div 
							className="grid grid-cols-2 md:grid-cols-6 gap-4 items-center p-4 hover:bg-gray-50 border-b" 
							key={product.id}
						>
							{/* Image */}
							<div className="flex justify-center md:justify-start">
								<img 
									className="w-16 h-16 object-cover rounded" 
									src={product.image_urls && product.image_urls.length > 0 ? product.image_urls[0] : '/placeholder-image.jpg'} 
									alt={product.name} 
								/>
							</div>
							
							{/* Product details */}
							<div className="md:col-span-2">
								<h3 className="font-medium">{product.name}</h3>
								<p className="text-sm text-gray-500 truncate">{product.description}</p>
								<p className="text-xs text-gray-400">Category: {product.category}</p>
							</div>
							
							{/* Price */}
							<div className="hidden md:block font-medium">
								KSh {product.price.toFixed(2)}
							</div>
							
							{/* Inventory */}
							<div className="hidden md:block">
								<div className="flex flex-col">
									<span className={`font-medium ${product.totalStock > 0 ? 'text-green-600' : 'text-red-600'}`}>
										{product.totalStock} in stock
									</span>
									<div className="text-xs text-gray-500">
										{product.sizes.map(size => (
											<span key={size.size} className="mr-2">
												{size.size}: {size.stock}
											</span>
										))}
									</div>
								</div>
							</div>
							
							{/* Actions */}
							<div className="flex justify-end md:justify-center space-x-2">
								{/* <button 
									onClick={() => handleEdit(product.id)}
									className="text-blue-500 hover:text-blue-700 p-1"
									title="Edit product"
								>
									✏️
								</button> */}
								<button 
									onClick={() => handleDelete(product.id)}
									className="text-red-500 hover:text-red-700 p-1"
									title="Delete product"
								>
									<img src={bin} alt="bin" className="w-5" />
									
								</button>
							</div>
						</div>
					))
				)}
			</div>
			
			{/* Pagination placeholder - can be implemented if needed */}
			<div className="flex justify-between items-center mt-4">
				<div>
					<span className="text-sm text-gray-500">Showing {filteredProducts.length} of {productList.length} products</span>
				</div>
				<div>
					{/* Pagination controls would go here */}
				</div>
			</div>
		</>
	)

};


export default List;
