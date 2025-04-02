var express = require('express');
var router = express.Router();
var { isAuth, authIsAdmin } = require('../middleware/middleware.js');
var BrandService = require('../services/BrandService');
var db = require('../models');
var brandService = new BrandService(db);

router.get('/', isAuth, authIsAdmin, async function(req, res, next) {
    // #swagger.tags = ['Brands']
    // #swagger.summary = 'Retrieve all brands'
    // #swagger.description = 'Fetches a list of all available brands.'
    // #swagger.security = [{ "bearerAuth": [] }]
    /*
    #swagger.responses[200] = {
        description: 'Brands successfully retrieved',
        schema: {
            status: "success",
            statuscode: 200,
            data: {
                result: "Brands found",
                brands: [
                    {
                        id: 1,
                        name: "Brand A"
                    },
                    {
                        id: 2,
                        name: "Brand B"
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
            data: { message: "No brands found" }
        }
    }

    #swagger.responses[500] = {
        description: 'Server error',
        schema: {
            status: "error",
            statuscode: 500,
            data: { 
                result: "An error occurred while fetching brands",
                error: "Error details"
            }
        }
    }
    */
    try {
        let brands = await brandService.getAll()

        if (!brands || brands.length === 0) {
            return res.status(404).json({
                status: "error",
                statuscode: 404,
                execution: "database called successfully",
                data: { message: "No brands found" }
            });
        }

        res.status(200).json({
            status: "success",
            statuscode: 200,
            data: {
                result: "Brands found",
                brands
            } 
    });
    } catch (error) {
        res.status(500).json({
            status: "error",
            statuscode: 500,
            data: {
                result: "An error occurred while fetching brands",
                error: error.message
            }
        });
    }
});

router.post('/', isAuth, authIsAdmin, async function(req, res, next) {
    // #swagger.tags = ['Brands']
    // #swagger.summary = 'Create a new brand'
    // #swagger.description = 'Creates a new brand with the provided name.'
    // #swagger.security = [{ "bearerAuth": [] }]
    /*
    #swagger.parameters['body'] = {
        in: 'body',
        required: true,
        description: 'Request body for adding brand.',
        schema: {
            $brandname: 'Sony'
        }
    }
    #swagger.responses[200] = {
        description: 'Brand successfully created',
        schema: {
            status: "success",
            statuscode: 200,
            data: {
                result: "Brand created",
                id: 123,
                name: "Sony"
            }
        }
    }
    #swagger.responses[500] = {
        description: 'Server error',
        schema: {
            status: "error",
            statuscode: 500,
            data: { 
                result: "An error occurred while creating brand",
                error: "Error details"
            }
        }
    }
    */
    let brandname = req.body.brandname
    
    try {
        let brand = await brandService.create(brandname)
        res.status(200).json({
            status: "success",
            statuscode: 200,
            data: {
                result: "Brand created",
                id: brand.id,
                name: brand.name
            } 
    });
    } catch (error) {
        res.status(500).json({
            status: "error",
            statuscode: 500,
            data: {
                result: "An error occurred while creating brand",
                error: error.message
            }
        });
    }
});

router.put('/:id', isAuth, authIsAdmin, async function(req, res, next) {
    // #swagger.tags = ['Brands']
    // #swagger.summary = 'Update a brand'
    // #swagger.description = 'Updates the name of a brand by its ID.'
    // #swagger.security = [{ "bearerAuth": [] }]
    /*
    #swagger.parameters['id'] = {
        in: 'path',
        description: 'The ID of the brand to update',
        required: true,
        type: 'integer'
    }
    #swagger.parameters['body'] = {
        in: 'body',
        required: true,
        description: 'Request body for updating brand.',
        schema: {
            $brandname: 'Dyson'
        }
    }
    #swagger.responses[200] = {
        description: 'Brand successfully updated',
        schema: {
            status: "success",
            statuscode: 200,
            data: {
                result: "Brand updated",
                id: 123,
                name: "Dyson"
            }
        }
    }
    #swagger.responses[500] = {
        description: 'Server error',
        schema: {
            status: "error",
            statuscode: 500,
            data: { 
                result: "An error occurred while updating brand",
                error: "Error details"
            }
        }
    }
    */
    let id = req.params.id
    let brandname = req.body.brandname
    
    try {
        let brand = await brandService.update(id, brandname)
        res.status(200).json({
            status: "success",
            statuscode: 200,
            data: {
                result: "Brand updated",
                id: brand.id,
                name: brand.name
            } 
    });
    } catch (error) {
        res.status(500).json({
            status: "error",
            statuscode: 500,
            data: {
                result: "An error occurred while updating brand",
                error: error.message
            }
        });
    }
});

router.delete('/:id', isAuth, authIsAdmin, async function(req, res, next) {
    // #swagger.tags = ['Brands']
    // #swagger.summary = 'Delete a brand'
    // #swagger.description = 'Deletes a brand by its ID. Only accessible to admin users.'
    // #swagger.security = [{ "bearerAuth": [] }]
    /*
    #swagger.parameters['id'] = {
        in: 'path',
        description: 'The ID of the brand to delete',
        required: true,
        type: 'integer'
    }
    #swagger.responses[200] = {
        description: 'Brand successfully deleted',
        schema: {
            status: "success",
            statuscode: 200,
            data: {
                result: "Brand successfully deleted",
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
                result: "An error occurred while deleting brand",
                error: "Error details"
            }
        }
    }
    */
    let id = req.params.id;
    
    try {
        let result = await brandService.delete(id);
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
                result: "An error occurred while deleting brand",
                error: error.message
            }
        });
    }
});


module.exports = router;