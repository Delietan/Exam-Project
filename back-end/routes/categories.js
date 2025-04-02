var express = require('express');
var router = express.Router();
var { isAuth, authIsAdmin } = require('../middleware/middleware.js');
var CategoryService = require('../services/CategoryService');
var db = require('../models');
var categoryService = new CategoryService(db);

router.get('/', isAuth, authIsAdmin, async function(req, res, next) {
    // #swagger.tags = ['Categories']
    // #swagger.summary = 'Retrieve all categories'
    // #swagger.description = "Retrieves all categories stored in the database."
    // #swagger.security = [{ "bearerAuth": [] }]

    /* 
    #swagger.responses[200] = {
        description: "Successfully retrieved categories.",
        schema: {
            status: "success",
            statuscode: 200,
            data: {
                result: "Categories found",
                categories: [
                    {
                        id: 1,
                        name: "Phones"
                    },
                    {
                        id: 2,
                        name: "Laptops"
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
            data: { message: "No categories found" }
        }
    }
    */
    /* #swagger.responses[500] = {
        description: "Internal server error while fetching categories.",
        schema: {
            status: "error",
            statuscode: 500,
            data: {
                result: "An error occurred while fetching categories.",
                error: "Detailed error message here."
            }
        }
    } */

    try {
        let categories = await categoryService.getAll();

        if (!categories || categories.length === 0) {
            return res.status(404).json({
                status: "error",
                statuscode: 404,
                execution: "database called successfully",
                data: { message: "No categories found" }
            });
        }

        res.status(200).json({
            status: "success",
            statuscode: 200,
            data: {
                result: "Categories found",
                categories
            } 
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            statuscode: 500,
            data: {
                result: "An error occurred while fetching categories.",
                error: error.message
            }
        });
    }
});

router.post('/', isAuth, authIsAdmin, async function(req, res, next) {
    // #swagger.tags = ['Categories']
    // #swagger.summary = 'Create a category'
    // #swagger.description = "Creates a new product category."
    // #swagger.security = [{ "bearerAuth": [] }]

    /* #swagger.parameters['body'] = {
        in: 'body',
        required: true,
        description: "Details required to create a new category.",
        schema: {
            name: "New Category"
        }
    } */

    /* #swagger.responses[201] = {
        description: "Successfully created a new category.",
        schema: {
            status: "success",
            statuscode: 201,
            data: {
                result: "Category created",
                id: 1,
                name: "New Category"
            }
        }
    } */

    /* #swagger.responses[400] = {
        description: "Invalid input, category name is required.",
        schema: {
            status: "fail",
            statuscode: 400,
            data: {
                result: "Category name is required."
            }
        }
    } */

    /* #swagger.responses[500] = {
        description: "Internal server error while creating category.",
        schema: {
            status: "error",
            statuscode: 500,
            data: {
                result: "An error occurred while creating category.",
                error: "Detailed error message here."
            }
        }
    } */

    let categoryName = req.body.name;

    if (!categoryName || !isNaN(categoryName) || categoryName.trim() === '') {
        return res.status(400).json({
            status: "fail",
            statuscode: 400,
            data: { result: "Category name is required." }
        });
    }
    
    try {
        let category = await categoryService.create(categoryName);
        res.status(201).json({
            status: "success",
            statuscode: 201,
            data: {
                result: "Category created",
                id: category.id,
                name: category.name
            } 
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            statuscode: 500,
            data: {
                result: "An error occurred while creating category.",
                error: error.message
            }
        });
    }
});

router.put('/:id', isAuth, authIsAdmin, async function(req, res, next) {
    // #swagger.tags = ['Categories']
    // #swagger.summary = 'Update a category'
    // #swagger.description = "Updates an existing category by ID."
    // #swagger.security = [{ "bearerAuth": [] }]

    /* #swagger.parameters['id'] = {
        in: 'path',
        required: true,
        description: "The ID of the category to update.",
        type: "integer"
    } */

    /* #swagger.parameters['body'] = {
        in: 'body',
        required: true,
        description: "Details required to update the category.",
        schema: {
            name: "Updated Category Name"
        }
    } */

    /* #swagger.responses[200] = {
        description: "Successfully updated the category.",
        schema: {
            status: "success",
            statuscode: 200,
            data: {
                result: "Category updated",
                id: 1,
                name: "Updated Category Name"
            }
        }
    } */

    /* #swagger.responses[500] = {
        description: "Internal server error while updating the category.",
        schema: {
            status: "error",
            statuscode: 500,
            data: {
                result: "An error occurred while updating category",
                error: "Detailed error message here."
            }
        }
    } */

    let id = req.params.id;
    let categoryName = req.body.name;

    try {
        let category = await categoryService.update(id, categoryName);
        res.status(200).json({
            status: "success",
            statuscode: 200,
            data: {
                result: "Category updated",
                id: category.id,
                name: category.name
            } 
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            statuscode: 500,
            data: {
                result: "An error occurred while updating category",
                error: error.message
            }
        });
    }
});

router.delete('/:id', isAuth, authIsAdmin, async function(req, res, next) {
    // #swagger.tags = ['Categories']
    // #swagger.summary = 'Delete a category'
    // #swagger.description = "Deletes an existing category by ID."
    // #swagger.security = [{ "bearerAuth": [] }]

    /* #swagger.parameters['id'] = {
        in: 'path',
        required: true,
        description: "The ID of the category to update.",
        type: "integer"
    } */

    /*
    #swagger.responses[200] = {
        description: 'Category successfully deleted',
        schema: {
            status: "success",
            statuscode: 200,
            data: {
                result: "Category deleted successfully",
                id: 123
            }
        }
    }
    #swagger.responses[500] = {
        description: 'Server error',
        schema: {
            status: "error",
            statuscode: 500,
            data: {
                result: "An error occurred while deleting category",
                error: "Error message"
            }
        }
    }
    */
    let id = req.params.id;
    
    try {
        let result = await categoryService.delete(id);
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
                result: "An error occurred while deleting category",
                error: error.message
            }
        });
    }
});

module.exports = router;
