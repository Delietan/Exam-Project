var express = require('express');
var router = express.Router();
var { isAuth, authIsAdmin } = require('../middleware/middleware.js');
var MembershipService = require('../services/MembershipService');
var db = require('../models');
var membershipService = new MembershipService(db);

router.get('/', isAuth, authIsAdmin, async function(req, res, next) {
    // #swagger.tags = ['Memberships']
    // #swagger.summary = 'Retrieve all memberships'
    /* #swagger.description = "Fetch all memberships stored in the database." */
    // #swagger.security = [{ "bearerAuth": [] }]

    /* #swagger.responses[200] = {
        description: "Successfully retrieved memberships.",
        schema: {
            status: "success",
            statuscode: 200,
            data: {
                result: "Memberships found",
                memberships: [
                    { id: 1, name: "Gold", discount: "10%", threshold: 100 },
                    { id: 2, name: "Silver", discount: "5%", threshold: 50 }
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
            data: { message: "No memberships found" }
        }
    }
    */
    /* #swagger.responses[500] = {
        description: "Internal server error while fetching memberships.",
        schema: {
            status: "error",
            statuscode: 500,
            data: {
                result: "An error occurred while fetching memberships",
                error: "Detailed error message here."
            }
        }
    } */
    try {
        let memberships = await membershipService.getAll();

        if (!memberships || memberships.length === 0) {
            return res.status(404).json({
                status: "error",
                statuscode: 404,
                execution: "database called successfully",
                data: { message: "No memberships found" }
            });
        }

        res.status(200).json({
            status: "success",
            statuscode: 200,
            data: {
                result: "Memberships found",
                memberships
            }
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            statuscode: 500,
            data: {
                result: "An error occurred while fetching memberships",
                error: error.message
            }
        });
    }
});

router.post('/', isAuth, authIsAdmin, async function(req, res, next) {
    // #swagger.tags = ['Memberships']
    // #swagger.summary = 'Create membership'
    /* #swagger.description = "Create a new membership." */
    // #swagger.security = [{ "bearerAuth": [] }]

    /* #swagger.parameters['body'] = {
        in: 'body',
        required: true,
        description: "Membership details.",
        schema: {
            name: "Gold",
            discount: "10%",
            threshold: 100
        }
    } */

    /* #swagger.responses[200] = {
        description: "Successfully created a membership.",
        schema: {
            status: "success",
            statuscode: 200,
            data: {
                result: "Membership created",
                membership: {
                    id: 1,
                    name: "Gold",
                    discount: "10%",
                    threshold: 100
                }
            }
        }
    } */

    /* #swagger.responses[500] = {
        description: "Internal server error while creating membership.",
        schema: {
            status: "error",
            statuscode: 500,
            data: {
                result: "An error occurred while creating membership",
                error: "Detailed error message here."
            }
        }
    } */
    let { name, discount, threshold } = req.body;

    try {
        let membership = await membershipService.create(name, discount, threshold);
        res.status(200).json({
            status: "success",
            statuscode: 200,
            data: {
                result: "Membership created",
                membership
            }
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            statuscode: 500,
            data: {
                result: "An error occurred while creating membership",
                error: error.message
            }
        });
    }
});

router.put('/:id', isAuth, authIsAdmin, async function(req, res, next) {
    // #swagger.tags = ['Memberships']
    // #swagger.summary = 'Update membership'
    /* #swagger.description = "Update an existing membership by ID." */
    // #swagger.security = [{ "bearerAuth": [] }]

    /* #swagger.parameters['id'] = {
        in: 'path',
        required: true,
        description: "The ID of the membership to update.",
        type: "integer"
    } */

    /* #swagger.parameters['body'] = {
        in: 'body',
        required: true,
        description: "Updated membership details.",
        schema: {
            name: "Platinum",
            discount: "45%",
            threshold: 50
        }
    } */

    /* #swagger.responses[200] = {
        description: "Successfully updated the membership.",
        schema: {
            status: "success",
            statuscode: 200,
            data: {
                result: "Membership updated",
                membership: {
                    id: 1,
                    name: "Platinum",
                    discount: "45%",
                    threshold: 50
                }
            }
        }
    } */

    /* #swagger.responses[500] = {
        description: "Internal server error while updating membership.",
        schema: {
            status: "error",
            statuscode: 500,
            data: {
                result: "An error occurred while updating membership",
                error: "Detailed error message here."
            }
        }
    } */
    let id = req.params.id;
    const dataToSend = {
        name: req.body.name, 
        discount: req.body.discount, 
        threshold: req.body.threshold
      }

    try {
        let membership = await membershipService.updateById(id, dataToSend);
        res.status(200).json({
            status: "success",
            statuscode: 200,
            data: {
                result: "Membership updated",
                membership
            }
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            statuscode: 500,
            data: {
                result: "An error occurred while updating membership",
                error: error.message
            }
        });
    }
});

router.delete('/:id', isAuth, authIsAdmin, async function(req, res, next) {
    // #swagger.tags = ['Memberships']
    // #swagger.summary = 'Delete membership'
    /* #swagger.description = "Delete a membership by ID." */
    // #swagger.security = [{ "bearerAuth": [] }]

    /* #swagger.parameters['id'] = {
        in: 'path',
        required: true,
        description: "The ID of the membership to delete.",
        type: "integer"
    } */

    /* #swagger.responses[200] = {
        description: "Successfully deleted the membership.",
        schema: {
            status: "success",
            statuscode: 200,
            data: {
                result: "Membership deleted",
                id: 1
            }
        }
    } */

    /* #swagger.responses[500] = {
        description: "Internal server error while deleting membership.",
        schema: {
            status: "error",
            statuscode: 500,
            data: {
                result: "An error occurred while deleting membership",
                error: "Detailed error message here."
            }
        }
    } */
    let id = req.params.id;

    try {
        let result = await membershipService.delete(id);
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
                result: "An error occurred while deleting membership",
                error: error.message
            }
        });
    }
});

module.exports = router;