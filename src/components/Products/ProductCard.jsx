import React, { memo, useContext } from 'react'

import './ProductCard.css'
import config from '../../config.json'
import star from '../../assets/white-star.png'
import basket from '../../assets/basket.png'
import { NavLink } from 'react-router-dom'
import CartContext from '../../contexts/CartContext'
import UserContext from '../../contexts/UserContext'


const ProductCard = ({ product }) => {

    const { addToCart } = useContext(CartContext);

    const user = useContext(UserContext);

    // note using ? to check if product is actually available (ie non-null)
    return (
        <article className='product_card'>
            <div className='product_image'>
                <NavLink to={`/product/${product?._id}`}>
                    <img src={`${config.backendURL}/products/${product?.images[0]}`} alt="product image" />
                </NavLink>
            </div>

            <div className="product_details">
                <h3 className="product_price">${product?.price}</h3>
                <p className="product_title">{product?.title}</p>
                <footer className="align_center product_info_footer">
                    <div className="align_center">
                        <p className='align_center product_rating'>
                            <img src={star} alt="star" />
                            {product?.reviews.rate}
                        </p>
                        <p className='product_review_count'>{product?.reviews.counts}</p>
                    </div>

                    {product?.stock > 0 && user &&          // product must be available, and user must be logged in
                        <button className="add_to_cart" onClick={() => addToCart(product, 1)}>
                            <img src={basket} alt="basket" />
                        </button>
                    }
                </footer>
            </div>
        </article>
    )
}

export default memo(ProductCard)
