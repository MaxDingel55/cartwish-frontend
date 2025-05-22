import React, { useState, useContext, memo } from 'react'
import { useParams } from 'react-router-dom';

import './SingleProductPage.css'
import config from '../../../config.json'
import QuantityInput from './QuantityInput';
import useData from '../../../hooks/useData';
import Loader from '../../Common/Loader';
import CartContext from './../../../contexts/CartContext';
import UserContext from '../../../contexts/UserContext';

const SingleProductPage = () => {

    // stores index value of the selected image so that it is the one that gets displayed the largest
    const [selectedImage, setSelectedImage] = useState(0);

    // Fetching the product data based on the id given from the route parameter
    const { id } = useParams(); // useParams() returns an object containing all the route parameters

    // Fetching the data from the API
    // in JS, passing less arguments means others that weren't specified are set to undefined; doesn't cause error
    const { data: product, error, isLoading } = useData(`/products/${id}`, null, ["products", id]); 

    // To track the quantity of the product the user wants
    const [quantity, setQuantity] = useState(0);

    // useContext() hook instead of passing as props (instead of prop drilling)
    const { addToCart } = useContext(CartContext);

    const user = useContext(UserContext);

    return (
        
        
        <section className="align_center single_product">
            {error && <em className='form_error'>{error.message}</em>}
            {isLoading && <Loader />}
            {product &&
                <>
                    <div className="align_center">
                        <div className="single_product_thumbnails">
                            {
                                product.images.map((image, index) => {
                                    return (<img 
                                                src={`${config.backendURL}/products/${image}`} 
                                                alt={product.title} 
                                                className={selectedImage === index ? 'selected_image' : ''}
                                                key={index} 
                                                onClick={() => setSelectedImage(index)}
                                            />)
                                })
                            }
                        </div>

                        <img src={`${config.backendURL}/products/${product.images[selectedImage]}`} alt={product.title} className='single_product_display'/>
                    </div>

                    <div className="single_product_details">
                        <h1 className="single_product_title">{product.title}</h1>
                        <p className="single_product_description">{product.description}</p>
                        <p className="single_product_price">${product.price.toFixed(2)}</p>
                        
                        {user && 
                            <>
                                <h2 className="quantity_title">Quantity:</h2>
                                <div className="align_center quantity_input">
                                    <QuantityInput quantity={quantity} setQuantity={setQuantity} stock={product.stock} />
                                </div>

                                <button className="search_button add_cart" onClick={() => addToCart(product, quantity)}>Add to Cart</button>
                            </>
                        }
                            
                    </div>
                </>
            }
        </section>
        
    )
}

export default memo(SingleProductPage)
