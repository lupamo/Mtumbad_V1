import React, { useState } from "react";
import AdminNav from "../components/AdminNav";
import AdminSidebar from "../components/AdminSidebar";
import Add from '../components/Add';
import List from '../components/List';
import PlacedOrders from '../components/PlacedOrders';

const Admin = () => {
	const [activeComponent, setActiveComponent] = useState('add');

	const renderComponent = () => {
		switch(activeComponent) {
			case 'add':
				return <Add />;
			case 'list':
				return <List />;
			case 'placed-orders':
				return <PlacedOrders />;
			default:
				return <Add />;
		}
	};

	return(
		<div className="bg-gray-50 min-h-screen">
			<>
			<AdminNav />
			<hr />
			<div className="flex w-full">
				<AdminSidebar setActiveComponent={setActiveComponent} activeComponent={activeComponent} />
				<div className="w-[70%] mx-auto ml-[max(5vw, 25px)] my-8 text-gray-600 text-base">
					{renderComponent()}
				</div>

			</div>
			</>
			
		</div>
	)

};


export default Admin;
