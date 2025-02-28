import React, { useState } from "react";
import { NavLink } from "react-router-dom";

const Login = () => {
	const [currentState, setCurrentState] = useState('Sign Up');
	const onSubmitHandler = async(e) => {
		e.preventDefault();
	};

	return (
		<form onSubmit={onSubmitHandler} className="flex flex-col items-center w-[90%] sm:max-w-96 m-auto mt-14 gap-4 text-gray-800">
			<div className="inline-flex items-center gap-2 mb-2 mt-10">
				<p className="prata-regularr text-3xl">{currentState}</p>
				
			</div>
			{ currentState === 'login' ? '' : <input type="text" className="w-full px-3 py-2 border border-gray-800 " placeholder="Name" required />}
			<input type="email" className="w-full px-3 py-2 border border-gray-800 " placeholder="Email" required />
			<input type="password" className="w-full px-3 py-2 border border-gray-800 " placeholder="Password" required />

			<div className="w-full flex justify-between text-sm mt-[-8px]">
				<p className="cursor-pointer">Forgot Your Password?</p>
				{
					currentState === 'login' 
						? <p onClick={() => setCurrentState('sign up')} className="cursor-pointer">Create account</p>
						: <p onClick={() => setCurrentState('login')} className="cursor-pointer">Login Here</p>
				}
			</div>
			<button className="bg-black text-white font-light px-8 py-2">{currentState === 'login' ? 'Sign In' : 'Sign Up'}</button>
			<NavLink to='/admin-login'>Admin Login</NavLink>
		</form>
	);
}

export default Login;