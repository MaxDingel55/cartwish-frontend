import React, { useState, useEffect, useReducer, useCallback } from 'react'
import {ToastContainer, toast} from 'react-toastify'

import UserContext from './contexts/UserContext';
import CartContext from './contexts/CartContext';
import './App.css'
import Navbar from './components/Navbar/Navbar';
import Routing from './components/Routing/Routing';
import { getJwt, getUser } from './services/userServices';
import setAuthToken from './utils/setAuthToken';
import 'react-toastify/dist/ReactToastify.css'
import useData from './hooks/useData';
import useAddToCart from './hooks/cart/useAddToCart';
import cartReducer from "./reducers/cartReducer";
import useRemoveFromCart from './hooks/cart/useRemoveFromCart';
import useUpdateCart from './hooks/cart/useUpdateCart';

setAuthToken(getJwt());

const App = () => {

	const [user, setUser] = useState(null);
	const [cart, dispatchCart] = useReducer(cartReducer, []);
	const { data: cartData, refetch } = useData("/cart", null, ["cart"]);

	// mutation variables
	const addToCartMutation = useAddToCart();
	const removeFromCartMutation = useRemoveFromCart();
	const updateCartMutation = useUpdateCart();

	// if cartData isn't null (ie fetch from API returned data), set the cart state variable to that data
	useEffect(() => {
		if (cartData) {
			dispatchCart({ type: "GET_CART", payload: { products: cartData } });
		}
	}, [cartData]);

	// refetch the cart data if the user changes 
	useEffect(() => {
		if (user) {
			refetch(); // from useQuery(), which is called in useData()
		}
	}, [user]);

	// accessing JSON Web Token to get user's info
	useEffect(() => {
		try {
			const jwtUser = getUser(); // custom method from userServices.js

			if (Date.now() >= jwtUser.exp * 1000) { // since Date.now() returns current time in ms, hence the * 1000
				localStorage.removeItem("token");
				location.reload();
			} else {
				setUser(jwtUser);
			}

		} catch (error) {}
	}, []);

	// Functions =======================================================================================================================

	const addToCart = useCallback((product, quantity) => {

		dispatchCart({ type: "ADD_TO_CART", payload: { product, quantity } });

		addToCartMutation.mutate({id: product._id, quantity: quantity}, {
			onError: (error) => {
				console.error("Add to cart failed:", error);
				toast.error("Something went wrong 1!");
				dispatchCart({ type: "REVERT_CART", payload: { cart } });
			}
		});
	}, [cart]);

	const removeFromCart = useCallback(id => {
		dispatchCart({ type: "REMOVE_FROM_CART", payload: { id } });

		removeFromCartMutation.mutate({id}, {
			onError: () => {
				toast.error("Something went wrong 2!");
				dispatchCart({ type: "REVERT_CART", payload: { cart } }); // error occured, so undo the removal, set cart to cart (the setCart(newCart) from above runs, but it doesn't matter,
			}
		})

	}, [cart]);

	const updateCart = useCallback((type, id) => {
		const updatedCart = [...cart];
		const productIndex = updatedCart.findIndex(item => item.product._id === id);

		if (type === "increase") {
			updatedCart[productIndex].quantity += 1;
			
		} else if (type === "decrease") { 
			updatedCart[productIndex].quantity -= 1;
		}

		dispatchCart({ type: "GET_CART", payload: { products: updatedCart } });

		updateCartMutation.mutate({ id, type }, {
			onError: (error) => {
				console.error("Update cart failed:", error.response?.data || error.message);
				toast.error("Something went wrong 3!");
				dispatchCart({ type: "REVERT_CART", payload: { cart } });
			}
		});

	}, [cart]);

	return (
		// Whatever is between UserContext.Provider, those components and their children can access
		//  the info (object, data, functions) passed in the value props
		<UserContext.Provider value={user}>
			<CartContext.Provider value={{ cart, addToCart, removeFromCart, updateCart }}>
				<div className='app'>
					<Navbar />
					<main>
						<ToastContainer position='bottom-right'/>
						<Routing />
					</main>
				</div>
			</CartContext.Provider>
		</UserContext.Provider>
	)
}

export default App