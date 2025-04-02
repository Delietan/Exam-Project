var express = require('express');
var router = express.Router();
var { checkForUserId, isAuth, authIsAdmin } = require('../middleware/middleware.js');
var ProductService = require('../services/ProductService');
var db = require('../models');
var productService = new ProductService(db);


router.get('/', isAuth, async (req, res) => {
    // #swagger.tags = ['Products']
    // #swagger.summary = 'Retrieve all products'
    /* #swagger.description = "Retrieve all products for the authenticated user." */
    // #swagger.security = [{ "bearerAuth": [] }]

    /* #swagger.responses[200] = {
        description: "Successfully retrieved products.",
        schema: {
            status: "success",
            statuscode: 200,
            data: {
                userId: 1,
                result: "Products found",
                products: [
                    {                 
                        "id": 1,
                        "name": "iPhone 6s Plus 16Gb",
                        "description": "3D Touch. 12MP photos. 4K video.",
                        "PriceWithoutDiscount": "649.00",
                        "unitprice": "649.00",
                        "date_added": "2022-05-01T00:00:00",
                        "imgurl": "http://images.restapi.co.za/products/product-iphone.png",
                        "quantity": 2,
                        "isdeleted": 0,
                        "createdAt": "2025-03-04T01:21:02.000Z",
                        "BrandId": 1,
                        "CategoryId": 1,
                        "brand": "Apple",
                        "category": "Phones" 
                    },
                ]
            }
        }
    } */

    /* #swagger.responses[404] = {
        description: "No products found.",
        schema: {
            status: "error",
            statuscode: 404,
            data: { message: "No products found" }
        }
    } */

    /* #swagger.responses[500] = {
        description: "Internal server error while fetching products.",
        schema: {
            status: "error",
            statuscode: 500,
            data: { message: "Failed to retrieve products" }
        }
    } */

    try {
        let products = [];
        if (req.user.id === 1) {
            products = await productService.getAllAdmin(req.user.id);
        } else {
            products = await productService.getAll(req.user.id);
        }

        if (!products || products.length === 0) {
            return res.status(404).json({
                status: "error",
                statuscode: 404,
                execution: "database called successfully",
                data: { message: "No products found" }
            });
        }

        res.status(200).json({
            status: "success",
            statuscode: 200,
            data: {
                userId: req.user.id,
                result: "Products found",
                products
            }
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            statuscode: 500,
            data: { message: "Failed to retrieve products" }
        });
    }
});

router.get('/:id', isAuth, async (req, res) => {
    // #swagger.tags = ['Products']
    // #swagger.summary = 'Retrieve a single product by ID'
    /* #swagger.description = "Retrieve a single product for the authenticated user." */
    // #swagger.security = [{ "bearerAuth": [] }]

    /* #swagger.parameters['id'] = {
        in: 'path',
        required: true,
        description: 'Product ID to fetch',
        schema: { $type: 'integer', $example: 1 }
    } */

    /* #swagger.responses[200] = {
        description: "Successfully retrieved product.",
        schema: {
            status: "success",
            statuscode: 200,
            data: {
                userId: 1,
                result: "Product found",
                product: 
                    { 
                        "id": 1,
                        "name": "iPhone 6s Plus 16Gb",
                        "description": "3D Touch. 12MP photos. 4K video.",
                        "PriceWithoutDiscount": "649.00",
                        "unitprice": "649.00",
                        "date_added": "2022-05-01T00:00:00",
                        "imgurl": "http://images.restapi.co.za/products/product-iphone.png",
                        "quantity": 2,
                        "isdeleted": 0,
                        "createdAt": "2025-03-04T01:21:02.000Z",
                        "BrandId": 1,
                        "CategoryId": 1,
                        "brand": "Apple",
                        "category": "Phones" 
                    }
                }   
            }
        } 
    */

    /* #swagger.responses[404] = {
        description: "Product not found.",
        schema: {
            status: "error",
            statuscode: 404,
            data: { message: "Product not found" }
        }
    } */

    /* #swagger.responses[500] = {
        description: "Internal server error while fetching the product.",
        schema: {
            status: "error",
            statuscode: 500,
            data: { message: "Failed to retrieve product" }
        }
    } */

    try {
        const { id } = req.params;
        let product = null;

        if (req.user.id === 1) {
            product = await productService.getSingleAdmin(id, req.user.id);
        } else {
            product = await productService.getSingle(id, req.user.id);
        }

        if (!product) {
            return res.status(404).json({
                status: "error",
                statuscode: 404,
                execution: "database called successfully",
                data: { message: "Product not found" }
            });
        }

        res.status(200).json({
            status: "success",
            statuscode: 200,
            data: {
                userId: req.user.id,
                result: "Product found",
                product
            }
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            statuscode: 500,
            data: { message: "Failed to retrieve product" }
        });
    }
});

