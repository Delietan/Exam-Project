var express = require('express');
var router = express.Router();
var { isAuth, authIsAdmin } = require('../middleware/middleware.js');
var OrderStatusService = require('../services/OrderStatusService');
var db = require('../models');
var orderstatusService = new OrderStatusService(db);

router.get('/', isAuth, authIsAdmin, async function(req, res, next) {
    // #swagger.tags = ['Orderstatuses']
    // #swagger.summary = 'Retrieve all orderstatuses'
    // #swagger.description = 'Fetches a list of all available orderstatuses.'
    // #swagger.security = [{ "bearerAuth": [] }]
    /*
    #swagger.responses[200] = {
        description: 'Orderstatuses successfully retrieved',
        schema: {
            status: "success",
            statuscode: 200,
            data: {
                result: "Orderstatuses found",
                orderstatuses: [
                    {
                        id: 1,
                        OrderStatus: "In Progress"
                    },
                    {
                        id: 2,
                        OrderStatus: "Ordered"
                    }
                ]
            }
        }
    }

    #swagger.responses[404] = {
        description: 'Not found',
        schema: {
            status: "error",
            statuscode: 404,
            execution: "database called successfully",
            data: { message: "No orderstatuses found" }
        }
    }

    #swagger.responses[500] = {
        description: 'Server error',
        schema: {
            status: "error",
            statuscode: 500,
            data: { 
                result: "An error occurred while fetching orderstatuses",
                error: "Error details"
            }
        }
    }
    */
    try {
        let orderstatuses = await orderstatusService.getAll()

        if (!orderstatuses || orderstatuses.length === 0) {
            return res.status(404).json({
                status: "error",
                statuscode: 404,
                execution: "database called successfully",
                data: { message: "No orderstatuses found" }
            });
        }

        res.status(200).json({
            status: "success",
            statuscode: 200,
            data: {
                result: "Orderstatuses found",
                orderstatuses
            } 
    });
    } catch (error) {
        res.status(500).json({
            status: "error",
            statuscode: 500,
            data: {
                result: "An error occurred while fetching orderstatuses",
                error: error.message
            }
        });
    }
});

router.post('/', isAuth, authIsAdmin, async function(req, res, next) {
    // #swagger.tags = ['Orderstatuses']
    // #swagger.summary = 'Create a new orderstatus'
    // #swagger.description = 'Creates a new orderstatus with the provided name.'
    // #swagger.security = [{ "bearerAuth": [] }]
    /*
    #swagger.parameters['body'] = {
        in: 'body',
        required: true,
        description: 'Request body for adding orderstatus.',
        schema: {
            $orderstatusname: 'Returned'
        }
    }
    #swagger.responses[200] = {
        description: 'Orderstatus successfully created',
        schema: {
            status: "success",
            statuscode: 200,
            data: {
                result: "Orderstatus created",
                id: 4,
                name: "Returned"
            }
        }
    }
    #swagger.responses[500] = {
        description: 'Server error',
        schema: {
            status: "error",
            statuscode: 500,
            data: { 
                result: "An error occurred while creating orderstatus",
                error: "Error details"
            }
        }
    }
    */
    let orderstatusname = req.body.orderstatusname
    
    try {
        let orderstatus = await orderstatusService.create(orderstatusname)
        res.status(200).json({
            status: "success",
            statuscode: 200,
            data: {
                result: "Orderstatus created",
                id: orderstatus.id,
                name: orderstatus.name
            } 
    });
    } catch (error) {
        res.status(500).json({
            status: "error",
            statuscode: 500,
            data: {
                result: "An error occurred while creating orderstatus",
                error: error.message
            }
        });
    }
});

router.put('/:id', isAuth, authIsAdmin, async function(req, res, next) {
    // #swagger.tags = ['Orderstatuses']
    // #swagger.summary = 'Update a orderstatus'
    // #swagger.description = 'Updates the name of a orderstatus by its ID.'
    // #swagger.security = [{ "bearerAuth": [] }]
    /*
    #swagger.parameters['id'] = {
        in: 'path',
        description: 'The ID of the orderstatus to update',
        required: true,
        type: 'integer'
    }
    #swagger.parameters['body'] = {
        in: 'body',
        required: true,
        description: 'Request body for updating orderstatus.',
        schema: {
            $orderstatusname: 'Cancelled'
        }
    }
    #swagger.responses[200] = {
        description: 'Orderstatus successfully updated',
        schema: {
            status: "success",
            statuscode: 200,
            data: {
                result: "Orderstatus updated",
                id: 4,
                name: "Cancelled"
            }
        }
    }
    #swagger.responses[500] = {
        description: 'Server error',
        schema: {
            status: "error",
            statuscode: 500,
            data: { 
                result: "An error occurred while updating orderstatus",
                error: "Error details"
            }
        }
    }
    */
    let id = req.params.id
    let orderstatusname = req.body.orderstatusname
    
    try {
        let orderstatus = await orderstatusService.update(id, orderstatusname)
        res.status(200).json({
            status: "success",
            statuscode: 200,
            data: {
                result: "Orderstatus updated",
                id: orderstatus.id,
                name: orderstatus.name
            } 
    });
    } catch (error) {
        res.status(500).json({
            status: "error",
            statuscode: 500,
            data: {
                result: "An error occurred while updating orderstatus",
                error: error.message
            }
        });
    }
});

router.delete('/:id', isAuth, authIsAdmin, async function(req, res, next) {
    // #swagger.tags = ['Orderstatuses']
    // #swagger.summary = 'Delete a orderstatus'
    // #swagger.description = 'Deletes a orderstatus by its ID. Only accessible to admin users.'
    // #swagger.security = [{ "bearerAuth": [] }]
    /*
    #swagger.parameters['id'] = {
        in: 'path',
        description: 'The ID of the orderstatus to delete',
        required: true,
        type: 'integer'
    }
    #swagger.responses[200] = {
        description: 'Orderstatus successfully deleted',
        schema: {
            status: "success",
            statuscode: 200,
            data: {
                result: "Orderstatus successfully deleted",
                id: 4
            }
        }
    }
    #swagger.responses[500] = {
        description: 'Server error',
        schema: {
            status: "error",
            statuscode: 500,
            data: { 
                result: "An error occurred while deleting orderstatus",
                error: "Error details"
            }
        }
    }
    */
    let id = req.params.id;
    
    try {
        let result = await orderstatusService.delete(id);
        res.status(200).json({
            status: "success",
            statuscode: 200,
            data: {
                result: result.message,
                id: result.id
            } 
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            statuscode: 500,
            data: {
                result: "An error occurred while deleting orderstatus",
                error: error.message
            }
        });
    }
});


module.exports = router;