import React, { memo, useContext, useReducer, useMemo } from 'react'
import {toast} from 'react-toastify'

import './CartPage.css'
import config from '../../config.json'
import Table from '../Common/Table'
import QuantityInput from '../Products/SingleProduct/QuantityInput'
import remove from '../../assets/remove.png'
import UserContext from '../../contexts/UserContext';
import CartContext from './../../contexts/CartContext';
import { checkoutAPI } from '../../services/orderServices'

const CartPage = () => {

    const user = useContext(UserContext); 

    const { cart, revertCart, removeFromCart, updateCart, clearCart } = useContext(CartContext); // getting cart info from App.jsx

    // // useEffect() approach (need an extra state variable):

    // const [subTotal, setSubTotal] = useState(0);

    // useEffect(() => {
    //     let total = 0;
    //     cart.forEach(item => {
    //         total += item.product.price * item.quantity;
    //     });

    //     setSubTotal(total);
    // }, [cart]);

    // useMemo() approach (can assign variable directly)
    const subTotal = useMemo(() => {
        let total = 0;
        cart.forEach(item => {
            total += item.product.price * item.quantity;
        });

        return total;
    }, [cart]);

    const checkout = () => {
        clearCart(); // assume succeeded => clear the cart, and call checkoutAPI()
        checkoutAPI().then(() => {
            toast.success("Order placed successfully!");

        }).catch(() => {
            toast.error("Something went wrong 4!")
            revertCart();
        })
    }

    return (
        <section className="align_center cart_page">
            <div className="align_center user_info">
                <img src={`${config.backendURL}/profile/${user?.profilePic}`} alt="user profile" />
                <div>
                    <p className="user_name">Name: {user?.name}</p>
                    <p className="user_email">Email: {user?.email}</p>
                </div>
            </div>

            <Table headings={["Item", "Price", "Quantity", "Total", "Remove"]}>
                <tbody>
                    {cart.map(({ product, quantity }) => 
                        <tr key={product._id}>
                            <td>{product.title}</td>
                            <td>{product.price}</td>
                            <td className='align_center table_quantity_input'>
                                <QuantityInput 
                                    quantity={quantity} 
                                    stock={product.stock} 
                                    setQuantity={updateCart} 
                                    cartPage={true} 
                                    productId={product._id}
                                />
                            </td>
                            <td>${quantity * product.price}</td>
                            <td>
                                <img src={remove} alt="remove_icon" className='cart_remove_icon' onClick={() => removeFromCart(product._id)}/>
                            </td>
                        </tr>)
                    }
                    
                </tbody>
            </Table>
            

            <table className="cart_bill">
                <tbody>
                    <tr>
                        <td>Subtotal</td>
                        <td>${subTotal}</td>
                    </tr>
                    <tr>
                        <td>Shipping Charge</td>
                        <td>$5</td>
                    </tr>
                    <tr className='cart_bill_final'>
                        <td>Total</td>
                        <td>${subTotal + 5}</td>
                    </tr>
                </tbody>
            </table>

            <button className="search_button checkout_button" onClick={checkout}>Checkout</button>
        </section>
    )
}

export default memo(CartPage);
