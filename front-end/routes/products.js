var express = require('express');
var router = express.Router();
var { isAuth, authIsAdmin } = require('../middleware/middleware.js');

router.get('/', isAuth, authIsAdmin, async function(req, res, next) {
    // #swagger.summary = 'View products'
    let query = req.query.search || ''
    let searchBarText = query || "Search for a product, brand or category...";
    let token = req.cookies.token
    console.log("-- TOKEN USED:" + token)
    try {
        const response = await fetch(`http://localhost:3001/products/search?search=${query}`, {
        method: 'POST',
        credentials: 'include',
        headers: {
            authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        }
        });

        const categoriesResponse = await fetch('http://localhost:3001/categories/', {
            method: 'GET',
            credentials: 'include',
            headers: {
                authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            }
        });

        const brandsResponse = await fetch('http://localhost:3001/brands/', {
            method: 'GET',
            credentials: 'include',
            headers: {
                authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            }
        });

        const data = await response.json();
        const categoriesData = await categoriesResponse.json();
        const brandsData = await brandsResponse.json();

        res.render('products', { 
            products: data.data.products || [],
            searchBarText,
            categories: categoriesData.data.categories,
            brands: brandsData.data.brands });
    } catch (error) {
        console.error('Error fetching products:', error);
        res.send('error. unhandled condition');
    }
});

module.exports = router;