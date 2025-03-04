import { createContext, useState, useEffect } from 'react';
import { products } from '../assets/assets';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

// API base URL - adjust to match your FastAPI server
const API_URL = 'http://localhost:8001';


export const ShopContext = createContext();

const ShopContextProvider = (props) => {
  const currency = 'Kshs';
  const delivery_fee = 130;
  const [search, setSearch] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [cartItems, setCartItems] = useState({});
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();

  // Load cart items from localStorage when component mounts
  useEffect(() => {
    const savedCartItems = localStorage.getItem('cartItems');
    if (savedCartItems) {
      try {
        setCartItems(JSON.parse(savedCartItems));
      } catch (error) {
        console.error('Error parsing saved cart items:', error);
        localStorage.removeItem('cartItems');
      }
    }
    checkAuthStatus();
  }, []);

  // Check if user is authenticated
  const checkAuthStatus = async () => {
    const token = localStorage.getItem('authtoken') || sessionStorage.getItem('authtoken');
    const userEmail = localStorage.getItem('userEmail') || sessionStorage.getItem('userEmail');
    
    if (token) {
      setIsAuthenticated(true);
      if (userEmail) {
        setCurrentUser({ email: userEmail });
      } else {
        setCurrentUser({ email: "User" });
      }
    } else {
      setIsAuthenticated(false);
      setCurrentUser(null);
    }
  };

  // Handle user registration
  const register = async (userData) => {
    try {
      const response = await fetch(`${API_URL}/users/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'Registration failed');
      }

      return { success: true, data };
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, error: error.message };
    }
  };

  // Handle login
  const login = async (email, password, rememberMe = false) => {
    try {
      // Your backend uses /auth/login instead of /token
      const response = await fetch(`${API_URL}/auth/login?email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error(data.detail || 'Authentication failed');
      }
  
      // Assuming your backend returns the token directly as a string
      const token = data.access_token;

      
      if (!token) {
        throw new Error('Invalid token response');
      }


      // Store token based on remember me choice
      if (rememberMe) {
        localStorage.setItem('authtoken', token);
        localStorage.setItem('userEmail', email);
      } else {
        sessionStorage.setItem('authtoken', token);
        localStorage.setItem('userEmail', email);
      }
      
      setIsAuthenticated(true);
      setCurrentUser({ email: email });
      
      // Navigate home on successful login
      navigate('/');
      
      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: error.message };
    }
  };

  // Handle logout
  const logout = () => {
    localStorage.removeItem('authtoken');
    sessionStorage.removeItem('authtoken');
    localStorage.removeItem('userId');
    sessionStorage.removeItem('userId');
    setIsAuthenticated(false);
    setCurrentUser(null);
    setCartItems({});
    navigate('/login');
  };


  // Update user profile
  const updateProfile = async (userData) => {
    try {
      const token = localStorage.getItem('authtoken') || sessionStorage.getItem('authtoken');
      const userId = localStorage.getItem('userId') || sessionStorage.getItem('userId');
      
      if (!token || !userId) {
        throw new Error('Not authenticated');
      }
      
      const response = await fetch(`${API_URL}/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'Profile update failed');
      }

      // Update currentUser state with new data
      setCurrentUser({...currentUser, ...data});
      return { success: true, data };
    } catch (error) {
      console.error('Update profile error:', error);
      return { success: false, error: error.message };
    }
  };


  // Require authentication for protected routes
  const requireAuth = (callback) => {
    if (isAuthenticated) {
      if (typeof callback === 'function') {
        return callback();
      }
      return true;
    } else {
      toast.error('Please log in to continue');
      navigate('/login');
      return false;
    }
  };

  // Add item to cart
  const addToCart = async (itemId, size) => {
    if (!size) {
      toast.error('Please select a size');
      return;
    }

    const product = products.find(product => product.id === itemId);
    if (!product) {
      toast.error('Product not found');
      return;
    }

    const sizeAvailable = product.sizes.find(s => s.size === size);
    if (!sizeAvailable) {
      toast.error('Selected size is not available');
      return;
    }

    let cartData = structuredClone(cartItems);
    if (cartData[itemId]) {
      if (cartData[itemId][size]) {
        if (cartData[itemId][size] >= sizeAvailable.quantity) {
          toast.error('Not enough stock available');
          return;
        }
        cartData[itemId][size] += 1;
      } else {
        cartData[itemId][size] = 1;
      }
    } else {
      cartData[itemId] = {};
      cartData[itemId][size] = 1;
    }

    setCartItems(cartData);
    localStorage.setItem('cartItems', JSON.stringify(cartData));
    toast.success('Item added to cart');
  };

  // Get total count of items in cart
  const getCartCount = () => {
    let totalCount = 0;
    for (const items in cartItems) {
      for (const item in cartItems[items]) {
        try {
          if (cartItems[items][item] > 0) {
            totalCount += cartItems[items][item];
          }
        } catch (error) {
          console.log(error);
        }
      }
    }
    return totalCount;
  };

  // Update quantity of an item in cart
  const updateQuantity = async (itemId, size, quantity) => {
    let cartData = structuredClone(cartItems);
    cartData[itemId][size] = quantity;
    setCartItems(cartData);
    localStorage.setItem('cartItems', JSON.stringify(cartData));
  };

  // Calculate total amount in cart
  const getCartAmount = () => {
    let totalAmount = 0;
    for (const items in cartItems) {
      let itemInfo = products.find(product => product.id === items);
      for (const item in cartItems[items]) {
        try {
          if (cartItems[items][item] > 0) {
            totalAmount += cartItems[items][item] * itemInfo.price;
          }
        } catch (error) {
          console.log(error);
        }
      }
    }
    return totalAmount;
  };

  // Proceed to checkout
  const proceedToCheckout = () => {
    requireAuth(() => {
      navigate('/checkout');
    });
  };

  const value = {
    products,
    currency,
    delivery_fee,
    search,
    setSearch,
    showSearch,
    setShowSearch,
    cartItems,
    addToCart,
    getCartCount,
    updateQuantity,
    getCartAmount,
    navigate,
    isAuthenticated,
    currentUser,
    register,
    login,
    logout,
    updateProfile,
    proceedToCheckout,
    requireAuth,
  };

  return (
    <ShopContext.Provider value={value}>
      {props.children}
    </ShopContext.Provider>
  );
};

export default ShopContextProvider;