router.post('/addProductsFromAPI', async (req, res) => {
    // #swagger.tags = ['Deployment and Maintenance']
    // #swagger.summary = 'Populate products. Used for testing.'
    // #swagger.description = 'Fetches multiple real products from an external API and adds them to the database.'
    // #swagger.security = [{ "bearerAuth": [] }]
    
    /*
    #swagger.responses[201] = {
        description: 'Products successfully added',
        schema: {
            status: "success",
            statuscode: 201,
            data: [{ 
                id: 1,
                name: "Sample Product",
                description: "A sample product",
                price: 100,
                quantity: 10,
                brand: "Brand Name",
                category: "Category Name",
                imgurl: "https://example.com/image.jpg"
            }]
        }
    }
    #swagger.responses[500] = {
        description: 'Failed to add multiple products',
        schema: {
            status: "error",
            statuscode: 500,
            data: { message: "Failed to add multiple products" }
        }
    }
    */
    try {
        let results = await productService.addProductsFromAPI();

        res.status(201).json({
            status: "success",
            statuscode: 201,
            data: results
        });

    } catch (error) {
        res.status(500).json({
            status: "error",
            statuscode: 500,
            data: { message: error.message || "Failed to add multiple products" }
        });
    }
});

router.post('/fakeAddProductsFromAPI', async (req, res) => {
    // #swagger.tags = ['Deployment and Maintenance']
    // #swagger.summary = 'Populate products. Used for testing.'
    // #swagger.description = 'Reads local json file with multiple products and adds them to the database.'
    // #swagger.security = [{ "bearerAuth": [] }]
    
    /*
    #swagger.responses[201] = {
        description: 'Products successfully added',
        schema: {
            status: "success",
            statuscode: 201,
            data: [{ 
                id: 1,
                name: "Sample Product",
                description: "A sample product",
                price: 100,
                quantity: 10,
                brand: "Brand Name",
                category: "Category Name",
                imgurl: "https://example.com/image.jpg"
            }]
        }
    }
    #swagger.responses[500] = {
        description: 'Failed to add multiple products',
        schema: {
            status: "error",
            statuscode: 500,
            data: { message: "Failed to add multiple products" }
        }
    }
    */
    try {
        let results = await productService.fakeAddProductsFromAPI();

        res.status(201).json({
            status: "success",
            statuscode: 201,
            data: results
        });

    } catch (error) {
        res.status(500).json({
            status: "error",
            statuscode: 500,
            data: { message: error.message || "Failed to add multiple products" }
        });
    }
});

