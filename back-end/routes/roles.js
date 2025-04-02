var express = require('express');
var router = express.Router();
var { isAuth, authIsAdmin } = require('../middleware/middleware.js');
var RoleService = require('../services/RoleService');
var db = require('../models');
var roleService = new RoleService(db);

router.get('/', isAuth, authIsAdmin, async function(req, res, next) {
    // #swagger.tags = ['Roles']
    // #swagger.summary = 'Retrieve all roles'
    /* #swagger.description = "Retrieve all roles from the database." */
    // #swagger.security = [{ "bearerAuth": [] }]
    
    /* #swagger.responses[200] = {
        description: "Successfully retrieved roles.",
        schema: {
            status: "success",
            statuscode: 200,
            data: {
                result: "Roles found",
                roles: [
                    { id: 1, name: "Admin" },
                    { id: 2, name: "User" }
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
            data: { message: "No roles found" }
        }
    }

    #swagger.responses[500] = {
        description: "Internal server error while fetching roles.",
        schema: {
            status: "error",
            statuscode: 500,
            data: { message: "An error occurred while fetching roles" }
        }
    } */
    try {
        let roles = await roleService.getAll();

        if (!roles || roles.length === 0) {
            return res.status(404).json({
                status: "error",
                statuscode: 404,
                execution: "database called successfully",
                data: { message: "No roles found" }
            });
        }

        res.status(200).json({
            status: "success",
            statuscode: 200,
            data: {
                result: "Roles found",
                roles
            } 
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            statuscode: 500,
            data: {
                result: "An error occurred while fetching roles",
                error: error.message
            }
        });
    }
});

router.post('/', isAuth, authIsAdmin, async function(req, res, next) {
    // #swagger.tags = ['Roles']
    // #swagger.summary = 'Create role'
    /* #swagger.description = "Create a new role." */
    // #swagger.security = [{ "bearerAuth": [] }]

    /* #swagger.parameters['body'] = {
        in: 'body',
        required: true,
        description: "Role details",
        schema: {
            name: "Moderator"
        }
    } */

    /* #swagger.responses[200] = {
        description: "Successfully created role.",
        schema: {
            status: "success",
            statuscode: 200,
            data: {
                result: "Role created",
                role: { id: 3, name: "Moderator" }
            }
        }
    } */

    /* #swagger.responses[500] = {
        description: "Internal server error while creating role.",
        schema: {
            status: "error",
            statuscode: 500,
            data: { message: "An error occurred while creating role" }
        }
    } */
    let roleName = req.body.name;
    
    try {
        let role = await roleService.create(roleName);
        res.status(200).json({
            status: "success",
            statuscode: 200,
            data: {
                result: "Role created",
                role
            } 
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            statuscode: 500,
            data: {
                result: "An error occurred while creating role",
                error: error.message
            }
        });
    }
});

router.put('/:id', isAuth, authIsAdmin, async function(req, res, next) {
    // #swagger.tags = ['Roles']
    // #swagger.summary = 'Update a role'
    /* #swagger.description = "Update an existing role." */
    // #swagger.security = [{ "bearerAuth": [] }]

    /* #swagger.parameters['id'] = {
        in: 'path',
        required: true,
        description: "The ID of the role to update.",
        type: "integer"
    } */

    /* #swagger.parameters['body'] = {
        in: 'body',
        required: true,
        description: "Updated role details.",
        schema: {
            name: "Super Admin"
        }
    } */

    /* #swagger.responses[200] = {
        description: "Successfully updated role.",
        schema: {
            status: "success",
            statuscode: 200,
            data: {
                result: "Role updated",
                role: { id: 1, name: "Super Admin" }
            }
        }
    } */

    /* #swagger.responses[500] = {
        description: "Internal server error while updating role.",
        schema: {
            status: "error",
            statuscode: 500,
            data: { message: "An error occurred while updating role" }
        }
    } */

    let id = req.params.id;
    let roleName = req.body.name;
    
    try {
        let role = await roleService.update(id, roleName);
        res.status(200).json({
            status: "success",
            statuscode: 200,
            data: {
                result: "Role updated",
                role
            } 
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            statuscode: 500,
            data: {
                result: "An error occurred while updating role",
                error: error.message
            }
        });
    }
});

router.delete('/:id', isAuth, authIsAdmin, async function(req, res, next) {
    // #swagger.tags = ['Roles']
    // #swagger.summary = 'Delete a role'
    /* #swagger.description = "Delete a role by ID." */
    // #swagger.security = [{ "bearerAuth": [] }]

    /* #swagger.parameters['id'] = {
        in: 'path',
        required: true,
        description: "The ID of the role to delete.",
        type: "integer"
    } */

    /* #swagger.responses[200] = {
        description: "Successfully deleted role.",
        schema: {
            status: "success",
            statuscode: 200,
            data: {
                result: "Role deleted successfully",
                id: 3
            }
        }
    } */

    /* #swagger.responses[500] = {
        description: "Internal server error while deleting role.",
        schema: {
            status: "error",
            statuscode: 500,
            data: { message: "An error occurred while deleting role" }
        }
    } */

    let id = req.params.id;
    
    try {
        let result = await roleService.delete(id);
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
                result: "An error occurred while deleting role",
                error: error.message
            }
        });
    }
});

module.exports = router;