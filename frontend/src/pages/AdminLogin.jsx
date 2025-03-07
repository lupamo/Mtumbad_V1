import React, { useContext, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import { toast } from "react-toastify";

const AdminLogin = () => {

	const { adminLogin, navigate } = useContext(ShopContext);
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

	const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    }

	const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const result = await adminLogin(formData.email, formData.password);
            if (!result.success) {
                throw new Error(result.error || 'Admin login failed');
            }
            toast.success('Admin login successful');
            navigate('/admin');
        } catch (error) {
            toast.error(error.message);
        } finally {
            setIsLoading(false);
        }
    };

	return (
		<form onSubmit={handleSubmit} className="flex flex-col items-center w-[90%] sm:max-w-96 m-auto mt-14 gap-4 text-gray-800">
			<div className="inline-flex items-center gap-2 mb-2 mt-10">
				<p className="prata-regularr text-3xl">Admin Login</p>
				
			</div>
			<input name="email" type="email" value={formData.email} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-800 " placeholder="Email" required />
			<input name="password" type="password" value={formData.password} onChange={handleInputChange}className="w-full px-3 py-2 border border-gray-800 " placeholder="Password" required />
			<button 
                className="bg-black text-white font-light px-8 py-2 w-full"
                disabled={isLoading}
            >
                {isLoading ? 'Processing...' : 'Login'}
            </button>
		</form>
	);
}

export default AdminLogin;