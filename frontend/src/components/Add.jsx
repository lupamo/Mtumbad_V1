import React from "react";
import { assets } from "../assets/assets";

const Add = () => {
	return(
		<form className="flex flex-col w-full items-start gap-4">
			<div>
				<p>Upload Image</p>
				<div className="flex gap-4">
					<label className="w-20 h-20 rounded-sm  border border-gray-300" htmlFor="image1">
						<img src={assets.upload} alt="upload" />
						<input type="file" id="image1" hidden/>
					</label>
					<label className="w-20 h-20 rounded-sm border border-gray-300" htmlFor="image2">
						<img src={assets.upload} alt="upload" />
						<input type="file" id="image2" hidden/>
					</label>
					<label className="w-20 h-20 rounded-sm border border-gray-300" htmlFor="image3">
						<img src={assets.upload} alt="upload" />
						<input type="file" id="image3" hidden/>
					</label>
					<label className="w-20 h-20 rounded-sm border border-gray-300" htmlFor="image4">
						<img src={assets.upload} alt="upload" />
						<input type="file" id="image4" hidden/>
					</label>
				</div>
			</div>
			<div className="w-full">
				<p className="mb-2">Product Name</p>
				<input className="w-full border rounded-sm border-gray-300 max-w-[700px] px-3 py-2" type="text" placeholder="Type Here" required />
			</div>
			<div className="w-full">
				<p className="mb-2">Product Description</p>
				<textarea className="w-full border rounded-sm border-gray-300 max-w-[700px] px-3 py-2" type="text" placeholder="Write Here" required />
			</div>
			<div className="flex flex-col sm:flex-row gap-2 w-full sm:gap-8">
				<div>
					<p className='mb-2'>Product Category</p>
					<select className="w-full px-3 py-2 border rounded-sm border-gray-300 max-w-[100px]">
						<option value="Men">Men</option>
						<option value="Women">Women</option>
						<option value="Kids">Kids</option>
					</select>

				</div>
				<div>
					<p className='mb-2'>Product SubCategory</p>
					<select className="w-full px-3 py-2 border rounded-sm border-gray-300 max-w-[120px]">
						<option value="topWear">TopWear</option>
						<option value="bottomWear">BottomWear</option>
					</select>
				</div>
				<div>
					<p className='mb-2'>Product Price</p>
					<input className="w-full px-3 py-2 border rounded-sm border-gray-300 max-w-[120px]" type="Number" placeholder="20" />
				</div>
			</div>
		</form>
	)

};


export default Add;
