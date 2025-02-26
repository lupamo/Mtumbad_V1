import React, { useContext } from 'react';
import { ShopContext } from '../context/ShopContext';
import { Link } from 'react-router-dom';


const ProductItem = ({ id, image, name, price }) => {

	const {currency} = useContext(ShopContext);

	return (
		<Link to={`/product/${id}`} className="text-gray-700 cursor-pointer flex flex-col h-full w-full">
			<div className='overflow-hidden flex-shrink-0 h-55'>
				<img src={image[0]} alt={name} className='hover:scale-110 transition ease-in-out w-full ' />
			</div>
			<p className='pt-3 pb-1 text-sm'>{name}</p>
			<p className='text-sm font-medium'>{currency}{price}</p>
		</Link>
	);
};

export default ProductItem