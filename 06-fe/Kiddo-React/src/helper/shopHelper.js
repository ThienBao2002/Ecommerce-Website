import React from 'react-dom/client';
import { Link } from 'react-router-dom';
import shopblock from '../data/shop/shop.json';
import category from '../data/category.json';



function getProduct(id) {
    return shopblock.filter(product => { return product.id === parseInt(id) })[0];
}
// Count Category
function setCategoriesCount() {
    for (let i = 0; i < category.length; i++) {
        var count = shopblock.filter(product => { return product.category.includes(parseInt(category[i].id)) });
        count = count.length;
        category[i].count = count;
    }
}
setCategoriesCount();
// Recent Product
function changeToMonth(month) {
    var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    return months[month];
}
function setDemoDate() {
    var today = new Date();
    shopblock.slice(0, 3).map(product => {
        product.timestamp = today.getTime() - (3 * 24 * 60 * 60 * 1000);
        // Remove this date on your live demo. This is only used for preview purposed. Your date should actually be updated
        // in the blog.json object
        product.productdate = `${today.getDate() - 2} ${changeToMonth(today.getMonth())}, ${today.getFullYear()}`;
        return product;
    });
}
function getRecentProduct() {
    var elems = shopblock.filter(product => {
        return product.timestamp < new Date(product.productdate);
    });
    return elems;
}
function getFeatured() {
    var elems = shopblock.filter(item => {
        return item.featured === true
    });
    return elems;
}
setDemoDate();
// Related Product
function getProductByCategory(items, pageRoute) {
    var elems = shopblock.filter((product) => { return parseInt(product.id) !== parseInt(pageRoute) && product.category.some(r => items.includes(r)) });
    return elems;
}
// Filter
function getFilteredproducts(products, filter = { cat: '', tag: '', searchQuery: '', priceFilter: [] }) {
    var catgoryFilter = filter.cat !== undefined && filter.cat !== null && filter.cat !== '';
    var tagFilter = filter.tag !== undefined && filter.tag !== null && filter.tag !== '';
    var searchFilter = filter.searchQuery !== undefined && filter.searchQuery !== null && filter.searchQuery !== '';
    var priceFilterValue = filter.newPriceFilter[0] !== undefined && filter.newPriceFilter[1] !== undefined && filter.newPriceFilter[0] !== null && filter.newPriceFilter[1] != null && filter.newPriceFilter[0] !== '' && filter.newPriceFilter[1] !== '';
    // Category filter
    if (catgoryFilter) {
        products = products.filter(product => {
            return (product.category !== undefined && product.category !== null) && product.category.includes(parseInt(filter.cat))
        })
    }
    // Tag filter
    if (tagFilter) {
        products = products.filter(product => {
            return (product.tags !== undefined && product.tags !== null) && product.tags.includes(parseInt(filter.tag))
        })
    }
    // Search Filter
    if (searchFilter) {
        products = products.filter(product => {
            return (product.title !== undefined && product.title !== null) && product.title.toLowerCase().includes(filter.searchQuery.toLowerCase())
        })
    }
    // Price Filter
    if (priceFilterValue) {
        products = products.filter(product => {
            return (product.newPrice !== undefined && product.newPrice !== null) && product.newPrice > filter.newPriceFilter[0] && product.newPrice <= filter.newPriceFilter[1]
        })
    }
    return products;
}
// Pagination
function getProductNavigation(items, index) {
    var output = [],
        id, item;
    if (items[index - 1] !== undefined && index - 1 !== -1) {
        item = items[index - 1];
        id = item.id;
        // Show the previous button 
        output.push(<div key={id} className="sigma_single-pagination-item sigma_single-pagination-prev"> <Link to={"/shop-details/" + parseInt(id)}><div className="sigma_single-pagination-thumb"> <img src={process.env.PUBLIC_URL + "/" + item.image[0]} alt={item.title} /></div><div className="sigma_single-pagination-content"><h6>{item.title}</h6></div> <i className="fas fa-chevron-left" /> </Link></div>
        );
    }
    if (items[index + 1] !== undefined && index <= items.length - 1) {
        // Show next button 
        item = items[index + 1];
        id = item.id;
        output.push(<div key={id} className="sigma_single-pagination-item sigma_single-pagination-next"> <Link to={"/shop-details/" + parseInt(id)}><div className="sigma_single-pagination-thumb"> <img src={process.env.PUBLIC_URL + "/" + item.image[0]} alt={item.title} /></div><div className="sigma_single-pagination-content"><h6>{item.title}</h6></div> <i className="fas fa-chevron-right" /> </Link></div>
        );
    }

    return output;
}
function handleOutofStock() {
    alert('Product Out of Stock')
}
function handleDeleteFromWishlist() {
    alert('Are you sure you want to delete this item from your Wishlist?')
}
function handleDeleteFromCart() {
    alert('Are you sure you want to delete all this item from your cart?')
}
export {getProduct, handleOutofStock, getRecentProduct, getProductByCategory, handleDeleteFromCart, handleDeleteFromWishlist, getFilteredproducts, getProductNavigation, getFeatured };