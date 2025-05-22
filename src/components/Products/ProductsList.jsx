import React, { useEffect, useState } from 'react'
import useData from '../../hooks/useData';
import ProductCardSkeleton from './ProductCardSkeleton';
import { useSearchParams } from 'react-router-dom';

import './ProductsList.css'
import ProductCard from './ProductCard';
import Pagination from '../Common/Pagination';
import useProductList from '../../hooks/useProductList';

const ProductsList = () => {

	// for sorting the products
	const [sortBy, setSortBy] = useState("");
	const [sortedProducts, setSortedProducts] = useState([]);

	// getting the query string called category, which changes when we click the diff categories in the ProductsSidebar component
	// Eg: http://localhost:5173/products?category=Headphones&page=2
	const [search, setSearch] = useSearchParams();
	const category = search.get("category");
	const searchQuery = search.get("search"); // ie what product the user searched for in the search text field

	// passing an object as customConfig argument, to pass query string, so that we know which products to load depending on the category we select
	const { data, error, isFetching, hasNextPage, fetchNextPage } = useProductList({
		search: searchQuery,
		category,
		perPage: 10,
	});

	if (data) {
		console.log(data)
	}
	
	const skeletons = [1, 2, 3, 4, 5, 6, 7, 8]; // to display while actual products are loading

	// const handlePageChange = () => {
	// 	const currentParams = Object.fromEntries([...search]);
	// 	console.log(currentParams);
	// 	const currentPage = parseInt(currentParams) || 1;
	// 	setSearch({ ...currentParams, page: currentPage + 1 }); // increment page once have scrolled to bottom
	// }

	useEffect(() => {
		const handleScroll = () => {
			const { scrollTop, clientHeight, scrollHeight } = document.documentElement;
			if (scrollTop + clientHeight >= scrollHeight - 1 && ! isFetching && hasNextPage && data) {
				fetchNextPage();
			}
		}

		window.addEventListener("scroll", handleScroll);

		// useEffect() clean up function
		return () => window.removeEventListener("scroll", handleScroll)
	}, [data, isFetching]);

	// for sorting products
	useEffect(() => {
		if (data && data.pages) {

			const products = data.pages.flatMap(page => page.products);
			if (sortBy === "price desc") {
				setSortedProducts(products.sort((a, b) => b.price - a.price)); // b - a for descending
			} else if (sortBy === "price asc") {
				setSortedProducts(products.sort((a, b) => a.price - b.price)); // a - b for ascending
			} else if (sortBy === "rate desc") {
				setSortedProducts(products.sort((a, b) => b.reviews.rate - a.reviews.rate));
			} else if (sortBy === "rate asc") {
				setSortedProducts(products.sort((a, b) => a.reviews.rate - b.reviews.rate));
			} else {
				setSortedProducts(products); // If there is no filter
			}
		}
	}, [sortBy, data]);

	return (
		<section className="products_list_section">
			<header className="align_center products_list_header">
				<h2>Products</h2>
				<select name="sort" id="" className='products_sorting' onChange={event => setSortBy(event.target.value)}>
				<option value="">Relevance</option>
					<option value="price desc">Price HIGH to LOW</option>
					<option value="price asc">Price LOW to HIGH</option>
					<option value="rate desc">Rate HIGH to LOW</option>
					<option value="rate asc">Rate LOW to HIGH</option>
				</select>
				
			</header>

			<div className='products_list'>
				{error && <em className='form_error'>{error}</em>}

				{sortedProducts.map(product => <ProductCard key={product._id} product={product} />)}
				
				{isFetching && skeletons.map(n => <ProductCardSkeleton key={n} />)}
			</div>
		</section>
	)
}

export default ProductsList
