import React, {useState, useEffect} from "react";

const List = () => {

	const [list, setList] = useState([]);
	const fetchList = async () => {
		// try {
		// 	const response = await fetch("http://localhost:8000/api/list");
		// 	const data = await response.json();
		// 	setList(data);
		// } catch (error) {
		// 	console.log(error);
		// }
	};


	useEffect(() => {
		fetchList();
	}, []);

	return(
		<>
		<p className="mb-2">All product List</p>	
		<div className='flex flex-col gap-2'>
			{/* --table title--- */}
			<div className="hidden md:flex flex-cols-[1fr_3fr_1fr_1fr_fr] justify-around items-center py-1 px-2 border bg-gray-100 text-sm">
				<b>Image</b>
				<b>Name</b>
				<b>Category</b>
				<b>Price</b>
				<b className="text-center">Action</b>
			</div>
			{/* -----List of products------- */}
			{
				list.map((item, index) => (
					<div className="md:flex flex-cols-[1fr_3fr_1fr] md:flex-cols-[1fr_3fr_1fr_1fr_1fr] justify-around border text-sm items-center py-1 px-2" key={index}>
						<img className="w-12" src={item.image[0]} alt="productImg" />
						<p>i{item.name}</p>
						<p>{item.category}</p>
						<p>ksh {item.price}</p>
						<p className="text-right md:text-center cursor-pointer text-lg">X</p>
					</div>
				))
			}
		</div>
			
		</>
	)

};


export default List;
