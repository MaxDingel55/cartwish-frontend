import React, { useContext, useEffect, useState } from 'react'
import { easeInOut, motion } from 'framer-motion'

import './Navbar.css'
import rocket from '../../assets/rocket.png'
import star from '../../assets/glowing-star.png'
import idButton from '../../assets/id-button.png'
import memo from '../../assets/memo.png'
import order from '../../assets/package.png'
import lock from '../../assets/locked.png'
import LinkWithIcon from './LinkWithIcon';
import { Link, NavLink, useNavigate } from 'react-router-dom'
import UserContext from '../../contexts/UserContext';
import CartContext from './../../contexts/CartContext';
import { getSuggestionsAPI } from '../../services/productServices'

const Navbar = () => {

    const [search, setSearch] = useState("");
    const [suggestions, setSuggestions] = useState([]);

    // to navigate through diff. search options when pressing up and down keys
    const [selectedItem, setSelectedItem] = useState(-1); // starts at index 0; thus -1 means no item is selected

    const navigate = useNavigate();

    const user = useContext(UserContext);

    const { cart } = useContext(CartContext);

    const handleSubmit = event => {
        event.preventDefault();

        // if search is non-empty and form was submitted, navigate to the products page with this search query string set to the user's input of the search field
        if (search.trim() !== "") {
            navigate(`/products?search=${search.trim()}`) 
        }

        setSuggestions([]);
    }

    const handleKeyDown = event => {
        if (selectedItem < suggestions.length) {
            if (event.key === "ArrowDown") {
                setSelectedItem(current => current === suggestions.length - 1 ? 0 : current + 1); // if at last suggestion and press down, go to top suggestion (index 0)
            } else if (event.key === "ArrowUp") {
                setSelectedItem(current => current === 0 ? suggestions.length - 1: current - 1); // if at first suggestion and press up, go to last/bottom suggestion
            } else if (event.key === "Enter" && selectedItem > -1) {
                const suggestion = suggestions[selectedItem];
                navigate(`/products?search=${suggestion.title}`);
                setSearch("");
                setSuggestions([]);
            }
        } else {
            setSelectedItem(-1);
        }
        
    }

    useEffect(() => {
        const delaySuggestions = setTimeout(() => {
            if (search.trim() !== "") {
                getSuggestionsAPI(search).then(res => {
                    setSuggestions(res.data);
                }).catch(error => console.log(error));

            } else {
                setSuggestions([]);
            }
        }, 300);

        // cleanup function! If user types another character within 300 ms of the delaySuggestions() call, 
        // then the timer will reset to 300 ms again, further postponing the API call, and preventing unneeded, 'stale' API calls
        return () => clearTimeout(delaySuggestions); 
        
    }, [search]);

    return (
        <motion.nav 
            className='align_center navbar' 
            initial={{opacity: 0, y: -30}}
            animate={{opacity: 1, y: 0}}
            transition={{ duration: 1, ease: easeInOut}}>

            <div className='align_center'>
                <h1 className='navbar_heading'>CartWish</h1>
                <form className=' align_center navbar_form' action="" onSubmit={handleSubmit}>
                    <input 
                        type="text" 
                        className='navbar_search' 
                        placeholder='Search Products' 
                        value={search} 
                        onChange={event => setSearch(event.target.value)}
                        onKeyDown={handleKeyDown}
                    />
                    <button type='submit' className='search_button'>Search</button>

                    {suggestions.length > 0 &&
                        <ul className="search_result">
                            {suggestions.map((suggestion, index) => 
                                <li className={selectedItem === index ? "search_suggestion_link active" : "search_suggestion_link"} key={suggestion._id}>
                                    <Link to={`/products?search=${suggestion.title}`} 
                                        onClick={() => {
                                            setSearch("");
                                            setSuggestions([]);
                                        }}>
                                        {suggestion.title}
                                    </Link>
                                </li>)
                            }
                        </ul>
                    }
                </form>
            </div>

            <div className=' align_center navbar_links'>
                <LinkWithIcon title="Home" link="/" emoji={rocket}/>
                <LinkWithIcon title="Products" link="/products" emoji={star}/>


                { !user && // Only display login and signup links if user is NOT logged in
                    <>
                        <LinkWithIcon title="LogIn" link="/login" emoji={idButton}/>
                        <LinkWithIcon title="SignUp" link="/signup" emoji={memo}/>
                    </> 
                }
                
                { user && // Conversely, only display my orders, logout, and cart links if user IS logged in
                    <>
                        <LinkWithIcon title="My Orders" link="/myorders" emoji={order}/>
                        <LinkWithIcon title="Logout" link="/logout" emoji={lock}/>
                        <NavLink to="/cart" className='align_center'>
                            Cart 
                            <p className="align_center cart_counts">{cart.length}</p>
                        </NavLink>
                    </>
                }
            </div>
        </motion.nav>
    )
}

export default Navbar