router.post('/search', checkForUserId, async (req, res) => {
    // #swagger.tags = ['Products']
    // #swagger.summary = 'Search'
    /* #swagger.description = "Search for products based on a query. The search is also based on your role, and does not returned soft-deleted items if you are not admin." */
    // #swagger.security = [{ "bearerAuth": [] }]
    
    /* #swagger.parameters['search'] = {
        in: "query",
        required: true,
        description: "Search query string",
        type: "string"
    } */

    /* #swagger.responses[200] = {
        description: "Successfully retrieved search results.",
        schema: {
            status: "success",
            statuscode: 200,
            itemsFound: 2,
            data: {
                userId: 1,
                result: "Products found",
                products: [
                    {
                        "name": "iPhone SE 32/64Gb",
                        "id": 3,
                        "description": "A big step for small",
                        "PriceWithoutDiscount": "499.00",
                        "unitprice": "384.2300",
                        "date_added": "2021-09-15T00:00:00",
                        "imgurl": "http://images.restapi.co.za/products/product-iphone-se.png",
                        "quantity": 15,
                        "isdeleted": 0,
                        "createdAt": "2025-02-28T23:33:30.000Z",
                        "BrandId": 1,
                        "CategoryId": 1,
                        "brand": "Apple",
                        "category": "21"
                    }
                ]
            }
        }
    } */

    /* #swagger.responses[500] = {
        description: "Internal server error while searching products.",
        schema: {
            status: "error",
            statuscode: 500,
            data: { message: "Failed to search products" }
        }
    } */
    const query = req.query.search;
    const userId = req.user.id;

    try {
        // const products = await productService.search(query, userId);
        let products = []
        if (req.user.id === 1){
            products = await productService.searchAdmin(query, userId);
        } else {
            products = await productService.search(query, userId);
        }

        if (products.length == 0) {
            return res.status(404).json({
                status: "error",
                statuscode: 404,
                execution: "query successful",
                query: req.query.search,
                data: { 
                    message: "No products found" }
            });
        }

        res.status(200).json({
            status: "success",
            statuscode: 200,
            query: req.query.search,
            itemsFound: products.length,
            data: {
                userId,
                result: "Products found",
                products
            }
        });

    } catch (error) {
        res.status(500).json({
            status: "error",
            statuscode: 500,
            data: { message: error.message || "Failed to search products" }
        });
    }
});

router.delete('/:id', isAuth, authIsAdmin, async function(req, res) {
    // #swagger.tags = ['Products']
    // #swagger.summary = 'Soft delete a product'
    /* #swagger.description = "Soft delete a product by ID." */
    // #swagger.security = [{ "bearerAuth": [] }]
    
    /* #swagger.parameters['id'] = {
        in: "path",
        required: true,
        description: "ID of the product to delete",
        type: "integer"
    } */

    /* #swagger.responses[200] = {
        description: "Product deleted successfully.",
        schema: {
            status: "success",
            statuscode: 200,
            data: { result: "Product deleted successfully" }
        }
    } */

    /* #swagger.responses[500] = {
        description: "Internal server error while deleting product.",
        schema: {
            status: "error",
            statuscode: 500,
            data: { message: "An error occurred while deleting the product" }
        }
    } */
    try {
        const id = req.params.id;

        const result = await productService.fakeDelete(id);

        res.status(200).json({
            status: "success",
            statuscode: 200,
            data: { result: result.message }
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            statuscode: 500,
            data: {
                result: "An error occurred while deleting the product",
                error: error.message
            }
        });
    }
});

router.delete('/realdelete/:id', isAuth, authIsAdmin, async function(req, res) {
    // #swagger.tags = ['Products']
    // #swagger.summary = 'Hard delete a product'
    /* #swagger.description = "Hard delete a product by ID." */
    // #swagger.security = [{ "bearerAuth": [] }]
    
    /* #swagger.parameters['id'] = {
        in: "path",
        required: true,
        description: "ID of the product to delete",
        type: "integer"
    } */

    /* #swagger.responses[200] = {
        description: "Product deleted successfully.",
        schema: {
            status: "success",
            statuscode: 200,
            data: { result: "Product deleted successfully" }
        }
    } */

    /* #swagger.responses[500] = {
        description: "Internal server error while deleting product.",
        schema: {
            status: "error",
            statuscode: 500,
            data: { message: "An error occurred while deleting the product" }
        }
    } */
    try {
        let id = req.params.id;
        await productService.deleteById(id);

        res.status(200).json({
            status: "success",
            statuscode: 200,
            data: { result: "Product deleted successfully" }
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            statuscode: 500,
            data: {
                result: "An error occurred while deleting the product",
                error: error.message
            }
        });
    }
});

