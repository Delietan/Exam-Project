var express = require('express');
var router = express.Router();
var { isAuth, authIsAdmin } = require('../middleware/middleware.js');
var OrderService = require('../services/OrderService.js');
var OrderStatusService = require('../services/OrderStatusService.js');
var db = require('../models/index.js');
var orderService = new OrderService(db);
var orderStatusService = new OrderStatusService(db);

router.get('/', isAuth, authIsAdmin, async (req, res) => {
    // #swagger.tags = ['Orders']
    // #swagger.summary = 'Retrieve all order'
    /* #swagger.description = "Fetch all orders from the database." */
    // #swagger.security = [{ "bearerAuth": [] }]

    /* #swagger.responses[200] = {
    description: "Successfully retrieved orders.",
        schema: {
            status: "success",
            statuscode: 200,
            data: {
                result: "Orders found",
                orders: [
                    {
                        "id": 1,
                        "uniqueId": "8aaaad1b",
                        "capturedMembershipId": 2,
                        "capturedMembershipName": "Silver",
                        "capturedMembershipDiscount": "15%",
                        "createdAt": "2025-02-22T19:34:23.000Z",
                        "updatedAt": "2025-02-28T20:12:14.000Z",
                        "OrderStatusId": 1,
                        "UserId": 1,
                        "OrderStatusName": "In Progress",
                        "TotalQuantity": "4",
                        "TotalPrice": "850.00",
                        "OriginalPrice": "1000.00"
                    },
                    {
                        "id": 2,
                        "uniqueId": "j483mdlq",
                        "capturedMembershipId": 3,
                        "capturedMembershipName": "Gold",
                        "capturedMembershipDiscount": "30%",
                        "createdAt": "2025-02-04T16:34:16.000Z",
                        "updatedAt": "2025-02-07T05:12:14.000Z",
                        "OrderStatusId": 2,
                        "UserId": 7,
                        "OrderStatusName": "Ordered",
                        "TotalQuantity": "7",
                        "TotalPrice": "700.00",
                        "OriginalPrice": "1000.00"
                    }
                ]
            }
        }
    } */

    /* 
    
    #swagger.responses[404] = {
        description: 'Not found',
        schema: {
            status: "error",
            statuscode: 404,
            execution: "database called successfully",
            data: { message: "No orders found" }
        }
    }

    #swagger.responses[500] = {
        description: "Internal server error while fetching orders.",
        schema: {
            status: "error",
            statuscode: 500,
            data: { message: "Failed to retrieve orders" }
        }
    } */
    try {
        let orders = await orderService.getAll()

        if (!orders || orders.length === 0) {
            return res.status(404).json({
                status: "error",
                statuscode: 404,
                execution: "database called successfully",
                data: { message: "No orders found" }
            });
        }

        res.status(200).json({
            status: "success",
            statuscode: 200,
            data: {
                result: "Orders found",
                orders
            }
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            statuscode: 500,
            data: { message: "Failed to retrieve orders" }
        });
    }
});

