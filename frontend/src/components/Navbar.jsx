import React from "react";
import { Link, NavLink } from "react-router-dom";
import { useContext } from "react";
import { assets } from "../assets/assets";
import { ShopContext } from "../context/ShopContext";

const Navbar = () => {
	// menu setup
	const [visible, setVisible] = React.useState(false);
	const { 
		setShowSearch, 
		getCartCount, 
		isAuthenticated, 
		currentUser 
	} = useContext(ShopContext);
	
	// Determine profile link destination based on authentication status
	const profileLinkDestination = isAuthenticated ? '/profile' : '/login';
	
	return (
		<div className="flex items-center justify-between py-5 font-medium">
			<Link to='/'>
				<img src={assets.logo} alt="logo" className="w-36" />
			</Link>

			<ul className="hidden sm:flex gap-5 text-sm text-gray-700">
				<NavLink to='/' className='flex flex-col items-center gap-1'>
					<p>HOME</p>
					<hr className="w-2/4 border-none h-[1.5px] bg-gray-700 hidden"/>
				</NavLink>
				<NavLink to='/about' className='flex flex-col items-center gap-1'>
					<p>ABOUT</p>
					<hr className="w-2/4 border-none h-[1.5px] bg-gray-700 hidden"/>
				</NavLink>
				<NavLink to='/collection' className='flex flex-col items-center gap-1'>
					<p>COLLECTION</p>
					<hr className="w-2/4 border-none h-[1.5px] bg-gray-700 hidden"/>
				</NavLink>
				<NavLink to='/contact' className='flex flex-col items-center gap-1'>
					<p>CONTACT</p>
					<hr className="w-2/4 border-none h-[1.5px] bg-gray-700 hidden"/>
				</NavLink>
			</ul>
			<div className="flex items-center gap-6">
				<img onClick={()=>setShowSearch(true)} src={assets.search_icon} className='w-5 cursor-pointer' alt="search" />
				<div className="group relative">
					<Link to={profileLinkDestination}>
						<img 
							src={assets.profile} 
							className={`w-5 cursor-pointer ${isAuthenticated ? 'border border-black rounded-full p-0.5' : ''}`}
							alt="profile" 
						/>
					</Link>
					{isAuthenticated && (
						<div className="absolute right-0 min-w-max bg-white shadow-lg rounded p-2 hidden group-hover:block z-10">
							<p className="text-sm whitespace-nowrap">{currentUser?.name || currentUser?.email}</p>
						</div>
					)}
				</div>
				<Link to='/cart' className="relative">
					<img src={assets.cart} className='w-5 min-w-5 cursor-pointer' alt="cart" />
					<p className="absolute right-[-5px] bottom-[-5px] w-4 text-center leading-4 bg-black text-white aspect-square rounded-full text-[15px]">{getCartCount()}</p>
				</Link>
				<img onClick={()=>setVisible(true)} src={assets.menu} alt="Menu" className="w-5 cursor pointer sm:hidden" />
			</div>
			{/* side bar menu on small screen */}
			<div className={`absolute top-0 right-0 bottom-0 overflow-hidden bg-white transition-all z-20 ${visible ? 'w-full':'w-0'}`}>
				<div className="flex flex-col text-gray-600">
					<div onClick={() => setVisible(false)} className="flex items-center gap-4 p-3 cursor-pointer">
						<img src={assets.drop} alt="back" className="h-5 rotate-90" />
						<p>Back</p>
					</div>
					<NavLink onClick={() => setVisible(false)} to='/' className='py-2 pl-6 border'>
						<p>HOME</p>
					</NavLink>
					<NavLink onClick={() => setVisible(false)} to='/about' className='py-2 pl-6 border'>
						<p>ABOUT</p>
					</NavLink>
					<NavLink onClick={() => setVisible(false)} to='/collection' className='py-2 pl-6 border'>
						<p>COLLECTION</p>
					</NavLink>
					<NavLink onClick={() => setVisible(false)} to='/contact' className='py-2 pl-6 border'>
						<p>CONTACT</p>
					</NavLink>
					<NavLink onClick={() => setVisible(false)} to={profileLinkDestination} className='py-2 pl-6 border'>
						<p>{isAuthenticated ? 'PROFILE' : 'LOGIN'}</p>
					</NavLink>
				</div>
			</div>
		</div>
	);
}

export default Navbar;