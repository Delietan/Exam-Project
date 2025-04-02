var express = require('express');
var router = express.Router();
var { isAuth, authIsAdmin } = require('../middleware/middleware.js');
var RoleService = require('../services/RoleService');
var UserService = require('../services/UserService');
var MembershipService = require('../services/MembershipService');
var ProductService = require('../services/ProductService');
var OrderStatusService = require('../services/OrderStatusService');
var db = require('../models');
var roleService = new RoleService(db);
var userService = new UserService(db);
var membershipService = new MembershipService(db);
var productService = new ProductService(db);
var orderStatusService = new OrderStatusService(db);

router.post('/init', async function(req, res, next) {
  // #swagger.tags = ['Deployment and Maintenance']
  // #swagger.summary = 'Populate database '
  // #swagger.description = "This endpoint populated the database with Roles, Memberships, an Admin User, Products from the Noroff API and Order Statuses. This is achieved with running methods from various service files."

  /* 
	#swagger.responses[200] = {
		description: "Successful request",
		schema: {
      status: "success",
      statuscode: 200,
      data: {
        result: "Database tables have been populated successfully"

      }
		}
	}
  #swagger.responses[500] = {
    description: 'Server error',
    schema: {
        status: "error",
        statuscode: 500,
        data: { 
            result: "Error details"
        }
    }
  }
	*/
  try {
    await roleService.populateRoles();
    await membershipService.populateMemberships();
    await userService.addAdmin();
    await productService.addProductsFromAPI();
    await orderStatusService.populateOrderStatuses();

    res.status(200).json({
      status: "success",
      statuscode: 200,
      data: {
        result: "Database tables have been populated successfully"
      }
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      statuscode: 500,
      data: {
        result: err.message
      }
    });
  }
});

router.post('/FAKEinit', async function(req, res, next) {
  // #swagger.tags = ['Deployment and Maintenance']    
  // #swagger.summary = 'Populates database with local data. Used for testing.' 
  // #swagger.description = "Uses various services to populate the database, but doesn't not involve external API. Uses locally stored data to populate the products table"

  /* 
	#swagger.responses[200] = {
		description: "Successful request",
		schema: {
      status: "success",
      statuscode: 200,
      data: {
        result: "Database tables have been populated successfully"

      }
		}
	}
  #swagger.responses[500] = {
    description: 'Server error',
    schema: {
        status: "error",
        statuscode: 500,
        data: { 
            result: "Error details"
        }
    }
  }
	*/
  try {
    await roleService.populateRoles();
    await membershipService.populateMemberships();
    await userService.addAdmin();
    await productService.fakeAddProductsFromAPI();
    await orderStatusService.populateOrderStatuses();

    res.status(200).json({
      status: "success",
      statuscode: 200,
      data: {
        result: "Database tables have been populated successfully"
      }
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      statuscode: 500,
      data: {
        result: err.message
      }
    });
  }
});

module.exports = router;