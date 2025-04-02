var express = require('express');
var router = express.Router();
var { isAuth, authIsAdmin } = require('../middleware/middleware.js');
var UserService = require('../services/UserService');
var db = require('../models');

var userService = new UserService(db);

router.get('/', isAuth, authIsAdmin, async function(req, res) {
    // #swagger.tags = ['Users']
    // #swagger.summary = 'Retrieve all users'
    /* #swagger.description = "Fetch all users from the database." */
    /* #swagger.security = [{
        "BearerAuth": []
    }] */

    /* #swagger.responses[200] = {
        description: "Successfully retrieved users.",
        schema: {
            status: "success",
            statuscode: 200,
            data: {
                result: "Users found",
                "users": [
                    {
                        "id": 1,
                        "Username": "admin",
                        "EncryptedPassword": "b5d68145dcdf167dfaabd4353ccb2354675405cc04c6bd3cf928b7175f0055d6",
                        "Salt": "7b1b74417dedabaec932ac3036205698",
                        "Email": "admin@noroff.no",
                        "FirstName": "Admin",
                        "LastName": "Support",
                        "Address": "Online",
                        "Telephone": "911",
                        "MembershipId": 1,
                        "RoleId": 1,
                        "createdAt": "2025-03-06T14:58:10.000Z",
                        "updatedAt": "2025-03-06T14:58:10.000Z",
                        "RoleName": "Admin",
                        "MembershipName": "Bronze",
                        "TotalItemsPurchased": "0"
                    },
                    {
                        "id": 2,
                        "Username": "user123",
                        "EncryptedPassword": "8e85b2d8dbd679716888c37d262bdb1f7cd84e7e3c28339d971fac741650d98c",
                        "Salt": "215d32304553f246781f52d387790a4a",
                        "Email": "Joe@gmail.com",
                        "FirstName": "Joe",
                        "LastName": "Smith",
                        "Address": "123 Street, City",
                        "Telephone": "242424",
                        "MembershipId": 1,
                        "RoleId": 2,
                        "createdAt": "2025-03-06T14:58:26.000Z",
                        "updatedAt": "2025-03-06T14:58:26.000Z",
                        "RoleName": "User",
                        "MembershipName": "Bronze",
                        "TotalItemsPurchased": "0"
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
            data: { message: "No users found" }
        }
    }
    
    #swagger.responses[500] = {
        description: "Internal server error while fetching users.",
        schema: {
            status: "error",
            statuscode: 500,
            data: { message: "An error occurred while fetching users" }
        }
    } */
    try {
        let users = await userService.getAll();

        if (!users || users.length === 0) {
            return res.status(404).json({
                status: "error",
                statuscode: 404,
                execution: "database called successfully",
                data: { message: "No users found" }
            });
        }

        res.status(200).json({
            status: "success",
            statuscode: 200,
            data: {
                result: "Users found",
                users
            }
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            statuscode: 500,
            data: {
                result: "An error occurred while fetching users",
                error: error.message
            }
        });
    }
});

router.get('/:userId', isAuth, authIsAdmin, async function(req, res) {
    // #swagger.tags = ['Users']
    // #swagger.summary = 'Retrieve all users'
    /* #swagger.description = "Fetch all users from the database." */
    /* #swagger.security = [{
        "BearerAuth": []
    }] */

    /* #swagger.responses[200] = {
        description: "Successfully retrieved users.",
        schema: {
            status: "success",
            statuscode: 200,
            data: {
                result: "User found",
                user: {
                    "id": 2,
                    "Username": "user123",
                    "EncryptedPassword": "8e85b2d8dbd679716888c37d262bdb1f7cd84e7e3c28339d971fac741650d98c",
                    "Salt": "215d32304553f246781f52d387790a4a",
                    "Email": "Joe@gmail.com",
                    "FirstName": "Joe",
                    "LastName": "Smith",
                    "Address": "123 Street, City",
                    "Telephone": "242424",
                    "MembershipId": 1,
                    "RoleId": 2,
                    "createdAt": "2025-03-06T14:58:26.000Z",
                    "updatedAt": "2025-03-06T14:58:26.000Z"
                }
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
            data: { message: "User not found" }
        }
    }
    
    #swagger.responses[500] = {
        description: "Internal server error while fetching users.",
        schema: {
            status: "error",
            statuscode: 500,
            data: { message: "An error occurred while fetching user" }
        }
    } */
    try {
        let user = await userService.getOneById(req.params.userId);

        if (!user || user.length === 0) {
            return res.status(404).json({
                status: "error",
                statuscode: 404,
                execution: "database called successfully",
                data: { message: "User not found" }
            });
        }

        res.status(200).json({
            status: "success",
            statuscode: 200,
            data: {
                result: "User found",
                user
            }
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            statuscode: 500,
            data: {
                result: "An error occurred while fetching user",
                error: error.message
            }
        });
    }
});

