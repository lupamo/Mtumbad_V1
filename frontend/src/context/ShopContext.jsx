import { createContext, useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

// API base URL - adjust to match your FastAPI server
const API_URL = 'http://localhost:8000';


export const ShopContext = createContext();

const ShopContextProvider = (props) => {
  const currency = 'Kshs';
  const delivery_fee = 130;
  const [search, setSearch] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [cartItems, setCartItems] = useState({});
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [products, setProducts ] = useState([]);
  const [loading, setLoading] = useState(true);
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
    fetchProducts();
  }, []);

  // Fetch products from API
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/products/`);

      if(!response.ok) {
        throw new Error('Server error');
      }
      const data = await response.json();

       // Transform backend data to match your frontend structure
       const transformedProducts = data.map(item => ({
        id: item.id,
        name: item.name,
        description: item.description,
        price: item.price,
        category: item.category_id,
        subCategory: item.subcategory_id,
        image: item.image_urls || [],
        sizes: item.sizes.map(size => ({
          size: size.size,
          quantity: size.stock
        })),
        bestselling: item.bestselling || false
      }));
      setProducts(transformedProducts);
    } catch (error) {
      console.error('Fetch products error:', error);
      toast.error('Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  // Check if user is authenticated
  const checkAuthStatus = async () => {
    const token = localStorage.getItem('authtoken') || sessionStorage.getItem('authtoken');
    const userEmail = localStorage.getItem('userEmail') || sessionStorage.getItem('userEmail');
    const userIsAdmin = localStorage.getItem('isAdmin') === 'true' || sessionStorage.getItem('isAdmin') === 'true';

    if (token) {
      setIsAuthenticated(true);
      setIsAdmin(userIsAdmin);
      if (userEmail) {
        setCurrentUser({ email: userEmail, isAdmin: userIsAdmin });
      } else {
        setCurrentUser({ email: "User", isAdmin: userIsAdmin });
      }
    } else {
      setIsAuthenticated(false);
      setIsAdmin(false);
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
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error(data.detail || 'Authentication failed');
      }
  
      // Assuming your backend returns the token directly as a string
      const token = data.access_token;
      const userIsAdmin = data.is_admin || false;

      
      if (!token) {
        throw new Error('Invalid token response');
      }


      // Store token based on remember me choice
      if (rememberMe) {
        localStorage.setItem('authtoken', token);
        localStorage.setItem('userEmail', email);
        sessionStorage.setItem('isAdmin', userIsAdmin);
      } else {
        sessionStorage.setItem('authtoken', token);
        localStorage.setItem('userEmail', email);
        sessionStorage.setItem('isAdmin', userIsAdmin);
      }
      
      setIsAuthenticated(true);
      setIsAdmin(userIsAdmin);
      setCurrentUser({ email: email });
      
      // Navigate home on successful login
      navigate('/');
      
      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: error.message };
    }
  };

  //admin login
  const adminLogin = async (email, password) => {
    try {
      // Step 1: Login with credentials
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error(data.detail || 'Admin authentication failed');
      }
  
      const token = data.access_token;
  
      if (!token) {
        throw new Error('Invalid token response');
      }
  
      // Get user information to verify admin status
      const userInfoResponse = await fetch(`${API_URL}/users/`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
  
      if (!userInfoResponse.ok) {
        throw new Error('Failed to get user information');
      }
  
      const users = await userInfoResponse.json();
      
      // Find the current user in the users array by matching the email
      const currentUser = users.find(user => user.email === email);
      
      if (!currentUser) {
        throw new Error('User not found');
      }
      
      // Check if the user is an admin
      if (!currentUser.is_admin) {
        throw new Error('Unauthorized: Admin access required');
      }
  
      // Store admin token and info
      localStorage.setItem('authtoken', token);
      localStorage.setItem('userEmail', email);
      localStorage.setItem('isAdmin', 'true');
      
      setIsAuthenticated(true);
      setIsAdmin(true);
      setCurrentUser({ email: email, isAdmin: true });
      
      // Navigate to admin dashboard on successful login
      navigate('/admin');
      
      return { success: true };
    } catch (error) {
      console.error('Admin login error:', error);
      return { success: false, error: error.message };
    }
  };

  // Handle logout
  const logout = () => {
    localStorage.removeItem('authtoken');
    sessionStorage.removeItem('authtoken');
    localStorage.removeItem('userId');
    sessionStorage.removeItem('userId');
    localStorage.removeItem('isAdmin');
    sessionStorage.removeItem('isAdmin');
    localStorage.removeItem('userEmail');
    sessionStorage.removeItem('userEmail');

    setIsAuthenticated(false);
    setIsAdmin(false);
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

  // Require admin authorization for admin routes
  const requireAdmin = (callback) => {
    if (isAuthenticated && isAdmin) {
      if (typeof callback === 'function') {
        return callback();
      }
      return true;
    } else if (isAuthenticated) {
      toast.error('Admin access required');
      navigate('/');
      return false;
    } else {
      toast.error('Please log in to continue');
      navigate('/admin-login');
      return false;
    }
  };
  // Sync cart with backend
  const syncCartWithBackend = async () => {
    try {
      const token = localStorage.getItem('authtoken') || sessionStorage.getItem('authtoken');
      
      if (!token || !isAuthenticated) {
        return { success: false, error: 'Not authenticated' };
      }
      
      // Add items from local cart to backend cart
      for (const productId in cartItems) {
        for (const size in cartItems[productId]) {
          const quantity = cartItems[productId][size];
          
          if (quantity > 0) {
            const addToCartResponse = await fetch(`${API_URL}/cart/`, {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                product_id: productId,
                quantity: quantity,
                size: size
              })
            });
            
            if (!addToCartResponse.ok) {
              const errorData = await addToCartResponse.json();
              throw new Error(errorData.detail || "Failed to sync cart with server");
            }
          }
        }
      }
      
      return { success: true };
    } catch (error) {
      console.error('Error syncing cart with backend:', error);
      return { success: false, error: error.message };
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
    for (const itemId in cartItems) {
      let itemInfo = products.find(product => product.id === itemId);
      if (!itemInfo) continue; // Skip if product not found
      
      for (const size in cartItems[itemId]) {
        try {
          if (cartItems[itemId][size] > 0) {
            totalAmount += cartItems[itemId][size] * itemInfo.price;
          }
        } catch (error) {
          console.log(`Error calculating price for item ${itemId}, size ${size}:`, error);
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
    isAdmin,
    adminLogin,
    register,
    login,
    logout,
    updateProfile,
    proceedToCheckout,
    requireAuth,
    requireAdmin,
    syncCartWithBackend
  };

  return (
    <ShopContext.Provider value={value}>
      {props.children}
    </ShopContext.Provider>
  );
};

export default ShopContextProvider;