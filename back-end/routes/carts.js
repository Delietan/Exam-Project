var express = require('express');
var router = express.Router();
var { isAuth, authIsAdmin } = require('../middleware/middleware.js');
var CartService = require('../services/CartService');
var db = require('../models');
var cartService = new CartService(db);

router.get('/', isAuth, async function(req, res, next) {
    // #swagger.tags = ['Carts']
    // #swagger.summary = 'Retrieve the cart of the authenticated user'
    // #swagger.description = 'Fetches the cart details of the currently logged-in user, including products added to the cart.'
    // #swagger.security = [{ "bearerAuth": [] }]
    /*
    #swagger.responses[200] = {
        description: 'Successfully retrieved cart',
        schema: {
            status: "success",
            statuscode: 200,
            data: {
                result: "Products in cart found",
                userid: 1,
                cart: [
                    {
                        productId: 101,
                        name: "Product Name",
                        quantity: 2,
                        price: 50
                    }
                ]
            }
        }
    }
    #swagger.responses[401] = {
        description: 'Unauthorized access - User is not authenticated',
        schema: {
            status: "error",
            statuscode: 401,
            data: { message: "Unauthorized" }
        }
    }

    #swagger.responses[404] = {
        description: 'Not found',
        schema: {
            status: "error",
            statuscode: 404,
            execution: "database called successfully",
            data: { message: "No carts found" }
        }
    }

    #swagger.responses[500] = {
        description: 'Server error',
        schema: {
            status: "error",
            statuscode: 500,
            data: { message: "Internal Server Error" }
        }
    }
    */
    try {
        let cart = await cartService.getCart(req.user.id);

        if (!cart || cart.length === 0) {
            return res.status(404).json({
                status: "error",
                statuscode: 404,
                execution: "database called successfully",
                data: { message: "No items in cart found" }
            });
        }

        res.status(200).json({
            status: "success",
            statuscode: 200,
            data: {
                result: "Products in cart found",
                userid: req.user.id,
                cart
            } 
        });
    } catch (err) {
        res.status(500).json({
            status: "error",
            statuscode: 500,
            data: {
                result: "An error occurred while fetching cart",
                error: err.message
            }
        });
    }
});

router.post('/add', isAuth, async function(req, res, next) {
    // #swagger.tags = ['Carts']
    // #swagger.summary = 'Add a product to the user’s cart'
    // #swagger.description = 'Allows an authenticated user to add a product to their cart. If the product already exists in the cart, the quantity will be updated.'
    // #swagger.security = [{ "bearerAuth": [] }]
    /*
    #swagger.parameters['body'] = {
        in: 'body',
        description: 'Product data to be added to the cart',
        required: true,
        schema: {
            id: 101,
            quantity: 2
        }
    }
    #swagger.responses[200] = {
        description: 'Product successfully added to cart',
        schema: {
            status: "success",
            statuscode: 200,
            data: {
                message: "Product added to cart successfully",
                product: {
                    id: 2
                },
                cartQuantity: 1,
                remainingStock: 9
            }
        }
    }
    #swagger.responses[400] = {
        description: 'Bad request - Missing required product ID',
        schema: {
            status: "error",
            statuscode: 400,
            data: {
                message: "Only 10 units are available in stock.",
                availableStock: 10
    }
        }
    }
    #swagger.responses[500] = {
        description: 'Server error',
        schema: {
            status: "error",
            statuscode: 500,
            data: { message: "Internal Server Error" }
        }
    }
    */
    try {
        const { id, quantity } = req.body;
        
        const result = await cartService.addItem(req.user.id, id, quantity);
    
        res.status(result.statuscode).json(result);
    } catch (err) {
        res.status(500).json({
            status: "error",
            statuscode: 500,
            data: {
                message: "An error occurred while adding item",
                error: err.message
            }
        });
    }
    
});

router.post('/checkout/now', isAuth, async function(req, res, next) {
    // #swagger.tags = ['Carts']
    // #swagger.summary = 'Checkout and place an order'
    // #swagger.description = 'Allows the user to checkout and place an order using the products in their cart.'
    // #swagger.security = [{ "bearerAuth": [] }]
    /*
    #swagger.responses[200] = {
        description: 'Order successfully placed',
        schema: {
            status: "success",
            statuscode: 200,
            data: { orderId: 1234, message: "Order placed successfully" }
        }
    }
    #swagger.responses[400] = {
        description: 'Bad request - Cart is empty',
        schema: {
            status: "error",
            statuscode: 400,
            data: { result: "Your cart is empty. Add products before checkout." }
        }
    }
    #swagger.responses[500] = {
        description: 'Server error',
        schema: {
            status: "error",
            statuscode: 500,
            data: { message: "Internal Server Error" }
        }
    }
    */
    try {
        const result = await cartService.makeOrder(req.user.id);

        if (result.emptyCart) {
            return res.status(400).json({
                status: "error",
                statuscode: 400,
                data: { result: "Your cart is empty. Add products before checkout." }
            });
        }

        if (result.emptyStock) {
            return res.status(400).json({
                status: "error",
                statuscode: 400,
                data: { 
                    result: "Item out of stock."
                }
            });
        }

        res.status(200).json({
            status: "success",
            statuscode: 200,
            data: result
        });
    } catch (err) {
        res.status(500).json({
            status: "error",
            statuscode: 500,
            data: {
                result: "An error occurred while placing order",
                error: err.message
            }
        });
    }
});


module.exports = router;