// router.get('/:username', isAuth, authIsAdmin, async function(req, res) {
//     // #swagger.tags = ['Users']
//     // #swagger.summary = 'Retrieve a specific user'
//     /* #swagger.description = "Fetch details of a specific user by username." */
//     /* #swagger.security = [{
//         "BearerAuth": []
//     }] */

//     /* #swagger.parameters['username'] = {
//         in: 'path',
//         required: true,
//         description: "The username of the user to retrieve.",
//         type: "string"
//     } */

//     /* #swagger.responses[200] = {
//         description: "Successfully retrieved user details.",
//         schema: {
//             status: "success",
//             statuscode: 200,
//             data: {
//                 result: "User found",
//                 user: { id: 1, username: "johndoe", email: "johndoe@example.com", roleId: 2 }
//             }
//         }
//     } */

//     /* #swagger.responses[500] = {
//         description: "Internal server error while fetching the user.",
//         schema: {
//             status: "error",
//             statuscode: 500,
//             data: { message: "An error occurred while fetching the user" }
//         }
//     } */
//     try {
//         let username = req.params.username;
//         let user = await userService.getOne(username);

//         if (!user || user.length === 0) {
//             return res.status(404).json({
//                 status: "error",
//                 statuscode: 404,
//                 execution: "database called successfully",
//                 data: { message: "No user found" }
//             });
//         }

//         res.status(200).json({
//             status: "success",
//             statuscode: 200,
//             data: {
//                 result: "User found",
//                 user
//             }
//         });
//     } catch (error) {
//         res.status(500).json({
//             status: "error",
//             statuscode: 500,
//             data: {
//                 result: "An error occurred while fetching the user",
//                 error: error.message
//             }
//         });
//     }
// });

router.delete('/:id', isAuth, authIsAdmin, async function(req, res) {
    // #swagger.tags = ['Users']
    // #swagger.summary = 'Delete a specific user'
    /* #swagger.description = "Delete a user by ID." */

    /* #swagger.security = [{
        "BearerAuth": []
    }] */

    /* #swagger.parameters['id'] = {
        in: 'path',
        required: true,
        description: "The ID of the user to delete.",
        type: "integer"
    } */

    /* #swagger.responses[200] = {
        description: "Successfully deleted the user.",
        schema: {
            status: "success",
            statuscode: 200,
            data: { message: "User deleted successfully" }
        }
    } */

    /* #swagger.responses[500] = {
        description: "Internal server error while deleting user.",
        schema: {
            status: "error",
            statuscode: 500,
            data: { message: "An error occurred while deleting the user" }
        }
    } */
    try {
        let id = req.params.id;
        await userService.deleteById(id);

        res.status(200).json({
            status: "success",
            statuscode: 200,
            data: { result: "User deleted successfully" }
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            statuscode: 500,
            data: {
                result: "An error occurred while deleting the user",
                error: error.message
            }
        });
    }
});

router.put('/:id', isAuth, authIsAdmin, async function(req, res) {
    // #swagger.tags = ['Users']
    // #swagger.summary = 'Update a user'
    /* #swagger.description = "Update the details of an existing user." */

    /* #swagger.security = [{
        "BearerAuth": []
    }] */

    /* #swagger.parameters['id'] = {
        in: 'path',
        required: true,
        description: "The ID of the user to update.",
        type: "integer"
    } */

    /* #swagger.parameters['body'] = {
        in: 'body',
        required: true,
        description: "User details to update.",
        schema: {
            firstname: "John",
            lastname: "Doe",
            username: "johndoe",
            email: "johndoe@example.com",
            address: "123 Main St",
            telephone: "123456789",
            membershipId: 1,
            roleId: 2
        }
    } */

    /* #swagger.responses[200] = {
        description: "Successfully updated user details.",
        schema: {
            status: "success",
            statuscode: 200,
            data: { message: "User updated successfully" }
        }
    } */

    /* #swagger.responses[500] = {
        description: "Internal server error while updating user details.",
        schema: {
            status: "error",
            statuscode: 500,
            data: { message: "An error occurred while updating the user" }
        }
    } */
    try {
        let id = req.params.id;
        const dataToSend = {
          firstname: req.body.firstname, 
          lastname: req.body.lastname, 
          username: req.body.username, 
          email: req.body.email, 
          address: req.body.address, 
          telephone: req.body.telephone, 
          membershipId: req.body.membershipId, 
          roleId: req.body.roleId
        }
        await userService.updateById(id, dataToSend);

        res.status(200).json({
            status: "success",
            statuscode: 200,
            data: { result: "User updated successfully" }
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            statuscode: 500,
            data: {
                result: "An error occurred while updating the user",
                error: error.message
            }
        });
    }
});

module.exports = router;