router.put('/:id', isAuth, authIsAdmin, async function(req, res) {
    // #swagger.tags = ['Products']
    // #swagger.summary = 'Update a product'
    /* #swagger.description = "Update a product by ID." */
    // #swagger.security = [{ "bearerAuth": [] }]
    
    /* #swagger.parameters['id'] = {
        in: "path",
        required: true,
        description: "ID of the product to update",
        type: "integer"
    } */
    /* #swagger.parameters['body'] = {
        in: "body",
        required: true,
        schema: {
            name: "Updated Product",
            description: "Updated description",
            quantity: 15,
            unitprice: 29.99,
            imgurl: "http://example.com/new-image.jpg",
            brandid: 1,
            categoryid: 2
        }
    } */
    
    /* #swagger.responses[200] = {
        description: "Product updated successfully.",
        schema: {
            status: "success",
            statuscode: 200,
            data: { result: "Product updated successfully" }
        }
    } */

    /* #swagger.responses[500] = {
        description: "Internal server error while updating product.",
        schema: {
            status: "error",
            statuscode: 500,
            data: { message: "An error occurred while updating the product" }
        }
    } */
    try {
        let id = req.params.id;
        const dataToSend = {
          name: req.body.name, 
          description: req.body.description, 
          quantity: req.body.quantity, 
          unitprice: req.body.unitprice, 
          imgurl: req.body.imgurl, 
          brandid: req.body.brandid, 
          categoryid: req.body.categoryid, 
        }
        await productService.updateById(id, dataToSend);

        res.status(200).json({
            status: "success",
            statuscode: 200,
            data: { result: "Product updated successfully" }
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            statuscode: 500,
            data: {
                result: "An error occurred while updating the product",
                error: error.message
            }
        });
    }
});

router.post('/', isAuth, authIsAdmin, async function(req, res) {
    // #swagger.tags = ['Products']
    // #swagger.summary = 'Create a product'
    /* #swagger.description = "Create a new product." */
    // #swagger.security = [{ "bearerAuth": [] }]
    
    /* #swagger.parameters['body'] = {
        in: "body",
        required: true,
        schema: {
            name: "Product A",
            description: "A sample product",
            quantity: 10,
            unitprice: 19.99,
            imgurl: "http://example.com/image.jpg",
            brandid: 1,
            categoryid: 2
        }
    } */
    
    /* #swagger.responses[201] = {
        description: "Product created successfully.",
        schema: {
            status: "success",
            statuscode: 201,
            data: { 
                result: "Product created successfully",
                id: 1,
                name: "Product A"
            }
        }
    } */

    /* #swagger.responses[500] = {
        description: "Internal server error while creating product.",
        schema: {
            status: "error",
            statuscode: 500,
            data: { message: "An error occurred while creating the product" }
        }
    } */
    try {
        const dataToSend = {
          name: req.body.name, 
          description: req.body.description, 
          quantity: req.body.quantity, 
          unitprice: req.body.unitprice, 
          imgurl: req.body.imgurl, 
          brandid: req.body.brandid, 
          categoryid: req.body.categoryid, 
        }
        const product = await productService.create(dataToSend);

        res.status(201).json({
            status: "success",
            statuscode: 201,
            data: { 
                result: "Product created successfully",
                id: product.id,
                name: product.Name
            }
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            statuscode: 500,
            data: {
                result: "An error occurred while creating the product",
                error: error.message
            }
        });
    }
});

module.exports = router;