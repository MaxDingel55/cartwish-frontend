import React from 'react'

import './MyOrderPage.css'
import Table from '../Common/Table'
import useData from '../../hooks/useData'
import Loader from '../Common/Loader'

const MyOrderPage = () => {

	const { data: orders, error, isLoading } = useData("/order", null, ["myorders"], 1*60*1000);

	const getProductString = order => {
		const productStringArray = order.products.map(p => `${p.product.title} (${p.quantity})`);

		return productStringArray.join(", ");
	}

	return (
		<section className="align_center myorder_page">
			{isLoading && <Loader />}
			{error && <em className='form_error'>{error}</em>}
			{orders &&
				<Table headings={["Order", "Products", "Total", "Status"]}>
					<tbody>
						{orders && orders.map((order, i) => 
							<tr key={order._id}>
								<td>{i + 1}</td>
								<td>{getProductString(order)}</td>
								<td>${order.total}</td>
								<td>{order.status}</td>
							</tr>
						)}
					</tbody>
				</Table>
			}
		</section>
	)
}

export default MyOrderPage
