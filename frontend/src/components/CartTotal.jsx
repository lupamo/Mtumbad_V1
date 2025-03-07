import React from 'react';
import { useContext } from 'react';
import { ShopContext } from '../context/ShopContext';
import Title from './Title';


const CartTotal = () => {
	const { currency, delivery_fee, getCartAmount, products } = useContext(ShopContext);


	const cartAmount = products && products.length > 0 ? getCartAmount() : 0;

	return (
		<div className="w-full">
			<div className="text-2xl">
				<Title text1={'CART'} text2={'TOTAL'} />
			</div>
			<div className="flex flex-col gap-2 mt-2 text-sm">
				<div className="flex justify-between">
					<p className='px-2'>Subtotal</p>
					<p> {currency} {cartAmount}</p>
				</div>
				<hr />
				<div className="flex justify-between">
					<p>Delivery Fee</p>
					<p>{currency}{delivery_fee}</p>
				</div>
				<hr />
				<div className="flex justify-between">
					<b>Total</b>
					<b>{currency} {cartAmount === 0 ? 0 : cartAmount + delivery_fee}</b>
				</div>
			</div>
		</div>
	);
}

export default CartTotal;