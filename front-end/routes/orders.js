var express = require('express');
var router = express.Router();
var { isAuth, authIsAdmin } = require('../middleware/middleware.js');

router.get('/', isAuth, authIsAdmin, async function(req, res, next) {
  // #swagger.summary = 'View orders'
  let token = req.cookies.token
  console.log("-- TOKEN USED:" + token)
  try {
    const response = await fetch('http://localhost:3001/orders/', {
      method: 'GET',
      credentials: 'include',
      headers: {
        authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      }
    });

    const orderStatusResponse = await fetch('http://localhost:3001/orderstatuses/', {
      method: 'GET',
      credentials: 'include',
      headers: {
          authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
      }
  });

    const data = await response.json();
    const orderStatusData = await orderStatusResponse.json();
    console.log(data)

    if (data.statusCode ===  403 || data.statusCode ===  401) {
      console.log("-- UNAUTHORIZED --")
      return res.render('forbidden');
    }

    res.render('orders', { 
      orders: data.data.orders || [],
      statuses: orderStatusData.data.orderstatuses
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.send('error. unhandled condition');
  }
});

module.exports = router;