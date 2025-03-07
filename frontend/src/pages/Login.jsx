import React, { useState, useContext } from "react";
import { NavLink } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import { toast } from "react-toastify";

const Login = () => {
	const [currentState, setCurrentState] = useState('Sign Up');
	const [isLoading, setIsLoading] = useState(false);
	const [formData, setFormData] = useState({
		name: '',
		email: '',
		password: '',
		rememberMe: false
	});
	const { register, login } = useContext(ShopContext);

	const handleInputChange = (e) => {
		const { name, value, type, checked } = e.target;
		setFormData({
			...formData,
			[name]: type === 'checkbox' ? checked : value
		});
	}

	const onSubmitHandler = async(e) => {
		e.preventDefault();
		setIsLoading(true);
		
		try {
			if (currentState.toLowerCase() === 'sign up') {
				// Handle signup
				const result = await register({
					name: formData.name,
					email: formData.email,
					password: formData.password
				});
				if (!result.success) {
					throw new Error(result.error || 'Failed to create account');
				}
				toast.success('Account created successfully');
				setCurrentState('login');

				//reset after successful signup
				setFormData({
					...formData,
					name: '',
					password: '',
				});
			} else {
				// Handle login
				const result = await login(formData.email, formData.password, formData.rememberMe);
				if (!result.success) {
					throw new Error(result.error || 'Failed to login');
				}
				toast.success('Login successful');
			}
		} catch (error) {
			toast.error(error.message || 'An error occurred');
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<form onSubmit={onSubmitHandler} className="flex flex-col items-center w-[90%] sm:max-w-96 m-auto mt-14 gap-4 text-gray-800">
			<div className="inline-flex items-center gap-2 mb-2 mt-10">
				<p className="prata-regularr text-3xl">{currentState}</p>
			</div>
			
			{currentState.toLowerCase() === 'sign up' && (
				<input 
					type="text" 
					name="name"
					value={formData.name}
					onChange={handleInputChange}
					className="w-full px-3 py-2 border border-gray-800" 
					placeholder="Name" 
					required 
				/>
			)}
			
			<input 
				type="email" 
				name="email"
				value={formData.email}
				onChange={handleInputChange}
				className="w-full px-3 py-2 border border-gray-800" 
				placeholder="Email" 
				required 
			/>
			
			<input 
				type="password" 
				name="password"
				value={formData.password}
				onChange={handleInputChange}
				className="w-full px-3 py-2 border border-gray-800" 
				placeholder="Password" 
				required 
			/>

			<div className="w-full flex justify-between text-sm mt-[-8px]">
				{currentState.toLowerCase() === 'login' && (
					<p className="cursor-pointer">Forgot Your Password?</p>
				)}
				
				{currentState.toLowerCase() === 'login' ? (
					<>
						<div className="flex items-center">
							<input 
								type="checkbox" 
								id="rememberMe" 
								name="rememberMe"
								checked={formData.rememberMe}
								onChange={handleInputChange}
								className="mr-2" 
							/>
							<label htmlFor="rememberMe">Remember me</label>
						</div>
						<p onClick={() => setCurrentState('Sign Up')} className="cursor-pointer">Create account</p>
					</>
				) : (
					<>
						<div></div> {/* Empty div to maintain layout */}
						<p onClick={() => setCurrentState('Login')} className="cursor-pointer">Login Here</p>
					</>
				)}
			</div>
			
			<button 
				className="bg-black text-white font-light px-8 py-2 w-full"
				disabled={isLoading}
			>
				{isLoading ? 'Processing...' : currentState}
			</button>
			
			<NavLink to='/admin-login'>Admin Login</NavLink>
		</form>
	);
}

export default Login;