router.get('/:orderId', isAuth, authIsAdmin, async (req, res) => {
    // #swagger.tags = ['Orders']
    // #swagger.summary = 'Retrieve all order'
    /* #swagger.description = "Fetch a single order from the database." */
    // #swagger.security = [{ "bearerAuth": [] }]

    /* #swagger.parameters['orderId'] = {
        in: 'path',
        required: true,
        description: "The ID of the order to retrieve.",
        type: "integer"
    } */

    /* #swagger.responses[200] = {
    description: "Successfully retrieved orders.",
        schema: {
            status: "success",
            statuscode: 200,
            data: {
                result: "Order found",
                orders: [
                    {
                        "id": 1,
                        "uniqueId": "8aaaad1b",
                        "capturedMembershipId": 2,
                        "capturedMembershipName": "Silver",
                        "capturedMembershipDiscount": "15%",
                        "createdAt": "2025-02-22T19:34:23.000Z",
                        "updatedAt": "2025-02-28T20:12:14.000Z",
                        "OrderStatusId": 1,
                        "UserId": 1,
                        "OrderStatusName": "In Progress",
                        "TotalQuantity": "4",
                        "TotalPrice": "850.00",
                        "OriginalPrice": "1000.00"
                    }
                ]
            }
        }
    } */

    /* 
    
    #swagger.responses[404] = {
        description: 'Not found',
        schema: {
            status: "error",
            statuscode: 404,
            execution: "database called successfully",
            data: { message: "Order not found" }
        }
    }

    #swagger.responses[500] = {
        description: "Internal server error while fetching orders.",
        schema: {
            status: "error",
            statuscode: 500,
            data: { message: "Failed to retrieve products" }
        }
    } */
    try {
        let orders = await orderService.getOne(req.params.orderId)

        if (!orders || orders.length === 0) {
            return res.status(404).json({
                status: "error",
                statuscode: 404,
                execution: "database called successfully",
                data: { message: "Order not found" }
            });
        }

        res.status(200).json({
            status: "success",
            statuscode: 200,
            data: {
                result: "Order found",
                orders
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

router.get('/my', isAuth, async (req, res) => {
    // #swagger.tags = ['Orders']
    // #swagger.summary = 'Retrieve user's orders'
    /* #swagger.description = "Fetch orders belonging to the authenticated user." */
    // #swagger.security = [{ "bearerAuth": [] }]

    /* #swagger.security = [{
        "BearerAuth": []
    }] */

    /* #swagger.responses[200] = {
        description: "Successfully retrieved user orders.",
        schema: {
            status: "success",
            statuscode: 200,
            data: {
                result: "Orders found",
                orders: [
                    { id: 1, userId: 10, statusId: 2, createdAt: "2024-03-01T12:00:00Z" }
                ]
            }
        }
    } */

    /* 
    
    #swagger.responses[404] = {
        description: 'Not found',
        schema: {
            status: "error",
            statuscode: 404,
            execution: "database called successfully",
            data: { message: "No orders found for this user" }
        }
    }

    #swagger.responses[500] = {
        description: "Internal server error while fetching user orders.",
        schema: {
            status: "error",
            statuscode: 500,
            data: { message: "Failed to retrieve orders" }
        }
    } */
    try {
        let orders = await orderService.getMyOrders(req.user.id)

        if (!orders || orders.length === 0) {
            return res.status(404).json({
                status: "error",
                statuscode: 404,
                execution: "database called successfully",
                data: { message: "No orders found for this user" }
            });
        }

        res.status(200).json({
            status: "success",
            statuscode: 200,
            data: {
                result: "Orders found",
                orders
            }
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            statuscode: 500,
            data: { message: "Failed to retrieve orders" }
        });
    }
});

router.get('/my/:orderId', isAuth, async (req, res) => {
    // #swagger.tags = ['Orders']
    // #swagger.summary = 'Retrieve specific order'
    /* #swagger.description = "Fetch details of a single order belonging to the authenticated user." */
    // #swagger.security = [{ "bearerAuth": [] }]

    /* #swagger.parameters['orderId'] = {
        in: 'path',
        required: true,
        description: "The ID of the order to retrieve.",
        type: "integer"
    } */

    /* #swagger.responses[200] = {
        description: "Successfully retrieved order details.",
        schema: {
            status: "success",
            statuscode: 200,
            data: {
                result: "Products found",
                orders: [
                    { productId: 5, quantity: 2 },
                    { productId: 8, quantity: 1 }
                ]
            }
        }
    } */

    /* #swagger.responses[404] = {
        description: 'Not found',
        schema: {
            status: "error",
            statuscode: 404,
            execution: "database called successfully",
            data: { message: "Order not found" }
        }
    } */

    /* #swagger.responses[500] = {
        description: "Internal server error while fetching order.",
        schema: {
            status: "error",
            statuscode: 500,
            data: { message: "Failed to retrieve order" }
        }
    } */
    try {
        let orders = await orderService.getOrderItems(req.user.id, req.params.orderId)
        
        if (!orders || orders.length === 0) {
            return res.status(404).json({
                status: "error",
                statuscode: 404,
                execution: "database called successfully",
                data: { message: "Order not found" }
            });
        }
        
        res.status(200).json({
            status: "success",
            statuscode: 200,
            data: {
                result: "Products found",
                orders
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

router.get('/inspect/:orderId', isAuth, authIsAdmin, async (req, res) => {
    // #swagger.tags = ['Orders']
    // #swagger.summary = 'Retrieve specific order'
    /* #swagger.description = "Lets an admin fetch details of a specific order." */
    // #swagger.security = [{ "bearerAuth": [] }]

    /* #swagger.parameters['orderId'] = {
        in: 'path',
        required: true,
        description: "The ID of the order to retrieve.",
        type: "integer"
    } */

    /* #swagger.responses[200] = {
        description: "Successfully retrieved order details.",
        schema: {
            status: "success",
            statuscode: 200,
            data: {
                result: "Products found",
                orders: [
                    { productId: 5, quantity: 2 },
                    { productId: 8, quantity: 1 }
                ]
            }
        }
    } */

    /* #swagger.responses[404] = {
        description: 'Not found',
        schema: {
            status: "error",
            statuscode: 404,
            execution: "database called successfully",
            data: { message: "Order not found" }
        }
    } */

    /* #swagger.responses[500] = {
        description: "Internal server error while fetching order.",
        schema: {
            status: "error",
            statuscode: 500,
            data: { message: "Failed to retrieve order" }
        }
    } */
    try {
        let order = await orderService.adminInspectOrder(req.params.orderId)
        
        if (!order || order.length === 0) {
            return res.status(404).json({
                status: "error",
                statuscode: 404,
                execution: "database called successfully",
                data: { message: "Order not found" }
            });
        }
        
        res.status(200).json({
            status: "success",
            statuscode: 200,
            data: {
                result: "Products found",
                order
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

router.put('/:id', isAuth, authIsAdmin, async (req, res) => {
    // #swagger.tags = ['Orders']
    // #swagger.summary = 'Update order status'
    /* #swagger.description = "Update the status of an existing order." */
    // #swagger.security = [{ "bearerAuth": [] }]

    /* #swagger.parameters['id'] = {
        in: 'path',
        required: true,
        description: "The ID of the order to update.",
        type: "integer"
    } */

    /* #swagger.parameters['body'] = {
        in: 'body',
        required: true,
        description: "New order status ID.",
        schema: {
            statusid: 2
        }
    } */

    /* #swagger.responses[200] = {
        description: "Successfully updated order status.",
        schema: {
            status: "success",
            statuscode: 200,
            data: { message: "Order status updated successfully" }
        }
    } */

    /* #swagger.responses[500] = {
        description: "Internal server error while updating order status.",
        schema: {
            status: "error",
            statuscode: 500,
            data: { message: "Error message here" }
        }
    } */
    let id = req.params.id;
    let newStatusId = req.body.statusid
    try {
        let result = await orderService.update(id, newStatusId);
        res.status(200).json({
            status: "success",
            statuscode: 200,
            data: result
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            statuscode: 500,
            data: { message: error.message }
        });
    }
});

router.delete('/:id', isAuth, authIsAdmin, async (req, res) => {
    // #swagger.tags = ['Orders']
    // #swagger.summary = 'Delete order'
    /* #swagger.description = "Delete an order by ID." */
    // #swagger.security = [{ "bearerAuth": [] }]

    /* #swagger.parameters['id'] = {
        in: 'path',
        required: true,
        description: "The ID of the order to delete.",
        type: "integer"
    } */

    /* #swagger.responses[200] = {
        description: "Successfully deleted the order.",
        schema: {
            status: "success",
            statuscode: 200,
            data: { message: "Order deleted successfully" }
        }
    } */

    /* #swagger.responses[500] = {
        description: "Internal server error while deleting order.",
        schema: {
            status: "error",
            statuscode: 500,
            data: { message: "Error message here" }
        }
    } */
    let id = req.params.id;

    try {
        let result = await orderService.delete(id);
        res.status(200).json({
            status: "success",
            statuscode: 200,
            data: result
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            statuscode: 500,
            data: { message: error.message }
        });
    }
});

module.exports = router;