import React from 'react'

import './QuantityInput.css'

const QuantityInput = ({ quantity, setQuantity, stock, cartPage, productId }) => {
    return (
        <>
            <button 
                className="quantity_input_button" 
                disabled={quantity === 0} // If quantity = 0, then user cannot decrease the quantity further, ie disable the button
                onClick={() => cartPage ? setQuantity("decrease", productId) : setQuantity(quantity - 1)}>
                {" "}-{" "}
            </button>

            <p className="quantity_input_count">{quantity}</p>

            <button 
                className="quantity_input_button" 
                disabled={quantity >= stock} // Don't let user order more products than are available in the stock
                onClick={() => cartPage ? setQuantity("increase", productId) : setQuantity(quantity + 1)}>
                {" "}+{" "}
            </button>
        </>

    )
}

export default QuantityInput
